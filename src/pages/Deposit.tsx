import { useState } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const methods = [
  { id: "card", label: "Банковская карта", icon: "CreditCard", min: 500, max: 300000, fee: "0%", time: "Мгновенно" },
  { id: "sbp", label: "СБП", icon: "Smartphone", min: 100, max: 100000, fee: "0%", time: "Мгновенно" },
  { id: "crypto", label: "Криптовалюта", icon: "Bitcoin", min: 1000, max: 1000000, fee: "0%", time: "до 10 мин" },
  { id: "qiwi", label: "QIWI", icon: "Wallet", min: 300, max: 50000, fee: "2%", time: "Мгновенно" },
];

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

const bonuses = [
  { min: 1000, bonus: "10%", label: "Мини" },
  { min: 5000, bonus: "25%", label: "Стандарт" },
  { min: 15000, bonus: "50%", label: "Хай-роллер" },
  { min: 50000, bonus: "100%", label: "VIP" },
];

export default function Deposit() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const numAmount = parseFloat(amount) || 0;
  const currentMethod = methods.find((m) => m.id === selectedMethod);
  const activeBonus = bonuses.filter((b) => numAmount >= b.min).slice(-1)[0];

  const handleDeposit = () => {
    if (!amount || numAmount < (currentMethod?.min || 0)) return;
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
          <h2 className="font-display text-2xl font-bold text-white mb-2">Обрабатываем платёж</h2>
          <p className="text-white/40">Перенаправляем на страницу оплаты...</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={40} className="text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Депозит принят!</h2>
          <p className="text-white/40 mb-2">
            ₽ {parseFloat(amount).toLocaleString("ru")} зачислено на ваш счёт
          </p>
          {activeBonus && (
            <p className="text-yellow-400 font-bold mb-8">
              + бонус {activeBonus.bonus}: ₽ {(numAmount * parseFloat(activeBonus.bonus) / 100).toLocaleString("ru")}
            </p>
          )}
          <button
            onClick={() => { setStep("form"); setAmount(""); }}
            className="btn-gradient px-8 py-3 rounded-xl font-bold text-white inline-flex items-center gap-2"
          >
            <Icon name="Plus" size={16} />
            Пополнить ещё
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
          <h1 className="font-display text-3xl font-black text-white mb-2">💳 Пополнение счёта</h1>
          <p className="text-white/40">Мгновенное зачисление без комиссии</p>
        </div>

        {/* Bonus Banner */}
        <div className="glass rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Gift" size={20} className="text-yellow-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-yellow-400">Бонус на пополнение</div>
              <div className="flex gap-3 mt-1 flex-wrap">
                {bonuses.map((b) => (
                  <div
                    key={b.min}
                    className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                      numAmount >= b.min
                        ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                        : "text-white/30"
                    }`}
                  >
                    от ₽{b.min.toLocaleString("ru")} → {b.bonus}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`glass glass-hover rounded-xl p-4 border text-left transition-all ${
                selectedMethod === m.id
                  ? "border-purple-500/50 bg-purple-500/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon name={m.icon} size={18} className={selectedMethod === m.id ? "text-purple-400" : "text-white/50"} />
                <span className={`text-sm font-medium ${selectedMethod === m.id ? "text-white" : "text-white/60"}`}>{m.label}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs text-green-400">{m.fee} комиссия</span>
                <span className="text-xs text-white/30">{m.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-4">
          <label className="text-sm text-white/60 mb-3 block">Сумма пополнения</label>
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-lg">₽</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full glass border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xl font-bold placeholder-white/20 focus:outline-none focus:border-purple-500/50 bg-transparent"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  amount === String(a)
                    ? "btn-gradient text-white"
                    : "glass border border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                ₽ {a.toLocaleString("ru")}
              </button>
            ))}
          </div>
          {currentMethod && (
            <div className="mt-3 text-xs text-white/30">
              Мин: ₽ {currentMethod.min.toLocaleString("ru")} · Макс: ₽ {currentMethod.max.toLocaleString("ru")}
            </div>
          )}
        </div>

        {/* Active bonus indicator */}
        {activeBonus && (
          <div className="glass rounded-xl border border-green-500/30 bg-green-500/5 p-3 mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-green-400" />
            <span className="text-sm text-green-400">
              Бонус активирован: <strong>+{activeBonus.bonus}</strong> = ₽ {(numAmount * parseFloat(activeBonus.bonus) / 100).toLocaleString("ru")}
            </span>
          </div>
        )}

        <button
          onClick={handleDeposit}
          disabled={!amount || numAmount < (currentMethod?.min || 0)}
          className="w-full btn-gradient py-4 rounded-xl font-bold text-white text-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Icon name="CreditCard" size={20} />
          Пополнить {amount ? `₽ ${parseFloat(amount).toLocaleString("ru")}` : ""}
        </button>
      </div>
    </div>
  );
}
