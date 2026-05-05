import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';

const GRID = 25;

function calcMultiplier(revealed: number, mines: number): number {
  let mult = 1;
  const safe = GRID - mines;
  for (let i = 0; i < revealed; i++) {
    mult *= (GRID - mines - i) / (GRID - i);
  }
  return Math.round((1 / mult) * 100) / 100;
}

export default function Miner() {
  const { user, updateBalanceDelta } = useUser();
  const [mines, setMines] = useState(3);
  const [bet, setBet] = useState(50);
  const [gameActive, setGameActive] = useState(false);
  const [minePositions, setMinePositions] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [exploded, setExploded] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const multiplier = calcMultiplier(revealed.size, mines);
  const currentWin = gameActive ? Math.round(bet * multiplier * 100) / 100 : 0;

  const startGame = useCallback(async () => {
    if (!user) return;
    if ((user.balance || 0) < bet) {
      alert('Недостаточно средств');
      return;
    }
    await updateBalanceDelta(-bet);

    const positions = new Set<number>();
    while (positions.size < mines) {
      positions.add(Math.floor(Math.random() * GRID));
    }
    setMinePositions(positions);
    setRevealed(new Set());
    setExploded(null);
    setGameOver(null);
    setGameActive(true);
    setWinAmount(0);
  }, [user, bet, mines, updateBalanceDelta]);

  const handleCell = useCallback(async (idx: number) => {
    if (!gameActive || revealed.has(idx) || exploded !== null) return;

    if (minePositions.has(idx)) {
      setExploded(idx);
      setGameActive(false);
      setGameOver('lose');
      setMinePositions(new Set(minePositions)); // reveal all mines
    } else {
      const newRevealed = new Set(revealed);
      newRevealed.add(idx);
      setRevealed(newRevealed);

      if (newRevealed.size === GRID - mines) {
        const win = Math.round(bet * calcMultiplier(newRevealed.size, mines) * 100) / 100;
        setWinAmount(win);
        await updateBalanceDelta(win);
        setGameActive(false);
        setGameOver('win');
      }
    }
  }, [gameActive, revealed, exploded, minePositions, mines, bet, updateBalanceDelta]);

  const cashOut = useCallback(async () => {
    if (!gameActive || revealed.size === 0) return;
    const win = currentWin;
    await updateBalanceDelta(win);
    setWinAmount(win);
    setGameActive(false);
    setGameOver('win');
  }, [gameActive, revealed, currentWin, updateBalanceDelta]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-4xl">💣</div>
          <div>
            <h1 className="font-display text-3xl font-black text-white">МИНЁР</h1>
            <p className="text-white/40 text-sm">Открывай клетки и не задень мину</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Game field */}
          <div>
            {gameOver === 'win' && (
              <div className="glass border border-green-500/40 bg-green-500/10 rounded-2xl p-4 mb-4 text-center animate-fade-in">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-display text-2xl font-black text-green-400">+₽ {winAmount.toLocaleString('ru')}</div>
                <div className="text-white/50 text-sm mt-1">Выигрыш зачислен!</div>
              </div>
            )}
            {gameOver === 'lose' && (
              <div className="glass border border-red-500/40 bg-red-500/10 rounded-2xl p-4 mb-4 text-center animate-fade-in">
                <div className="text-4xl mb-2">💥</div>
                <div className="font-display text-2xl font-black text-red-400">Взрыв! −₽ {bet.toLocaleString('ru')}</div>
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: GRID }, (_, i) => {
                const isRevealed = revealed.has(i);
                const isMine = minePositions.has(i);
                const isExploded = exploded === i;
                const showMine = gameOver !== null && isMine;

                return (
                  <button
                    key={i}
                    onClick={() => handleCell(i)}
                    disabled={!gameActive || isRevealed}
                    className={`
                      aspect-square rounded-xl text-2xl font-bold transition-all duration-200 flex items-center justify-center
                      ${isExploded ? 'bg-red-500 scale-95 border-2 border-red-400 animate-pulse' :
                        showMine ? 'bg-red-500/20 border border-red-500/30' :
                        isRevealed ? 'bg-green-500/20 border border-green-500/30 scale-95 cursor-default' :
                        gameActive ? 'glass border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer active:scale-95' :
                        'glass border border-white/5 cursor-default opacity-60'}
                    `}
                  >
                    {isExploded ? '💥' : showMine ? '💣' : isRevealed ? '💎' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="glass rounded-2xl border border-white/10 p-4">
              <div className="text-xs text-white/40 mb-1">Баланс</div>
              <div className="font-display text-2xl font-black text-yellow-400">
                ₽ {(user?.balance || 0).toLocaleString('ru')}
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/10 p-4 space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Мины: <span className="text-purple-400 font-bold">{mines}</span></label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((m) => (
                    <button
                      key={m}
                      onClick={() => !gameActive && setMines(m)}
                      disabled={gameActive}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mines === m ? 'btn-gradient text-white' : 'glass border border-white/10 text-white/50 hover:text-white'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-2 block">Ставка</label>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₽</span>
                  <input
                    type="number"
                    value={bet}
                    onChange={(e) => !gameActive && setBet(Math.max(10, parseInt(e.target.value) || 10))}
                    disabled={gameActive}
                    min={10}
                    className="w-full glass border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-purple-500/50 bg-transparent disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[10, 50, 100, 500].map((a) => (
                    <button key={a} onClick={() => !gameActive && setBet(a)} disabled={gameActive}
                      className="py-1.5 rounded-lg text-xs glass border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-50 transition-all">
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {gameActive && revealed.size > 0 && (
              <div className="glass rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-center animate-fade-in">
                <div className="text-xs text-white/40 mb-1">Можно забрать</div>
                <div className="font-display text-2xl font-black text-green-400">₽ {currentWin.toLocaleString('ru')}</div>
                <div className="text-xs text-white/30 mb-3">× {multiplier} множитель</div>
                <button onClick={cashOut} className="w-full btn-green py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2">
                  <Icon name="HandCoins" size={16} />
                  Забрать выигрыш
                </button>
              </div>
            )}

            {gameActive && revealed.size === 0 && (
              <div className="glass rounded-2xl border border-white/10 p-4 text-center">
                <div className="text-xs text-white/40 mb-1">Множитель</div>
                <div className="font-display text-2xl font-black text-purple-400">× {multiplier}</div>
                <div className="text-xs text-white/30 mt-1">Открой клетку чтобы начать</div>
              </div>
            )}

            {!gameActive && (
              <button
                onClick={startGame}
                disabled={!user || (user.balance || 0) < bet}
                className="w-full btn-gradient py-4 rounded-xl font-bold text-white text-lg disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Icon name="Play" size={18} />
                {gameOver ? 'Играть снова' : 'Начать игру'}
              </button>
            )}

            {gameActive && (
              <div className="text-center text-sm text-white/40 animate-pulse">
                Открыто: {revealed.size} / {GRID - mines}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
