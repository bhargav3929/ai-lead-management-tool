"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Dynamic Background matching app theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="z-10 container mx-auto px-4 text-center space-y-12">

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-block mb-4">
            <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-sm font-medium backdrop-blur-sm">
              Technical Assessment Submission
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white">
            Welcome to Bhargav&apos;s <br />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Task Assignment
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A production-ready AI Lead Management System built to demonstrate <br />
            full-stack engineering skills, UI/UX design, and AI integration.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          {/* Explore Lead Form Button */}
          <Link href="/submit">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
              <Button size="lg" className="relative h-16 px-8 text-lg font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border-0 shadow-xl transition-all gap-3 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Explore Lead Form
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Link>

          {/* Explore Admin Panel Button */}
          <Link href="/login">
            <Button size="lg" variant="ghost" className="h-16 px-8 text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 gap-3 rounded-lg transition-all">
              <LayoutDashboard className="w-5 h-5" />
              Explore the Admin Panel
            </Button>
          </Link>
        </motion.div>

        {/* Footer / Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-0 w-full text-center"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">Designed by Bhargav</p>
        </motion.div>

      </div>
    </main>
  );
}
