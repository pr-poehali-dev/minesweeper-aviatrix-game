import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: number;
  nickname: string;
  balance: number;
  is_admin: boolean;
  bonus_claimed: boolean;
}

let globalUser: User | null = null;
const listeners: Set<(u: User | null) => void> = new Set();

export function notifyUserUpdate(u: User | null) {
  globalUser = u;
  listeners.forEach((l) => l(u));
}

export function useUser() {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState(!globalUser);

  useEffect(() => {
    listeners.add(setUser);
    return () => { listeners.delete(setUser); };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await api.getUser();
    notifyUserUpdate(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!globalUser) refresh();
  }, [refresh]);

  const updateBalanceDelta = useCallback(async (delta: number) => {
    const data = await api.updateBalance(delta);
    if (data.balance !== undefined && globalUser) {
      notifyUserUpdate({ ...globalUser, balance: data.balance });
    }
    return data.balance as number;
  }, []);

  return { user, loading, refresh, updateBalanceDelta };
}
