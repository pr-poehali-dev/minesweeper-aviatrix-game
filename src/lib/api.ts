const API_URL = 'https://functions.poehali.dev/914c417f-1802-434e-b376-41c4e0ea689e';

function getSessionId(): string {
  let sid = localStorage.getItem('nexus_session');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    localStorage.setItem('nexus_session', sid);
  }
  return sid;
}

export const sessionId = getSessionId();

export function isAdmin(): boolean {
  return sessionId === 'admin_master_777';
}

async function request(path: string, method = 'GET', body?: object) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export const api = {
  getUser: () => request('/user'),
  updateBalance: (delta: number) => request('/balance/update', 'POST', { delta }),

  createDeposit: (amount: number) => request('/deposit', 'POST', { amount }),
  myDeposits: () => request('/deposit/my'),

  createWithdraw: (amount: number, sbp_phone: string, bank_name: string) =>
    request('/withdraw', 'POST', { amount, sbp_phone, bank_name }),
  myWithdrawals: () => request('/withdraw/my'),

  supportMessages: () => request('/support/messages'),
  supportSend: (text: string) => request('/support/send', 'POST', { text }),

  adminDeposits: () => request('/admin/deposits'),
  adminApproveDeposit: (id: number, action: 'approve' | 'reject') =>
    request('/admin/deposit/approve', 'POST', { id, action }),

  adminWithdrawals: () => request('/admin/withdrawals'),
  adminApproveWithdraw: (id: number, action: 'approve' | 'reject') =>
    request('/admin/withdraw/approve', 'POST', { id, action }),

  adminSupportSessions: () => request('/admin/support/sessions'),
  adminSupportMessages: (session_id: string) =>
    request('/admin/support/messages?session_id=' + session_id),
  adminSupportReply: (session_id: string, text: string) =>
    request('/admin/support/reply', 'POST', { session_id, text }),
};
