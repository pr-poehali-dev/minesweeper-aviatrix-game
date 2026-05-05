import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';

type GameState = 'waiting' | 'flying' | 'crashed' | 'cashedout';

const CRASH_HISTORY = [1.24, 8.45, 1.03, 3.21, 1.67, 14.2, 2.88, 1.01, 5.55, 1.33, 22.4, 1.09];

function generateCrashPoint(): number {
  const r = Math.random();
  if (r < 0.4) return 1 + Math.random() * 0.5;
  if (r < 0.7) return 1.5 + Math.random() * 2;
  if (r < 0.9) return 3.5 + Math.random() * 6;
  return 10 + Math.random() * 40;
}

export default function Aviatrix() {
  const { user, updateBalanceDelta } = useUser();
  const [bet, setBet] = useState(50);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedAt, setCashedAt] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>(CRASH_HISTORY);
  const [countdown, setCountdown] = useState(5);
  const [planeX, setPlaneX] = useState(10);
  const [planeY, setPlaneY] = useState(80);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(2);

  const winAmount = betPlaced && cashedAt ? Math.round(bet * cashedAt * 100) / 100 : 0;

  const clearIntervals = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = useCallback(() => {
    setGameState('waiting');
    setMultiplier(1.0);
    setCashedAt(null);
    setPlaneX(10);
    setPlaneY(80);
    const cp = generateCrashPoint();
    crashPointRef.current = cp;
    setCrashPoint(null);
    setBetPlaced(false);
    setCountdown(5);

    let cnt = 5;
    countdownRef.current = setInterval(() => {
      cnt -= 1;
      setCountdown(cnt);
      if (cnt <= 0) {
        clearInterval(countdownRef.current!);
        startFlight();
      }
    }, 1000);
  }, []);

  const startFlight = () => {
    setGameState('flying');
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const m = Math.round(Math.pow(1.06, elapsed * 10) * 100) / 100;
      setMultiplier(m);

      const px = Math.min(10 + elapsed * 8, 75);
      const py = Math.max(80 - elapsed * 7, 10);
      setPlaneX(px);
      setPlaneY(py);

      if (m >= crashPointRef.current) {
        clearInterval(intervalRef.current!);
        setCrashPoint(m);
        setGameState('crashed');
        setTimeout(() => startCountdown(), 3500);
      }
    }, 100);
  };

  useEffect(() => {
    startCountdown();
    return () => clearIntervals();
  }, []);

  const placeBet = async () => {
    if (gameState !== 'waiting') return;
    if (!user || (user.balance || 0) < bet) { alert('Недостаточно средств'); return; }
    await updateBalanceDelta(-bet);
    setBetPlaced(true);
  };

  const cashOut = useCallback(async () => {
    if (gameState !== 'flying' || !betPlaced || cashedAt) return;
    const m = multiplier;
    setCashedAt(m);
    setGameState('cashedout');
    const win = Math.round(bet * m * 100) / 100;
    await updateBalanceDelta(win);
    clearInterval(intervalRef.current!);
    setTimeout(() => startCountdown(), 2500);
  }, [gameState, betPlaced, cashedAt, multiplier, bet, updateBalanceDelta, startCountdown]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-4xl">✈️</div>
          <div>
            <h1 className="font-display text-3xl font-black text-white">АВИАТРИКС</h1>
            <p className="text-white/40 text-sm">Забери деньги до крушения самолёта</p>
          </div>
        </div>

        {/* History */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {history.slice(-10).map((h, i) => (
            <span key={i} className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${h >= 10 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : h >= 2 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              ×{h.toFixed(2)}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Flight screen */}
          <div className="glass rounded-3xl border border-white/10 overflow-hidden relative" style={{ height: 340 }}>
            {/* Sky bg */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 to-black/60" />
            
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
              {[25, 50, 75].map((y) => (
                <div key={y} className="absolute w-full border-t border-white/20" style={{ top: `${y}%` }} />
              ))}
              {[25, 50, 75].map((x) => (
                <div key={x} className="absolute h-full border-l border-white/20" style={{ left: `${x}%` }} />
              ))}
            </div>

            {/* Stars */}
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full bg-white/30"
                style={{ left: `${(i * 37 + 5) % 100}%`, top: `${(i * 53 + 5) % 70}%` }} />
            ))}

            {/* Multiplier display */}
            <div className="absolute inset-0 flex items-center justify-center">
              {gameState === 'waiting' && (
                <div className="text-center animate-fade-in">
                  <div className="text-white/50 text-sm mb-2">Следующий раунд через</div>
                  <div className="font-display text-7xl font-black text-white">{countdown}</div>
                  <div className="text-white/30 text-sm mt-2">
                    {betPlaced ? <span className="text-green-400">✓ Ставка принята ₽{bet}</span> : 'Сделай ставку'}
                  </div>
                </div>
              )}
              {gameState === 'flying' && (
                <div className="text-center">
                  <div className="font-display text-7xl font-black text-green-400 animate-pulse-neon">
                    ×{multiplier.toFixed(2)}
                  </div>
                </div>
              )}
              {gameState === 'crashed' && (
                <div className="text-center animate-fade-in">
                  <div className="text-5xl mb-2">💥</div>
                  <div className="font-display text-3xl font-black text-red-400">КРУШЕНИЕ!</div>
                  <div className="text-white/50 text-sm mt-1">×{(crashPoint || 0).toFixed(2)}</div>
                </div>
              )}
              {gameState === 'cashedout' && (
                <div className="text-center animate-fade-in">
                  <div className="text-5xl mb-2">🎉</div>
                  <div className="font-display text-4xl font-black text-green-400">+₽ {winAmount.toLocaleString('ru')}</div>
                  <div className="text-white/50 text-sm mt-1">×{(cashedAt || 0).toFixed(2)}</div>
                </div>
              )}
            </div>

            {/* Plane */}
            {(gameState === 'flying' || gameState === 'cashedout') && (
              <div
                className="absolute text-3xl transition-all duration-100"
                style={{ left: `${planeX}%`, top: `${planeY}%` }}
              >
                {gameState === 'cashedout' ? '🪂' : '✈️'}
              </div>
            )}

            {/* Flight trail */}
            {gameState === 'flying' && (
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <path
                  d={`M ${planeX * 3.4}% ${planeY * 3.4}% Q 50% 60% 5% 95%`}
                  fill="none"
                  stroke="rgba(168,85,247,0.3)"
                  strokeWidth="2"
                />
              </svg>
            )}

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="glass rounded-2xl border border-white/10 p-4">
              <div className="text-xs text-white/40 mb-1">Баланс</div>
              <div className="font-display text-2xl font-black text-yellow-400">
                ₽ {(user?.balance || 0).toLocaleString('ru')}
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/10 p-4 space-y-3">
              <label className="text-xs text-white/50 block">Ставка</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₽</span>
                <input
                  type="number"
                  value={bet}
                  onChange={(e) => !betPlaced && setBet(Math.max(10, parseInt(e.target.value) || 10))}
                  disabled={betPlaced}
                  min={10}
                  className="w-full glass border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-purple-500/50 bg-transparent disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[10, 50, 100, 500].map((a) => (
                  <button key={a} onClick={() => !betPlaced && setBet(a)} disabled={betPlaced}
                    className="py-1.5 rounded-lg text-xs glass border border-white/10 text-white/50 hover:text-white disabled:opacity-40 transition-all">
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {!betPlaced ? (
              <button
                onClick={placeBet}
                disabled={gameState !== 'waiting' || !user || (user.balance || 0) < bet}
                className="w-full btn-gradient py-4 rounded-xl font-bold text-white text-lg disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Icon name="Ticket" size={18} />
                {gameState === 'waiting' ? `Ставка ₽${bet}` : 'Ждите раунда...'}
              </button>
            ) : gameState === 'flying' ? (
              <button
                onClick={cashOut}
                className="w-full btn-green py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 animate-pulse"
              >
                <Icon name="HandCoins" size={18} />
                Забрать ×{multiplier.toFixed(2)}
              </button>
            ) : (
              <div className={`glass rounded-xl p-4 text-center border ${gameState === 'cashedout' ? 'border-green-500/30 bg-green-500/5' : gameState === 'crashed' && betPlaced ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'}`}>
                {gameState === 'cashedout' && <div className="text-green-400 font-bold">Забрано: ₽{winAmount.toLocaleString('ru')}</div>}
                {gameState === 'crashed' && betPlaced && !cashedAt && <div className="text-red-400 font-bold">Потеряно: ₽{bet.toLocaleString('ru')}</div>}
                <div className="text-white/40 text-sm mt-1">Следующий раунд...</div>
              </div>
            )}

            {/* Live bets */}
            <div className="glass rounded-2xl border border-white/10 p-4">
              <div className="text-xs text-white/40 mb-3">Другие игроки</div>
              <div className="space-y-2">
                {[
                  { name: 'Alex***', bet: 500, mult: gameState === 'flying' ? multiplier : 0 },
                  { name: 'Kat***', bet: 1200, mult: 0 },
                  { name: 'Pro***', bet: 300, mult: gameState === 'flying' ? multiplier * 0.9 : 0 },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{p.name}</span>
                    <span className="text-white/40">₽{p.bet}</span>
                    {p.mult > 0 ? (
                      <span className="text-green-400 font-bold">×{p.mult.toFixed(2)}</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
