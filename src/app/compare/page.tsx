"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Check,
  Star,
  MapPin,
  Trophy,
  Zap,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  Dumbbell,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { gyms } from "@/data/gyms";
import { cn, scoreTailwindClass, scoreGradientClass } from "@/lib/utils";
import type { Gym } from "@/types";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmtPKR(n: number) {
  return `PKR ${n.toLocaleString()}`;
}

function aiScoreBg(score: number) {
  if (score >= 90) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (score >= 75) return "bg-violet-500/20 text-violet-400 border-violet-500/30";
  if (score >= 60) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return "bg-amber-500/20 text-amber-400 border-amber-500/30";
}

/* ─── Subcomponents ───────────────────────────────────────────────────────── */
function YesNo({ val }: { val: boolean }) {
  return val ? (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20">
      <Check className="w-4 h-4 text-emerald-400" />
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10">
      <X className="w-4 h-4 text-red-500" />
    </span>
  );
}

function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    pct >= 80
      ? "from-emerald-500 to-teal-500"
      : pct >= 60
      ? "from-violet-500 to-purple-500"
      : pct >= 40
      ? "from-amber-500 to-orange-500"
      : "from-red-500 to-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full bg-gradient-to-r rounded-full", color)}
        />
      </div>
      <span className="text-xs text-gray-400 w-5 text-right">{value}</span>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "w-3.5 h-3.5",
            rating >= s ? "fill-amber-400 text-amber-400" : "fill-gray-700 text-gray-700"
          )}
        />
      ))}
    </div>
  );
}

/* ─── Row Definition ──────────────────────────────────────────────────────── */
type RowKind = "price" | "score" | "bar" | "bool" | "text" | "stars" | "badge";

interface RowDef {
  label: string;
  kind: RowKind;
  key: keyof Gym | string;
  lowestBest?: boolean; // highlight lowest value green
  highestBest?: boolean;
}

const PRICING_ROWS: RowDef[] = [
  { label: "Monthly Fee", kind: "price", key: "monthlyFee", lowestBest: true },
  { label: "Annual Fee", kind: "price", key: "annualFee", lowestBest: true },
  { label: "Registration Fee", kind: "price", key: "registrationFee", lowestBest: true },
  { label: "Trainer Fee / Session", kind: "price", key: "trainerFee", lowestBest: true },
];

const SCORE_ROWS: RowDef[] = [
  { label: "Overall AI Score", kind: "score", key: "aiScore", highestBest: true },
  { label: "Equipment", kind: "bar", key: "equipment", highestBest: true },
  { label: "Cleanliness", kind: "bar", key: "cleanliness", highestBest: true },
  { label: "Trainer Quality", kind: "bar", key: "trainerQuality", highestBest: true },
  { label: "Value for Money", kind: "bar", key: "priceScore", lowestBest: true },
];

const FACILITY_ROWS: RowDef[] = [
  { label: "Parking", kind: "bool", key: "hasParking" },
  { label: "Swimming Pool", kind: "bool", key: "hasSwimming" },
  { label: "Sauna / Steam Room", kind: "bool", key: "hasSauna" },
  { label: "CrossFit Area", kind: "bool", key: "hasCrossfit" },
  { label: "Yoga Studio", kind: "bool", key: "hasYoga" },
  { label: "Group Classes", kind: "bool", key: "_groupClasses" },
  { label: "Locker Rooms", kind: "bool", key: "_lockers" },
  { label: "AC", kind: "bool", key: "_ac" },
  { label: "Juice Bar", kind: "bool", key: "_juiceBar" },
  { label: "Nutritionist", kind: "bool", key: "_nutritionist" },
];

const OTHER_ROWS: RowDef[] = [
  { label: "Distance", kind: "text", key: "distance" },
  { label: "Rating", kind: "stars", key: "rating" },
  { label: "Review Count", kind: "text", key: "reviewCount" },
  { label: "Female Friendly", kind: "badge", key: "femaleFriendly" },
  { label: "Family Friendly", kind: "badge", key: "familyFriendly" },
  { label: "Opening Hours (Mon)", kind: "text", key: "_openMon" },
];

