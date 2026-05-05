import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { api, isAdmin } from '@/lib/api';

type AdminTab = 'deposits' | 'withdrawals' | 'support';

interface Deposit {
  id: number; session_id: string; nickname: string;
  amount: number; status: string; created_at: string;
}
interface Withdrawal {
  id: number; session_id: string; nickname: string;
  amount: number; sbp_phone: string; bank_name: string;
  status: string; created_at: string;
}
interface SupportSession {
  session_id: string; nickname: string;
  msg_count: number; last_msg: string; last_text: string;
}
interface Message {
  id: number; text: string; from_admin: boolean; created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('deposits');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) { navigate('/'); return; }
    loadAll();
  }, []);

  const loadAll = useCallback(async () => {
    const [d, w, s] = await Promise.all([
      api.adminDeposits(),
      api.adminWithdrawals(),
      api.adminSupportSessions(),
    ]);
    setDeposits(d.deposits || []);
    setWithdrawals(d.withdrawals || w.withdrawals || []);
    setSupportSessions(s.sessions || []);
    // Fix: load correctly
    if (d.deposits) setDeposits(d.deposits);
    if (w.withdrawals) setWithdrawals(w.withdrawals);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDeposit = async (id: number, action: 'approve' | 'reject') => {
    setLoading(true);
    await api.adminApproveDeposit(id, action);
    await loadAll();
    setLoading(false);
  };

  const handleWithdraw = async (id: number, action: 'approve' | 'reject') => {
    setLoading(true);
    await api.adminApproveWithdraw(id, action);
    await loadAll();
    setLoading(false);
  };

  const openChat = async (session_id: string) => {
    setActiveChat(session_id);
    const data = await api.adminSupportMessages(session_id);
    setChatMessages(data.messages || []);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !activeChat) return;
    await api.adminSupportReply(activeChat, replyText);
    setReplyText('');
    const data = await api.adminSupportMessages(activeChat);
    setChatMessages(data.messages || []);
  };

  const statusBadge = (status: string) => {
    if (status === 'approved') return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Одобрено</span>;
    if (status === 'rejected') return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">Отклонено</span>;
    return <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">Ожидает</span>;
  };

  const pendingDeposits = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending').length;

  if (!isAdmin()) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-white">ADMIN PANEL</h1>
            <p className="text-white/40 text-sm">Управление заявками и поддержкой</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-xl p-3 border border-orange-500/20 text-center">
            <div className="font-display text-2xl font-black text-orange-400">{pendingDeposits}</div>
            <div className="text-xs text-white/40">Депозитов ожидает</div>
          </div>
          <div className="glass rounded-xl p-3 border border-cyan-500/20 text-center">
            <div className="font-display text-2xl font-black text-cyan-400">{pendingWithdrawals}</div>
            <div className="text-xs text-white/40">Выводов ожидает</div>
          </div>
          <div className="glass rounded-xl p-3 border border-purple-500/20 text-center">
            <div className="font-display text-2xl font-black text-purple-400">{supportSessions.length}</div>
            <div className="text-xs text-white/40">Чатов поддержки</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 border border-white/10 mb-6">
          {([
            { key: 'deposits' as AdminTab, label: 'Депозиты', icon: 'ArrowDownLeft', count: pendingDeposits },
            { key: 'withdrawals' as AdminTab, label: 'Выводы', icon: 'ArrowUpRight', count: pendingWithdrawals },
            { key: 'support' as AdminTab, label: 'Поддержка', icon: 'MessageCircle', count: 0 },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setActiveChat(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              {t.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Deposits */}
        {tab === 'deposits' && (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">Заявки на пополнение</h3>
              <button onClick={loadAll} className="text-white/40 hover:text-white transition-colors">
                <Icon name="RefreshCw" size={14} />
              </button>
            </div>
            {deposits.length === 0 ? (
              <div className="p-8 text-center text-white/30">Заявок пока нет</div>
            ) : (
              <div className="divide-y divide-white/5">
                {deposits.map((d) => (
                  <div key={d.id} className="p-4 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{d.nickname}</span>
                        <span className="font-mono text-xs text-white/30">#{d.id}</span>
                        {statusBadge(d.status)}
                      </div>
                      <div className="text-sm text-white/50">
                        Сумма: <span className="text-green-400 font-bold">₽ {d.amount.toLocaleString('ru')}</span>
                        <span className="text-white/20 ml-2">{new Date(d.created_at).toLocaleString('ru')}</span>
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">
                        Реквизиты: Оплата мобильной связи Билайн 79629031556
                      </div>
                    </div>
                    {d.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleDeposit(d.id, 'approve')}
                          disabled={loading}
                          className="btn-green px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-1 disabled:opacity-50"
                        >
                          <Icon name="Check" size={14} />
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleDeposit(d.id, 'reject')}
                          disabled={loading}
                          className="glass border border-red-500/30 px-4 py-2 rounded-xl text-sm font-bold text-red-400 flex items-center gap-1 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          <Icon name="X" size={14} />
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Withdrawals */}
        {tab === 'withdrawals' && (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">Заявки на вывод</h3>
              <button onClick={loadAll} className="text-white/40 hover:text-white transition-colors">
                <Icon name="RefreshCw" size={14} />
              </button>
            </div>
            {withdrawals.length === 0 ? (
              <div className="p-8 text-center text-white/30">Заявок пока нет</div>
            ) : (
              <div className="divide-y divide-white/5">
                {withdrawals.map((w) => (
                  <div key={w.id} className="p-4 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{w.nickname}</span>
                        <span className="font-mono text-xs text-white/30">#{w.id}</span>
                        {statusBadge(w.status)}
                      </div>
                      <div className="text-sm text-white/50">
                        Сумма: <span className="text-cyan-400 font-bold">₽ {w.amount.toLocaleString('ru')}</span>
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">
                        СБП: <span className="text-white/60 font-mono">{w.sbp_phone}</span>
                        {' · '}<span className="text-white/60">{w.bank_name}</span>
                      </div>
                      <div className="text-xs text-white/20">{new Date(w.created_at).toLocaleString('ru')}</div>
                    </div>
                    {w.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleWithdraw(w.id, 'approve')}
                          disabled={loading}
                          className="btn-cyan px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-1 disabled:opacity-50"
                        >
                          <Icon name="Check" size={14} />
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleWithdraw(w.id, 'reject')}
                          disabled={loading}
                          className="glass border border-red-500/30 px-4 py-2 rounded-xl text-sm font-bold text-red-400 flex items-center gap-1 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          <Icon name="X" size={14} />
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support */}
        {tab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-3 border-b border-white/10">
                <div className="text-sm font-bold text-white">Чаты</div>
              </div>
              {supportSessions.length === 0 ? (
                <div className="p-6 text-center text-white/30 text-sm">Чатов пока нет</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {supportSessions.map((s) => (
                    <button
                      key={s.session_id}
                      onClick={() => openChat(s.session_id)}
                      className={`w-full p-3 text-left transition-all hover:bg-white/5 ${activeChat === s.session_id ? 'bg-purple-500/10 border-l-2 border-purple-500' : ''}`}
                    >
                      <div className="font-medium text-white text-sm">{s.nickname}</div>
                      <div className="text-xs text-white/30 truncate mt-0.5">{s.last_text}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeChat ? (
              <div className="glass rounded-2xl border border-white/10 flex flex-col" style={{ minHeight: 400 }}>
                <div className="p-4 border-b border-white/10">
                  <div className="font-bold text-white text-sm">
                    {supportSessions.find((s) => s.session_id === activeChat)?.nickname || 'Игрок'}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 380 }}>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from_admin ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                      <div className={`px-3 py-2 rounded-xl text-sm max-w-xs ${msg.from_admin ? 'btn-gradient text-white rounded-tr-sm' : 'glass border border-white/10 text-white/80 rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                    placeholder="Написать ответ..."
                    className="flex-1 glass border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50 bg-transparent"
                  />
                  <button onClick={sendReply} className="btn-gradient px-4 py-2 rounded-xl text-white">
                    <Icon name="Send" size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl border border-white/10 flex items-center justify-center text-white/30">
                Выберите чат
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
