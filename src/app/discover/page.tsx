"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List,
  Map,
  SlidersHorizontal,
  X,
  ArrowRight,
  ChevronDown,
  GitCompare,
  AlertCircle,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymCard from "@/components/gym/GymCard";
import GymFilters from "@/components/gym/GymFilters";
import { gyms } from "@/data/gyms";
import { cn } from "@/lib/utils";
import type { Gym, SearchFilters, SortByOption } from "@/types";

/* ─── Default filter state ──────────────────────────────────────────────────── */
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

/* ─── Sort options ──────────────────────────────────────────────────────────── */
const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: "ai_score", label: "AI Score" },
  { value: "rating", label: "Rating" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "distance", label: "Distance" },
  { value: "most_reviewed", label: "Most Reviewed" },
];

/* ─── Toast notification ─────────────────────────────────────────────────────── */
interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const colors = {
    success: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    info: "bg-violet-500/20 border-violet-500/40 text-violet-300",
    warning: "bg-amber-500/20 border-amber-500/40 text-amber-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl text-sm font-medium shadow-2xl",
        colors[toast.type]
      )}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-auto flex-shrink-0 opacity-70 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/* ─── Map placeholder ───────────────────────────────────────────────────────── */
function MapViewPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-full rounded-2xl overflow-hidden border border-white/10"
      style={{ height: "600px" }}
    >
      {/* Dark map background with grid */}
      <div className="absolute inset-0 bg-gray-900">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Dot markers */}
        {[
          { top: "25%", left: "30%", name: "Olympus Fitness", score: 96 },
          { top: "40%", left: "55%", name: "The Fitness Lab", score: 83 },
          { top: "60%", left: "40%", name: "Flex Zone", score: 78 },
          { top: "35%", left: "70%", name: "PureGym Premium", score: 89 },
          { top: "70%", left: "25%", name: "Iron Paradise", score: 91 },
          { top: "50%", left: "62%", name: "Zenith Athletic", score: 87 },
        ].map((pin, i) => (
          <motion.div
            key={pin.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 300 }}
            className="absolute"
            style={{ top: pin.top, left: pin.left }}
          >
            <div className="relative group cursor-pointer">
              {/* Pin */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 border-2 border-white/30 flex items-center justify-center shadow-lg shadow-violet-500/40 group-hover:scale-125 transition-transform duration-200">
                  <span className="text-white text-xs font-black">{pin.score}</span>
                </div>
                <div className="w-0.5 h-3 bg-violet-500/50" />
                <div className="w-2 h-2 rounded-full bg-violet-500/50" />
              </div>
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div className="bg-gray-900 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-xl">
                  {pin.name}
                </div>
              </div>
              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="absolute inset-0 rounded-full bg-violet-500/30"
              />
            </div>
          </motion.div>
        ))}

        {/* Subtle city label */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 text-7xl font-black select-none pointer-events-none">
          KARACHI
        </div>
      </div>

      {/* Overlay card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-gray-950/80 border border-white/10 rounded-2xl p-8 text-center max-w-sm mx-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
            <Map className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Interactive Map View</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Google Maps API integration coming soon. Pins above are a live preview of how gyms will
            appear on the interactive map.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Google Maps API Integration
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Sticky compare bar ────────────────────────────────────────────────────── */
function CompareBar({
  selectedIds,
  onClear,
  onRemove,
}: {
  selectedIds: string[];
  onClear: () => void;
  onRemove: (id: string) => void;
}) {
  if (selectedIds.length === 0) return null;

  const selectedGyms = selectedIds
    .map((id) => gyms.find((g) => g.id === id))
    .filter((g): g is Gym => !!g);

  const compareUrl = `/compare?ids=${selectedIds.join(",")}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
      >
        <div className="backdrop-blur-xl bg-gray-950/95 border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-500/20 px-5 py-4">
          <div className="flex items-center gap-4">
            {/* Selected gym chips */}
            <div className="flex items-center gap-2 flex-1 overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <GitCompare className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-bold text-white whitespace-nowrap">
                  Compare ({selectedIds.length}/5)
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {selectedGyms.map((gym) => (
                  <div
                    key={gym.id}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium"
                  >
                    <span className="max-w-[100px] truncate">{gym.name}</span>
                    <button
                      onClick={() => onRemove(gym.id)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onClear}
                className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                Clear
              </button>
              <Link
                href={compareUrl}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/20"
              >
                Compare Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main Discover Page ────────────────────────────────────────────────────── */
export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ── Toast helpers ── */
  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Filter + sort logic ── */
  const filteredGyms = useMemo(() => {
    let result = [...gyms];

    // Search query: name, city, address, tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.city.toLowerCase().includes(q) ||
          g.address.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.facilities.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Location filter
    if (filters.location.trim()) {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (g) =>
          g.city.toLowerCase().includes(loc) ||
          g.address.toLowerCase().includes(loc)
      );
    }

    // Max price
    if (filters.maxPrice < 15000) {
      result = result.filter((g) => g.monthlyFee <= filters.maxPrice);
    }

    // Min rating
    if (filters.rating > 0) {
      result = result.filter((g) => g.rating >= filters.rating);
    }

    // Facilities
    if (filters.facilities.length > 0) {
      result = result.filter((g) =>
        filters.facilities.every(
          (f) =>
            g.facilities.some((gf) => gf.toLowerCase().includes(f.toLowerCase())) ||
            (f === "Swimming Pool" && g.hasSwimming) ||
            (f === "Sauna" && g.hasSauna) ||
            (f === "CrossFit" && g.hasCrossfit) ||
            (f === "Yoga" && g.hasYoga) ||
            (f === "Parking" && g.hasParking)
        )
      );
    }

    // Toggle filters
    if (filters.femaleFriendly) result = result.filter((g) => g.femaleFriendly);
    if (filters.familyFriendly) result = result.filter((g) => g.familyFriendly);
    if (filters.hasParking) result = result.filter((g) => g.hasParking);

    // Sort
    switch (filters.sortBy) {
      case "ai_score":
        result.sort((a, b) => b.aiScore - a.aiScore);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        result.sort((a, b) => a.monthlyFee - b.monthlyFee);
        break;
      case "price_high":
        result.sort((a, b) => b.monthlyFee - a.monthlyFee);
        break;
      case "distance":
        result.sort((a, b) => a.distance - b.distance);
        break;
      case "most_reviewed":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [searchQuery, filters]);

  /* ── Compare handler ── */
  const handleCompare = useCallback(
    (gym: Gym) => {
      setSelectedForCompare((prev) => {
        if (prev.includes(gym.id)) {
          addToast(`Removed ${gym.name} from comparison`, "info");
          return prev.filter((id) => id !== gym.id);
        }
        if (prev.length >= 5) {
          addToast("Maximum 5 gyms can be compared at once", "warning");
          return prev;
        }
        addToast(`Added ${gym.name} to comparison`, "success");
        return [...prev, gym.id];
      });
    },
    [addToast]
  );

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ?? "AI Score";

  return (
    <div className="min-h-dvh bg-gray-950 flex flex-col">
      <Navbar />

      {/* ── Page header ── */}
      <div className="pt-20 pb-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-8 pb-6">
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-300">Discover Gyms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Discover Gyms Near You
            </h1>
            <p className="text-gray-400 text-base">
              AI-ranked fitness centres across Pakistan — find your perfect match.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by gym name, city, or facility..."
              className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 lg:gap-8">
            {/* ── Sidebar filters (desktop) ── */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <GymFilters filters={filters} onChange={handleFiltersChange} />
              </div>
            </aside>

            {/* ── Main content area ── */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Results count */}
                  <span className="text-gray-300 text-sm font-medium">
                    <span className="text-white font-bold">{filteredGyms.length}</span>
                    {" "}gym{filteredGyms.length !== 1 ? "s" : ""} found
                  </span>

                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {(filters.facilities.length > 0 ||
                      filters.femaleFriendly ||
                      filters.familyFriendly ||
                      filters.hasParking ||
                      filters.rating > 0) && (
                      <span className="w-2 h-2 rounded-full bg-violet-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: e.target.value as SortByOption,
                        }))
                      }
                      className="appearance-none pl-4 pr-9 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 cursor-pointer hover:bg-white/10 transition-all duration-200"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>

                  {/* View mode toggle: Map / List */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-all duration-200",
                        viewMode === "list"
                          ? "bg-violet-600/30 text-violet-300 border-r border-violet-500/20"
                          : "text-gray-400 hover:text-white border-r border-white/10"
                      )}
                    >
                      <List className="w-4 h-4" />
                      <span className="hidden sm:inline">List</span>
                    </button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-all duration-200",
                        viewMode === "map"
                          ? "bg-violet-600/30 text-violet-300"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      <Map className="w-4 h-4" />
                      <span className="hidden sm:inline">Map</span>
                    </button>
                  </div>

                  {/* Grid / List display toggle (only in list view) */}
                  {viewMode === "list" && (
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setDisplayMode("grid")}
                        className={cn(
                          "flex items-center justify-center p-2.5 transition-all duration-200",
                          displayMode === "grid"
                            ? "bg-violet-600/30 text-violet-300"
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDisplayMode("list")}
                        className={cn(
                          "flex items-center justify-center p-2.5 transition-all duration-200",
                          displayMode === "list"
                            ? "bg-violet-600/30 text-violet-300"
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Map View ── */}
              {viewMode === "map" && <MapViewPlaceholder />}

              {/* ── List View ── */}
              {viewMode === "list" && (
                <>
                  {filteredGyms.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-24 text-center"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                        <Dumbbell className="w-10 h-10 text-gray-600" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">No gyms found</h3>
                      <p className="text-gray-400 text-sm max-w-xs mb-6">
                        Try adjusting your search query or filters to find more gyms.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilters(DEFAULT_FILTERS);
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-200"
                      >
                        Clear all filters
                      </button>
                    </motion.div>
                  ) : (
                    <div
                      className={cn(
                        displayMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                          : "flex flex-col gap-4"
                      )}
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredGyms.map((gym, i) => (
                          <motion.div
                            key={gym.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                          >
                            <Link href={`/gym/${gym.id}`} className="block">
                              <GymCard
                                gym={gym}
                                index={i}
                                onCompare={handleCompare}
                                isInCompare={selectedForCompare.includes(gym.id)}
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Filters Drawer ── */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-gray-950/98 backdrop-blur-xl border-r border-white/10 shadow-2xl lg:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-bold text-white">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4">
                <GymFilters
                  filters={filters}
                  onChange={(f) => {
                    handleFiltersChange(f);
                    setShowFilters(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Compare sticky footer ── */}
      <CompareBar
        selectedIds={selectedForCompare}
        onClear={() => setSelectedForCompare([])}
        onRemove={(id) => setSelectedForCompare((prev) => prev.filter((i) => i !== id))}
      />

      {/* ── Toast notifications ── */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastNotification
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
