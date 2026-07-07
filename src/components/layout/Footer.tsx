"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, AtSign, MessageCircle, Globe, Play, Send, Smartphone, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Discover", href: "/discover" },
    { label: "Compare", href: "/compare" },
    { label: "AI Advisor", href: "/advisor" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: AtSign,         label: "Twitter",   href: "https://twitter.com" },
  { icon: MessageCircle, label: "Instagram",  href: "https://instagram.com" },
  { icon: Globe,         label: "LinkedIn",   href: "https://linkedin.com" },
  { icon: Play,          label: "YouTube",    href: "https://youtube.com" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-gray-950 overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-violet-600/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-2.5">
                  <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                GymLens AI
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Pakistan&apos;s first AI-powered gym discovery platform. Find your perfect gym with intelligent recommendations tailored to your goals.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-gray-500 mt-0.5">Gyms Listed</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-gray-500 mt-0.5">Members</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-xs text-gray-500 mt-0.5">Cities</div>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                        <ArrowRight className="w-3 h-3 text-violet-400 flex-shrink-0" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download column */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Download
            </h3>
            <div className="space-y-3">
              {/* App Store placeholder */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <Smartphone className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 leading-none mb-0.5">Download on the</div>
                  <div className="text-sm font-semibold text-white leading-none">App Store</div>
                </div>
              </a>

              {/* Play Store placeholder */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <Smartphone className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 leading-none mb-0.5">Get it on</div>
                  <div className="text-sm font-semibold text-white leading-none">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="py-8 border-t border-white/10">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white mb-1">
                Stay in the loop
              </h3>
              <p className="text-sm text-gray-400">
                Get AI insights, new gym openings, and exclusive deals delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              {subscribed ? (
                <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-400">You&apos;re subscribed!</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 sm:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GymLens AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            Built with
            <span className="text-red-400 mx-1">&#x2665;</span>
            for Pakistan&apos;s fitness community
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
