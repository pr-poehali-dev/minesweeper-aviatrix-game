import { useState } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const methods = [
  { id: "card", label: "Карта Visa/MC", icon: "CreditCard", min: 1000, max: 200000, fee: "1.5%", time: "до 3 дней" },
  { id: "sbp", label: "СБП", icon: "Smartphone", min: 500, max: 100000, fee: "0%", time: "до 1 ч" },
  { id: "crypto", label: "USDT/BTC", icon: "Bitcoin", min: 2000, max: 2000000, fee: "0%", time: "до 30 мин" },
  { id: "qiwi", label: "QIWI", icon: "Wallet", min: 500, max: 75000, fee: "2%", time: "до 1 ч" },
];

const pendingWithdrawals = [
  { id: "#WD-4821", amount: "₽ 15 000", method: "СБП", status: "processing", time: "20 мин назад" },
  { id: "#WD-4720", amount: "₽ 8 500", method: "Карта", status: "sent", time: "2 ч назад" },
];

export default function Withdraw() {
  const [selectedMethod, setSelectedMethod] = useState("sbp");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const numAmount = parseFloat(amount) || 0;
  const currentMethod = methods.find((m) => m.id === selectedMethod);
  const feePercent = parseFloat(currentMethod?.fee || "0");
  const feeAmount = numAmount * feePercent / 100;
  const netAmount = numAmount - feeAmount;
  const balance = 12450.5;

  const handleWithdraw = () => {
    if (!amount || numAmount < (currentMethod?.min || 0) || numAmount > balance) return;
    setStep("processing");
    setTimeout(() => setStep("success"), 2500);
  };

  if (step === "processing") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full btn-gradient flex items-center justify-center mx-auto mb-6 animate-pulse-neon">
            <Icon name="Loader" size={32} className="text-white animate-spin" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Создаём заявку</h2>
          <p className="text-white/40">Обрабатываем вашу заявку на вывод...</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={40} className="text-cyan-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Заявка принята!</h2>
          <p className="text-white/40 mb-1">Сумма: ₽ {netAmount.toLocaleString("ru")}</p>
          <p className="text-white/30 text-sm mb-2">Ожидаемое время: {currentMethod?.time}</p>
          <p className="text-cyan-400 text-xs mb-8">Push-уведомление придёт при зачислении</p>
          <button
            onClick={() => { setStep("form"); setAmount(""); }}
            className="btn-cyan px-8 py-3 rounded-xl font-bold text-white inline-flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-black text-white mb-2">💸 Вывод средств</h1>
          <p className="text-white/40">Быстрые выплаты на карту, СБП или крипто</p>
        </div>

        {/* Balance */}
        <div className="glass rounded-2xl border border-white/10 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Wallet" size={20} className="text-yellow-400" />
            <div>
              <div className="text-xs text-white/40">Доступно для вывода</div>
              <div className="font-display text-xl font-black text-yellow-400">₽ {balance.toLocaleString("ru")}</div>
            </div>
          </div>
          <div className="text-xs text-white/30">Верификация не требуется</div>
        </div>

        {/* Pending */}
        {pendingWithdrawals.length > 0 && (
          <div className="glass rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Clock" size={16} className="text-orange-400" />
              <span className="text-sm font-bold text-orange-400">Заявки в обработке</span>
            </div>
            <div className="space-y-2">
              {pendingWithdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 font-mono text-xs">{w.id}</span>
                    <span className="text-white/70">{w.amount}</span>
                    <span className="text-white/30">· {w.method}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    w.status === "processing"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {w.status === "processing" ? "Обработка" : "Отправлено"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methods */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`glass glass-hover rounded-xl p-4 border text-left transition-all ${
                selectedMethod === m.id
                  ? "border-cyan-500/50 bg-cyan-500/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon name={m.icon} size={18} className={selectedMethod === m.id ? "text-cyan-400" : "text-white/50"} />
                <span className={`text-sm font-medium ${selectedMethod === m.id ? "text-white" : "text-white/60"}`}>{m.label}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`text-xs ${m.fee === "0%" ? "text-green-400" : "text-orange-400"}`}>
                  {m.fee} комиссия
                </span>
                <span className="text-xs text-white/30">{m.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-4 space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Сумма вывода</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-lg">₽</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full glass border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xl font-bold placeholder-white/20 focus:outline-none focus:border-cyan-500/50 bg-transparent"
              />
            </div>
            {currentMethod && (
              <div className="mt-1 text-xs text-white/30">
                Мин: ₽ {currentMethod.min.toLocaleString("ru")} · Макс: ₽ {currentMethod.max.toLocaleString("ru")}
              </div>
            )}
          </div>

          {(selectedMethod === "card") && (
            <div>
              <label className="text-sm text-white/60 mb-2 block">Номер карты</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 font-mono bg-transparent"
              />
            </div>
          )}

          {(selectedMethod === "sbp") && (
            <div>
              <label className="text-sm text-white/60 mb-2 block">Номер телефона</label>
              <input
                type="tel"
                placeholder="+7 (999) 999-99-99"
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 bg-transparent"
              />
            </div>
          )}

          {(selectedMethod === "crypto") && (
            <div>
              <label className="text-sm text-white/60 mb-2 block">Адрес кошелька (USDT TRC-20)</label>
              <input
                type="text"
                placeholder="T..."
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 font-mono text-sm bg-transparent"
              />
            </div>
          )}
        </div>

        {/* Summary */}
        {numAmount > 0 && (
          <div className="glass rounded-xl border border-white/10 p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Сумма вывода</span>
              <span className="text-white">₽ {numAmount.toLocaleString("ru")}</span>
            </div>
            {feeAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Комиссия ({currentMethod?.fee})</span>
                <span className="text-red-400">− ₽ {feeAmount.toLocaleString("ru")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-white/10 pt-2">
              <span className="text-white font-bold">К получению</span>
              <span className="text-cyan-400 font-bold">₽ {netAmount.toLocaleString("ru")}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={!amount || numAmount < (currentMethod?.min || 0) || numAmount > balance}
          className="w-full btn-cyan py-4 rounded-xl font-bold text-white text-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Icon name="ArrowUpRight" size={20} />
          Вывести {amount ? `₽ ${netAmount.toLocaleString("ru")}` : ""}
        </button>
      </div>
    </div>
  );
}
