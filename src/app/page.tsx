"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  Zap,
  Trophy,
  Camera,
  MessageSquare,
  User,
  BarChart2,
  Activity,
  Search,
  ArrowRight,
  Play,
  Star,
  MapPin,
  ChevronRight,
  CheckCircle,
  Brain,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymCard from "@/components/gym/GymCard";
import AIScoreCard from "@/components/gym/AIScoreCard";
import { gyms } from "@/data/gyms";
import { cn } from "@/lib/utils";
import type { Gym } from "@/types";

/* ─── Animated Search Placeholder ─────────────────────────────────────────── */
const SEARCH_PLACEHOLDERS = [
  "Best gym for weight loss...",
  "Cheapest gym near me...",
  "Gym with CrossFit classes...",
  "Female-friendly gym in Karachi...",
  "Gym with swimming pool...",
  "Top-rated gym under PKR 5000...",
];

function AnimatedSearchBar() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-2xl w-full mx-auto">
      {/* Glow ring */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl blur-sm opacity-60" />
      <div className="relative flex items-center bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex-shrink-0 pl-5">
          <Search className="w-5 h-5 text-violet-400" />
        </div>
        <div className="relative flex-1 overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base px-4 py-4 outline-none placeholder-transparent"
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
          />
          {/* Animated placeholder when input is empty */}
          {!query && (
            <div className="absolute inset-0 flex items-center pointer-events-none pl-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500 text-base"
                >
                  {SEARCH_PLACEHOLDERS[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>
        <Link
          href="/discover"
          className="flex-shrink-0 m-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Search
        </Link>
      </div>
    </div>
  );
}

/* ─── Stats Row ─────────────────────────────────────────────────────────────── */
const STATS = [
  { value: "500+", label: "Gyms Listed" },
  { value: "50K+", label: "Active Users" },
  { value: "98%", label: "Match Rate" },
  { value: "4.9★", label: "App Rating" },
];

/* ─── How It Works ──────────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Target,
    title: "Share Your Goals",
    description:
      "Tell us your fitness goals, budget, location, and preferences. It takes less than 60 seconds.",
    color: "from-violet-600 to-purple-600",
    shadowColor: "shadow-violet-500/30",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyses Everything",
    description:
      "Our AI scores 50+ factors across every nearby gym — equipment, cleanliness, trainers, value, and more.",
    color: "from-indigo-600 to-blue-600",
    shadowColor: "shadow-indigo-500/30",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Find Your Perfect Match",
    description:
      "Get personalised recommendations ranked by AI score with full side-by-side comparisons.",
    color: "from-emerald-600 to-teal-600",
    shadowColor: "shadow-emerald-500/30",
  },
];

/* ─── AI Features ───────────────────────────────────────────────────────────── */
const AI_FEATURES = [
  {
    icon: Sparkles,
    title: "AI Scoring Engine",
    description:
      "A composite score out of 100 built from 10 weighted factors using real member data and computer vision.",
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Camera,
    title: "Image Analysis",
    description:
      "Computer vision scans gym interior photos to evaluate equipment density, cleanliness, and space quality.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: MessageSquare,
    title: "Review Sentiment",
    description:
      "NLP-powered analysis of thousands of reviews to extract genuine positive and negative signals.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: User,
    title: "Personalised Picks",
    description:
      "Recommendations filtered by your gender, goals, budget, and schedule — not just proximity.",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: BarChart2,
    title: "Smart Comparison",
    description:
      "Compare up to 5 gyms side by side across every metric to make a fully informed decision.",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Activity,
    title: "Live Occupancy",
    description:
      "Real-time crowding estimates based on historical peak-hours data so you never waste a trip.",
    gradient: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
];

/* ─── Testimonials ──────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Fatima Malik",
    city: "Karachi",
    rating: 5,
    quote:
      "GymLens AI found me the perfect female-friendly gym in DHA in under a minute. The AI score matched exactly what I experienced when I visited. Game-changer!",
    initial: "F",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Ahmed Raza",
    city: "Lahore",
    rating: 5,
    quote:
      "I used to waste hours reading scattered Google reviews. GymLens gives me a single score that actually means something. Found Iron Paradise through it — best decision ever.",
    initial: "A",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Sana Iqbal",
    city: "Islamabad",
    rating: 5,
    quote:
      "The comparison feature saved me from choosing the wrong gym. PureGym Premium's AI score of 89 told me everything I needed to know before my free trial.",
    initial: "S",
    color: "from-emerald-500 to-teal-600",
  },
];

/* ─── City Filter Tabs ──────────────────────────────────────────────────────── */
const CITY_TABS = ["All", "Karachi", "Lahore", "Islamabad"];

/* ─── Section Wrapper with scroll animation ────────────────────────────────── */
function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Mini floating gym card preview ───────────────────────────────────────── */
function MiniGymCard({ gym, delay = 0 }: { gym: Gym; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3.5 w-56 flex-shrink-0 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
    >
      <div className="relative h-28 rounded-xl overflow-hidden bg-gray-900 mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-indigo-600/30" />
        <img
          src={gym.images[0]}
          alt={gym.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        <div className="absolute top-2 right-2 flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg">
          <span className="text-white text-sm font-black leading-none">{gym.aiScore}</span>
        </div>
        {gym.isVerified && (
          <div className="absolute top-2 left-2">
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <p className="text-white text-sm font-bold truncate">{gym.name}</p>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <MapPin className="w-3 h-3 text-violet-400 flex-shrink-0" />
          <span className="truncate">{gym.city}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "w-2.5 h-2.5",
                  gym.rating >= s ? "fill-amber-400 text-amber-400" : "fill-gray-700 text-gray-700"
                )}
              />
            ))}
          </div>
          <span className="text-emerald-400 text-xs font-bold">
            PKR {gym.monthlyFee.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page Component ───────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeCity, setActiveCity] = useState("All");
  const [compareList, setCompareList] = useState<string[]>([]);

  const featuredGyms = gyms.filter((g) => g.isFeatured).slice(0, 3);

  const filteredFeatured =
    activeCity === "All"
      ? featuredGyms
      : gyms
          .filter((g) => g.city === activeCity)
          .sort((a, b) => b.aiScore - a.aiScore)
          .slice(0, 3);

  const handleCompare = (gym: Gym) => {
    setCompareList((prev) =>
      prev.includes(gym.id)
        ? prev.filter((id) => id !== gym.id)
        : [...prev, gym.id].slice(0, 5)
    );
  };

  const heroGyms = gyms.slice(0, 3);

  return (
    <div className="min-h-dvh bg-gray-950 overflow-x-hidden">
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        {/* Animated floating orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -40, 20, 0], y: [0, 30, -30, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute -top-10 -right-20 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, 50, -10, 0], y: [0, -20, 40, 0], scale: [1, 1.05, 0.98, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            className="absolute -bottom-20 -left-10 w-[400px] h-[400px] rounded-full bg-purple-700/15 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -30, 15, 0], y: [0, 25, -35, 0], scale: [1, 1.08, 0.92, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 9 }}
            className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-teal-600/10 blur-[120px]"
          />
          {/* Grid dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(139,92,246,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Gym Discovery — Now Live in Pakistan
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-2"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              Discover Your
              <br />
              Perfect Gym with
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AI-Powered Intelligence
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            GymLens AI scores hundreds of gyms across equipment, cleanliness, trainers and value.
            <br className="hidden sm:block" />
            Get your perfect match in seconds — no guesswork, no wasted memberships.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/discover"
              className="group relative flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-violet-500/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <MapPin className="relative z-10 w-5 h-5" />
              <span className="relative z-10">Find Gyms Near Me</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <button className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-2xl backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="w-full"
          >
            <AnimatedSearchBar />
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex items-center justify-center flex-wrap gap-x-8 gap-y-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating gym card previews */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 mt-14 w-full max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 overflow-hidden">
            {heroGyms.map((gym, i) => (
              <MiniGymCard key={gym.id} gym={gym} delay={0.9 + i * 0.15} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 to-transparent" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <Section className="px-4 py-24 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            Simple 3-Step Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white">How GymLens AI Works</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From goals to your perfect gym in under 60 seconds — powered by artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.667%+1.5rem)] right-[calc(16.667%+1.5rem)] h-px">
            <div className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 opacity-30" />
          </div>

          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <span className="absolute -top-4 left-8 text-xs font-black text-gray-700 tracking-widest">
                  {step.step}
                </span>
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-2xl",
                    step.color,
                    step.shadowColor
                  )}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          3. FEATURED GYMS
      ════════════════════════════════════════════════════════════════ */}
      <Section className="px-4 py-24 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-4xl sm:text-5xl font-black text-white">
                  Top Rated Gyms Near You
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  AI Recommended
                </span>
              </div>
              <p className="text-gray-400 text-base">
                Ranked by our composite AI score — updated weekly.
              </p>
            </div>
            <Link
              href="/discover"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm font-semibold whitespace-nowrap"
            >
              View All Gyms
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* City filter tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {CITY_TABS.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={cn(
                  "flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  activeCity === city
                    ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                )}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Gym cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFeatured.length > 0 ? (
                filteredFeatured.map((gym, i) => (
                  <motion.div
                    key={gym.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link href={`/gym/${gym.id}`} className="block">
                      <GymCard
                        gym={gym}
                        index={i}
                        onCompare={handleCompare}
                        isInCompare={compareList.includes(gym.id)}
                      />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-3 text-center py-16 text-gray-500"
                >
                  <p className="text-lg font-medium">No featured gyms in {activeCity} yet.</p>
                  <Link
                    href="/discover"
                    className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block"
                  >
                    Browse all gyms →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              View All {gyms.length} Gyms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          4. AI FEATURES
      ════════════════════════════════════════════════════════════════ */}
      <Section className="px-4 py-24 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Technology
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Powered by Advanced AI
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Six intelligent systems working together to give you the clearest picture of every gym.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AI_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  "group relative p-6 rounded-2xl border backdrop-blur-xl overflow-hidden",
                  "bg-gradient-to-br",
                  feature.gradient,
                  feature.border,
                  "hover:shadow-2xl transition-all duration-300"
                )}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={cn("w-6 h-6", feature.iconColor)} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-500 blur-xl" />
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          5. AI SCORE DEMO
      ════════════════════════════════════════════════════════════════ */}
      <Section className="px-4 py-24 bg-gradient-to-b from-transparent via-gray-900/40 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium">
              <Activity className="w-3.5 h-3.5" />
              Live Demo
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              See the AI Score in Action
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              A real breakdown from one of our top-rated gyms — every factor, fully transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Gym info panel */}
            <div className="space-y-4">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                    <span className="text-2xl font-black text-white">{gyms[0].aiScore}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{gyms[0].name}</h3>
                      {gyms[0].isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{gyms[0].address}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3.5 h-3.5",
                              gyms[0].rating >= s
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-700 text-gray-700"
                            )}
                          />
                        ))}
                        <span className="text-gray-400 text-xs ml-1">
                          {gyms[0].rating} ({gyms[0].reviewCount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">{gyms[0].aiSummary}</p>

                <div className="flex flex-wrap gap-2">
                  {gyms[0].facilities.slice(0, 6).map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                  {gyms[0].facilities.length > 6 && (
                    <span className="px-2.5 py-1 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full">
                      +{gyms[0].facilities.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500">Monthly from</p>
                    <p className="text-emerald-400 font-bold text-lg">
                      PKR {gyms[0].monthlyFee.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/gym/${gyms[0].id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 hover:scale-105"
                  >
                    View Full Profile
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Score Card */}
            <div>
              <AIScoreCard gym={gyms[0]} />
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          6. TESTIMONIALS
      ════════════════════════════════════════════════════════════════ */}
      <Section className="px-4 py-24 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Trusted by 50,000+ users
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white">What Our Users Say</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real members who found their perfect gym using GymLens AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
            >
              <div className="text-5xl leading-none text-violet-500/20 font-serif select-none">
                &ldquo;
              </div>
              <p className="text-gray-300 text-sm leading-relaxed -mt-4">{t.quote}</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-3.5 h-3.5",
                      t.rating >= s ? "fill-amber-400 text-amber-400" : "fill-gray-700 text-gray-700"
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10 mt-auto">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg",
                    t.color
                  )}
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.city}</p>
                </div>
                <div className="ml-auto">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          7. CTA BANNER
      ════════════════════════════════════════════════════════════════ */}
      <Section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700" />
            <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center gap-6 px-8 py-16 sm:py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl font-black text-white leading-tight"
              >
                Ready to Find Your
                <br />
                Perfect Gym?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/80 text-lg max-w-lg"
              >
                Join 50,000+ users who found their ideal gym with GymLens AI. Free to use, no
                credit card required.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link
                  href="/get-started"
                  className="group flex items-center gap-2.5 px-8 py-4 bg-white text-violet-700 font-bold text-base rounded-2xl hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="/discover"
                  className="flex items-center gap-2.5 px-8 py-4 border-2 border-white/40 text-white font-semibold text-base rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Browse Gyms
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2"
              >
                {["No sign-up required", "100% Free", "Instant results"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-white/60" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
