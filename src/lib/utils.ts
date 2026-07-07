import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function calculateAIScore(gym: {
  equipment?: number;
  cleanliness?: number;
  trainerQuality?: number;
  priceScore?: number;
  distance?: number;
  facilities?: string[];
  interiorScore?: number;
  rating?: number;
  safetyScore?: number;
  crowdedness?: number;
  [key: string]: unknown;
}): number {
  const weights = {
    equipment:    0.15,
    cleanliness:  0.12,
    trainers:     0.12,
    value:        0.12,
    location:     0.10,
    facilities:   0.10,
    interior:     0.08,
    reviews:      0.11,
    safety:       0.05,
    crowdedness:  0.05,
  };

  let score = 0;
  score += (gym.equipment       ?? 5) * 10 * weights.equipment;
  score += (gym.cleanliness     ?? 5) * 10 * weights.cleanliness;
  score += (gym.trainerQuality  ?? 5) * 10 * weights.trainers;
  score += (10 - Math.min(gym.priceScore  ?? 5, 10)) * 10 * weights.value;
  score += (10 - Math.min(gym.distance    ?? 1, 10)) * 10 * weights.location;
  score += (gym.facilities?.length        ?? 5) * 3  * weights.facilities;
  score += (gym.interiorScore   ?? 5) * 10 * weights.interior;
  score += (gym.rating          ?? 4) * 20 * weights.reviews;
  score += (gym.safetyScore     ?? 5) * 10 * weights.safety;
  score += (10 - Math.min(gym.crowdedness ?? 5, 10)) * 10 * weights.crowdedness;

  return Math.min(Math.round(score), 100);
}

/** Shorten large numbers: 1200 → "1.2K", 1200000 → "1.2M" */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Returns a CSS color string based on AI score value */
export function scoreColor(score: number): string {
  if (score >= 90) return "#34d399"; // emerald-400
  if (score >= 75) return "#a78bfa"; // violet-400
  if (score >= 60) return "#60a5fa"; // blue-400
  if (score >= 45) return "#fbbf24"; // amber-400
  return "#f87171";                  // red-400
}

/** Returns a Tailwind text-color class based on AI score */
export function scoreTailwindClass(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-violet-400";
  if (score >= 60) return "text-blue-400";
  if (score >= 45) return "text-amber-400";
  return "text-red-400";
}

/** Returns a Tailwind background gradient class based on AI score */
export function scoreGradientClass(score: number): string {
  if (score >= 90)
    return "from-emerald-500 to-teal-500";
  if (score >= 75)
    return "from-violet-500 to-purple-500";
  if (score >= 60)
    return "from-blue-500 to-cyan-500";
  if (score >= 45)
    return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-500";
}

/** Clamps a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Converts kilometres to a human-friendly string */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Calculates savings percentage between monthly × 12 vs annual price */
export function annualSavings(monthly: number, annual: number): number {
  const yearlyEquivalent = monthly * 12;
  if (yearlyEquivalent === 0) return 0;
  return Math.round(((yearlyEquivalent - annual) / yearlyEquivalent) * 100);
}

/** Returns a relative time string (e.g. "3 days ago") */
export function timeAgo(date: string | Date): string {
  const now  = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60)       return "just now";
  if (diff < 3600)     return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)    return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000)  return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

/** Truncates a string to maxLength and appends "…" if needed */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

/** Slugifies a gym name for URL use */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Generates star rating display array (full/half/empty) */
export function ratingStars(rating: number): ("full" | "half" | "empty")[] {
  return Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });
}
