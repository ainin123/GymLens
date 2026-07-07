"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Dumbbell,
  TrendingUp,
  Zap,
  Heart,
  Waves,
  Award,
  Activity,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  RefreshCw,
  Trophy,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { gyms } from "@/data/gyms";
import { cn, scoreGradientClass } from "@/lib/utils";
import type { Gym } from "@/types";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface WizardState {
  budget: number;
  goals: string[];
  gender: "male" | "female" | "";
  distance: number;
  timings: string[];
  facilities: string[];
  needsTrainer: boolean | null;
  trainerGender: "male" | "female" | "any";
  experience: "beginner" | "intermediate" | "advanced" | "";
}

interface MatchResult {
  gym: Gym;
  matchScore: number;
  reasons: string[];
}

const TOTAL_STEPS = 5;

const INITIAL_STATE: WizardState = {
  budget: 6000,
  goals: [],
  gender: "",
  distance: 10,
  timings: [],
  facilities: [],
  needsTrainer: null,
  trainerGender: "any",
  experience: "",
};

/* ─── Step 1: Budget ──────────────────────────────────────────────────────── */
function Step1Budget({
  state,
  onChange,
}: {
  state: WizardState;
  onChange: (s: Partial<WizardState>) => void;
}) {
  const budgetTiers = [
    { label: "Under 3K", value: 3000 },
    { label: "3K – 6K", value: 6000 },
    { label: "6K – 10K", value: 10000 },
    { label: "10K+", value: 15000 },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          What&apos;s your monthly budget?
        </h2>
        <p className="text-gray-400">We&apos;ll only show gyms within your price range.</p>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">PKR 500</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              PKR {state.budget.toLocaleString()}
            </span>
            <span className="text-gray-500 text-xs">per month</span>
          </div>
          <span className="text-gray-500 text-sm">PKR 15,000</span>
        </div>
        <input
          type="range"
          min={500}
          max={15000}
          step={500}
          value={state.budget}
          onChange={(e) => onChange({ budget: Number(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #14b8a6 ${((state.budget - 500) / (15000 - 500)) * 100}%, rgba(255,255,255,0.1) ${((state.budget - 500) / (15000 - 500)) * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
      </div>

      {/* Quick select */}
      <div>
        <p className="text-gray-400 text-sm mb-3 text-center">Quick select</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {budgetTiers.map((tier) => (
            <button
              key={tier.label}
              onClick={() => onChange({ budget: tier.value })}
              className={cn(
                "py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 hover:scale-105",
                state.budget === tier.value
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              )}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Goals ───────────────────────────────────────────────────────── */
const GOALS = [
  { id: "weight_loss", label: "Weight Loss", icon: Flame, color: "from-orange-500 to-red-500", shadow: "shadow-orange-500/30" },
  { id: "muscle_building", label: "Muscle Building", icon: Dumbbell, color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/30" },
  { id: "strength", label: "Strength Training", icon: TrendingUp, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/30" },
  { id: "crossfit", label: "CrossFit", icon: Zap, color: "from-yellow-500 to-amber-500", shadow: "shadow-yellow-500/30" },
  { id: "yoga", label: "Yoga & Wellness", icon: Heart, color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/30" },
  { id: "swimming", label: "Swimming", icon: Waves, color: "from-teal-500 to-cyan-500", shadow: "shadow-teal-500/30" },
  { id: "bodybuilding", label: "Bodybuilding", icon: Award, color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/30" },
  { id: "general", label: "General Fitness", icon: Activity, color: "from-emerald-500 to-green-500", shadow: "shadow-emerald-500/30" },
];

function Step2Goals({
  state,
  onChange,
}: {
  state: WizardState;
  onChange: (s: Partial<WizardState>) => void;
}) {
  const toggle = (id: string) => {
    onChange({
      goals: state.goals.includes(id)
        ? state.goals.filter((g) => g !== id)
        : [...state.goals, id],
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">What are your fitness goals?</h2>
        <p className="text-gray-400">Select all that apply — we&apos;ll match gyms with the right facilities.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GOALS.map((goal) => {
          const Icon = goal.icon;
          const selected = state.goals.includes(goal.id);
          return (
            <motion.button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200",
                selected
                  ? "border-transparent bg-white/10 shadow-lg"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  goal.color,
                  selected ? goal.shadow : ""
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold text-center leading-tight",
                  selected ? "text-white" : "text-gray-400"
                )}
              >
                {goal.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 3: Preferences ─────────────────────────────────────────────────── */
const TIMINGS = [
  { id: "morning", label: "Morning", sub: "6 – 10 AM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", sub: "10 AM – 5 PM", icon: "☀️" },
  { id: "evening", label: "Evening", sub: "5 – 9 PM", icon: "🌆" },
  { id: "night", label: "Night", sub: "9 PM+", icon: "🌙" },
];

const FAC_OPTIONS = [
  "Parking", "AC", "Locker Rooms", "Showers", "Swimming Pool", "Sauna",
];

function Step3Preferences({
  state,
  onChange,
}: {
  state: WizardState;
  onChange: (s: Partial<WizardState>) => void;
}) {
  const toggleTiming = (id: string) => {
    onChange({
      timings: state.timings.includes(id)
        ? state.timings.filter((t) => t !== id)
        : [...state.timings, id],
    });
  };
  const toggleFac = (f: string) => {
    onChange({
      facilities: state.facilities.includes(f)
        ? state.facilities.filter((x) => x !== f)
        : [...state.facilities, f],
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Tell us your preferences</h2>
        <p className="text-gray-400">Help us narrow down the perfect match for you.</p>
      </div>

      {/* Gender */}
      <div>
        <p className="text-gray-300 text-sm font-semibold mb-3">Your gender</p>
        <div className="grid grid-cols-2 gap-3">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => onChange({ gender: g })}
              className={cn(
                "py-3 px-5 rounded-xl border text-sm font-semibold capitalize transition-all duration-200 hover:scale-105",
                state.gender === g
                  ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              )}
            >
              {g === "male" ? "👨 Male" : "👩 Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-300 text-sm font-semibold">Distance willing to travel</p>
          <span className="text-violet-400 font-bold text-sm">{state.distance} km</span>
        </div>
        <input
          type="range"
          min={1}
          max={25}
          step={1}
          value={state.distance}
          onChange={(e) => onChange({ distance: Number(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #6366f1 ${((state.distance - 1) / 24) * 100}%, rgba(255,255,255,0.1) ${((state.distance - 1) / 24) * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-gray-600 text-xs">1 km</span>
          <span className="text-gray-600 text-xs">25 km</span>
        </div>
      </div>

      {/* Timings */}
      <div>
        <p className="text-gray-300 text-sm font-semibold mb-3">Preferred workout timings</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIMINGS.map((t) => {
            const selected = state.timings.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTiming(t.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl border text-center transition-all duration-200 hover:scale-105",
                  selected
                    ? "bg-gradient-to-b from-violet-500/20 to-indigo-500/20 border-violet-500/40 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                )}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs font-semibold">{t.label}</span>
                <span className="text-[10px] text-gray-500">{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Required Facilities */}
      <div>
        <p className="text-gray-300 text-sm font-semibold mb-3">Required facilities</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FAC_OPTIONS.map((f) => {
            const selected = state.facilities.includes(f);
            return (
              <label
                key={f}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-200",
                  selected
                    ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded flex items-center justify-center border flex-shrink-0",
                    selected ? "bg-violet-600 border-violet-600" : "border-white/20 bg-white/5"
                  )}
                >
                  {selected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium">{f}</span>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleFac(f)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Trainer Preferences ─────────────────────────────────────────── */
const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just starting out", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "6+ months experience", emoji: "💪" },
  { id: "advanced", label: "Advanced", desc: "2+ years, serious athlete", emoji: "🏆" },
];

function Step4Trainer({
  state,
  onChange,
}: {
  state: WizardState;
  onChange: (s: Partial<WizardState>) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Trainer preferences</h2>
        <p className="text-gray-400">Tell us about your training experience and needs.</p>
      </div>

      {/* Need trainer? */}
      <div>
        <p className="text-gray-300 text-sm font-semibold mb-3">Do you need a personal trainer?</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: true, label: "Yes, I need a trainer", emoji: "👨‍🏫" },
            { val: false, label: "No, I train solo", emoji: "🎧" },
          ].map((opt) => (
            <button
              key={String(opt.val)}
              onClick={() => onChange({ needsTrainer: opt.val })}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:scale-105",
                state.needsTrainer === opt.val
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              )}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-sm font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trainer gender (only if needsTrainer) */}
      <AnimatePresence>
        {state.needsTrainer === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-3">Trainer gender preference</p>
              <div className="grid grid-cols-3 gap-3">
                {(["male", "female", "any"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => onChange({ trainerGender: g })}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition-all duration-200 hover:scale-105",
                      state.trainerGender === g
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                    )}
                  >
                    {g === "male" ? "👨 Male" : g === "female" ? "👩 Female" : "🤝 Any"}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Level */}
      <div>
        <p className="text-gray-300 text-sm font-semibold mb-3">Your experience level</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onChange({ experience: level.id as WizardState["experience"] })}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all duration-200 hover:scale-105",
                state.experience === level.id
                  ? "bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-500/40 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              )}
            >
              <span className="text-3xl">{level.emoji}</span>
              <span className="text-sm font-bold">{level.label}</span>
              <span className="text-xs text-gray-500 text-center">{level.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Match Logic ─────────────────────────────────────────────────────────── */
function computeMatches(state: WizardState): MatchResult[] {
  return gyms
    .map((gym) => {
      let score = 0;
      const reasons: string[] = [];

      // Budget
      if (gym.monthlyFee <= state.budget) {
        score += 25;
        const diff = state.budget - gym.monthlyFee;
        if (diff >= 2000) {
          reasons.push(`Well within your PKR ${state.budget.toLocaleString()} budget`);
        } else {
          reasons.push(`Fits your PKR ${state.budget.toLocaleString()} monthly budget`);
        }
      } else {
        score -= 20;
      }

      // Goals → facilities
      if (state.goals.includes("crossfit") && gym.hasCrossfit) { score += 15; reasons.push("Has a dedicated CrossFit area"); }
      if (state.goals.includes("yoga") && gym.hasYoga) { score += 10; reasons.push("Offers yoga studio & classes"); }
      if (state.goals.includes("swimming") && gym.hasSwimming) { score += 15; reasons.push("Has a swimming pool"); }
      if (state.goals.includes("weight_loss") && gym.trainerQuality >= 8) { score += 10; reasons.push("Expert trainers for weight loss programmes"); }
      if (state.goals.includes("muscle_building") && gym.equipment >= 8) { score += 10; reasons.push("Top-tier equipment for muscle building"); }
      if (state.goals.includes("bodybuilding") && gym.equipment >= 8) { score += 8; reasons.push("Extensive free-weights & machines"); }
      if (state.goals.includes("general") && gym.facilities.length >= 10) { score += 8; reasons.push("Comprehensive facilities for general fitness"); }

      // Gender
      if (state.gender === "female" && gym.femaleFriendly) { score += 15; reasons.push("Female-friendly with dedicated spaces"); }
      if (state.gender === "female" && !gym.femaleFriendly) { score -= 15; }

      // Distance
      if (gym.distance <= state.distance) {
        score += 10;
        reasons.push(`Only ${gym.distance.toFixed(1)} km away — within your ${state.distance} km limit`);
      } else {
        score -= 10;
      }

      // Required facilities
      state.facilities.forEach((f) => {
        if (gym.facilities.includes(f)) score += 5;
        else score -= 5;
      });
      if (state.facilities.some((f) => gym.facilities.includes(f))) {
        const matching = state.facilities.filter((f) => gym.facilities.includes(f));
        if (matching.length > 0) reasons.push(`Has required facilities: ${matching.join(", ")}`);
      }

      // AI Score bonus
      if (gym.aiScore >= 90) { score += 10; reasons.push(`Exceptional AI Score of ${gym.aiScore}/100`); }
      else if (gym.aiScore >= 80) { score += 5; reasons.push(`Strong AI Score of ${gym.aiScore}/100`); }

      // Trainer
      if (state.needsTrainer === true && gym.trainers.length >= 3) { score += 5; reasons.push(`${gym.trainers.length} certified trainers on staff`); }

      // Experience
      if (state.experience === "beginner" && gym.cleanliness >= 8) { score += 5; reasons.push("Welcoming environment for beginners"); }
      if (state.experience === "advanced" && gym.equipment >= 9) { score += 8; reasons.push("Advanced equipment for serious athletes"); }

      const matchScore = Math.min(Math.max(Math.round((score / 120) * 100), 10), 99);
      return { gym, matchScore, reasons: reasons.slice(0, 4) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

/* ─── Step 5: Results ─────────────────────────────────────────────────────── */
function Step5Results({
  state,
  onRetake,
}: {
  state: WizardState;
  onRetake: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(computeMatches(state));
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [state]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/30" />
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg mb-1">AI is analysing gyms…</p>
          <p className="text-gray-500 text-sm">Matching across {(gyms.length * 50).toLocaleString()} data points</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-violet-500"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Your AI-Matched Gyms</h2>
        <p className="text-gray-400">Based on your preferences, here are the best gyms for you.</p>
      </div>

      <div className="space-y-4">
        {results.map((result, i) => (
          <motion.div
            key={result.gym.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={cn(
              "relative rounded-2xl border overflow-hidden backdrop-blur-xl",
              i === 0
                ? "border-violet-500/40 bg-violet-500/5 shadow-lg shadow-violet-500/10"
                : "border-white/10 bg-white/5"
            )}
          >
            {i === 0 && (
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            )}

            <div className="flex items-start gap-4 p-4 sm:p-5">
              {/* Rank & Match Score */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black",
                    i === 0
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/10 text-gray-400"
                  )}
                >
                  #{i + 1}
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "text-lg font-black",
                      result.matchScore >= 80
                        ? "text-emerald-400"
                        : result.matchScore >= 60
                        ? "text-violet-400"
                        : "text-amber-400"
                    )}
                  >
                    {result.matchScore}%
                  </span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">match</span>
                </div>
              </div>

              {/* Gym Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">{result.gym.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-violet-400" />
                      <span className="text-gray-400 text-xs">{result.gym.city} · {result.gym.distance.toFixed(1)} km</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br flex-shrink-0 shadow-md",
                      scoreGradientClass(result.gym.aiScore)
                    )}
                  >
                    <span className="text-white text-xs font-black">{result.gym.aiScore}</span>
                  </div>
                </div>

                {/* Why it matches */}
                <div className="mt-2 space-y-1">
                  {result.reasons.map((r, ri) => (
                    <div key={ri} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs leading-snug">{r}</span>
                    </div>
                  ))}
                </div>

                {/* Price + Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-emerald-400 font-bold text-sm">
                      PKR {result.gym.monthlyFee.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-xs">/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/gym/${result.gym.id}`}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105 flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/gym/${result.gym.id}`}
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 text-xs font-semibold hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                      Book Trial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function AIAdvisorPage() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [direction, setDirection] = useState<1 | -1>(1);

  const update = (partial: Partial<WizardState>) => setState((s) => ({ ...s, ...partial }));

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const retake = () => {
    setState(INITIAL_STATE);
    setStep(1);
  };

  const canProceed = () => {
    if (step === 2 && state.goals.length === 0) return false;
    return true;
  };

  const stepLabels = ["Budget", "Goals", "Preferences", "Trainer", "Results"];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="min-h-dvh bg-gray-950">
      <Navbar />

      {/* Background orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-28 pb-20">
        {/* Progress header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-violet-400 font-semibold">
              {stepLabels[step - 1]}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-full"
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i + 1 < step
                      ? "bg-violet-500"
                      : i + 1 === step
                      ? "bg-white w-3 h-3 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                      : "bg-white/20"
                  )}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step content card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/20 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              {step === 1 && <Step1Budget state={state} onChange={update} />}
              {step === 2 && <Step2Goals state={state} onChange={update} />}
              {step === 3 && <Step3Preferences state={state} onChange={update} />}
              {step === 4 && <Step4Trainer state={state} onChange={update} />}
              {step === 5 && <Step5Results state={state} onRetake={retake} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {step < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mt-6"
          >
            <button
              onClick={goBack}
              disabled={step === 1}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                step === 1
                  ? "border-white/5 text-gray-700 cursor-not-allowed"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 hover:scale-105"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                canProceed()
                  ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:scale-105 shadow-lg shadow-violet-500/20"
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
              )}
            >
              {step === 4 ? "Get My Matches" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
