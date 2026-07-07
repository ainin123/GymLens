"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  CheckCircle,
  Phone,
  Globe,
  Clock,
  Navigation,
  Heart,
  Share2,
  GitCompare,
  ChevronRight,
  Award,
  Users,
  Calendar,
  Dumbbell,
  Zap,
  Wifi,
  Car,
  Waves,
  Wind,
  Flame,
  Leaf,
  GlassWater,
  Apple,
  ShoppingBag,
  LockKeyhole,
  Droplets,
  ShieldCheck,
  Check,
  AlertTriangle,
  ThumbsUp,
  MessageSquare,
  BarChart2,
  Activity,
  TrendingUp,
  Medal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIScoreCard from "@/components/gym/AIScoreCard";
import { gyms } from "@/data/gyms";
import { cn, formatDistance, annualSavings } from "@/lib/utils";
import type { Gym, Package, Trainer, GymClass, Review } from "@/types";

/* ─── Sample reviews (Pakistani names) ─────────────────────────────────────── */
const SAMPLE_REVIEWS: Review[] = [
  {
    id: "rev-001",
    userId: "u-001",
    userName: "Hasan Mirza",
    userAvatar: "H",
    rating: 5,
    comment:
      "Absolutely world-class facility. The equipment is impeccable — every machine is well-maintained and the free-weight section is enormous. Staff are professional and the trainers are genuinely among the best I have worked with. Worth every rupee.",
    date: "2026-06-18",
    verified: true,
    helpful: 47,
  },
  {
    id: "rev-002",
    userId: "u-002",
    userName: "Zainab Qureshi",
    userAvatar: "Z",
    rating: 5,
    comment:
      "As a woman, I felt completely safe and comfortable here. The female section is spacious, well-equipped, and the female trainers are outstanding. Clean showers and changing rooms. I am never going back to my old gym.",
    date: "2026-06-05",
    verified: true,
    helpful: 38,
  },
  {
    id: "rev-003",
    userId: "u-003",
    userName: "Bilal Rehman",
    userAvatar: "B",
    rating: 4,
    comment:
      "Fantastic gym overall. My only complaint is the parking lot fills up fast during 6–8 PM. I now come at 5:15 AM to avoid the rush — the early morning crowd is very dedicated and the atmosphere is electric. The juice bar protein shakes are also excellent.",
    date: "2026-05-22",
    verified: true,
    helpful: 29,
  },
  {
    id: "rev-004",
    userId: "u-004",
    userName: "Ayesha Nawaz",
    userAvatar: "A",
    rating: 5,
    comment:
      "The CrossFit classes with Bilal are insane — in the best way. He pushes you but never beyond your limits. The nutrition bar staff customised my pre-workout meal based on my goals. This gym genuinely cares about results, not just membership numbers.",
    date: "2026-05-10",
    verified: true,
    helpful: 53,
  },
];

/* ─── Icon map for amenity icons ───────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Wifi: Wifi,
  ParkingCircle: Car,
  LockKeyhole: LockKeyhole,
  Droplets: Droplets,
  Wind: Wind,
  Waves: Waves,
  Flame: Flame,
  Leaf: Leaf,
  GlassWater: GlassWater,
  Apple: Apple,
  ShoppingBag: ShoppingBag,
  ShieldCheck: ShieldCheck,
  Dumbbell: Dumbbell,
  CloudFog: Flame,
  ScanLine: Activity,
  Stethoscope: Activity,
  Swords: Award,
  Circle: Activity,
  Baby: Users,
};

function AmenityIcon({ iconName }: { iconName: string }) {
  const Icon = ICON_MAP[iconName] ?? Dumbbell;
  return <Icon className="w-5 h-5" />;
}

/* ─── Tab IDs ───────────────────────────────────────────────────────────────── */
type TabId = "overview" | "packages" | "trainers" | "classes" | "gallery" | "reviews";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "packages", label: "Packages" },
  { id: "trainers", label: "Trainers" },
  { id: "classes", label: "Classes" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
];

/* ─── Star display ──────────────────────────────────────────────────────────── */
function StarRow({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const s = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            s,
            rating >= i ? "fill-amber-400 text-amber-400" : "fill-gray-700 text-gray-700"
          )}
        />
      ))}
    </div>
  );
}

