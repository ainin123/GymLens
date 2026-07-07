"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Discover", href: "/discover" },
  { label: "Compare", href: "/compare" },
  { label: "AI Advisor", href: "/advisor" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-gray-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20"
            : "bg-transparent backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-2">
                  <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                GymLens AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-white/10 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.label === "AI Advisor" && (
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      )}
                      {link.label}
                    </span>
                    {!isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-violet-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                className="relative group px-5 py-2 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-gray-950/98 backdrop-blur-xl border-l border-white/10 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <Link
                  href="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-2">
                    <Dumbbell className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-base font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    GymLens AI
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white border border-violet-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          {link.label === "AI Advisor" && (
                            <Sparkles className="w-4 h-4 text-violet-400" />
                          )}
                          {link.label}
                        </span>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-violet-400" : "text-gray-600"
                          )}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer CTA */}
              <div className="px-4 py-6 border-t border-white/10 space-y-3">
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-300 border border-white/10 rounded-xl hover:border-white/20 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-200"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
