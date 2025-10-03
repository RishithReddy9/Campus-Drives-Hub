"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, Lock } from "lucide-react";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} =useSession();
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Built by Seniors. <br /> For Your Placements.
        </motion.h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Campus Drives Hub is a members-only resource created by ISTE seniors to 
          help juniors ace placements with real experiences, resources, and insights.
        </p>
        <div className="mt-8">
          <Link
            href="https://forms.gle/i1KoR178PVmUgph28"
            className="px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Become a Member
          </Link>
        </div>
      </section>

      {/* PREVIEW / FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          What You’ll Get as a Member
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: GraduationCap,
              title: "Interview Drives",
              desc: "Real experiences from seniors who cracked placements.",
            },
            {
              icon: BookOpen,
              title: "Resources & Blogs",
              desc: "Curated prep materials, notes, and guides.",
            },
            {
              icon: Calendar,
              title: "Placement Calendar",
              desc: "Important dates & rounds at a glance.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow relative"
            >
              <Icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{desc}</p>
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Lock className="w-5 h-5" /> Members Only
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Join ISTE and Unlock Access
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          This hub is available exclusively to ISTE members. Get access to drives,
          resources, and placement insights directly from your seniors.
        </p>
        <div className="mt-8">
          <Link
            href="https://forms.gle/i1KoR178PVmUgph28"
            className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Become a Member
          </Link>
        </div>
      </section>

    </main>
  );
}
