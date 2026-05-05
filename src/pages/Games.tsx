import { useState } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const categories = ["Все", "Слоты", "Рулетка", "Краш", "Карты", "Лайв"];

const games = [
  { id: 1, name: "Mega Fortune", category: "Слоты", rtp: "96.6%", players: 342, emoji: "🎰", hot: true, new: false, jackpot: "₽ 2.4M" },
  { id: 2, name: "Lightning Roulette", category: "Рулетка", rtp: "97.3%", players: 215, emoji: "⚡", hot: true, new: false, jackpot: null },
  { id: 3, name: "Crash X100", category: "Краш", rtp: "97.0%", players: 891, emoji: "🚀", hot: false, new: true, jackpot: null },
  { id: 4, name: "Dragon Tiger", category: "Карты", rtp: "96.8%", players: 128, emoji: "🐉", hot: false, new: false, jackpot: null },
  { id: 5, name: "Book of Ra", category: "Слоты", rtp: "95.0%", players: 567, emoji: "📚", hot: true, new: false, jackpot: "₽ 890K" },
  { id: 6, name: "Sweet Bonanza", category: "Слоты", rtp: "96.5%", players: 443, emoji: "🍬", hot: false, new: false, jackpot: null },
  { id: 7, name: "Evolution Baccarat", category: "Лайв", rtp: "98.9%", players: 76, emoji: "🎴", hot: false, new: true, jackpot: null },
  { id: 8, name: "Aviator", category: "Краш", rtp: "97.0%", players: 1240, emoji: "✈️", hot: true, new: false, jackpot: null },
  { id: 9, name: "Gates of Olympus", category: "Слоты", rtp: "96.5%", players: 389, emoji: "⚡", hot: true, new: false, jackpot: "₽ 5.1M" },
  { id: 10, name: "Speed Roulette", category: "Рулетка", rtp: "97.3%", players: 94, emoji: "🎡", hot: false, new: true, jackpot: null },
  { id: 11, name: "Blackjack VIP", category: "Карты", rtp: "99.5%", players: 32, emoji: "♠️", hot: false, new: false, jackpot: null },
  { id: 12, name: "Crazy Time", category: "Лайв", rtp: "96.1%", players: 2100, emoji: "🎪", hot: true, new: false, jackpot: null },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "rtp", label: "По RTP" },
  { value: "new", label: "Новинки" },
];

export default function Games() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [playingGame, setPlayingGame] = useState<number | null>(null);

  const filtered = games
    .filter((g) => {
      const matchCat = activeCategory === "Все" || g.category === activeCategory;
      const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "popular") return b.players - a.players;
      if (sort === "rtp") return parseFloat(b.rtp) - parseFloat(a.rtp);
      if (sort === "new") return Number(b.new) - Number(a.new);
      return 0;
    });

  if (playingGame !== null) {
    const game = games.find((g) => g.id === playingGame);
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => setPlayingGame(null)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад к играм
          </button>
          <div className="glass rounded-3xl border border-purple-500/20 overflow-hidden">
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/20 h-96 flex flex-col items-center justify-center gap-4">
              <div className="text-8xl">{game?.emoji}</div>
              <h2 className="font-display text-3xl font-bold text-white">{game?.name}</h2>
              <div className="flex gap-3">
                <span className="glass px-3 py-1 rounded-full text-sm text-purple-400 border border-purple-500/30">{game?.category}</span>
                <span className="glass px-3 py-1 rounded-full text-sm text-green-400 border border-green-500/30">RTP {game?.rtp}</span>
              </div>
              <p className="text-white/40 text-sm">Демо-режим — зарегистрируйся для игры на реальные деньги</p>
            </div>
            <div className="p-6 flex gap-3 justify-center">
              <button className="btn-gradient px-6 py-3 rounded-xl font-bold text-white inline-flex items-center gap-2">
                <Icon name="Play" size={16} />
                Играть на деньги
              </button>
              <button className="glass px-6 py-3 rounded-xl font-medium text-white/70 border border-white/10 hover:border-white/20 transition-all inline-flex items-center gap-2">
                <Icon name="Eye" size={16} />
                Демо-режим
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-black text-white mb-2">
            🎮 Каталог игр
          </h1>
          <p className="text-white/40">320+ игр от лучших провайдеров</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Поиск игры..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="glass border border-white/10 rounded-xl px-4 py-2.5 text-white/70 text-sm focus:outline-none focus:border-purple-500/50 bg-transparent"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "btn-gradient text-white"
                  : "glass text-white/50 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((game) => (
            <div
              key={game.id}
              onClick={() => setPlayingGame(game.id)}
              className="glass glass-hover rounded-2xl p-4 border border-white/5 cursor-pointer group"
            >
              <div className="relative mb-3">
                <div className="text-5xl text-center leading-none">{game.emoji}</div>
                <div className="absolute top-0 right-0 flex gap-1">
                  {game.hot && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30">HOT</span>
                  )}
                  {game.new && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/30">NEW</span>
                  )}
                </div>
              </div>
              <div className="font-bold text-white text-sm mb-1 truncate">{game.name}</div>
              <div className="text-xs text-white/40 mb-2">{game.category}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400">RTP {game.rtp}</span>
                <span className="text-xs text-white/30 flex items-center gap-1">
                  <Icon name="Users" size={10} />
                  {game.players}
                </span>
              </div>
              {game.jackpot && (
                <div className="mt-2 text-xs gradient-text-gold font-bold text-center">
                  JP: {game.jackpot}
                </div>
              )}
              <button className="w-full mt-3 btn-gradient py-2 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Играть
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white/40">Игры не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
