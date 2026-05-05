import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';
import { isAdmin } from '@/lib/api';

const navItems: { path: string; label: string; icon: string }[] = [
  { path: '/', label: 'Главная', icon: 'Home' },
  { path: '/miner', label: 'Минёр', icon: 'Bomb' },
  { path: '/aviatrix', label: 'Авиатрикс', icon: 'Plane' },
  { path: '/deposit', label: 'Пополнить', icon: 'CreditCard' },
  { path: '/withdraw', label: 'Вывод', icon: 'Banknote' },
  { path: '/support', label: 'Поддержка', icon: 'MessageCircle' },
];

export default function Navbar() {
  const location = useLocation();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
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
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </Link>
            ))}
            {isAdmin() && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                }`}
              >
                <Icon name="ShieldCheck" size={14} />
                Админ
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/10">
              <Icon name="Coins" size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400 font-display">
                ₽ {((user?.balance) || 0).toLocaleString('ru')}
              </span>
            </div>
            <button
              className="lg:hidden text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </Link>
              ))}
              {isAdmin() && (
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
