import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

interface Message {
  id: number;
  from: "user" | "agent";
  text: string;
  time: string;
}

const initMessages: Message[] = [
  {
    id: 1,
    from: "agent",
    text: "Привет! Я агент поддержки NEXUS. Чем могу помочь? 🎮",
    time: "10:00",
  },
  {
    id: 2,
    from: "agent",
    text: "Вы можете спросить меня о пополнении, выводе средств, бонусах или технических вопросах.",
    time: "10:00",
  },
];

const autoReplies: Record<string, string> = {
  "вывод": "Вывод средств обрабатывается от 5 минут до 3 дней в зависимости от метода. СБП — самый быстрый способ.",
  "депозит": "Пополнение счёта происходит мгновенно. Минимальная сумма от ₽100 через СБП.",
  "бонус": "Бонус 100% действует на первый депозит. Минимальная сумма — ₽1 000. Подробности в разделе Пополнение.",
  "реферал": "Приглашайте друзей и получайте 10% от их пополнений. Ссылка в разделе Рефералы.",
  "верификация": "Верификация не требуется для сумм до ₽100 000 в сутки.",
};

const quickQuestions = [
  "Как вывести деньги?",
  "Сколько идёт вывод?",
  "Где мой бонус?",
  "Как работает реферал?",
];

export default function Support() {
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), from: "user", text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const matchKey = Object.keys(autoReplies).find((k) => lower.includes(k));
      const reply = matchKey
        ? autoReplies[matchKey]
        : "Ваш вопрос передан оператору. Обычно мы отвечаем в течение 5-10 минут. Вы также можете написать нам в Telegram.";
      const agentMsg: Message = {
        id: Date.now() + 1,
        from: "agent",
        text: reply,
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
    }, 1500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-black text-white mb-2">💬 Поддержка</h1>
          <p className="text-white/40">Онлайн 24/7 · Среднее время ответа: 3 мин</p>
        </div>

        <div className="glass rounded-3xl border border-white/10 overflow-hidden" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Icon name="Headphones" size={18} className="text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-black" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Служба поддержки NEXUS</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Онлайн
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ height: "calc(100% - 140px)" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.from === "agent" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="Headphones" size={12} className="text-white" />
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-sm ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "btn-gradient text-white rounded-tr-sm"
                        : "glass border border-white/10 text-white/80 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-white/20">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                  <Icon name="Headphones" size={12} className="text-white" />
                </div>
                <div className="glass border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-5 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs glass border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap text-white/50 hover:text-white hover:border-white/20 transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение..."
              className="flex-1 glass border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 bg-transparent"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="btn-gradient w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 shrink-0"
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
