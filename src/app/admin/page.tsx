"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Star,
  BarChart2,
  Zap,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Dumbbell,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Trophy,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { gyms } from "@/data/gyms";
import { cn, scoreGradientClass, scoreTailwindClass } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

/* ─── Data ────────────────────────────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "gyms", label: "Gyms", icon: Building2 },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "ai-reports", label: "AI Reports", icon: Zap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATS = [
  {
    label: "Total Users",
    value: "52,847",
    change: "+12%",
    up: true,
    icon: Users,
    gradient: "from-violet-600 to-purple-600",
    shadow: "shadow-violet-500/20",
    glow: "bg-violet-500/10",
  },
  {
    label: "Active Gyms",
    value: "486",
    change: "+8%",
    up: true,
    icon: Building2,
    gradient: "from-blue-600 to-cyan-600",
    shadow: "shadow-blue-500/20",
    glow: "bg-blue-500/10",
  },
  {
    label: "Monthly Revenue",
    value: "PKR 2.4M",
    change: "+23%",
    up: true,
    icon: TrendingUp,
    gradient: "from-emerald-600 to-teal-600",
    shadow: "shadow-emerald-500/20",
    glow: "bg-emerald-500/10",
  },
  {
    label: "AI Queries",
    value: "128,432",
    change: "+45%",
    up: true,
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
    glow: "bg-amber-500/10",
  },
];

const USER_GROWTH_DATA = [
  { day: "Mon", newUsers: 320, activeUsers: 8420 },
  { day: "Tue", newUsers: 480, activeUsers: 9100 },
  { day: "Wed", newUsers: 390, activeUsers: 8760 },
  { day: "Thu", newUsers: 610, activeUsers: 9850 },
  { day: "Fri", newUsers: 720, activeUsers: 10200 },
  { day: "Sat", newUsers: 850, activeUsers: 11400 },
  { day: "Sun", newUsers: 540, activeUsers: 9600 },
];

const CITY_DATA = [
  { name: "Karachi", value: 45, color: "#8b5cf6" },
  { name: "Lahore", value: 35, color: "#6366f1" },
  { name: "Islamabad", value: 20, color: "#a78bfa" },
];

const GYM_STATUSES = ["Active", "Active", "Pending", "Active", "Active", "Suspended"];

const RECENT_REVIEWS = [
  {
    id: 1,
    user: "Fatima K.",
    gym: "Olympus Fitness Elite",
    rating: 5,
    comment: "Absolutely world-class facility. The trainers are exceptional and the equipment is top-notch. Worth every rupee!",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Ahmed R.",
    gym: "Iron Paradise",
    rating: 4,
    comment: "Great gym for serious lifters. The free weight section is unmatched in Lahore. Can get crowded evenings.",
    time: "5 hours ago",
  },
  {
    id: 3,
    user: "Sara M.",
    gym: "Flex Zone",
    rating: 2,
    comment: "Machines are not maintained well. Two of the treadmills were broken for weeks. Needs improvement.",
    time: "1 day ago",
  },
];

const TOP_PERFORMERS = gyms
  .sort((a, b) => b.aiScore - a.aiScore)
  .slice(0, 3);

/* ─── Custom Tooltip ──────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/* ─── Pie Custom Label ────────────────────────────────────────────────────── */
function PieLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, outerRadius, percent, name } = props;
  const RADIAN = Math.PI / 180;
  const cxNum = typeof cx === "number" ? cx : 0;
  const cyNum = typeof cy === "number" ? cy : 0;
  const midAngleNum = typeof midAngle === "number" ? midAngle : 0;
  const outerRadiusNum = typeof outerRadius === "number" ? outerRadius : 0;
  const percentNum = typeof percent === "number" ? percent : 0;
  const radius = outerRadiusNum + 30;
  const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);
  return (
    <text x={x} y={y} fill="#9ca3af" textAnchor={x > cxNum ? "start" : "end"} dominantBaseline="central" fontSize={11}>
      {String(name)} {(percentNum * 100).toFixed(0)}%
    </text>
  );
}

