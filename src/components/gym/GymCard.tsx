"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Star, CheckCircle, Plus, Minus, ArrowRight } from "lucide-react";
import { cn, formatDistance, scoreGradientClass, scoreTailwindClass } from "@/lib/utils";
import type { Gym } from "@/types";

interface GymCardProps {
  gym: Gym;
  onCompare?: (gym: Gym) => void;
  isInCompare?: boolean;
  index?: number;
}

function AIScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 90
      ? "from-emerald-500 to-teal-500 shadow-emerald-500/30"
      : score >= 75
      ? "from-yellow-500 to-amber-500 shadow-yellow-500/30"
      : "from-orange-500 to-red-500 shadow-orange-500/30";

  return (
    <div className={cn("flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br shadow-lg", colorClass)}>
      <span className="text-white text-base font-black leading-none">{score}</span>
      <span className="text-white/80 text-[9px] font-semibold leading-none mt-0.5">/100</span>
    </div>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating >= i + 0.5;
          return (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                filled || half ? "fill-amber-400 text-amber-400" : "fill-gray-700 text-gray-700"
              )}
            />
          );
        })}
      </div>
      <span className="text-gray-400 text-xs">
        {rating.toFixed(1)} ({count.toLocaleString()})
      </span>
    </div>
  );
}

export default function GymCard({ gym, onCompare, isInCompare = false, index = 0 }: GymCardProps) {
  const visibleFacilities = gym.facilities.slice(0, 4);
  const extraCount = gym.facilities.length - 4;

  const gradientClass = scoreGradientClass(gym.aiScore);
  const scoreTextClass = scoreTailwindClass(gym.aiScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "backdrop-blur-xl bg-white/5 border border-white/10",
        "hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10",
        "transition-all duration-300"
      )}
    >
      {/* Image area */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-900">
        {/* Gradient placeholder when no image loads */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientClass, "opacity-30")} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />

        {/* Image */}
        <img
          src={gym.images[0]}
          alt={gym.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {gym.isNew && (
            <span className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30">
              NEW
            </span>
          )}
          {gym.isFeatured && (
            <span className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-full shadow-lg shadow-violet-500/30">
              FEATURED
            </span>
          )}
        </div>

        {/* Top-right: AI Score */}
        <div className="absolute top-3 right-3">
          <AIScoreBadge score={gym.aiScore} />
        </div>

        {/* Bottom-left: name & verified */}
        <div className="absolute bottom-3 left-3 right-16 flex items-end gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-white font-bold text-base leading-tight truncate">
                {gym.name}
              </h3>
              {gym.isVerified && (
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Location + Distance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs min-w-0">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-violet-400" />
            <span className="truncate">{gym.address}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs flex-shrink-0 ml-2">
            <Navigation className="w-3 h-3 text-indigo-400" />
            <span>{formatDistance(gym.distance)}</span>
          </div>
        </div>

        {/* Star rating */}
        <StarRating rating={gym.rating} count={gym.reviewCount} />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-emerald-400 font-bold text-base">
              PKR {gym.monthlyFee.toLocaleString()}
            </span>
            <span className="text-gray-500 text-xs">/mo</span>
          </div>
          <span className="text-gray-500 text-xs">From</span>
        </div>

        {/* Facility tags */}
        <div className="flex items-center flex-wrap gap-1.5">
          {visibleFacilities.map((facility) => (
            <span
              key={facility}
              className="px-2 py-0.5 text-[11px] font-medium text-gray-400 bg-white/5 border border-white/10 rounded-full"
            >
              {facility}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full">
              +{extraCount} more
            </span>
          )}
        </div>

        {/* AI Score bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">AI Score</span>
            <span className={cn("text-[11px] font-bold", scoreTextClass)}>{gym.aiScore}/100</span>
          </div>
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gym.aiScore}%` }}
              transition={{ duration: 0.8, delay: index * 0.06 + 0.3, ease: "easeOut" }}
              className={cn("absolute inset-y-0 left-0 bg-gradient-to-r rounded-full", gradientClass)}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onCompare?.(gym)}
            className={cn(
              "flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              isInCompare
                ? "text-violet-300 bg-violet-500/20 border-violet-500/40 hover:bg-violet-500/30"
                : "text-gray-400 bg-transparent border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5"
            )}
            title={isInCompare ? "Remove from compare" : "Add to compare"}
          >
            {isInCompare ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Compare
          </button>
        </div>
      </div>
    </motion.div>
  );
}
