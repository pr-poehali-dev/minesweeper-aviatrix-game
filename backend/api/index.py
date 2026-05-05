"""
Главный API — пользователи, баланс, депозиты, выводы, поддержка, игры
"""
import json
import os
import random
import string
from datetime import datetime
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def resp(status, body):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(body, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    params = event.get('queryStringParameters') or {}
    session_id = (event.get('headers') or {}).get('X-Session-Id', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        # --- Получить/создать пользователя ---
        if path == '/user' and method == 'GET':
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("SELECT id, nickname, balance, is_admin, bonus_claimed FROM users WHERE session_id=%s", (session_id,))
            row = cur.fetchone()
            if not row:
                cur.execute("INSERT INTO users (session_id, nickname, balance, is_admin, bonus_claimed) VALUES (%s, %s, 100.00, FALSE, TRUE) RETURNING id, nickname, balance, is_admin, bonus_claimed", (session_id, 'Игрок'))
                conn.commit()
                row = cur.fetchone()
            return resp(200, {'id': row[0], 'nickname': row[1], 'balance': float(row[2]), 'is_admin': row[3], 'bonus_claimed': row[4]})

        # --- Обновить баланс (игры) ---
        if path == '/balance/update' and method == 'POST':
            delta = float(body.get('delta', 0))
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("UPDATE users SET balance = GREATEST(0, balance + %s) WHERE session_id=%s RETURNING balance", (delta, session_id))
            row = cur.fetchone()
            conn.commit()
            return resp(200, {'balance': float(row[0]) if row else 0})

        # --- Создать депозит ---
        if path == '/deposit' and method == 'POST':
            amount = float(body.get('amount', 0))
            if amount < 100:
                return resp(400, {'error': 'Минимум 100₽'})
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("INSERT INTO deposits (session_id, amount, status) VALUES (%s, %s, 'pending') RETURNING id", (session_id, amount))
            did = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': did, 'amount': amount, 'status': 'pending'})

        # --- Мои депозиты ---
        if path == '/deposit/my' and method == 'GET':
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("SELECT id, amount, status, created_at FROM deposits WHERE session_id=%s ORDER BY created_at DESC LIMIT 20", (session_id,))
            rows = cur.fetchall()
            return resp(200, {'deposits': [{'id': r[0], 'amount': float(r[1]), 'status': r[2], 'created_at': str(r[3])} for r in rows]})

        # --- Создать вывод ---
        if path == '/withdraw' and method == 'POST':
            amount = float(body.get('amount', 0))
            sbp_phone = body.get('sbp_phone', '')
            bank_name = body.get('bank_name', '')
            if amount < 100:
                return resp(400, {'error': 'Минимум 100₽'})
            if not sbp_phone or not bank_name:
                return resp(400, {'error': 'Укажите телефон и банк'})
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("SELECT balance FROM users WHERE session_id=%s", (session_id,))
            row = cur.fetchone()
            if not row or float(row[0]) < amount:
                return resp(400, {'error': 'Недостаточно средств'})
            cur.execute("UPDATE users SET balance = balance - %s WHERE session_id=%s", (amount, session_id))
            cur.execute("INSERT INTO withdrawals (session_id, amount, sbp_phone, bank_name, status) VALUES (%s, %s, %s, %s, 'pending') RETURNING id", (session_id, amount, sbp_phone, bank_name))
            wid = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': wid, 'amount': amount, 'status': 'pending'})

        # --- Мои выводы ---
        if path == '/withdraw/my' and method == 'GET':
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("SELECT id, amount, sbp_phone, bank_name, status, created_at FROM withdrawals WHERE session_id=%s ORDER BY created_at DESC LIMIT 20", (session_id,))
            rows = cur.fetchall()
            return resp(200, {'withdrawals': [{'id': r[0], 'amount': float(r[1]), 'sbp_phone': r[2], 'bank_name': r[3], 'status': r[4], 'created_at': str(r[5])} for r in rows]})

        # --- Сообщения поддержки пользователя ---
        if path == '/support/messages' and method == 'GET':
            if not session_id:
                return resp(400, {'error': 'no session'})
            cur.execute("SELECT id, text, from_admin, created_at FROM support_messages WHERE session_id=%s ORDER BY created_at ASC LIMIT 100", (session_id,))
            rows = cur.fetchall()
            return resp(200, {'messages': [{'id': r[0], 'text': r[1], 'from_admin': r[2], 'created_at': str(r[3])} for r in rows]})

        # --- Отправить сообщение в поддержку ---
        if path == '/support/send' and method == 'POST':
            text = body.get('text', '').strip()
            if not text or not session_id:
                return resp(400, {'error': 'empty'})
            cur.execute("INSERT INTO support_messages (session_id, text, from_admin) VALUES (%s, %s, FALSE) RETURNING id", (session_id, text))
            mid = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': mid})

        # === ADMIN ===

        # --- Все депозиты (admin) ---
        if path == '/admin/deposits' and method == 'GET':
            cur.execute("SELECT d.id, d.session_id, u.nickname, d.amount, d.status, d.created_at FROM deposits d LEFT JOIN users u ON u.session_id=d.session_id ORDER BY d.created_at DESC LIMIT 100")
            rows = cur.fetchall()
            return resp(200, {'deposits': [{'id': r[0], 'session_id': r[1], 'nickname': r[2] or 'Игрок', 'amount': float(r[3]), 'status': r[4], 'created_at': str(r[5])} for r in rows]})

        # --- Одобрить/отклонить депозит (admin) ---
        if path == '/admin/deposit/approve' and method == 'POST':
            did = int(body.get('id'))
            action = body.get('action', 'approve')
            cur.execute("SELECT session_id, amount, status FROM deposits WHERE id=%s", (did,))
            row = cur.fetchone()
            if not row:
                return resp(404, {'error': 'not found'})
            if row[2] != 'pending':
                return resp(400, {'error': 'already processed'})
            if action == 'approve':
                cur.execute("UPDATE deposits SET status='approved', approved_at=NOW() WHERE id=%s", (did,))
                cur.execute("UPDATE users SET balance = balance + %s WHERE session_id=%s", (float(row[1]), row[0]))
            else:
                cur.execute("UPDATE deposits SET status='rejected', approved_at=NOW() WHERE id=%s", (did,))
            conn.commit()
            return resp(200, {'ok': True})

        # --- Все выводы (admin) ---
        if path == '/admin/withdrawals' and method == 'GET':
            cur.execute("SELECT w.id, w.session_id, u.nickname, w.amount, w.sbp_phone, w.bank_name, w.status, w.created_at FROM withdrawals w LEFT JOIN users u ON u.session_id=w.session_id ORDER BY w.created_at DESC LIMIT 100")
            rows = cur.fetchall()
            return resp(200, {'withdrawals': [{'id': r[0], 'session_id': r[1], 'nickname': r[2] or 'Игрок', 'amount': float(r[3]), 'sbp_phone': r[4], 'bank_name': r[5], 'status': r[6], 'created_at': str(r[7])} for r in rows]})

        # --- Одобрить/отклонить вывод (admin) ---
        if path == '/admin/withdraw/approve' and method == 'POST':
            wid = int(body.get('id'))
            action = body.get('action', 'approve')
            cur.execute("SELECT session_id, amount, status FROM withdrawals WHERE id=%s", (wid,))
            row = cur.fetchone()
            if not row:
                return resp(404, {'error': 'not found'})
            if row[2] != 'pending':
                return resp(400, {'error': 'already processed'})
            if action == 'approve':
                cur.execute("UPDATE withdrawals SET status='approved', approved_at=NOW() WHERE id=%s", (wid,))
            else:
                # вернуть деньги
                cur.execute("UPDATE withdrawals SET status='rejected', approved_at=NOW() WHERE id=%s", (wid,))
                cur.execute("UPDATE users SET balance = balance + %s WHERE session_id=%s", (float(row[1]), row[0]))
            conn.commit()
            return resp(200, {'ok': True})

        # --- Все чаты поддержки (admin) ---
        if path == '/admin/support/sessions' and method == 'GET':
            cur.execute("""
                SELECT sm.session_id, u.nickname,
                       COUNT(*) as msg_count,
                       MAX(sm.created_at) as last_msg,
                       (SELECT text FROM support_messages WHERE session_id=sm.session_id ORDER BY created_at DESC LIMIT 1) as last_text
                FROM support_messages sm
                LEFT JOIN users u ON u.session_id=sm.session_id
                GROUP BY sm.session_id, u.nickname
                ORDER BY last_msg DESC
            """)
            rows = cur.fetchall()
            return resp(200, {'sessions': [{'session_id': r[0], 'nickname': r[1] or 'Игрок', 'msg_count': r[2], 'last_msg': str(r[3]), 'last_text': r[4]} for r in rows]})

        # --- Получить переписку (admin) ---
        if path == '/admin/support/messages' and method == 'GET':
            sid = params.get('session_id', '')
            if not sid:
                return resp(400, {'error': 'no session_id'})
            cur.execute("SELECT id, text, from_admin, created_at FROM support_messages WHERE session_id=%s ORDER BY created_at ASC LIMIT 200", (sid,))
            rows = cur.fetchall()
            return resp(200, {'messages': [{'id': r[0], 'text': r[1], 'from_admin': r[2], 'created_at': str(r[3])} for r in rows]})

        # --- Ответить пользователю (admin) ---
        if path == '/admin/support/reply' and method == 'POST':
            target_session = body.get('session_id', '')
            text = body.get('text', '').strip()
            if not text or not target_session:
                return resp(400, {'error': 'empty'})
            cur.execute("INSERT INTO support_messages (session_id, text, from_admin) VALUES (%s, %s, TRUE) RETURNING id", (target_session, text))
            mid = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': mid})

        return resp(404, {'error': 'not found'})

    finally:
        cur.close()
        conn.close()
