import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navItems: { path: string; label: string; icon: string }[] = [
  { path: "/", label: "Главная", icon: "Home" },
  { path: "/games", label: "Игры", icon: "Gamepad2" },
  { path: "/profile", label: "Кабинет", icon: "User" },
  { path: "/deposit", label: "Пополнить", icon: "CreditCard" },
  { path: "/withdraw", label: "Вывод", icon: "Banknote" },
  { path: "/history", label: "История", icon: "History" },
  { path: "/referral", label: "Рефералы", icon: "Users" },
  { path: "/support", label: "Поддержка", icon: "MessageCircle" },
];

const ADMIN_ROLE = "admin";
const currentUser = { role: ADMIN_ROLE, name: "CryptoPlayer", balance: 12450.5 };

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center animate-pulse-neon">
              <Icon name="Zap" size={16} className="text-white relative z-10" />
            </div>
            <span className="font-display text-lg gradient-text font-bold tracking-wider">NEXUS</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </Link>
            ))}
            {currentUser.role === ADMIN_ROLE && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                }`}
              >
                <Icon name="ShieldCheck" size={14} />
                Админ
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/10">
              <Icon name="Coins" size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400 font-display">
                {currentUser.balance.toLocaleString("ru")} ₽
              </span>
            </div>
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {currentUser.name[0]}
                </span>
              </div>
              <span className="hidden sm:block text-sm text-white/80">{currentUser.name}</span>
            </div>
            <button
              className="lg:hidden text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </Link>
              ))}
              {currentUser.role === ADMIN_ROLE && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Icon name="ShieldCheck" size={14} />
                  Админ
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}
