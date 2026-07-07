"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[120px] font-black bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent leading-none mb-4"
        >
          404
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The gym you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/discover"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            <Search className="w-4 h-4" />
            Find Gyms
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
