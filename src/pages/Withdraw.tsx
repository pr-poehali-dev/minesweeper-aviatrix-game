import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

export default function Withdraw() {
  const { user, refresh } = useUser();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [bank, setBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const balance = user?.balance || 0;

  const banks = ['Сбербанк', 'Тинькофф', 'ВТБ', 'Альфа-Банк', 'Россельхозбанк', 'Газпромбанк', 'Открытие', 'Другой'];

  const handleWithdraw = async () => {
    if (!amount || numAmount < 100 || !phone || !bank) return;
    if (numAmount > balance) { alert('Недостаточно средств'); return; }
    setLoading(true);
    const res = await api.createWithdraw(numAmount, phone, bank);
    setLoading(false);
    if (res?.id) {
      setDone(true);
      refresh();
    } else {
      alert(res?.error || 'Ошибка');
    }
  };

  if (done) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto mb-6">
            <Icon name="Clock" size={36} className="text-cyan-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Заявка принята!</h2>
          <div className="glass rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Сумма</span>
              <span className="text-white font-bold">₽ {numAmount.toLocaleString('ru')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Телефон СБП</span>
              <span className="text-white font-bold">{phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Банк</span>
              <span className="text-white font-bold">{bank}</span>
            </div>
          </div>
          <p className="text-white/40 text-sm mb-6">Администратор проверит заявку и переведёт средства. Статус появится в истории.</p>
          <button onClick={() => { setDone(false); setAmount(''); setPhone(''); setBank(''); }}
            className="btn-cyan px-8 py-3 rounded-xl font-bold text-white">
            Новая заявка
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-black text-white mb-2">💸 Вывод средств</h1>
          <div className="flex items-center gap-2">
            <span className="text-white/40">Баланс:</span>
            <span className="text-yellow-400 font-bold">₽ {balance.toLocaleString('ru')}</span>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5 space-y-4 mb-4">
          <div>
            <label className="text-xs text-white/50 mb-2 block">Сумма вывода (мин. ₽100)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-lg">₽</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min={100}
                className="w-full glass border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xl font-bold placeholder-white/20 focus:outline-none focus:border-cyan-500/50 bg-transparent"
              />
            </div>
            {numAmount > balance && (
              <p className="text-red-400 text-xs mt-1">Недостаточно средств</p>
            )}
          </div>

          <div>
            <label className="text-xs text-white/50 mb-2 block">Номер телефона СБП</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 999 999 99 99"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 bg-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-2 block">Банк</label>
            <div className="grid grid-cols-2 gap-2">
              {banks.map((b) => (
                <button
                  key={b}
                  onClick={() => setBank(b)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all text-left ${
                    bank === b ? 'btn-cyan text-white' : 'glass border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {numAmount > 0 && phone && bank && (
          <div className="glass rounded-xl border border-white/10 p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Сумма вывода</span>
              <span className="text-white">₽ {numAmount.toLocaleString('ru')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">СБП телефон</span>
              <span className="text-white">{phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Банк</span>
              <span className="text-white">{bank}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={loading || !amount || numAmount < 100 || numAmount > balance || !phone || !bank}
          className="w-full btn-cyan py-4 rounded-xl font-bold text-white text-lg disabled:opacity-30 flex items-center justify-center gap-2"
        >
          {loading ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="ArrowUpRight" size={20} />}
          Отправить заявку
        </button>
      </div>
    </div>
  );
}