/* ─── Package card ──────────────────────────────────────────────────────────── */
function PackageCard({ pkg }: { pkg: Package }) {
  const savings = annualSavings(pkg.monthlyPrice, pkg.annualPrice);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border transition-all duration-300",
        pkg.popular
          ? "bg-gradient-to-b from-violet-600/20 to-indigo-600/10 border-violet-500/40 shadow-2xl shadow-violet-500/10"
          : "bg-white/5 border-white/10 hover:border-white/20"
      )}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg shadow-violet-500/30">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-white">
            PKR {pkg.monthlyPrice.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm">/mo</span>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Annual: PKR {pkg.annualPrice.toLocaleString()}{" "}
          {savings > 0 && (
            <span className="text-emerald-400 font-semibold">
              (save {savings}%)
            </span>
          )}
        </p>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
            </div>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={cn(
          "w-full py-3 text-sm font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
          pkg.popular
            ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20"
            : "border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20"
        )}
      >
        Book Now
      </button>
    </motion.div>
  );
}

/* ─── Trainer card ──────────────────────────────────────────────────────────── */
function TrainerCard({ trainer }: { trainer: Trainer }) {
  const [showBio, setShowBio] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onHoverStart={() => setShowBio(true)}
      onHoverEnd={() => setShowBio(false)}
      className="relative p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
            <img
              src={trainer.image}
              alt={trainer.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="absolute text-2xl font-black text-white/80">
              {trainer.name.charAt(0)}
            </span>
          </div>
          {trainer.certified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-gray-950 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-white font-bold text-sm truncate">{trainer.name}</h4>
          <p className="text-violet-400 text-xs font-medium truncate">{trainer.specialty}</p>
          <div className="flex items-center gap-2 mt-1">
            <StarRow rating={trainer.rating} size="sm" />
            <span className="text-gray-500 text-xs">{trainer.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{trainer.experience} years exp.</span>
        </div>
        {trainer.certified && (
          <div className="flex items-center gap-1 text-emerald-400">
            <Medal className="w-3.5 h-3.5" />
            <span>Certified</span>
          </div>
        )}
      </div>

      {/* Bio (shows on hover) */}
      <AnimatePresence>
        {showBio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-xs leading-relaxed pt-3 border-t border-white/10">
              {trainer.bio}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Class type badge ──────────────────────────────────────────────────────── */
const CLASS_COLORS: Record<string, string> = {
  yoga: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  cardio: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  strength: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  crossfit: "bg-red-500/20 text-red-300 border-red-500/30",
  zumba: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  pilates: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  hiit: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  spinning: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  boxing: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

function ClassRow({ cls }: { cls: GymClass }) {
  const fillPct = Math.round((cls.enrolled / cls.capacity) * 100);
  const badgeColor = CLASS_COLORS[cls.type] ?? CLASS_COLORS.other;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-200 group"
    >
      <div className="flex-shrink-0 w-16 text-center">
        <span className="text-white text-sm font-bold">{cls.time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-white text-sm font-semibold truncate">{cls.name}</p>
          <span
            className={cn(
              "flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full border capitalize",
              badgeColor
            )}
          >
            {cls.type}
          </span>
        </div>
        <p className="text-gray-400 text-xs">{cls.instructor} &bull; {cls.duration} min</p>
      </div>
      <div className="flex-shrink-0 w-28">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">{cls.enrolled}/{cls.capacity}</span>
          <span
            className={cn(
              "font-semibold",
              fillPct >= 90 ? "text-red-400" : fillPct >= 70 ? "text-amber-400" : "text-emerald-400"
            )}
          >
            {fillPct}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              fillPct >= 90
                ? "bg-gradient-to-r from-red-500 to-rose-500"
                : fillPct >= 70
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Review card ───────────────────────────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (!voted) {
      setHelpful((h) => h + 1);
      setVoted(true);
    }
  };

  const date = new Date(review.date);
  const formattedDate = date.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg">
            {review.userAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-semibold">{review.userName}</p>
              {review.verified && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-xs">{formattedDate}</p>
          </div>
        </div>
        <StarRow rating={review.rating} size="sm" />
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-all duration-200",
            voted
              ? "text-violet-400 cursor-default"
              : "text-gray-500 hover:text-gray-300 cursor-pointer"
          )}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({helpful})
        </button>
        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <MessageSquare className="w-3.5 h-3.5" />
          Reply
        </button>
      </div>
    </div>
  );
}

/* ─── Peak hours chart ──────────────────────────────────────────────────────── */
const PEAK_HOURS_DATA = [
  { hour: "6AM", occupancy: 55 },
  { hour: "7AM", occupancy: 85 },
  { hour: "8AM", occupancy: 90 },
  { hour: "9AM", occupancy: 70 },
  { hour: "10AM", occupancy: 45 },
  { hour: "11AM", occupancy: 40 },
  { hour: "12PM", occupancy: 50 },
  { hour: "1PM", occupancy: 45 },
  { hour: "2PM", occupancy: 35 },
  { hour: "3PM", occupancy: 40 },
  { hour: "4PM", occupancy: 55 },
  { hour: "5PM", occupancy: 80 },
  { hour: "6PM", occupancy: 95 },
  { hour: "7PM", occupancy: 90 },
  { hour: "8PM", occupancy: 70 },
  { hour: "9PM", occupancy: 45 },
  { hour: "10PM", occupancy: 25 },
];

function PeakHoursChart() {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={PEAK_HOURS_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}% full`, "Occupancy"]}
          />
          <Bar dataKey="occupancy" radius={[4, 4, 0, 0]}>
            {PEAK_HOURS_DATA.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.occupancy >= 85
                    ? "#ef4444"
                    : entry.occupancy >= 65
                    ? "#f59e0b"
                    : "#8b5cf6"
                }
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Gallery placeholder ───────────────────────────────────────────────────── */
const GALLERY_LABELS = [
  "Main Gym Floor",
  "Cardio Zone",
  "Free Weights",
  "Group Fitness Studio",
  "Swimming Pool",
  "Locker Rooms",
];

const GALLERY_GRADIENTS = [
  "from-violet-800 to-indigo-900",
  "from-blue-800 to-cyan-900",
  "from-emerald-800 to-teal-900",
  "from-purple-800 to-pink-900",
  "from-indigo-800 to-blue-900",
  "from-teal-800 to-emerald-900",
];

/* ─── Main Gym Detail Page ──────────────────────────────────────────────────── */
export default function GymDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Support both Next.js 15 async params and legacy sync params
  const resolvedParams = typeof (params as any).then === "function"
    ? use(params as Promise<{ id: string }>)
    : (params as { id: string });

  const gym = gyms.find((g) => g.id === resolvedParams.id);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isSaved, setIsSaved] = useState(false);

  const overviewRef = useRef<HTMLDivElement>(null);
  const packagesRef = useRef<HTMLDivElement>(null);
  const trainersRef = useRef<HTMLDivElement>(null);
  const classesRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
    overview: overviewRef,
    packages: packagesRef,
    trainers: trainersRef,
    classes: classesRef,
    gallery: galleryRef,
    reviews: reviewsRef,
  };

  const scrollToSection = (tabId: TabId) => {
    setActiveTab(tabId);
    const ref = sectionRefs[tabId];
    if (ref.current) {
      const offset = 80;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // 404 state
  if (!gym) {
    return (
      <div className="min-h-dvh bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Dumbbell className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Gym Not Found</h1>
          <p className="text-gray-400 mb-6">
            We could not find the gym you are looking for.
          </p>
          <Link
            href="/discover"
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all"
          >
            Browse All Gyms
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const crowdColor =
    gym.crowdedness <= 3
      ? "from-emerald-500 to-teal-500"
      : gym.crowdedness <= 6
      ? "from-amber-500 to-orange-500"
      : "from-red-500 to-rose-500";

  const openHoursEntries = Object.entries(gym.openHours) as [string, string][];

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    // Simulate distribution based on overall rating
    const base =
      star === 5
        ? Math.round(gym.sentimentPositive * 0.7)
        : star === 4
        ? Math.round(gym.sentimentPositive * 0.25)
        : star === 3
        ? Math.round(100 - gym.sentimentPositive) * 0.5
        : star === 2
        ? Math.round(gym.sentimentNegative * 0.4)
        : Math.round(gym.sentimentNegative * 0.3);
    return { star, pct: Math.min(base, 100) };
  });

  return (
    <div className="min-h-dvh bg-gray-950 flex flex-col">
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════
          HEADER / HERO BANNER
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative pt-16 sm:pt-20">
        {/* Banner */}
        <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-900/60 to-indigo-900/80" />
          <img
            src={gym.images[0]}
            alt={gym.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/40 to-transparent" />
        </div>

        {/* Content overlaid on banner */}
        <div className="relative -mt-24 sm:-mt-28 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/discover" className="hover:text-gray-300 transition-colors">
              Discover
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-300 truncate max-w-[180px]">{gym.name}</span>
          </nav>

          {/* Gym title block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
            <div className="space-y-2">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {gym.isVerified && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                )}
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

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {gym.name}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  {gym.address}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                  {formatDistance(gym.distance)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StarRow rating={gym.rating} />
                <span className="text-amber-400 font-bold text-sm">{gym.rating}</span>
                <span className="text-gray-500 text-sm">
                  ({gym.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-violet-500/20">
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="relative z-10 w-4 h-4" />
                <span className="relative z-10">Book Free Trial</span>
              </button>

              <button
                onClick={() => setIsSaved((s) => !s)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95",
                  isSaved
                    ? "text-pink-400 bg-pink-500/10 border-pink-500/30"
                    : "text-gray-400 bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20"
                )}
              >
                <Heart className={cn("w-4 h-4", isSaved && "fill-pink-400")} />
                {isSaved ? "Saved" : "Save"}
              </button>

              <Link
                href={`/compare?ids=${gym.id}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </Link>

              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          INFO BAR
      ════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="backdrop-blur-xl bg-gray-950/90 border border-white/10 rounded-2xl px-5 py-4 shadow-2xl">
          <div className="flex items-center justify-between gap-4 flex-wrap overflow-x-auto">
            {/* Price */}
            <div className="flex flex-col flex-shrink-0">
              <span className="text-gray-500 text-xs">Monthly from</span>
              <span className="text-emerald-400 font-black text-base">
                PKR {gym.monthlyFee.toLocaleString()}
              </span>
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0 hidden sm:block" />

            {/* Distance */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-gray-500 text-xs block">Distance</span>
                <span className="text-white text-sm font-semibold">{formatDistance(gym.distance)}</span>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0 hidden sm:block" />

            {/* Opens at */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Clock className="w-4 h-4 text-violet-400" />
              <div>
                <span className="text-gray-500 text-xs block">Today</span>
                <span className="text-white text-sm font-semibold truncate max-w-[120px]">
                  {gym.openHours.monday}
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0 hidden sm:block" />

            {/* Crowdedness */}
            <div className="flex-shrink-0 min-w-[100px]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Crowdedness</span>
                <span className="text-white font-semibold">{gym.crowdedness}/10</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-28">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gym.crowdedness * 10}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn("h-full rounded-full bg-gradient-to-r", crowdColor)}
                />
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0 hidden sm:block" />

            {/* AI Score badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-white text-sm font-black">{gym.aiScore}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">AI Score</span>
                <span className="text-violet-300 text-xs font-semibold">Out of 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TAB NAVIGATION
      ════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-[88px] z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="backdrop-blur-xl bg-gray-950/90 border border-white/10 rounded-2xl px-2 py-1.5 shadow-xl">
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PAGE BODY
      ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">

        {/* ══ OVERVIEW ══ */}
        <div ref={overviewRef} className="scroll-mt-44">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <BarChart2 className="w-6 h-6 text-violet-400" />
            Overview
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: AI score + summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Score Card */}
              <AIScoreCard gym={gym} />

              {/* AI Summary */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  AI Summary
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{gym.aiSummary}</p>
              </div>

              {/* Facilities grid */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Facilities & Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gym.amenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl text-sm transition-all duration-200",
                        amenity.available
                          ? "bg-white/5 border border-white/10 text-gray-300"
                          : "bg-transparent border border-white/5 text-gray-600 opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          amenity.available ? "text-violet-400" : "text-gray-600"
                        )}
                      >
                        <AmenityIcon iconName={amenity.icon} />
                      </span>
                      <span className="text-xs font-medium truncate">{amenity.name}</span>
                      {amenity.available ? (
                        <Check className="w-3 h-3 text-emerald-400 ml-auto flex-shrink-0" strokeWidth={3} />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-700 ml-auto flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak hours chart */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    Peak Hours
                  </h3>
                  <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    Busiest: {gym.peakHours}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                    Low
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    Moderate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    Busy
                  </span>
                </div>
                <PeakHoursChart />
              </div>
            </div>

            {/* Right: contact + hours */}
            <div className="space-y-6">
              {/* Contact info */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">{gym.address}</p>
                  </div>
                  <a
                    href={`tel:${gym.phone}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                  >
                    <Phone className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="text-sm group-hover:text-violet-300 transition-colors">
                      {gym.phone}
                    </span>
                  </a>
                  <a
                    href={gym.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                  >
                    <Globe className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="text-sm group-hover:text-violet-300 transition-colors truncate">
                      {gym.website.replace("https://", "")}
                    </span>
                  </a>
                </div>
              </div>

              {/* Opening hours */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Opening Hours
                </h3>
                <div className="space-y-2.5">
                  {openHoursEntries.map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize font-medium w-24">
                        {day.slice(0, 3)}
                      </span>
                      <span
                        className={cn(
                          "text-right",
                          hours === "Closed" ? "text-red-400 font-semibold" : "text-gray-300"
                        )}
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {gym.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full capitalize"
                    >
                      {tag.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ PACKAGES ══ */}
        <div ref={packagesRef} className="scroll-mt-44">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-violet-400" />
            Membership Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gym.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>

        {/* ══ TRAINERS ══ */}
        <div ref={trainersRef} className="scroll-mt-44">
          <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
            <Users className="w-6 h-6 text-violet-400" />
            Our Trainers
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Hover over a card to read each trainer&apos;s full bio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gym.trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </div>

        {/* ══ CLASSES ══ */}
        <div ref={classesRef} className="scroll-mt-44">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-violet-400" />
            Group Classes
          </h2>
          <div className="space-y-3">
            {gym.classes.map((cls) => (
              <ClassRow key={cls.id} cls={cls} />
            ))}
          </div>
        </div>

        {/* ══ GALLERY ══ */}
        <div ref={galleryRef} className="scroll-mt-44">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-violet-400" />
            Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_LABELS.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer group",
                  i === 0 ? "md:col-span-2 md:row-span-2 h-64 md:h-auto" : "h-32 sm:h-36"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    GALLERY_GRADIENTS[i % GALLERY_GRADIENTS.length]
                  )}
                />
                <img
                  src={gym.images[i % gym.images.length]}
                  alt={`${gym.name} - ${label}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white text-xs sm:text-sm font-bold">{label}</span>
                </div>
                {/* View overlay on hover */}
                <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══ REVIEWS ══ */}
        <div ref={reviewsRef} className="scroll-mt-44">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-violet-400" />
            Member Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating summary */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 h-fit">
              <div className="text-center space-y-1">
                <span className="text-6xl font-black text-white">{gym.rating}</span>
                <p className="text-gray-400 text-sm">out of 5</p>
                <StarRow rating={gym.rating} size="lg" />
                <p className="text-gray-500 text-xs mt-1">
                  Based on {gym.reviewCount.toLocaleString()} reviews
                </p>
              </div>

              <div className="space-y-2.5">
                {ratingDistribution.map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="text-gray-400 w-3 text-right flex-shrink-0">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: (5 - star) * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      />
                    </div>
                    <span className="text-gray-500 w-8 text-right flex-shrink-0">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Sentiment */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Sentiment
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">
                    {gym.sentimentPositive}% positive
                  </span>
                  <span className="text-red-400 font-semibold">
                    {gym.sentimentNegative}% negative
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${gym.sentimentPositive}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${gym.sentimentNegative}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-red-500 to-rose-500 h-full"
                  />
                </div>
              </div>
            </div>

            {/* Review cards */}
            <div className="lg:col-span-2 space-y-4">
              {SAMPLE_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {/* Login to review CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6 text-violet-400" />
                </div>
                <h4 className="text-white font-bold">Share Your Experience</h4>
                <p className="text-gray-400 text-sm">
                  Been to {gym.name}? Login to leave a review and help the community.
                </p>
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 hover:scale-105"
                >
                  Login to Review
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