/* ─── Status Badge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={cn("px-2.5 py-0.5 text-xs font-semibold border rounded-full", styles[status] || styles.Pending)}>
      {status}
    </span>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({
  active,
  onSelect,
  collapsed,
}: {
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-gray-950/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-5 border-b border-white/10", collapsed && "justify-center px-0")}>
        <div className="flex-shrink-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-2">
          <Dumbbell className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            GymLens AI
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white border border-violet-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-violet-400" : "")} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-violet-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={cn("px-2 py-4 border-t border-white/10", collapsed && "flex justify-center")}>
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full",
            collapsed && "justify-center w-auto"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Main Dashboard ──────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 64 : 224;

  return (
    <div className="min-h-dvh bg-gray-950 flex">
      {/* Sidebar */}
      <Sidebar active={activeNav} onSelect={setActiveNav} collapsed={sidebarCollapsed} />

      {/* Main content */}
      <main
        className="flex-1 min-h-dvh overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-gray-950/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Dashboard</h1>
              <p className="text-gray-500 text-xs mt-0.5">Welcome back, Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <div className={cn("absolute inset-0 opacity-10", stat.glow)} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-1.5">{stat.label}</p>
                      <p className="text-white text-2xl font-black leading-none">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.up ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            stat.up ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {stat.change} this month
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
                        stat.gradient,
                        stat.shadow
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="xl:col-span-2 p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-sm">User Growth</h3>
                  <p className="text-gray-500 text-xs">Last 7 days</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className="text-gray-400 text-xs">New Users</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span className="text-gray-400 text-xs">Active Users</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={USER_GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="New Users"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    name="Active Users"
                    stroke="#818cf8"
                    strokeWidth={2.5}
                    dot={{ fill: "#818cf8", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <div className="mb-4">
                <h3 className="text-white font-bold text-sm">Gyms by City</h3>
                <p className="text-gray-500 text-xs">Distribution across Pakistan</p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={CITY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {CITY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {CITY_DATA.map((city) => (
                  <div key={city.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: city.color }} />
                      <span className="text-gray-400 text-xs">{city.name}</span>
                    </div>
                    <span className="text-white text-xs font-semibold">{city.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Recent Activity Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold text-sm">Recent Gym Activity</h3>
                <p className="text-gray-500 text-xs">Latest gym registrations and status updates</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs font-medium transition-all">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Gym Name", "City", "Status", "AI Score", "Reviews", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gyms.slice(0, 6).map((gym, i) => (
                    <tr
                      key={gym.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                              scoreGradientClass(gym.aiScore)
                            )}
                          >
                            <span className="text-white text-[10px] font-black">{gym.aiScore}</span>
                          </div>
                          <div>
                            <p className="text-white text-xs font-semibold truncate max-w-[140px]">{gym.name}</p>
                            <p className="text-gray-500 text-[10px] truncate max-w-[140px]">{gym.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-gray-300 text-xs">{gym.city}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={GYM_STATUSES[i]} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-xs font-bold", scoreTailwindClass(gym.aiScore))}>
                          {gym.aiScore}/100
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-gray-300 text-xs">{gym.reviewCount.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Bottom Row: Top Performers + Recent Reviews ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-bold text-sm">Top Performers</h3>
              </div>
              <div className="space-y-3">
                {TOP_PERFORMERS.map((gym, i) => (
                  <div
                    key={gym.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      i === 0
                        ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20"
                        : "bg-white/[0.03] border-white/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0",
                        i === 0
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                          : i === 1
                          ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                          : "bg-gradient-to-br from-amber-700 to-yellow-800 text-white"
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{gym.name}</p>
                      <p className="text-gray-500 text-[10px]">{gym.city} · {gym.reviewCount.toLocaleString()} reviews</p>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br flex-shrink-0 shadow-md",
                        scoreGradientClass(gym.aiScore)
                      )}
                    >
                      <span className="text-white text-xs font-black">{gym.aiScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-violet-400" />
                <h3 className="text-white font-bold text-sm">Reviews Needing Moderation</h3>
              </div>
              <div className="space-y-3">
                {RECENT_REVIEWS.map((review) => (
                  <div
                    key={review.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white text-xs font-semibold">{review.user}</p>
                        <p className="text-gray-500 text-[10px]">
                          {review.gym} · {review.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3 h-3",
                              review.rating >= s ? "fill-amber-400 text-amber-400" : "fill-gray-700 text-gray-700"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{review.comment}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all">
                        <XCircle className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
