import { useState } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

type TabKey = "games" | "transactions";

const gameHistory = [
  { id: 1, game: "Aviator", bet: 500, result: 2100, profit: 1600, time: "05.05.2026 14:32", win: true, emoji: "✈️" },
  { id: 2, game: "Lightning Roulette", bet: 1000, result: 0, profit: -1000, time: "05.05.2026 13:15", win: false, emoji: "⚡" },
  { id: 3, game: "Gates of Olympus", bet: 2000, result: 14400, profit: 12400, time: "05.05.2026 11:50", win: true, emoji: "⚡" },
  { id: 4, game: "Sweet Bonanza", bet: 300, result: 0, profit: -300, time: "04.05.2026 22:10", win: false, emoji: "🍬" },
  { id: 5, game: "Book of Ra", bet: 800, result: 3600, profit: 2800, time: "04.05.2026 20:45", win: true, emoji: "📚" },
  { id: 6, game: "Crazy Time", bet: 1500, result: 0, profit: -1500, time: "04.05.2026 18:30", win: false, emoji: "🎪" },
  { id: 7, game: "Mega Fortune", bet: 400, result: 1200, profit: 800, time: "04.05.2026 17:00", win: true, emoji: "🎰" },
  { id: 8, game: "Dragon Tiger", bet: 600, result: 0, profit: -600, time: "03.05.2026 21:00", win: false, emoji: "🐉" },
];

const transactions = [
  { id: "TXN-9912", type: "deposit", amount: 5000, method: "СБП", status: "completed", time: "05.05.2026 10:00" },
  { id: "TXN-9841", type: "withdrawal", amount: 15000, method: "Карта", status: "pending", time: "04.05.2026 18:00" },
  { id: "TXN-9780", type: "bonus", amount: 2500, method: "Бонус 50%", status: "completed", time: "04.05.2026 10:00" },
  { id: "TXN-9712", type: "deposit", amount: 10000, method: "Крипто", status: "completed", time: "02.05.2026 15:30" },
  { id: "TXN-9640", type: "withdrawal", amount: 8500, method: "СБП", status: "completed", time: "01.05.2026 12:00" },
  { id: "TXN-9581", type: "referral", amount: 1200, method: "Реферал", status: "completed", time: "30.04.2026 09:00" },
];

const txTypeConfig: Record<string, { label: string; icon: string; color: string }> = {
  deposit: { label: "Пополнение", icon: "ArrowDownLeft", color: "text-green-400" },
  withdrawal: { label: "Вывод", icon: "ArrowUpRight", color: "text-red-400" },
  bonus: { label: "Бонус", icon: "Gift", color: "text-yellow-400" },
  referral: { label: "Реферал", icon: "Users", color: "text-purple-400" },
};

export default function History() {
  const [tab, setTab] = useState<TabKey>("games");
  const [filterWin, setFilterWin] = useState<"all" | "win" | "lose">("all");

  const filteredGames = gameHistory.filter((g) => {
    if (filterWin === "win") return g.win;
    if (filterWin === "lose") return !g.win;
    return true;
  });

  const totalBets = gameHistory.reduce((s, g) => s + g.bet, 0);
  const totalWins = gameHistory.filter((g) => g.win).reduce((s, g) => s + g.profit, 0);
  const totalLosses = gameHistory.filter((g) => !g.win).reduce((s, g) => s + Math.abs(g.profit), 0);
  const winRate = Math.round((gameHistory.filter((g) => g.win).length / gameHistory.length) * 100);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-black text-white mb-2">📋 История</h1>
          <p className="text-white/40">Все ваши игры и финансовые операции</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Всего ставок", value: `₽ ${totalBets.toLocaleString("ru")}`, icon: "Gamepad2", color: "text-neon-purple" },
            { label: "Процент побед", value: `${winRate}%`, icon: "TrendingUp", color: "text-neon-green" },
            { label: "Выиграно", value: `₽ ${totalWins.toLocaleString("ru")}`, icon: "Trophy", color: "text-neon-gold" },
            { label: "Проиграно", value: `₽ ${totalLosses.toLocaleString("ru")}`, icon: "TrendingDown", color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
              <Icon name={s.icon} size={18} className={`${s.color} mx-auto mb-2`} />
              <div className={`font-display text-lg font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 border border-white/10 mb-4 w-fit">
          {[
            { key: "games" as TabKey, label: "Игры", icon: "Gamepad2" },
            { key: "transactions" as TabKey, label: "Транзакции", icon: "Receipt" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-purple-500/30 text-purple-400 border border-purple-500/30"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "games" && (
          <div>
            <div className="flex gap-2 mb-4">
              {[
                { key: "all" as const, label: "Все" },
                { key: "win" as const, label: "Победы" },
                { key: "lose" as const, label: "Поражения" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterWin(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterWin === f.key
                      ? f.key === "win" ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : f.key === "lose" ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "glass border border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="hidden md:grid grid-cols-5 px-4 py-2 text-xs text-white/30 border-b border-white/10">
                <span>Игра</span>
                <span className="text-right">Ставка</span>
                <span className="text-right">Результат</span>
                <span className="text-right">Прибыль</span>
                <span className="text-right">Дата</span>
              </div>
              <div className="divide-y divide-white/5">
                {filteredGames.map((g) => (
                  <div key={g.id} className="grid grid-cols-2 md:grid-cols-5 px-4 py-3 hover:bg-white/3 transition-colors items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{g.emoji}</span>
                      <div>
                        <div className="text-sm text-white font-medium">{g.game}</div>
                        <div className="text-xs text-white/30 md:hidden">{g.time}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-white/60">₽ {g.bet.toLocaleString("ru")}</div>
                    <div className="hidden md:block text-right text-sm text-white/60">
                      {g.win ? `₽ ${g.result.toLocaleString("ru")}` : "—"}
                    </div>
                    <div className={`text-right text-sm font-bold ${g.win ? "text-green-400" : "text-red-400"}`}>
                      {g.win ? `+₽ ${g.profit.toLocaleString("ru")}` : `−₽ ${Math.abs(g.profit).toLocaleString("ru")}`}
                    </div>
                    <div className="hidden md:block text-right text-xs text-white/30">{g.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "transactions" && (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="hidden md:grid grid-cols-5 px-4 py-2 text-xs text-white/30 border-b border-white/10">
              <span>ID</span>
              <span>Тип</span>
              <span className="text-right">Сумма</span>
              <span>Метод</span>
              <span className="text-right">Дата</span>
            </div>
            <div className="divide-y divide-white/5">
              {transactions.map((tx) => {
                const cfg = txTypeConfig[tx.type];
                return (
                  <div key={tx.id} className="grid grid-cols-2 md:grid-cols-5 px-4 py-3 hover:bg-white/3 transition-colors items-center">
                    <span className="font-mono text-xs text-white/30">{tx.id}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg glass flex items-center justify-center`}>
                        <Icon name={cfg.icon} size={12} className={cfg.color} />
                      </div>
                      <span className={`text-sm ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <div className={`text-right text-sm font-bold ${cfg.color}`}>
                      {tx.type === "withdrawal" ? "−" : "+"}₽ {tx.amount.toLocaleString("ru")}
                    </div>
                    <div className="hidden md:block text-sm text-white/50">{tx.method}</div>
                    <div className="hidden md:block text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-orange-500/10 text-orange-400"
                      }`}>
                        {tx.status === "completed" ? "Выполнено" : "В обработке"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