/* ─── Cell Renderer ───────────────────────────────────────────────────────── */
function resolveValue(gym: Gym, key: string): unknown {
  if (key === "_groupClasses") return gym.facilities.includes("Group Classes");
  if (key === "_lockers") return gym.facilities.includes("Locker Rooms");
  if (key === "_ac") return gym.facilities.includes("AC");
  if (key === "_juiceBar") return gym.facilities.includes("Juice Bar");
  if (key === "_nutritionist") return gym.facilities.includes("Nutritionist");
  if (key === "_openMon") return gym.openHours.monday;
  return gym[key as keyof Gym];
}

function getBestIndices(gyms: Gym[], key: string, lowestBest?: boolean, highestBest?: boolean): number[] {
  if (!lowestBest && !highestBest) return [];
  const vals = gyms.map((g) => Number(resolveValue(g, key)));
  const best = lowestBest ? Math.min(...vals) : Math.max(...vals);
  return vals.map((v, i) => (v === best ? i : -1)).filter((i) => i !== -1);
}

function CellValue({
  gym,
  row,
  isBest,
}: {
  gym: Gym;
  row: RowDef;
  isBest: boolean;
}) {
  const val = resolveValue(gym, row.key);

  if (row.kind === "price") {
    return (
      <span
        className={cn(
          "font-semibold text-sm",
          isBest ? "text-emerald-400" : "text-gray-200"
        )}
      >
        {fmtPKR(Number(val))}
        {isBest && (
          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
            Lowest
          </span>
        )}
      </span>
    );
  }
  if (row.kind === "score") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center px-2.5 py-1 rounded-lg border text-sm font-bold",
          aiScoreBg(Number(val))
        )}
      >
        {Number(val)}/100
      </span>
    );
  }
  if (row.kind === "bar") {
    return <ScoreBar value={Number(val)} />;
  }
  if (row.kind === "bool") {
    return <YesNo val={Boolean(val)} />;
  }
  if (row.kind === "stars") {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <StarRow rating={Number(val)} />
        <span className="text-xs text-gray-500">{Number(val).toFixed(1)}</span>
      </div>
    );
  }
  if (row.kind === "badge") {
    return Boolean(val) ? (
      <span className="px-2 py-0.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
        Yes
      </span>
    ) : (
      <span className="px-2 py-0.5 text-xs font-semibold text-gray-500 bg-white/5 border border-white/10 rounded-full">
        No
      </span>
    );
  }
  if (row.key === "reviewCount") {
    return <span className="text-gray-200 text-sm">{Number(val).toLocaleString()}</span>;
  }
  if (row.key === "distance") {
    return <span className="text-gray-200 text-sm">{Number(val).toFixed(1)} km</span>;
  }
  return <span className="text-gray-300 text-sm">{String(val)}</span>;
}

