import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const statCards = [
  { label: "Всего ставок", value: "1 248", icon: "Gamepad2", color: "text-neon-purple", bg: "from-purple-500/10 to-purple-900/5" },
  { label: "Побед", value: "634", icon: "Trophy", color: "text-neon-gold", bg: "from-yellow-500/10 to-yellow-900/5" },
  { label: "Процент побед", value: "50.8%", icon: "TrendingUp", color: "text-neon-green", bg: "from-green-500/10 to-green-900/5" },
  { label: "Общий выигрыш", value: "₽ 84 320", icon: "DollarSign", color: "text-neon-blue", bg: "from-cyan-500/10 to-cyan-900/5" },
  { label: "Общий проигрыш", value: "₽ 62 150", icon: "TrendingDown", color: "text-red-400", bg: "from-red-500/10 to-red-900/5" },
  { label: "Чистая прибыль", value: "+ ₽ 22 170", icon: "Wallet", color: "text-neon-green", bg: "from-green-500/10 to-green-900/5" },
];

const achievements = [
  { name: "Первая ставка", emoji: "🎯", earned: true },
  { name: "Счастливчик", emoji: "🍀", earned: true },
  { name: "Хай-роллер", emoji: "💎", earned: true },
  { name: "Верный игрок", emoji: "🏆", earned: false },
  { name: "Миллионер", emoji: "💰", earned: false },
  { name: "Легенда", emoji: "👑", earned: false },
];

const recentActivity = [
  { game: "Aviator", result: "+₽ 4 200", time: "5 мин назад", win: true },
  { game: "Lightning Roulette", result: "-₽ 800", time: "23 мин назад", win: false },
  { game: "Gates of Olympus", result: "+₽ 12 400", time: "1 ч назад", win: true },
  { game: "Book of Ra", result: "-₽ 1 500", time: "2 ч назад", win: false },
  { game: "Crazy Time", result: "+₽ 3 100", time: "3 ч назад", win: true },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("stats");
  const tabs = [
    { key: "stats", label: "Статистика", icon: "BarChart3" },
    { key: "activity", label: "Активность", icon: "Activity" },
    { key: "achievements", label: "Достижения", icon: "Trophy" },
    { key: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Profile Header */}
        <div className="glass rounded-3xl border border-white/10 p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-black text-white font-display animate-glow-pulse">
                C
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl font-black text-white">CryptoPlayer</h1>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">VIP</span>
              </div>
              <p className="text-white/40 text-sm mb-3">Игрок с марта 2024 · ID: #84521</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-48">
                  <div className="h-full progress-neon rounded-full" style={{ width: "68%" }} />
                </div>
                <span className="text-xs text-white/40">Уровень 12 · 68%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-max">
              <div className="glass px-5 py-3 rounded-xl border border-yellow-500/20 text-center">
                <div className="text-xs text-white/40 mb-1">Баланс</div>
                <div className="font-display text-xl font-black text-yellow-400">₽ 12 450.50</div>
              </div>
              <div className="flex gap-2">
                <Link to="/deposit" className="btn-gradient px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  <Icon name="Plus" size={12} />
                  Пополнить
                </Link>
                <Link to="/withdraw" className="btn-cyan px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  <Icon name="ArrowUpRight" size={12} />
                  Вывести
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 border border-white/10 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-purple-500/30 text-purple-400 border border-purple-500/30"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className={`glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br ${s.bg}`}>
                  <Icon name={s.icon} size={20} className={`${s.color} mb-3`} />
                  <div className={`font-display text-xl font-black mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Win/Loss Chart placeholder */}
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={16} className="text-purple-400" />
                Динамика за 7 дней
              </h3>
              <div className="flex items-end gap-2 h-32">
                {[65, 40, 80, 55, 90, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg progress-neon opacity-80"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-xs text-white/30">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Games */}
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Star" size={16} className="text-yellow-400" />
                Любимые игры
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Aviator", sessions: 124, winrate: "54%", emoji: "✈️" },
                  { name: "Gates of Olympus", sessions: 89, winrate: "48%", emoji: "⚡" },
                  { name: "Crazy Time", sessions: 67, winrate: "52%", emoji: "🎪" },
                ].map((g) => (
                  <div key={g.name} className="flex items-center gap-3">
                    <span className="text-2xl">{g.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white">{g.name}</span>
                        <span className="text-sm text-green-400 font-medium">{g.winrate}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full progress-neon"
                          style={{ width: g.winrate }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-white/30">{g.sessions} игр</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white">Последние игры</h3>
            </div>
            <div className="divide-y divide-white/5">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.win ? "bg-green-500/10" : "bg-red-500/10"}`}>
                      <Icon name={a.win ? "TrendingUp" : "TrendingDown"} size={14} className={a.win ? "text-green-400" : "text-red-400"} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{a.game}</div>
                      <div className="text-xs text-white/30">{a.time}</div>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${a.win ? "text-green-400" : "text-red-400"}`}>{a.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
            {achievements.map((a) => (
              <div
                key={a.name}
                className={`glass rounded-2xl p-5 border text-center transition-all ${
                  a.earned
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-white/5 opacity-40 grayscale"
                }`}
              >
                <div className="text-4xl mb-3">{a.emoji}</div>
                <div className={`text-sm font-bold ${a.earned ? "text-yellow-400" : "text-white/40"}`}>{a.name}</div>
                {a.earned && (
                  <div className="mt-2 text-xs text-white/30 flex items-center justify-center gap-1">
                    <Icon name="CheckCircle" size={10} className="text-green-400" />
                    Получено
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4 animate-fade-in">
            {[
              { label: "Email", value: "crypto***@gmail.com", icon: "Mail" },
              { label: "Телефон", value: "+7 (9**) ***-**-78", icon: "Phone" },
              { label: "Никнейм", value: "CryptoPlayer", icon: "User" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-2xl border border-white/10 p-4 flex items-center gap-4">
                <Icon name={f.icon} size={18} className="text-purple-400" />
                <div className="flex-1">
                  <div className="text-xs text-white/40 mb-1">{f.label}</div>
                  <div className="text-sm text-white">{f.value}</div>
                </div>
                <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Изменить</button>
              </div>
            ))}

            <div className="glass rounded-2xl border border-white/10 p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Bell" size={16} className="text-purple-400" />
                Push-уведомления
              </h3>
              {[
                { label: "Депозит принят", checked: true },
                { label: "Вывод выполнен", checked: true },
                { label: "Бонусы и акции", checked: false },
                { label: "Реферальное вознаграждение", checked: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-white/70">{n.label}</span>
                  <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${n.checked ? "bg-purple-500" : "bg-white/10"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white m-0.5 transition-transform ${n.checked ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
