import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';

const features = [
  { icon: 'Bomb', title: 'Минёр 5×5', desc: 'Открывай клетки, избегай мин. Забирай выигрыш когда хочешь!', color: 'from-purple-500/20 to-purple-900/5', border: 'border-purple-500/20', iconColor: 'text-neon-purple', path: '/miner' },
  { icon: 'Plane', title: 'Авиатрикс', desc: 'Самолётик летит и множитель растёт. Успей забрать до крушения!', color: 'from-cyan-500/20 to-cyan-900/5', border: 'border-cyan-500/20', iconColor: 'text-neon-blue', path: '/aviatrix' },
  { icon: 'CreditCard', title: 'Пополнение', desc: 'Оплата мобильной связи Билайн. Без комиссии, быстро.', color: 'from-green-500/20 to-green-900/5', border: 'border-green-500/20', iconColor: 'text-neon-green', path: '/deposit' },
  { icon: 'Gift', title: 'Бонус 100₽', desc: 'Каждый новый игрок получает 100₽ на игровой счёт бесплатно!', color: 'from-yellow-500/20 to-yellow-900/5', border: 'border-yellow-500/20', iconColor: 'text-yellow-400', path: '/deposit' },
];

export default function Index() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-grid">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {user && (
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-green-500/30 mb-6 animate-slide-up">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/70">Ваш баланс: <span className="text-yellow-400 font-bold">₽ {user.balance.toLocaleString('ru')}</span></span>
            </div>
          )}

          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 animate-slide-up-delay-1 leading-tight">
            <span className="gradient-text">NEXUS</span>
            <br />
            <span className="text-white/90 text-3xl md:text-5xl">Игровая Платформа</span>
          </h1>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto animate-slide-up-delay-2">
            Минёр и Авиатрикс — две честные игры с реальными выплатами.
            Бонус 100₽ каждому новому игроку!
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up-delay-3">
            <Link to="/miner" className="btn-gradient px-8 py-4 rounded-xl font-bold text-white text-lg relative z-10 inline-flex items-center gap-2 shadow-lg">
              <Icon name="Bomb" size={20} />
              Играть в Минёр
            </Link>
            <Link to="/aviatrix" className="btn-cyan px-8 py-4 rounded-xl font-bold text-white text-lg inline-flex items-center gap-2 shadow-lg">
              <Icon name="Plane" size={20} />
              Авиатрикс
            </Link>
          </div>

          <div className="mt-6 animate-slide-up-delay-4">
            <span className="text-xs text-green-400 font-bold">🎁 Бонус 100₽ при регистрации — уже на вашем счету!</span>
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
            Наши игры
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <Link
                key={f.title}
                to={f.path}
                className={`glass glass-hover rounded-2xl p-6 border ${f.border} bg-gradient-to-br ${f.color} group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${f.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon name={f.icon} size={24} />
                </div>
                <h3 className="font-display font-bold text-white mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-10">
            Как это работает
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { n: '1', title: 'Пополни счёт', desc: 'Оплата через мобильную связь Билайн на номер 79629031556', icon: 'CreditCard', color: 'text-purple-400' },
              { n: '2', title: 'Играй', desc: 'Выбирай Минёр или Авиатрикс и начинай выигрывать', icon: 'Gamepad2', color: 'text-cyan-400' },
              { n: '3', title: 'Выводи', desc: 'Выводи выигрыш на СБП любого банка', icon: 'Banknote', color: 'text-green-400' },
            ].map((s) => (
              <div key={s.n} className="glass rounded-2xl border border-white/5 p-5 text-center">
                <div className={`w-10 h-10 rounded-full btn-gradient flex items-center justify-center mx-auto mb-4 font-display font-black text-white text-lg`}>{s.n}</div>
                <Icon name={s.icon} size={24} className={`${s.color} mx-auto mb-3`} />
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