/* ─── Comparison Table Section ────────────────────────────────────────────── */
function TableSection({
  title,
  icon,
  rows,
  selectedGyms,
}: {
  title: string;
  icon: React.ReactNode;
  rows: RowDef[];
  selectedGyms: Gym[];
}) {
  return (
    <div className="mb-1">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</span>
      </div>
      {rows.map((row, ri) => {
        const bestIndices = getBestIndices(selectedGyms, row.key, row.lowestBest, row.highestBest);
        return (
          <div
            key={row.key + ri}
            className={cn(
              "flex border-b border-white/5",
              ri % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
            )}
          >
            {/* Label column */}
            <div className="w-40 lg:w-52 flex-shrink-0 flex items-center px-4 py-3 border-r border-white/10 sticky left-0 bg-gray-950 z-10">
              <span className="text-xs text-gray-400 font-medium leading-snug">{row.label}</span>
            </div>
            {/* Gym value columns */}
            {selectedGyms.map((gym, gi) => (
              <div
                key={gym.id}
                className={cn(
                  "flex-1 min-w-[140px] flex items-center px-4 py-3 border-r border-white/5 last:border-r-0",
                  bestIndices.includes(gi) && "bg-emerald-500/5"
                )}
              >
                <CellValue gym={gym} row={row} isBest={bestIndices.includes(gi)} />
              </div>
            ))}
            {/* Empty filler cols if < 5 gyms */}
            {Array.from({ length: 5 - selectedGyms.length }).map((_, ei) => (
              <div key={`empty-${ei}`} className="flex-1 min-w-[140px] border-r border-white/5 last:border-r-0" />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ─── AI Verdict Section ───────────────────────────────────────────────────── */
function VerdictSection({ gym }: { gym: Gym }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <div
          className={cn(
            "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md",
            scoreGradientClass(gym.aiScore)
          )}
        >
          <span className="text-white text-xs font-black">{gym.aiScore}</span>
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-tight">{gym.name}</p>
          <p className="text-gray-500 text-xs">{gym.city}</p>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5">Pros</p>
        <ul className="space-y-1">
          {gym.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-xs leading-snug">{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-1.5">Cons</p>
        <ul className="space-y-1">
          {gym.weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-xs leading-snug">{w}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-violet-400 mb-1.5">AI Summary</p>
        <p className="text-gray-400 text-xs leading-relaxed">{gym.aiSummary}</p>
      </div>
    </div>
  );
}

/* ─── Selection UI ─────────────────────────────────────────────────────────── */
function SelectionUI({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="min-h-dvh bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Side-by-Side Comparison
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Select Gyms to Compare
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Choose up to 5 gyms to compare side-by-side across pricing, AI scores, facilities, and more.
          </p>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center gap-3"
            >
              <span className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold">
                {selectedIds.length} selected
              </span>
              <Link
                href={`/compare?ids=${selectedIds.join(",")}`}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
              >
                Compare Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {gyms.map((gym, i) => {
            const isSelected = selectedIds.includes(gym.id);
            const isDisabled = !isSelected && selectedIds.length >= 5;
            return (
              <motion.div
                key={gym.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={cn(
                  "relative rounded-2xl overflow-hidden border transition-all duration-300",
                  "backdrop-blur-xl bg-white/5",
                  isSelected
                    ? "border-violet-500/50 shadow-lg shadow-violet-500/20"
                    : isDisabled
                    ? "border-white/5 opacity-50"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                {/* Image */}
                <div className="relative h-36 bg-gray-900">
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", scoreGradientClass(gym.aiScore))} />
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                  {/* AI Score */}
                  <div className="absolute top-2 right-2 flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
                    <span className="text-white text-xs font-black">{gym.aiScore}</span>
                  </div>
                  {/* Selected check */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <p className="text-white font-bold text-sm leading-tight">{gym.name}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <MapPin className="w-3 h-3 text-violet-400" />
                    <span>{gym.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-xs font-semibold">
                      PKR {gym.monthlyFee.toLocaleString()}/mo
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-gray-400 text-xs">{gym.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => !isDisabled && onToggle(gym.id)}
                    disabled={isDisabled}
                    className={cn(
                      "w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
                      isSelected
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                        : isDisabled
                        ? "bg-white/5 text-gray-600 cursor-not-allowed"
                        : "bg-white/5 text-gray-300 border border-white/10 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/20"
                    )}
                  >
                    {isSelected ? (
                      <>
                        <X className="w-3.5 h-3.5" /> Remove
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Compare
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ─── Main Compare View ────────────────────────────────────────────────────── */
function CompareView({ selectedGyms }: { selectedGyms: Gym[] }) {
  const router = useRouter();
  const [showAddMore, setShowAddMore] = useState(false);

  const bestGym = [...selectedGyms].sort((a, b) => b.aiScore - a.aiScore)[0];

  const removeGym = (id: string) => {
    const remaining = selectedGyms.filter((g) => g.id !== id).map((g) => g.id);
    if (remaining.length === 0) {
      router.push("/compare");
    } else {
      router.push(`/compare?ids=${remaining.join(",")}`);
    }
  };

  const addGym = (id: string) => {
    const ids = [...selectedGyms.map((g) => g.id), id];
    router.push(`/compare?ids=${ids.join(",")}`);
    setShowAddMore(false);
  };

  const availableToAdd = gyms.filter((g) => !selectedGyms.find((s) => s.id === g.id));

  return (
    <div className="min-h-dvh bg-gray-950">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 pt-24 pb-20">
        {/* Back link */}
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to selection
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Comparing {selectedGyms.length} Gym{selectedGyms.length > 1 ? "s" : ""}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold">
                <Sparkles className="w-3 h-3" /> AI Recommended: {bestGym.name}
              </span>
            </div>
            <p className="text-gray-500 text-sm">Side-by-side comparison across all key metrics</p>
          </div>
        </motion.div>

        {/* Gym selector row */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {selectedGyms.map((gym) => (
            <motion.div
              key={gym.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-2xl border backdrop-blur-sm",
                gym.id === bestGym.id
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-white/10 bg-white/5"
              )}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-black">{gym.aiScore}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate max-w-[120px]">{gym.name}</p>
                <p className="text-gray-500 text-[10px]">{gym.city}</p>
              </div>
              {gym.id === bestGym.id && (
                <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              )}
              <button
                onClick={() => removeGym(gym.id)}
                className="ml-1 w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-colors group"
              >
                <X className="w-3 h-3 text-gray-500 group-hover:text-red-400" />
              </button>
            </motion.div>
          ))}

          {/* Add more button */}
          {selectedGyms.length < 5 && (
            <div className="relative">
              <button
                onClick={() => setShowAddMore(!showAddMore)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 text-xs font-medium transition-all duration-200"
              >
                <Plus className="w-4 h-4" /> Add Gym
              </button>

              <AnimatePresence>
                {showAddMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {availableToAdd.map((gym) => (
                      <button
                        key={gym.id}
                        onClick={() => addGym(gym.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-black">{gym.aiScore}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-semibold truncate">{gym.name}</p>
                          <p className="text-gray-500 text-[10px]">{gym.city}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl overflow-hidden border border-white/10 overflow-x-auto">
          {/* Column headers */}
          <div className="flex border-b border-white/10 bg-gray-900/80 sticky top-0 z-20">
            <div className="w-40 lg:w-52 flex-shrink-0 flex items-center px-4 py-4 border-r border-white/10 sticky left-0 bg-gray-900/80 backdrop-blur-sm z-30">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</span>
            </div>
            {selectedGyms.map((gym) => (
              <div
                key={gym.id}
                className={cn(
                  "flex-1 min-w-[140px] flex flex-col items-start justify-center px-4 py-4 border-r border-white/5 last:border-r-0",
                  gym.id === bestGym.id && "bg-violet-500/5"
                )}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-white text-xs font-bold truncate">{gym.name}</span>
                  {gym.id === bestGym.id && <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                </div>
                <span className="text-gray-500 text-[10px]">{gym.city}</span>
              </div>
            ))}
            {Array.from({ length: 5 - selectedGyms.length }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[140px] border-r border-white/5 last:border-r-0" />
            ))}
          </div>

          {/* Sections */}
          <TableSection
            title="Pricing"
            icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            rows={PRICING_ROWS}
            selectedGyms={selectedGyms}
          />
          <TableSection
            title="AI Scores"
            icon={<Sparkles className="w-3.5 h-3.5 text-violet-400" />}
            rows={SCORE_ROWS}
            selectedGyms={selectedGyms}
          />
          <TableSection
            title="Facilities"
            icon={<Dumbbell className="w-3.5 h-3.5 text-blue-400" />}
            rows={FACILITY_ROWS}
            selectedGyms={selectedGyms}
          />
          <TableSection
            title="Other Metrics"
            icon={<Star className="w-3.5 h-3.5 text-amber-400" />}
            rows={OTHER_ROWS}
            selectedGyms={selectedGyms}
          />
        </div>

        {/* AI Verdict Row */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Verdicts</h2>
          </div>
          <div
            className={cn(
              "grid gap-4",
              selectedGyms.length === 1
                ? "grid-cols-1"
                : selectedGyms.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : selectedGyms.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : selectedGyms.length === 4
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            )}
          >
            {selectedGyms.map((gym) => (
              <VerdictSection key={gym.id} gym={gym} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <h3 className="text-white font-bold text-lg mb-4">Ready to take the next step?</h3>
          <div className="flex flex-wrap gap-4">
            {selectedGyms.map((gym) => (
              <div key={gym.id} className="flex items-center gap-3">
                <Link
                  href={`/gym/${gym.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
                >
                  Book Free Trial — {gym.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/ai-advisor"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Get personalised AI Recommendation instead
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ─── Inner Component (uses useSearchParams) ───────────────────────────────── */
function ComparePageInner() {
  const searchParams = useSearchParams();
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  const idsParam = searchParams.get("ids");
  const paramIds = idsParam ? idsParam.split(",").filter(Boolean) : [];
  const selectedGyms = paramIds
    .map((id) => gyms.find((g) => g.id === id))
    .filter(Boolean) as Gym[];

  // Selection mode: no valid IDs in query
  if (selectedGyms.length === 0) {
    return (
      <SelectionUI
        selectedIds={localSelected}
        onToggle={(id) =>
          setLocalSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 5)
          )
        }
      />
    );
  }

  return <CompareView selectedGyms={selectedGyms} />;
}

/* ─── Page Export ──────────────────────────────────────────────────────────── */
export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-gray-950 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ComparePageInner />
    </Suspense>
  );
}
