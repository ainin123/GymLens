/* ─────────────────────────────────────────────────────────────────────────
   GymLens AI  –  Shared TypeScript Interfaces
   ───────────────────────────────────────────────────────────────────────── */

/* ── Trainer ─────────────────────────────────────────────────────────────── */
export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  rating: number;         // 1–5
  experience: number;     // years
  image: string;
  certified: boolean;
  bio: string;
}

/* ── Membership Package ───────────────────────────────────────────────────── */
export interface Package {
  id: string;
  name: string;
  monthlyPrice: number;   // PKR
  annualPrice: number;    // PKR  (total for 12 months)
  features: string[];
  popular: boolean;
}

/* ── Gym Class / Session ─────────────────────────────────────────────────── */
export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  time: string;           // e.g. "07:00 AM"
  duration: number;       // minutes
  capacity: number;
  enrolled: number;
  type: "yoga" | "cardio" | "strength" | "crossfit" | "zumba" | "pilates" | "hiit" | "spinning" | "boxing" | "other";
}

/* ── Amenity ────────────────────────────────────────────────────────────── */
export interface Amenity {
  name: string;
  available: boolean;
  icon: string;           // lucide icon name string
}

/* ── Operating Hours ────────────────────────────────────────────────────── */
export interface OpenHours {
  monday:    string;
  tuesday:   string;
  wednesday: string;
  thursday:  string;
  friday:    string;
  saturday:  string;
  sunday:    string;
}

/* ── Coordinates ────────────────────────────────────────────────────────── */
export interface Coordinates {
  lat: number;
  lng: number;
}

/* ── Review ─────────────────────────────────────────────────────────────── */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;         // 1–5
  comment: string;
  date: string;           // ISO date string
  verified: boolean;
  helpful: number;        // upvote count
  response?: string;      // owner reply, optional
}

/* ── Main Gym Entity ─────────────────────────────────────────────────────── */
export interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: number;       // km from user location

  /* Ratings & scoring */
  rating: number;         // 1–5 (user average)
  reviewCount: number;
  aiScore: number;        // 0–100 composite AI score
  googleRating: number;   // pulled from Google Maps

  /* Pricing (PKR) */
  monthlyFee: number;
  annualFee: number;
  registrationFee: number;
  trainerFee: number;     // per session

  /* AI subscores (1–10) */
  equipment: number;
  cleanliness: number;
  trainerQuality: number;
  crowdedness: number;    // 1 = empty, 10 = very crowded
  interiorScore: number;
  safetyScore: number;
  priceScore: number;     // 1 = cheapest, 10 = most expensive

  /* Sentiment (0–100 %) */
  sentimentPositive: number;
  sentimentNegative: number;

  /* AI-generated content */
  aiSummary: string;
  strengths: string[];    // 3 items
  weaknesses: string[];   // 3 items

  /* Media */
  images: string[];

  /* Descriptions */
  description: string;

  /* Categorisation flags */
  isNew: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  femaleFriendly: boolean;
  familyFriendly: boolean;
  hasParking: boolean;
  hasSwimming: boolean;
  hasSauna: boolean;
  hasCrossfit: boolean;
  hasYoga: boolean;

  /* Audience scores (0–100) */
  femaleScore: number;
  familyScore: number;
  accessibilityScore: number;
  luxuryScore: number;

  /* Operational info */
  openHours: OpenHours;
  peakHours: string;      // e.g. "6–9 AM & 5–8 PM"
  coordinates: Coordinates;
  phone: string;
  website: string;

  /* Collections */
  facilities: string[];
  amenities: Amenity[];
  trainers: Trainer[];
  packages: Package[];
  classes: GymClass[];
  tags: string[];
  reviews?: Review[];
}

/* ── User ─────────────────────────────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "guest" | "user" | "owner" | "admin";
  points: number;
  badges: string[];
  favorites: string[];    // gym ids
}

/* ── Search & Filter ─────────────────────────────────────────────────────── */
export type SortByOption =
  | "ai_score"
  | "rating"
  | "price_low"
  | "price_high"
  | "distance"
  | "newest"
  | "most_reviewed";

export interface SearchFilters {
  location: string;
  radius: number;         // km
  maxPrice: number;       // PKR per month
  facilities: string[];
  rating: number;         // minimum
  femaleFriendly: boolean;
  familyFriendly: boolean;
  hasParking: boolean;
  sortBy: SortByOption;
}

/* ── AI Recommendation Engine Input ─────────────────────────────────────── */
export type GoalOption =
  | "weight_loss"
  | "muscle_gain"
  | "endurance"
  | "flexibility"
  | "general_fitness"
  | "sports_performance"
  | "rehabilitation"
  | "stress_relief";

export type GenderOption = "male" | "female" | "any";

export type TimePreference =
  | "early_morning"   // before 8 AM
  | "morning"         // 8–12 AM
  | "afternoon"       // 12–5 PM
  | "evening"         // 5–9 PM
  | "night";          // after 9 PM

export interface AIRecommendationInput {
  budget: number;                     // max monthly PKR
  gender: GenderOption;
  goals: GoalOption[];
  distance: number;                   // max km
  preferredTimes: TimePreference[];
  requiredFacilities: string[];
  trainerGender: GenderOption;
}

/* ── AI Recommendation Result ────────────────────────────────────────────── */
export interface AIRecommendationResult {
  gym: Gym;
  matchScore: number;        // 0–100 how well it fits the user input
  matchReasons: string[];    // human-readable bullets
  warnings: string[];        // potential mismatches
}

/* ── Notification ─────────────────────────────────────────────────────────── */
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/* ── Analytics / Stats (for owner dashboard) ─────────────────────────────── */
export interface GymStats {
  totalVisits: number;
  weeklyGrowth: number;   // percentage
  avgSessionDuration: number; // minutes
  memberCount: number;
  retentionRate: number;  // percentage
  revenueMonthly: number; // PKR
}
