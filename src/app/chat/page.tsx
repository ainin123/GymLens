"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Send,
  MapPin,
  Star,
  ArrowRight,
  Dumbbell,
  ChevronLeft,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { gyms } from "@/data/gyms";
import { cn, scoreGradientClass } from "@/lib/utils";
import type { Gym } from "@/types";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type MessageRole = "user" | "ai";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  gymCards?: Gym[];
  timestamp: Date;
}

/* ─── Quick Suggestions ───────────────────────────────────────────────────── */
const QUICK_SUGGESTIONS = [
  "Which gym is cheapest?",
  "Best gym for women?",
  "Gym with CrossFit?",
  "Best gym after 9 PM?",
  "Gym with swimming?",
];

/* ─── AI Response Logic ───────────────────────────────────────────────────── */
function getAIResponse(input: string): { text: string; gyms?: Gym[] } {
  const q = input.toLowerCase();

  if (q.includes("cheap") || q.includes("budget") || q.includes("affordable") || q.includes("low") || q.includes("inexpensive")) {
    const sorted = [...gyms].sort((a, b) => a.monthlyFee - b.monthlyFee).slice(0, 3);
    return {
      text: `Great question! Here are the most budget-friendly gyms I found. The cheapest option starts at just PKR ${sorted[0].monthlyFee.toLocaleString()} per month — excellent value for a verified gym!`,
      gyms: sorted,
    };
  }

  if (q.includes("women") || q.includes("female") || q.includes("ladies") || q.includes("girl")) {
    const femaleGyms = gyms.filter((g) => g.femaleFriendly).sort((a, b) => b.femaleScore - a.femaleScore).slice(0, 3);
    return {
      text: `I found ${femaleGyms.length} female-friendly gyms with dedicated spaces and welcoming environments. These gyms have the highest female safety and comfort scores in our database:`,
      gyms: femaleGyms,
    };
  }

  if (q.includes("crossfit") || q.includes("cross fit") || q.includes("wod") || q.includes("hiit")) {
    const cfGyms = gyms.filter((g) => g.hasCrossfit).sort((a, b) => b.aiScore - a.aiScore);
    return {
      text: `I found ${cfGyms.length} gyms with dedicated CrossFit areas and certified coaches. CrossFit is a high-intensity programme, so trainer quality matters — all of these score well:`,
      gyms: cfGyms,
    };
  }

  if (q.includes("swim") || q.includes("pool") || q.includes("water") || q.includes("aqua")) {
    const poolGyms = gyms.filter((g) => g.hasSwimming).sort((a, b) => b.aiScore - a.aiScore);
    return {
      text: `Here are all the gyms with swimming pools. Aquatic facilities are a premium offering — these gyms have verified, well-maintained pool facilities:`,
      gyms: poolGyms,
    };
  }

  if (q.includes("9 pm") || q.includes("9pm") || q.includes("late") || q.includes("night") || q.includes("midnight")) {
    const lateGyms = gyms
      .filter((g) => {
        const mon = g.openHours.monday.toLowerCase();
        return mon.includes("24") || mon.includes("11") || mon.includes("12") || mon.includes("midnight");
      })
      .sort((a, b) => b.aiScore - a.aiScore);
    return {
      text: `For night-owl gym-goers, here are the gyms that stay open late or offer 24-hour access during the week. Perfect for those with busy daytime schedules:`,
      gyms: lateGyms.length > 0 ? lateGyms : gyms.sort((a, b) => b.aiScore - a.aiScore).slice(0, 2),
    };
  }

  if (q.includes("yoga") || q.includes("stretch") || q.includes("pilates") || q.includes("wellness") || q.includes("mindful")) {
    const yogaGyms = gyms.filter((g) => g.hasYoga).sort((a, b) => b.aiScore - a.aiScore);
    return {
      text: `Great choice! Yoga and mindfulness training have incredible benefits for both body and mind. Here are the top gyms with dedicated yoga studios and certified instructors:`,
      gyms: yogaGyms.slice(0, 3),
    };
  }

  if (q.includes("karachi")) {
    const kGyms = gyms.filter((g) => g.city === "Karachi").sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
    return { text: "Here are the top AI-rated gyms in Karachi, ranked by our composite score:", gyms: kGyms };
  }

  if (q.includes("lahore")) {
    const lGyms = gyms.filter((g) => g.city === "Lahore").sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
    return { text: "Here are the top AI-rated gyms in Lahore:", gyms: lGyms };
  }

  if (q.includes("islamabad")) {
    const iGyms = gyms.filter((g) => g.city === "Islamabad").sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
    return { text: "Here are the top AI-rated gyms in Islamabad:", gyms: iGyms };
  }

  if (q.includes("best") || q.includes("top") || q.includes("highest") || q.includes("recommend")) {
    const topGyms = [...gyms].sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
    return {
      text: `Based on our composite AI analysis across 50+ factors, here are the highest-rated gyms in our database right now:`,
      gyms: topGyms,
    };
  }

  if (q.includes("sauna") || q.includes("steam")) {
    const saunaGyms = gyms.filter((g) => g.hasSauna).sort((a, b) => b.aiScore - a.aiScore);
    return {
      text: `Here are the gyms that offer sauna and steam room facilities. These are great for post-workout recovery:`,
      gyms: saunaGyms.slice(0, 3),
    };
  }

  if (q.includes("family") || q.includes("kids") || q.includes("children")) {
    const familyGyms = gyms.filter((g) => g.familyFriendly).sort((a, b) => b.familyScore - a.familyScore);
    return {
      text: `Looking for a gym the whole family can enjoy? Here are the top family-friendly gyms with dedicated spaces for all ages:`,
      gyms: familyGyms,
    };
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return {
      text: `Hello! I'm your GymLens AI Assistant. I can help you find the perfect gym based on your needs. You can ask me things like:\n\n• "Which gym is cheapest?"\n• "Best gym for women?"\n• "Gyms with CrossFit in Lahore"\n• "Gym with swimming pool"\n• "Best gym for weight loss"\n\nWhat are you looking for?`,
    };
  }

  return {
    text: `I understand you're looking for gym recommendations! I can help you find the best gym based on specific criteria. Try asking me:\n\n• **Price:** "Cheapest gym" or "Gym under PKR 5000"\n• **Facilities:** "Gym with pool" or "CrossFit gym"\n• **Gender:** "Female-friendly gym"\n• **Location:** "Best gym in Karachi"\n• **Hours:** "Gym open late at night"\n\nWhat matters most to you in a gym?`,
  };
}

