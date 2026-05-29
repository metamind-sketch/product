import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { ChatMessage, DigitalProduct } from "../types";

interface ChatAssistantProps {
  products: DigitalProduct[];
  setActiveTab: (tab: 'explore' | 'seller' | 'library' | 'incubator') => void;
}

export default function ChatAssistant({ products, setActiveTab }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hi! I am your Coursezy Store AI Guide. Ask me anything! I can recommend the right modern ebooks, templates, and courses inside our inventory block to match your goals." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const drawerEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      drawerEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userText: string = inputText) => {
    if (!userText.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newMessages);
    setInputText("");
    setIsSending(true);

    try {
      const resp = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          products: products.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            tagline: p.tagline,
            price: p.price,
            rating: p.rating
          }))
        })
      });

      if (!resp.ok) {
        throw new Error("HTTP error checking assistant recommendation.");
      }

      const data = await resp.json();
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (err) {
      console.error(err);
      
      // Fallback
      setMessages(prev => [...prev, {
        role: 'model',
        content: "I ran into a connection error while thinking about my recommendations. Feel free to browse our Template category to get CreatorOS Workspace or Елена's React guide! What else can I guide you on?"
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans" id="storefront-chat-assistant">
      {/* Floating Sparkles Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex h-14 w-14 items-center justify-center rounded-full bg-white font-bold text-black shadow-2xl hover:bg-amber-500 hover:text-black transition duration-300 border border-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-mono font-bold text-black items-center justify-center">AI</span>
        </span>
      </motion.button>

      {/* Slide out Chat drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 overflow-hidden rounded-lg border border-white/10 bg-[#0F0F0F] text-slate-200 shadow-2xl"
          >
            {/* Header info */}
            <div className="bg-[#0A0A0A] p-4 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-serif italic text-xs font-normal">Coursezy Concierge</h4>
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest font-mono">Shopping Companion</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer p-0.5">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Chat Messages flow list */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-[#070707]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-black font-semibold rounded-br-none'
                      : 'bg-[#121212] border border-white/5 text-slate-200 rounded-bl-none text-left'
                  }`}>
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded rounded-bl-none border border-white/5 bg-[#121212] p-3 text-xs text-slate-500 max-w-[85%] flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce"></span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={drawerEndRef} />
            </div>

            {/* Helper quick Question Chips */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto bg-[#070707] text-[9px] font-mono">
              <button
                onClick={() => handleQuickQuestion("Recommend a Notion template")}
                className="shrink-0 bg-[#121212] border border-white/5 rounded-full py-1 px-2.5 hover:border-amber-500/30 text-slate-400 hover:text-white cursor-pointer transition"
              >
                Notion template?
              </button>
              <button
                onClick={() => handleQuickQuestion("Best ebook to learn coding")}
                className="shrink-0 bg-[#121212] border border-white/5 rounded-full py-1 px-2.5 hover:border-amber-500/30 text-slate-400 hover:text-white cursor-pointer transition"
              >
                Learn coding?
              </button>
              <button
                onClick={() => handleQuickQuestion("Is checklist suitable for launches?")}
                className="shrink-0 bg-[#121212] border border-white/5 rounded-full py-1 px-2.5 hover:border-amber-500/30 text-slate-400 hover:text-white cursor-pointer transition"
              >
                Checklist features?
              </button>
            </div>

            {/* Input box form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="border-t border-white/5 p-3 flex gap-2 bg-[#0A0A0A]"
            >
              <input
                type="text"
                placeholder="Ask about digital products..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSending}
                className="flex-1 rounded border border-white/10 bg-[#121212] px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none disabled:opacity-50 placeholder-slate-700"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="h-8 w-8 shrink-0 flex items-center justify-center rounded bg-white text-black disabled:opacity-50 hover:bg-amber-500 cursor-pointer transition"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
