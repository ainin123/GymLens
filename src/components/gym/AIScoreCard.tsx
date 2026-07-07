"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn, scoreColor, scoreGradientClass } from "@/lib/utils";
import type { Gym } from "@/types";

interface AIScoreCardProps {
  gym: Gym;
}

interface ScoreRow {
  label: string;
  value: number;   // 1–10 raw score
  weight: number;  // percentage weight
  display: number; // 0–100 for display bar
}

function buildScoreRows(gym: Gym): ScoreRow[] {
  return [
    { label: "Equipment",   value: gym.equipment,       weight: 15, display: gym.equipment * 10 },
    { label: "Cleanliness", value: gym.cleanliness,     weight: 12, display: gym.cleanliness * 10 },
    { label: "Trainers",    value: gym.trainerQuality,  weight: 12, display: gym.trainerQuality * 10 },
    { label: "Value",       value: 10 - Math.min(gym.priceScore, 10), weight: 12, display: (10 - Math.min(gym.priceScore, 10)) * 10 },
    { label: "Location",    value: Math.max(0, 10 - gym.distance), weight: 10, display: Math.max(0, (10 - gym.distance)) * 10 },
    { label: "Facilities",  value: Math.min(10, gym.facilities.length / 2), weight: 10, display: Math.min(100, gym.facilities.length * 5) },
    { label: "Interior",    value: gym.interiorScore,   weight: 8,  display: gym.interiorScore * 10 },
    { label: "Reviews",     value: gym.rating * 2,      weight: 11, display: gym.rating * 20 },
    { label: "Safety",      value: gym.safetyScore,     weight: 5,  display: gym.safetyScore * 10 },
    { label: "Crowd",       value: 10 - Math.min(gym.crowdedness, 10), weight: 5, display: (10 - Math.min(gym.crowdedness, 10)) * 10 },
  ];
}

function CircularScore({ score, color }: { score: number; color: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
      {/* Background ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 128 128"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>

      {/* Center text */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-4xl font-black text-white leading-none"
        >
          {score}
        </motion.span>
        <span className="text-gray-500 text-xs font-medium mt-0.5">AI Score</span>
      </div>
    </div>
  );
}

function ScoreBar({
  row,
  index,
}: {
  row: ScoreRow;
  index: number;
}) {
  const barColor =
    row.display >= 80
      ? "from-emerald-500 to-teal-500"
      : row.display >= 60
      ? "from-violet-500 to-purple-500"
      : row.display >= 40
      ? "from-amber-500 to-orange-500"
      : "from-red-500 to-rose-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 + 0.2 }}
      className="space-y-1"
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 font-medium">{row.label}</span>
          <span className="text-gray-600 text-[10px]">({row.weight}%)</span>
        </div>
        <span className="text-gray-400 font-semibold tabular-nums">{row.display}%</span>
      </div>
      <div className="relative h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${row.display}%` }}
          transition={{ duration: 0.7, delay: index * 0.04 + 0.3, ease: "easeOut" }}
          className={cn("absolute inset-y-0 left-0 bg-gradient-to-r rounded-full", barColor)}
        />
      </div>
    </motion.div>
  );
}

export default function AIScoreCard({ gym }: AIScoreCardProps) {
  const color = scoreColor(gym.aiScore);
  const gradientClass = scoreGradientClass(gym.aiScore);
  const rows = buildScoreRows(gym);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header gradient strip */}
      <div className={cn("h-1 bg-gradient-to-r", gradientClass)} />

      <div className="p-6 space-y-6">
        {/* Circular score */}
        <div className="text-center space-y-2">
          <CircularScore score={gym.aiScore} color={color} />
          <p className="text-gray-400 text-sm">
            Composite AI-powered score based on 10 weighted factors
          </p>
        </div>

        {/* Score breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Score Breakdown
          </h3>
          <div className="space-y-2.5">
            {rows.map((row, i) => (
              <ScoreBar key={row.label} row={row} index={i} />
            ))}
          </div>
        </div>

        {/* Strengths */}
        {gym.strengths.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Recommended because
            </h3>
            <ul className="space-y-2.5">
              {gym.strengths.map((strength, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 + 0.5 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {gym.weaknesses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Watch out for
            </h3>
            <ul className="space-y-2.5">
              {gym.weaknesses.map((weakness, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 + 0.7 }}
                  className="flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm leading-relaxed">{weakness}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Sentiment bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium uppercase tracking-widest">Sentiment</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-semibold">{gym.sentimentPositive}% positive</span>
              <span className="text-red-400 font-semibold">{gym.sentimentNegative}% negative</span>
            </div>
          </div>
          <div className="relative h-2 bg-white/8 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gym.sentimentPositive}%` }}
              transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-l-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gym.sentimentNegative}%` }}
              transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-r-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
