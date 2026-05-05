import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

interface Message {
  id: number;
  text: string;
  from_admin: boolean;
  created_at: string;
}

const quickQuestions = [
  'Как пополнить баланс?',
  'Сколько ждать вывод?',
  'Как играть в Минёр?',
  'Как использовать бонус?',
];

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    const data = await api.supportMessages();
    setMessages(data.messages || []);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setInput('');
    setLoading(true);
    await api.supportSend(text);
    await loadMessages();
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-black text-white mb-2">💬 Поддержка</h1>
          <p className="text-white/40">Напишите нам — ответим как можно скорее</p>
        </div>

        <div className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 260px)', minHeight: 500 }}>
          {/* Header */}
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
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-white/30 text-sm py-8">
                Напишите нам — мы рады помочь!
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.from_admin ? 'flex-row' : 'flex-row-reverse'}`}>
                {msg.from_admin && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="Headphones" size={12} className="text-white" />
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-sm flex flex-col gap-1 ${msg.from_admin ? 'items-start' : 'items-end'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.from_admin
                      ? 'glass border border-white/10 text-white/80 rounded-tl-sm'
                      : 'btn-gradient text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-white/20">
                    {new Date(msg.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
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
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Написать сообщение..."
              className="flex-1 glass border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 bg-transparent"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="btn-gradient w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 shrink-0"
            >
              {loading ? <Icon name="Loader" size={14} className="animate-spin text-white" /> : <Icon name="Send" size={14} className="text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
