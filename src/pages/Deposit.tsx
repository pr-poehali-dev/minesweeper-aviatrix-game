import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

export default function Deposit() {
  const { user, refresh } = useUser();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'details' | 'pending'>('form');
  const [loading, setLoading] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const handleNext = () => {
    if (numAmount < 100) return;
    setStep('details');
  };

  const handleSend = async () => {
    if (!amount || numAmount < 100) return;
    setLoading(true);
    const res = await api.createDeposit(numAmount);
    setLoading(false);
    if (res?.id) {
      setStep('pending');
    } else {
      alert(res?.error || 'Ошибка');
    }
  };

  const quickAmounts = [100, 300, 500, 1000, 3000, 5000];

  if (step === 'pending') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mx-auto mb-6">
            <Icon name="Clock" size={36} className="text-yellow-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Заявка отправлена!</h2>
          <div className="glass rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-4 text-left">
            <div className="text-sm text-white/60 mb-2">Переведите <span className="text-yellow-400 font-bold">₽ {numAmount.toLocaleString('ru')}</span> на реквизиты:</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/40 text-sm">Метод</span>
                <span className="text-white font-bold text-sm">Оплата мобильной связи Билайн</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Номер</span>
                <span className="text-yellow-400 font-bold font-mono text-lg">79629031556</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-sm">Сумма</span>
                <span className="text-white font-bold text-sm">₽ {numAmount.toLocaleString('ru')}</span>
              </div>
            </div>
          </div>
          <p className="text-white/40 text-sm mb-6">После оплаты администратор проверит платёж и зачислит средства на ваш баланс. Обычно это занимает до 30 минут.</p>
          <button
            onClick={() => { setStep('form'); setAmount(''); refresh(); }}
            className="btn-gradient px-8 py-3 rounded-xl font-bold text-white"
          >
            Понятно
          </button>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-8">
          <button onClick={() => setStep('form')} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
          <h1 className="font-display text-2xl font-black text-white mb-6">💳 Реквизиты оплаты</h1>

          <div className="glass rounded-2xl border border-purple-500/30 p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📱</div>
              <div className="font-bold text-white">Оплата мобильной связи Билайн</div>
            </div>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="text-xs text-white/40 mb-1">Номер телефона</div>
                <div className="font-mono text-2xl font-black text-yellow-400 text-center">79629031556</div>
              </div>
              <div className="glass rounded-xl p-3 border border-white/10 flex justify-between">
                <span className="text-white/50 text-sm">Сумма к переводу</span>
                <span className="text-white font-bold">₽ {numAmount.toLocaleString('ru')}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex gap-2 text-xs text-orange-300">
                <Icon name="AlertTriangle" size={14} className="shrink-0 mt-0.5" />
                Переведите ровно указанную сумму. После оплаты нажмите кнопку ниже — мы проверим платёж и зачислим баланс.
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full btn-gradient py-4 rounded-xl font-bold text-white text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="CheckCircle" size={18} />}
            Я оплатил — жду зачисления
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
          <h1 className="font-display text-3xl font-black text-white mb-2">💳 Пополнение</h1>
          <div className="flex items-center gap-2">
            <span className="text-white/40">Баланс:</span>
            <span className="text-yellow-400 font-bold">₽ {(user?.balance || 0).toLocaleString('ru')}</span>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5 mb-4">
          <div className="glass rounded-xl border border-white/10 p-4 mb-4 flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div>
              <div className="font-bold text-white text-sm">Оплата мобильной связи Билайн</div>
              <div className="text-xs text-white/40">Мгновенное зачисление после проверки</div>
            </div>
          </div>

          <label className="text-xs text-white/50 mb-2 block">Сумма пополнения (минимум ₽100)</label>
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-lg">₽</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min={100}
              className="w-full glass border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xl font-bold placeholder-white/20 focus:outline-none focus:border-purple-500/50 bg-transparent"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  amount === String(a) ? 'btn-gradient text-white' : 'glass border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                ₽ {a.toLocaleString('ru')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={numAmount < 100}
          className="w-full btn-gradient py-4 rounded-xl font-bold text-white text-lg disabled:opacity-30 flex items-center justify-center gap-2"
        >
          <Icon name="ArrowRight" size={20} />
          Получить реквизиты
        </button>
      </div>
    </div>
  );
}
