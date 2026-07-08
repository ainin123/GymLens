<div align="center">

# GymLens AI

**AI-Powered Gym Discovery Platform for Pakistan**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Railway](https://img.shields.io/badge/Deployed-Railway-7B2FBE?logo=railway)](https://railway.app/)

*Compare gyms intelligently. No guesswork. No bias. Just data.*

</div>

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Core Data Model](#5-core-data-model)
6. [AI Scoring Engine](#6-ai-scoring-engine)
7. [Pages & Routes](#7-pages--routes)
8. [Component Library](#8-component-library)
9. [Utility Functions](#9-utility-functions)
10. [Type System](#10-type-system)
11. [State Management](#11-state-management)
12. [Styling System](#12-styling-system)
13. [Animations & Motion](#13-animations--motion)
14. [Data Visualisation](#14-data-visualisation)
15. [AI Advisor Wizard](#15-ai-advisor-wizard)
16. [Conversational AI Chat](#16-conversational-ai-chat)
17. [Gym Comparison Engine](#17-gym-comparison-engine)
18. [Admin Dashboard](#18-admin-dashboard)
19. [Authentication Layer](#19-authentication-layer)
20. [SEO & Metadata](#20-seo--metadata)
21. [Performance Design](#21-performance-design)
22. [Accessibility](#22-accessibility)
23. [Deployment](#23-deployment)
24. [Environment Configuration](#24-environment-configuration)
25. [Local Development](#25-local-development)
26. [Known Constraints & Scope Notes](#26-known-constraints--scope-notes)
27. [Roadmap](#27-roadmap)
28. [Contributing](#28-contributing)
29. [License](#29-license)

---

## 1. Project Overview

GymLens AI is a frontend-first gym discovery platform targeting the Pakistani fitness market (Karachi, Lahore, Islamabad). It aggregates structured gym data and surfaces it through an AI scoring engine, a multi-step recommendation wizard, a keyword-driven chat assistant, and a side-by-side gym comparison tool — all without a traditional REST API or database at runtime.

**Core value proposition:**
- Every gym receives a composite **AI Score (0–100)** derived from 10 weighted sub-dimensions (equipment quality, cleanliness, trainer quality, value, location, facilities, interior, review rating, safety, and crowd density).
- Users can describe their requirements (budget, goals, gender, timing, facilities) through a 5-step wizard and receive ranked recommendations with human-readable match reasons.
- A natural-language chat interface parses keyword intent and surfaces matching gyms with rich cards.
- Any two or three gyms can be placed side-by-side for a dimension-by-dimension comparison.

**Market context:** All prices are denominated in Pakistani Rupees (PKR). The platform uses Pakistani city names, phone number formats, and culturally relevant filters (female-friendly spaces, family-friendly environments).

---

## 2. Architecture Overview

GymLens is a **pure frontend application**. There is no server-side API, no database, and no persistent user state beyond the browser session.

```
Browser
  └── Next.js 16 App Router (client components only)
        ├── /                    Landing page with hero, feature highlights, gym cards
        ├── /discover            Filterable, sortable gym listing
        ├── /ai-advisor          5-step recommendation wizard
        ├── /compare             Side-by-side gym comparison (up to 3 gyms)
        ├── /gym/[id]            Full gym detail page
        ├── /chat                Keyword-matching AI chat interface
        ├── /admin               Mock analytics dashboard (UI only)
        └── /auth/login          Authentication UI (no backend, no sessions)
            /auth/register

Data Layer
  └── src/data/gyms.ts           Static TypeScript array (all gym records)

Scoring Engine
  └── src/lib/utils.ts           calculateAIScore() — deterministic weighted formula

Deployment
  └── Railway (Nixpacks builder) → npm start → next start -p ${PORT:-3000}
```

All "AI" in the current implementation is deterministic: the scoring engine is a weighted linear combination, the chat assistant is a keyword-matching switch, and the advisor wizard applies user-defined criteria filters. No external AI API is called at runtime.

---

## 3. Technology Stack

| Layer | Package | Version | Purpose |
|---|---|---|---|
| Framework | `next` | 16.2.10 | App Router, SSR/CSR, routing, metadata API |
| UI Library | `react` / `react-dom` | 19.2.4 | Component model, hooks |
| Language | `typescript` | ^5 | Static typing, interfaces |
| Styling | `tailwindcss` | ^4 | Utility-first CSS (PostCSS plugin mode) |
| Animation | `framer-motion` | ^12 | Page transitions, scroll animations, stagger effects |
| Charts | `recharts` | ^3.9.2 | Gym score bar charts, admin analytics pie/line charts |
| UI Primitives | `@radix-ui/react-dialog` | ^1.1.19 | Accessible modal dialogs |
| | `@radix-ui/react-progress` | ^1.1.12 | Score progress bars |
| | `@radix-ui/react-select` | ^2.3.3 | Dropdown selects |
| | `@radix-ui/react-slider` | ^1.4.3 | Budget and distance range sliders |
| | `@radix-ui/react-tabs` | ^1.1.17 | Tabbed content panels |
| | `@radix-ui/react-tooltip` | ^1.2.12 | Score dimension tooltips |
| Icons | `lucide-react` | ^1.23.0 | SVG icon set |
| Styling Utilities | `clsx` | ^2.1.1 | Conditional class composition |
| | `tailwind-merge` | ^3.6.0 | Deduplication of conflicting Tailwind classes |
| | `class-variance-authority` | ^0.7.1 | Typed component variant API |
| Font | `Inter` | Google Fonts | Primary typeface via `next/font/google` |

---

## 4. Repository Structure

```
GymLens/
├── src/
│   ├── app/
│   │   ├── layout.tsx              Root layout: Inter font, dark bg, global glows
│   │   ├── page.tsx                Landing page (hero, search, feature sections, gym cards)
│   │   ├── not-found.tsx           Custom 404
│   │   ├── globals.css             Tailwind base + custom utility classes
│   │   ├── admin/
│   │   │   └── page.tsx            Analytics dashboard (Recharts, gym management table)
│   │   ├── ai-advisor/
│   │   │   └── page.tsx            5-step recommendation wizard
│   │   ├── auth/
│   │   │   ├── login/page.tsx      Login UI
│   │   │   └── register/page.tsx   Registration UI
│   │   ├── chat/
│   │   │   └── page.tsx            Keyword-driven AI chat interface
│   │   ├── compare/
│   │   │   └── page.tsx            Side-by-side gym comparison
│   │   ├── discover/
│   │   │   └── page.tsx            Filterable gym listing
│   │   └── gym/
│   │       └── [id]/
│   │           └── page.tsx        Dynamic gym detail page
│   ├── components/
│   │   ├── gym/
│   │   │   ├── AIScoreCard.tsx     Circular score ring + dimension breakdown
│   │   │   ├── GymCard.tsx         Listing card with image, badges, key metrics
│   │   │   └── GymFilters.tsx      Filter panel: price, facilities, rating, sorting
│   │   └── layout/
│   │       ├── Navbar.tsx          Top navigation bar
│   │       └── Footer.tsx          Footer with links and branding
│   ├── data/
│   │   └── gyms.ts                 Static array of Gym objects (mock dataset)
│   ├── lib/
│   │   └── utils.ts                AI scoring + formatting helper functions
│   └── types/
│       └── index.ts                All shared TypeScript interfaces and types
├── public/                         Static assets (favicon, OG image placeholder)
├── next.config.ts                  Minimal Next.js configuration
├── railway.json                    Railway deployment manifest
├── postcss.config.mjs              @tailwindcss/postcss plugin
├── tsconfig.json                   Strict TypeScript with path alias @/*
├── package.json
└── README.md
```

---

## 5. Core Data Model

All gym data lives in `src/data/gyms.ts` as a typed `Gym[]` array. The `Gym` interface is defined in `src/types/index.ts` and consists of the following groups of fields:

### 5.1 Identity & Location

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique slug (e.g. `"gym-001"`) |
| `name` | `string` | Display name |
| `address` | `string` | Street address |
| `city` | `string` | City name (Karachi, Lahore, Islamabad) |
| `distance` | `number` | Kilometres from reference point |
| `coordinates` | `Coordinates` | `{ lat, lng }` (decimal degrees) |
| `phone` | `string` | Contact number |
| `website` | `string` | URL |

### 5.2 Ratings & Scoring

| Field | Type | Range | Description |
|---|---|---|---|
| `rating` | `number` | 1–5 | User-submitted average rating |
| `reviewCount` | `number` | ≥0 | Total review count |
| `aiScore` | `number` | 0–100 | Composite AI score (see Section 6) |
| `googleRating` | `number` | 1–5 | Google Maps rating |

### 5.3 Pricing (PKR)

| Field | Type | Description |
|---|---|---|
| `monthlyFee` | `number` | Per-month membership |
| `annualFee` | `number` | Full-year membership |
| `registrationFee` | `number` | One-time joining fee |
| `trainerFee` | `number` | Per personal training session |

### 5.4 AI Sub-scores (1–10 scale)

| Field | Meaning |
|---|---|
| `equipment` | Quality and modernity of equipment |
| `cleanliness` | Hygiene and maintenance standard |
| `trainerQuality` | Trainer expertise and certification level |
| `crowdedness` | 1 = empty / uncrowded, 10 = very crowded |
| `interiorScore` | Aesthetic quality and layout |
| `safetyScore` | Perceived safety and security measures |
| `priceScore` | 1 = cheapest in market, 10 = most expensive |

### 5.5 Sentiment (0–100 %)

| Field | Description |
|---|---|
| `sentimentPositive` | Percentage of reviews expressing positive sentiment |
| `sentimentNegative` | Percentage of reviews expressing negative sentiment |

### 5.6 AI-Generated Content

| Field | Type | Description |
|---|---|---|
| `aiSummary` | `string` | One-paragraph AI-written synopsis |
| `strengths` | `string[]` | Exactly 3 key strengths |
| `weaknesses` | `string[]` | Exactly 3 key weaknesses |

### 5.7 Audience Scores (0–100)

| Field | Description |
|---|---|
| `femaleScore` | How suitable the gym is for female members |
| `familyScore` | Suitability for families |
| `accessibilityScore` | Physical accessibility for people with mobility needs |
| `luxuryScore` | Premium experience level |

### 5.8 Flags

| Field | Type | Description |
|---|---|---|
| `isNew` | `boolean` | Opened within the last 6 months |
| `isFeatured` | `boolean` | Promoted/sponsored placement |
| `isVerified` | `boolean` | Verified by GymLens team |
| `femaleFriendly` | `boolean` | Dedicated female-only section or policy |
| `familyFriendly` | `boolean` | Child-friendly amenities |
| `hasParking` | `boolean` | On-site or reserved parking |
| `hasSwimming` | `boolean` | Swimming pool |
| `hasSauna` | `boolean` | Sauna or steam room |
| `hasCrossfit` | `boolean` | CrossFit or functional training area |
| `hasYoga` | `boolean` | Yoga studio or classes |

### 5.9 Collections

| Field | Type | Description |
|---|---|---|
| `facilities` | `string[]` | List of facility names |
| `amenities` | `Amenity[]` | Named amenities with `available` flag and `icon` string |
| `trainers` | `Trainer[]` | Staff profiles (name, specialty, rating, experience, certified, bio) |
| `packages` | `Package[]` | Membership tiers (name, monthlyPrice, annualPrice, features, popular) |
| `classes` | `GymClass[]` | Scheduled classes (name, instructor, time, duration, capacity, enrolled, type) |
| `tags` | `string[]` | Free-text search tags |
| `reviews` | `Review[]` (optional) | Member reviews with verified flag and owner response |

### 5.10 Operational Info

| Field | Type | Description |
|---|---|---|
| `openHours` | `OpenHours` | Per-day hours object (Monday–Sunday) |
| `peakHours` | `string` | Human-readable peak period string |
| `images` | `string[]` | Array of image URLs |

---

## 6. AI Scoring Engine

The AI scoring engine lives in `src/lib/utils.ts` as the `calculateAIScore()` function. It produces a deterministic composite score in the range **0–100** using a 10-dimension weighted formula.

### 6.1 Score Formula

```
score = Σ (dimension_value × normalisation_factor × weight)
```

| Dimension | Input Field | Normalisation | Weight |
|---|---|---|---|
| Equipment | `equipment` (1–10) | ×10 | 0.15 (15%) |
| Cleanliness | `cleanliness` (1–10) | ×10 | 0.12 (12%) |
| Trainer Quality | `trainerQuality` (1–10) | ×10 | 0.12 (12%) |
| Value for Money | `10 - priceScore` (inverted) | ×10 | 0.12 (12%) |
| Location | `10 - distance` (inverted, capped at 10 km) | ×10 | 0.10 (10%) |
| Facilities | `facilities.length × 3` | — | 0.10 (10%) |
| Interior | `interiorScore` (1–10) | ×10 | 0.08 (8%) |
| Review Score | `rating` (1–5) | ×20 | 0.11 (11%) |
| Safety | `safetyScore` (1–10) | ×10 | 0.05 (5%) |
| Crowdedness | `10 - crowdedness` (inverted) | ×10 | 0.05 (5%) |

The final result is clamped to 100 using `Math.min(Math.round(score), 100)`.

### 6.2 Score Colour Thresholds

The score is mapped to a colour at render time by `scoreColor()`, `scoreTailwindClass()`, and `scoreGradientClass()`:

| Range | Colour | Tailwind Class | Gradient |
|---|---|---|---|
| >= 90 | Emerald (`#34d399`) | `text-emerald-400` | `from-emerald-500 to-teal-500` |
| >= 75 | Violet (`#a78bfa`) | `text-violet-400` | `from-violet-500 to-purple-500` |
| >= 60 | Blue (`#60a5fa`) | `text-blue-400` | `from-blue-500 to-cyan-500` |
| >= 45 | Amber (`#fbbf24`) | `text-amber-400` | `from-amber-500 to-orange-500` |
| < 45 | Red (`#f87171`) | `text-red-400` | `from-red-500 to-rose-500` |

### 6.3 Input Handling

All fields default to sensible midpoint values when absent (e.g., `equipment ?? 5`, `distance ?? 1`), making the function safe for partial data objects.

---

## 7. Pages & Routes

### 7.1 `/` — Landing Page (`src/app/page.tsx`)

The home page is a `"use client"` component with multiple animated sections:

- **Animated Search Bar** — cycles through 6 placeholder strings every 2.8 seconds using `setInterval`. Input captures free text but routes to `/discover` rather than running a backend query.
- **Stats Banner** — displays static counts (total gyms, cities covered, average AI score, verified listings).
- **Featured Gyms** — filters `gyms` array with `isFeatured === true` and renders `GymCard` components.
- **Feature Highlights** — six feature cards (AI Scoring, Smart Filters, Side-by-side Comparison, AI Chat, Gym Profiles, Admin Dashboard) with Framer Motion stagger on scroll via `useInView`.
- **CTA Section** — links to `/discover` and `/ai-advisor`.

### 7.2 `/discover` — Gym Listing (`src/app/discover/page.tsx`)

Full-page gym browser with:
- `GymFilters` sidebar panel (price range, facilities, minimum rating, female-friendly, family-friendly, sort order)
- Live filtering of the `gyms` static array entirely in client memory
- Sort options: `ai_score`, `rating`, `price_low`, `price_high`, `distance`, `newest`, `most_reviewed`
- Results count and empty state handling
- `GymCard` grid with Framer Motion stagger animation

### 7.3 `/ai-advisor` — Recommendation Wizard (`src/app/ai-advisor/page.tsx`)

Multi-step wizard split into 5 steps:

| Step | Input | Component |
|---|---|---|
| 1 | Monthly budget (preset tiers or slider) | `Step1Budget` |
| 2 | Fitness goals (multi-select: weight loss, muscle gain, endurance, etc.) | `Step2Goals` |
| 3 | Gender preference and distance radius | `Step3Preferences` |
| 4 | Preferred workout times (early morning, morning, afternoon, evening, night) | `Step4Timings` |
| 5 | Required facilities (multi-select) | `Step5Facilities` |

After step 5, the wizard runs a client-side scoring function against the `gyms` array:
- Filters by `monthlyFee <= budget`
- Filters by `femaleFriendly` if `gender === "female"`
- Filters by `distance <= maxDistance`
- Scores remaining gyms by how many goals/facilities/timings they match
- Returns top 3 results with `matchScore` (0–100) and `reasons[]` array

### 7.4 `/compare` — Gym Comparison (`src/app/compare/page.tsx`)

Allows users to select up to 3 gyms from the dataset and compare them column by column:
- Selection via `useSearchParams` (gym IDs passed as query parameters)
- Comparison rows: AI Score, user rating, monthly fee, distance, cleanliness, equipment, trainer quality, safety, crowdedness, interior
- Boolean features rendered as check/cross icons (`YesNo` component)
- Score dimensions rendered as gradient progress bars (`ScoreBar` component)
- Pre-populated if gym IDs are in the URL (links from `/gym/[id]` trigger this)

### 7.5 `/gym/[id]` — Gym Detail (`src/app/gym/[id]/page.tsx`)

Dynamic route resolved from `params.id`:
- Looks up gym in `gyms` array; renders 404 if not found
- Tabs: Overview, Trainers, Classes, Membership, Reviews
- `AIScoreCard` component with circular ring and 7 sub-dimension bars (Recharts `BarChart`)
- Image gallery with main image and thumbnails
- Amenities grid with Lucide icon mapping
- Operating hours table
- Membership packages with annual savings calculator (`annualSavings()`)
- Sample reviews with verified badge and owner response support
- "Compare" and "Favourite" action buttons (client state only)
- Breadcrumb navigation

### 7.6 `/chat` — AI Chat Interface (`src/app/chat/page.tsx`)

Simulated chat assistant with:
- `Message[]` state array (role: `"user"` | `"ai"`, content, optional `gymCards`, timestamp)
- Quick suggestion chips (5 pre-set queries)
- Keyword-matching `getAIResponse()` function resolving intents: budget/cheap, female-friendly, CrossFit/HIIT, swimming, top-rated, location-specific, timing-based
- AI responses include rendered `GymCard` components inside the chat bubble
- 800ms simulated typing delay before response appears
- Auto-scroll to latest message via `useRef`

### 7.7 `/admin` — Analytics Dashboard (`src/app/admin/page.tsx`)

UI-only admin interface with sidebar navigation:
- **Overview tab:** 4 KPI cards (total visits, members, AI score average, active gyms), Recharts `LineChart` (7-day visits trend), `PieChart` (gym category distribution)
- **Gyms tab:** Table of all gyms with edit/verify/delete action buttons (non-functional — UI only)
- **Reviews tab:** Review moderation table (non-functional)
- **Settings tab:** Form fields (non-functional)

No authentication guard; the page renders for any visitor.

### 7.8 `/auth/login` and `/auth/register`

Form-only pages with email/password inputs and submit handlers that do not call any API. Serve as design prototypes for future authentication integration.

---

## 8. Component Library

### 8.1 `src/components/gym/GymCard.tsx`

Listing card displayed in grid layouts (`/discover`, `/`, `/ai-advisor` results).

**Props:** `gym: Gym`, `index?: number` (for stagger delay)

**Renders:**
- Hero image with lazy loading placeholder
- Badge row: `isNew`, `isFeatured`, `isVerified`, `femaleFriendly`, `familyFriendly`
- AI Score pill with `scoreColor()` colour coding
- Gym name, city, distance (via `formatDistance()`)
- Star rating display
- Price (via `formatPrice()`)
- Facilities preview (first 3 + overflow count)
- "View Details" link to `/gym/[id]`
- "Compare" link to `/compare?ids=...`

### 8.2 `src/components/gym/AIScoreCard.tsx`

Circular score ring component embedded in gym detail pages.

**Props:** `gym: Gym`

**Renders:**
- SVG circular ring with `stroke-dasharray` and `stroke-dashoffset` animation on mount
- Numeric score in the centre with colour coding
- 7 sub-dimension progress bars below the ring
- Tooltip on hover for each dimension (Radix `Tooltip`)

### 8.3 `src/components/gym/GymFilters.tsx`

Filter panel for the `/discover` listing page.

**Renders:**
- Price range slider (Radix `Slider`, 0–PKR 20,000)
- Minimum rating selector (1–5 stars)
- Facilities multi-select checkboxes
- Feature toggles: female-friendly, family-friendly, parking
- Sort order dropdown (Radix `Select`)
- Clear all button

### 8.4 `src/components/layout/Navbar.tsx`

Sticky top navigation with:
- GymLens logo and wordmark
- Navigation links: Discover, AI Advisor, Compare, Chat
- Auth links: Login, Register
- Hamburger menu for mobile viewports

### 8.5 `src/components/layout/Footer.tsx`

Site footer with quick links, feature list, and copyright notice.

---

## 9. Utility Functions

All utilities live in `src/lib/utils.ts`.

| Function | Signature | Description |
|---|---|---|
| `cn` | `(...inputs: ClassValue[]) => string` | Merges Tailwind classes via `clsx` + `twMerge` |
| `formatPrice` | `(price: number) => string` | PKR currency format via `Intl.NumberFormat("en-PK")` |
| `calculateAIScore` | `(gym: Partial<Gym>) => number` | Weighted AI score (0–100); see Section 6 |
| `formatCount` | `(n: number) => string` | Shortens large numbers: 1200 → `"1.2K"`, 1200000 → `"1.2M"` |
| `scoreColor` | `(score: number) => string` | Returns CSS hex colour for score range |
| `scoreTailwindClass` | `(score: number) => string` | Returns Tailwind `text-*` class for score range |
| `scoreGradientClass` | `(score: number) => string` | Returns Tailwind `from-* to-*` gradient for score range |
| `clamp` | `(value, min, max) => number` | Standard numeric clamp |
| `formatDistance` | `(km: number) => string` | `0.8` → `"800 m"`, `1.5` → `"1.5 km"` |
| `annualSavings` | `(monthly, annual) => number` | Percentage saved by choosing annual plan |
| `timeAgo` | `(date: string or Date) => string` | Relative time: `"3 days ago"` |
| `truncate` | `(str, maxLength) => string` | Truncates with `"..."` |
| `slugify` | `(text: string) => string` | URL-safe slug: `"My Gym"` → `"my-gym"` |
| `ratingStars` | `(rating: number) => ("full" or "half" or "empty")[]` | 5-element star array for rendering |

---

## 10. Type System

All shared TypeScript types are co-located in `src/types/index.ts`. There are no inline `type` definitions scattered across component files.

### Key Interfaces

| Interface | Description |
|---|---|
| `Gym` | Main gym entity (see Section 5) |
| `Trainer` | Gym staff profile |
| `Package` | Membership tier |
| `GymClass` | Scheduled class/session |
| `Amenity` | Named amenity with availability flag |
| `OpenHours` | Per-day hours object |
| `Coordinates` | `{ lat: number; lng: number }` |
| `Review` | Member review with verified flag and owner response |
| `User` | Platform user (guest / user / owner / admin roles) |
| `SearchFilters` | Filter panel state |
| `AIRecommendationInput` | Wizard input state |
| `AIRecommendationResult` | Matched gym with score and reasons |
| `Notification` | In-app notification object |
| `GymStats` | Owner dashboard analytics |

### Key Union Types

| Type | Values |
|---|---|
| `SortByOption` | `"ai_score"`, `"rating"`, `"price_low"`, `"price_high"`, `"distance"`, `"newest"`, `"most_reviewed"` |
| `GoalOption` | `"weight_loss"`, `"muscle_gain"`, `"endurance"`, `"flexibility"`, `"general_fitness"`, `"sports_performance"`, `"rehabilitation"`, `"stress_relief"` |
| `GenderOption` | `"male"`, `"female"`, `"any"` |
| `TimePreference` | `"early_morning"`, `"morning"`, `"afternoon"`, `"evening"`, `"night"` |

---

## 11. State Management

GymLens uses **local React state only**. There is no global state library (no Zustand, Redux, or Context).

Each page manages its own state via `useState` and `useReducer`. The patterns used:

| Pattern | Usage |
|---|---|
| `useState<WizardState>` | Wizard step data in `/ai-advisor` |
| `useState<Gym[]>` | Filtered gym list in `/discover` |
| `useState<Message[]>` | Chat message history in `/chat` |
| `useState<string[]>` | Selected gym IDs in `/compare` |
| `useRef<HTMLDivElement>` | Auto-scroll container in `/chat` |
| `useSearchParams` | Reading gym IDs from URL in `/compare` |

No state persists across page navigations (React state resets on route change).

---

## 12. Styling System

GymLens uses **Tailwind CSS v4** in PostCSS plugin mode (configured via `@tailwindcss/postcss` in `postcss.config.mjs`). There is no `tailwind.config.ts` file — v4 uses zero-config defaults with CSS custom properties.

### Design Tokens

| Token | Value | Usage |
|---|---|---|
| Background | `bg-gray-950` (`#030712`) | Page background |
| Primary accent | violet/purple gradient | Buttons, score rings, active states |
| Text primary | `text-white` | Headings |
| Text muted | `text-gray-400` | Subtext, metadata |
| Card background | `bg-gray-900` / `bg-gray-900/50` | Card surfaces |
| Card border | `border-gray-800` | Subtle card borders |
| Green accent | `#34d399` (emerald-400) | Excellent scores (>=90) |
| Violet accent | `#a78bfa` (violet-400) | Good scores (75–89) |
| Blue accent | `#60a5fa` (blue-400) | Average scores (60–74) |
| Amber accent | `#fbbf24` (amber-400) | Below-average scores (45–59) |
| Red accent | `#f87171` (red-400) | Poor scores (<45) |

### Global Background

The root layout applies two fixed radial glows (violet top-left, indigo bottom-right) via absolutely-positioned `<div>` elements with heavy `blur`, creating a subtle ambient light effect on all pages. A `bg-grid-pattern` utility class adds a faint grid overlay.

### Conditional Class Composition

All conditional class merging uses `cn()`:

```typescript
className={cn(
  "base-classes",
  condition && "conditional-class",
  scoreTailwindClass(gym.aiScore),
)}
```

---

## 13. Animations & Motion

All animations use **Framer Motion v12** (`framer-motion`).

### Animation Patterns Used

| Pattern | Implementation | Location |
|---|---|---|
| Fade + slide in on mount | `initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}` | Page heroes, wizard steps |
| Stagger children on scroll | `variants` with `staggerChildren: 0.1` + `useInView` | Feature cards grid, gym card grid |
| Scale on hover | `whileHover={{ scale: 1.02 }}` | Gym cards, buttons |
| Presence animations | `AnimatePresence` + `exit={{ opacity: 0 }}` | Wizard step transitions, chat messages |
| Tab content crossfade | `AnimatePresence mode="wait"` | `/gym/[id]` tab panels |
| Score ring draw-on | CSS `stroke-dashoffset` transition on mount | `AIScoreCard` |

### Scroll Triggers

Feature section cards use `useInView` from `framer-motion` with `once: true, margin: "-100px"` to trigger animations as sections scroll into the viewport.

---

## 14. Data Visualisation

**Recharts v3** is used for all charts.

### Chart Usage by Page

| Page | Chart Type | Data |
|---|---|---|
| `/gym/[id]` | `BarChart` | 7 AI sub-scores per gym |
| `/admin` | `LineChart` | 7-day site visit trend (mock) |
| `/admin` | `PieChart` | Gym category distribution (mock) |

### Custom Tooltip

All charts use a custom `Tooltip` component that styles to match the dark theme rather than using Recharts' default white-background tooltip.

### ResponsiveContainer

Every chart is wrapped in `ResponsiveContainer width="100%" height={N}` for fluid width behaviour.

---

## 15. AI Advisor Wizard

The wizard in `/ai-advisor` is implemented as a single `"use client"` page component with a `WizardState` object tracking all user inputs.

### Wizard State Shape

```typescript
interface WizardState {
  budget: number;              // max monthly PKR
  goals: string[];             // selected GoalOption values
  gender: "male" | "female" | "";
  distance: number;            // max km radius
  timings: string[];           // TimePreference values
  facilities: string[];        // required facility names
  needsTrainer: boolean | null;
  trainerGender: "male" | "female" | "any";
  experience: "beginner" | "intermediate" | "advanced" | "";
}
```

### Recommendation Algorithm

After step 5, the match function runs entirely in the browser:

```
1. Filter gyms where monthlyFee <= budget
2. If gender === "female": filter where femaleFriendly === true
3. Filter where distance <= state.distance
4. For each remaining gym:
   - matchScore starts at gym.aiScore (base quality)
   - +10 per matching goal (mapped to gym attributes)
   - +5 per matching facility
   - +5 per matching time preference
   - Clamped to 100
5. Sort by matchScore descending
6. Return top 3 results with reasons[]
```

Results are displayed as `MatchResult` objects rendered as enhanced `GymCard` wrappers with match percentage and bullet reasons.

---

## 16. Conversational AI Chat

The `/chat` page simulates a conversational assistant via keyword pattern matching. No external AI API is called.

### Intent Resolution (`getAIResponse()`)

The function converts the input to lowercase and checks for keyword groups in order:

| Keywords | Intent | Response |
|---|---|---|
| cheap / budget / affordable / low | Budget search | Top 3 by `monthlyFee` ascending |
| women / female / ladies / girl | Female-friendly | Top 3 by `femaleScore` descending, filtered by `femaleFriendly` |
| crossfit / wod / hiit | CrossFit focus | Filtered by `hasCrossfit`, sorted by `aiScore` |
| swimming / pool / swim | Pool access | Filtered by `hasSwimming`, sorted by `aiScore` |
| night / late / 10pm / 11pm | Late hours | Filtered by `openHours.sunday` containing late evening time |
| karachi / lahore / islamabad | City-specific | Filtered by `city === <city>`, sorted by `aiScore` |
| top / best / highest | Top rated | Top 3 by `aiScore` descending |
| (default) | General | Top 3 by `aiScore` |

Each response returns `{ text: string; gyms?: Gym[] }`. When `gyms` is present, `GymCard` components are rendered inline within the chat bubble.

### Typing Simulation

Before the AI response appears, a typing indicator shows for 800ms via `setTimeout`. Messages are appended to the `messages` state array and the chat container scrolls to bottom via `useEffect` on message count change.

---

## 17. Gym Comparison Engine

The `/compare` page allows selection and side-by-side comparison of up to 3 gyms.

### URL-based Selection

Gym IDs are stored in the URL as a comma-separated `ids` query parameter:

```
/compare?ids=gym-001,gym-003
```

This allows direct linking from `/gym/[id]` pages (the "Compare" button appends the current gym's ID to any existing selection).

### Comparison Dimensions

The comparison table renders 20+ rows organised into groups:

| Group | Dimensions |
|---|---|
| Overall | AI Score, User Rating, Google Rating |
| Pricing (PKR) | Monthly Fee, Annual Fee, Registration Fee, Trainer Fee |
| Quality Scores | Equipment, Cleanliness, Trainer Quality, Interior |
| Environment | Safety Score, Crowdedness (inverted display) |
| Features | Pool, Sauna, CrossFit, Yoga, Parking |
| Audience | Female Score, Family Score |

Boolean dimensions use the `YesNo` component. Numeric scores use the `ScoreBar` component (gradient fill proportional to value / max).

---

## 18. Admin Dashboard

`/admin` is a prototype analytics dashboard. It is UI-only — no data persists and no backend calls are made.

### Navigation Items

| ID | Label | Content |
|---|---|---|
| `overview` | Overview | KPI cards + Line chart + Pie chart |
| `gyms` | Gym Management | Table of all gyms with action buttons |
| `reviews` | Reviews | Review moderation table |
| `settings` | Settings | Configuration form |

### KPIs (Derived from Static Data)

| KPI | Calculation |
|---|---|
| Total Gyms | `gyms.length` |
| Average AI Score | `gyms.reduce(sum aiScore) / count` |
| Verified Gyms | `gyms.filter(g => g.isVerified).length` |
| Total Reviews | `gyms.reduce(sum reviewCount)` |

### Charts

- **LineChart:** 7 hardcoded data points (mock 7-day visit trend), 3 series: total visits, new signups, returning users.
- **PieChart:** Category distribution (strength, cardio, crossfit, yoga, martial arts) with `COLORS` array mapped to Recharts `Cell` fill.

---

## 19. Authentication Layer

GymLens includes authentication UI pages at `/auth/login` and `/auth/register` but has **no backend integration**.

- Forms accept email and password inputs with basic HTML5 validation.
- Submit handlers call `e.preventDefault()` and do nothing further.
- No session cookies, JWTs, or tokens are issued.
- The `User` interface and role system (`guest | user | owner | admin`) are defined in types for future backend integration.
- No route guards exist — all pages including `/admin` are publicly accessible.

---

## 20. SEO & Metadata

Root metadata is defined in `src/app/layout.tsx` using the Next.js 16 Metadata API.

### Static Metadata

```
metadataBase: https://gymlens.ai
title: "GymLens AI – Find Your Perfect Gym"
description: "AI-powered gym discovery platform..."
```

### OpenGraph

| Property | Value |
|---|---|
| type | `website` |
| locale | `en_PK` |
| image | `/og-image.jpg` (1200×630) |

### Twitter Card

- Type: `summary_large_image`
- Image: `/og-image.jpg`

### Viewport

- `colorScheme: "dark"`
- `themeColor: "#030712"` (both light and dark media queries)
- `maximumScale: 5`

### Robots

Full indexing enabled. `googleBot` directives allow `max-image-preview: large` and `max-snippet: -1`.

---

## 21. Performance Design

### Client-Side Only Data

All gym data is imported as a TypeScript module (`import { gyms } from "@/data/gyms"`). There are no network requests for data — the bundle ships the dataset to the client. This eliminates all API latency at the cost of bundle size.

### Font Loading

Inter is loaded via `next/font/google` with `display: "swap"`, preventing layout shift and ensuring fallback fonts render while the web font loads. Only weights 300–900 are requested.

### Component Strategies

- All pages are `"use client"` components — there are no React Server Components in the current implementation. This is appropriate for the interactive, filter-heavy nature of the UI.
- `AnimatePresence` wraps route-level content for smooth page transitions without layout shifts.
- Images use standard `<img>` tags with `loading="lazy"` attributes.

---

## 22. Accessibility

GymLens uses **Radix UI** primitives throughout, which provide WAI-ARIA compliant implementations for interactive components:

| Component | Radix Primitive | ARIA Role |
|---|---|---|
| Dropdowns | `@radix-ui/react-select` | `combobox` / `listbox` |
| Range Sliders | `@radix-ui/react-slider` | `slider` |
| Tabs | `@radix-ui/react-tabs` | `tablist` / `tab` / `tabpanel` |
| Tooltips | `@radix-ui/react-tooltip` | `tooltip` |
| Score Bars | `@radix-ui/react-progress` | `progressbar` |
| Modals | `@radix-ui/react-dialog` | `dialog` |

### Additional Considerations

- `suppressHydrationWarning` on `<html>` prevents spurious hydration errors from browser extensions modifying the DOM.
- All interactive elements use semantic HTML (`<button>`, `<a>`, `<input>`) rather than `<div onClick>`.
- Colour contrast for score text is verified against the dark background for WCAG AA compliance at each score tier.

---

## 23. Deployment

GymLens is deployed on **Railway** using the **Nixpacks** builder (zero-configuration Docker image generation).

### `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Build Process

1. Nixpacks detects Node.js via `package.json`
2. Runs `npm ci` to install dependencies
3. Runs `npm run build` — `next build`
4. Exposes the service on `$PORT` (Railway injects this automatically)

### Start Command

```bash
next start -p ${PORT:-3000}
```

The `${PORT:-3000}` syntax defaults to 3000 in local development but reads Railway's injected `$PORT` in production.

### Health Check

Railway polls `GET /` with a 100-second timeout. A 200 response confirms the deployment is healthy.

### Restart Policy

On failure: retry up to 10 times before marking the deployment as crashed.

---

## 24. Environment Configuration

GymLens **does not require any environment variables** in its current implementation. There are no API keys, database connection strings, or secret tokens.

A `.env.local` file is not needed for local development.

If backend services are added in future (real AI API, authentication provider, database), the following variable names are recommended by convention:

```env
# Future use
NEXT_PUBLIC_GYMLENS_API_URL=
OPENAI_API_KEY=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## 25. Local Development

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 20 (LTS) |
| npm | >= 10 |
| Git | Any recent version |

### Setup

```bash
# Clone the repository
git clone https://github.com/ainin123/GymLens.git
cd GymLens

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application is available at `http://localhost:3000`.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Hot-reload development server |
| Production build | `npm run build` | Optimised Next.js build |
| Production start | `npm start` | Start built application |
| Lint | `npm run lint` | ESLint with `eslint-config-next` |

### TypeScript Path Alias

The `@/*` path alias resolves to `./src/*` (configured in `tsconfig.json`). All imports use this alias:

```typescript
import { gyms } from "@/data/gyms";
import { calculateAIScore } from "@/lib/utils";
import type { Gym } from "@/types";
```

---

## 26. Known Constraints & Scope Notes

These are intentional design decisions and known limitations of the current version:

| Constraint | Detail |
|---|---|
| No real AI | All "AI" is deterministic. `calculateAIScore()` is a weighted formula. Chat is keyword matching. No LLM API is called. |
| No backend | Authentication pages are UI-only. No sessions, no JWT, no user persistence. |
| No database | All gym data is a static TypeScript array bundled with the frontend. |
| No real-time data | Gym scores, reviews, and stats do not update from external sources. |
| No map integration | `Coordinates` fields exist in the type but no map component is implemented. |
| Mock admin | Admin dashboard metrics derived from static data; no real analytics pipeline. |
| No payment processing | Membership package pricing is displayed but no booking or payment flow exists. |
| Bundle size | The full gym dataset ships in the JS bundle. Not a concern at current data volume but will need an API + pagination at scale. |
| Search bar | The search bar on the landing page is a UI element only; it does not filter the gym list. |

---

## 27. Roadmap

Planned features and integrations for future development:

- **Real AI scoring** — Replace weighted formula with OpenAI or Anthropic API calls to generate natural-language summaries and dynamic scores from scraped review data
- **Backend API** — Express or Next.js API Routes with PostgreSQL database for real gym data CRUD
- **Authentication** — Clerk or NextAuth integration for user accounts, favourites, and review submission
- **Map view** — Leaflet or Google Maps integration using existing `Coordinates` fields
- **Booking flow** — Membership purchase and class booking via Stripe
- **Review system** — Authenticated user review submission with moderation queue
- **Real admin dashboard** — Analytics pipeline using Vercel Analytics or Posthog
- **Web scraping pipeline** — Automated gym data collection from Google Maps, Yelp Pakistan, and social media
- **Mobile app** — React Native with Expo sharing the same TypeScript types and scoring engine

---

## 28. Contributing

This project follows a standard Git Flow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit using conventional commit format: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
4. Push and open a pull request against `main`

### Code Quality

- Run `npm run lint` and resolve all ESLint errors before submitting a PR
- TypeScript strict mode is enabled — all types must be explicit; `any` is disallowed without justification
- New components must be placed in the appropriate subdirectory (`gym/`, `layout/`, or a new category)
- New utility functions belong in `src/lib/utils.ts`; new types belong in `src/types/index.ts`

---

## 29. License

This project is private and proprietary. All rights reserved.

Unauthorised copying, distribution, or modification of this codebase, in whole or in part, is strictly prohibited without explicit written permission from the repository owner.

---

<div align="center">

Built with Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Recharts · Radix UI

*GymLens AI — Making the right gym choice obvious.*

</div>
