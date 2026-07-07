"use client";

import { useState, useCallback } from "react";
import { Search, MapPin, SlidersHorizontal, Star, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchFilters, SortByOption } from "@/types";

interface GymFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const FACILITY_OPTIONS = [
  "Parking",
  "AC",
  "Swimming Pool",
  "Sauna",
  "CrossFit",
  "Yoga",
  "Group Classes",
  "Locker Rooms",
  "Showers",
  "Juice Bar",
  "Nutritionist",
];

const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: "ai_score",      label: "AI Score" },
  { value: "rating",        label: "Rating" },
  { value: "price_low",     label: "Price: Low to High" },
  { value: "price_high",    label: "Price: High to Low" },
  { value: "distance",      label: "Distance" },
  { value: "most_reviewed", label: "Most Reviewed" },
];

const DEFAULT_FILTERS: SearchFilters = {
  location: "",
  radius: 10,
  maxPrice: 10000,
  facilities: [],
  rating: 0,
  femaleFriendly: false,
  familyFriendly: false,
  hasParking: false,
  sortBy: "ai_score",
};

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
          {format(value)}
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-1.5 opacity-0 cursor-pointer z-10"
          style={{ WebkitAppearance: "none" }}
        />
        {/* Visual thumb */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-lg shadow-violet-500/30 border-2 border-violet-500 pointer-events-none transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function FacilityCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 w-full text-left",
        checked
          ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-200",
          checked
            ? "bg-violet-500 border-violet-500"
            : "bg-transparent border-white/20"
        )}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <span>{label}</span>
    </button>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full py-2 group"
    >
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          checked ? "text-white" : "text-gray-400 group-hover:text-gray-300"
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "relative flex-shrink-0 w-10 h-5.5 rounded-full border transition-all duration-300",
          checked
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent"
            : "bg-white/10 border-white/10"
        )}
        style={{ height: "22px" }}
      >
        <div
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </div>
    </button>
  );
}

export default function GymFilters({ filters, onChange }: GymFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const update = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setLocalFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleFacility = useCallback((facility: string) => {
    setLocalFilters((prev) => {
      const has = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: has
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  }, []);

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    onChange(DEFAULT_FILTERS);
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-white">Filters</h2>
        </div>
        {localFilters.facilities.length > 0 && (
          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 rounded-full">
            {localFilters.facilities.length} active
          </span>
        )}
      </div>

      <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-240px)]">
        {/* Location search */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={localFilters.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City, area, or address"
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-200"
            />
            {localFilters.location && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-violet-400" />
              </div>
            )}
          </div>
        </div>

        {/* Radius slider */}
        <SliderInput
          label="Radius"
          value={localFilters.radius}
          min={1}
          max={50}
          step={1}
          format={(v) => `${v} km`}
          onChange={(v) => update("radius", v)}
        />

        {/* Max price slider */}
        <SliderInput
          label="Max Price / Month"
          value={localFilters.maxPrice}
          min={0}
          max={15000}
          step={500}
          format={(v) => v === 0 ? "Any" : `PKR ${v.toLocaleString()}`}
          onChange={(v) => update("maxPrice", v)}
        />

        {/* Minimum rating */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Minimum Rating
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  update("rating", localFilters.rating === star ? 0 : star)
                }
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-semibold transition-all duration-200",
                  localFilters.rating >= star
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300 hover:border-white/20"
                )}
              >
                <Star
                  className={cn(
                    "w-3 h-3",
                    localFilters.rating >= star ? "fill-amber-400" : ""
                  )}
                />
                {star}
              </button>
            ))}
          </div>
        </div>

        {/* Facility checkboxes */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Facilities
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {FACILITY_OPTIONS.map((facility) => (
              <FacilityCheckbox
                key={facility}
                label={facility}
                checked={localFilters.facilities.includes(facility)}
                onChange={() => toggleFacility(facility)}
              />
            ))}
          </div>
        </div>

        {/* Toggle switches */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Preferences
          </label>
          <div className="space-y-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 divide-y divide-white/5">
            <ToggleSwitch
              label="Female Friendly"
              checked={localFilters.femaleFriendly}
              onChange={(v) => update("femaleFriendly", v)}
            />
            <ToggleSwitch
              label="Family Friendly"
              checked={localFilters.familyFriendly}
              onChange={(v) => update("familyFriendly", v)}
            />
            <ToggleSwitch
              label="Has Parking"
              checked={localFilters.hasParking}
              onChange={(v) => update("hasParking", v)}
            />
          </div>
        </div>

        {/* Sort by */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sort By
          </label>
          <div className="relative">
            <select
              value={localFilters.sortBy}
              onChange={(e) => update("sortBy", e.target.value as SortByOption)}
              className="w-full appearance-none px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-900">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 border-t border-white/10 space-y-2.5">
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/20"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-400 border border-white/10 hover:border-white/20 hover:text-white rounded-xl transition-all duration-200 hover:bg-white/5"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>
    </div>
  );
}