/* ─── Gym Result Card ─────────────────────────────────────────────────────── */
function GymResultCard({ gym, index }: { gym: Gym; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-white/8 transition-all duration-200 group"
    >
      {/* AI Score Badge */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md",
          scoreGradientClass(gym.aiScore)
        )}
      >
        <span className="text-white text-xs font-black">{gym.aiScore}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-bold truncate">{gym.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-violet-400" />
            <span className="text-gray-500 text-[10px]">{gym.city}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-gray-500 text-[10px]">{gym.rating}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-emerald-400 text-xs font-bold">
          PKR {gym.monthlyFee.toLocaleString()}
        </span>
        <span className="text-gray-600 text-[10px]">/mo</span>
      </div>

      {/* Action */}
      <Link
        href={`/gym/${gym.id}`}
        className="flex-shrink-0 p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

/* ─── Typing Indicator ────────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
        <Zap className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-violet-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Message Bubble ──────────────────────────────────────────────────────── */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30 self-end">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 self-end border border-white/10">
          <span className="text-white text-[10px] font-bold">U</span>
        </div>
      )}

      {/* Bubble */}
      <div className={cn("max-w-[75%] space-y-2", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-violet-500/20"
              : "backdrop-blur-xl bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
          )}
        >
          {message.content.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <span key={i} className="block font-bold text-white mb-0.5">
                  {line.slice(2, -2)}
                </span>
              );
            }
            if (line.startsWith("• ")) {
              return (
                <span key={i} className="block text-gray-300 text-xs">
                  {line}
                </span>
              );
            }
            if (line === "") return <span key={i} className="block h-1" />;
            return <span key={i} className="block">{line}</span>;
          })}
        </div>

        {/* Gym cards */}
        {message.gymCards && message.gymCards.length > 0 && (
          <div className="space-y-2 w-full max-w-sm">
            {message.gymCards.map((gym, i) => (
              <GymResultCard key={gym.id} gym={gym} index={i} />
            ))}
            <Link
              href="/discover"
              className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
            >
              View all gyms
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Timestamp */}
        <p className={cn("text-[10px] text-gray-600 px-1", isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Pre-loaded Messages ─────────────────────────────────────────────────── */
function createInitialMessages(): Message[] {
  const now = new Date();
  const t = (offsetMs: number) => new Date(now.getTime() - offsetMs);

  return [
    {
      id: "msg-0",
      role: "ai",
      content:
        "Hello! I'm GymLens AI Assistant — your personal gym advisor powered by artificial intelligence.\n\nI've analysed 8 gyms across Karachi, Lahore, and Islamabad across 50+ factors including equipment quality, cleanliness, trainer expertise, and value for money.\n\nAsk me anything about finding your perfect gym!",
      timestamp: t(5 * 60 * 1000),
    },
    {
      id: "msg-1",
      role: "user",
      content: "What's the top rated gym overall?",
      timestamp: t(4 * 60 * 1000),
    },
    {
      id: "msg-2",
      role: "ai",
      content:
        "Based on our composite AI analysis, Olympus Fitness Elite in Karachi leads with an exceptional score of 96/100. It scores near-perfect on cleanliness (10/10), equipment quality (9/10), and trainer credentials. The only drawbacks are its premium price point and occasional waitlists.",
      gymCards: [gyms[0]],
      timestamp: t(3 * 60 * 1000 + 30 * 1000),
    },
  ];
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(createInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const userText = text.trim();
    if (!userText) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking delay based on response complexity
    const delay = 800 + Math.random() * 1000;
    await new Promise((r) => setTimeout(r, delay));

    const response = getAIResponse(userText);
    const aiMsg: Message = {
      id: `msg-${Date.now()}-ai`,
      role: "ai",
      content: response.text,
      gymCards: response.gyms,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (s: string) => {
    sendMessage(s);
    inputRef.current?.focus();
  };

  return (
    <div className="h-dvh bg-gray-950 flex flex-col overflow-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gray-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-gray-950" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-none">GymLens AI Assistant</h1>
              <p className="text-emerald-400 text-[10px] font-medium mt-0.5">Online · 8 gyms analysed</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/discover"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Browse Gyms
          </Link>
          <Link
            href="/ai-advisor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:from-violet-600/30 hover:to-indigo-600/30 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            AI Advisor
          </Link>
        </div>
      </header>

      {/* Messages area */}
      <div className="relative flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 scroll-smooth">
        {/* Welcome chips (only when fresh) */}
        {messages.length <= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 pt-2 pb-1"
          >
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs font-medium hover:bg-violet-500/20 hover:border-violet-500/30 transition-all duration-200 hover:scale-105"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative z-10 flex-shrink-0 px-4 sm:px-6 py-3 bg-gray-950/95 backdrop-blur-xl border-t border-white/10">
        {/* Suggestion chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="flex-shrink-0 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 text-xs font-medium transition-all duration-200"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about gyms in Pakistan…"
              className="relative w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none focus:border-violet-500/50 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 flex-shrink-0",
              input.trim() && !isTyping
                ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
                : "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
            )}
          >
            {isTyping ? (
              <div className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-gray-400 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <p className="text-center text-gray-700 text-[10px] mt-2">
          GymLens AI · Powered by gym data across Pakistan · Not real-time
        </p>
      </div>
    </div>
  );
}
