"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["700", "800"],
});

const ROTATE_MS = 5000;

const CARDS = [
  { id: "moderation", name: "Auto-Moderation Bot", image: "/nft1.jpeg", bid: "24/7 Active", time: "99.9% Uptime" },
  { id: "verification", name: "Wallet Verification", image: "/nft2.jpeg", bid: "Secure", time: "NXAE Holders" },
  { id: "arena", name: "Arena Predictions", image: "/nft3.jpeg", bid: "XP Rewards", time: "Live Leaderboards" },
  { id: "analytics", name: "Real-time Analytics", image: "/nft4.jpeg", bid: "Dashboard", time: "Bot Health" },
  // { id: "fort", name: "Fort Protection", image: "/nexis.jpeg", bid: "Secure Vault", time: "24/7 Guard" },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CARDS.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  const front = CARDS[index];
  const peekLeft = CARDS[(index + 1) % CARDS.length];
  const peekRight = CARDS[(index + 2) % CARDS.length];
  const peekTopRight = CARDS[(index + 3) % CARDS.length];

  return (
    <section className="relative w-full overflow-hidden py-16 transition-colors duration-500 lg:py-10">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-5 lg:gap-15 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* ================= LEFT: COPY ================= */}
        <div className="lg:col-span-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${sora.className} text-[2.75rem] leading-[1.12] font-extrabold text-zinc-900 dark:text-white sm:text-5xl lg:text-[3.5rem]`}
          >
            Automate Your Discord Community with{" "}
            <span className="bg-violet-600 bg-clip-text text-transparent">
              NEXIS.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400"
          >
            Deploy automated moderation bots, verify NXAE holders, and engage your community with prediction markets. The complete Web3 Discord operating system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center gap-8"
          >
            <Link href="/auth-page/register">
              <button className="rounded-full bg-violet-700 px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-95">
                Get Started Free
              </button>
            </Link>

            <Link
              href="/LandingPage/subscribtion"
              className="group flex items-center gap-3 text-sm font-semibold text-zinc-900 dark:text-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 transition-colors hover:border-violet-500 hover:text-violet-500 dark:border-white/30">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              View Subscription Plans
            </Link>
          </motion.div>

          {/* progress dots for the rotating stack */}
          <div className="mt-12 flex items-center gap-2">
            {CARDS.map((c, i) => (
              <span
                key={c.id}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-6 bg-violet-500"
                    : "w-1.5 bg-zinc-300 dark:bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>


        {/* ================= RIGHT: ROTATING CARD STACK ================= */}
        <div className="relative flex min-h-[450px] items-center justify-center lg:col-span-6 lg:min-h-[500px]">
          {/* ambient glow, violet to tie in with the rest of the app */}
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-600/25" />

          {/* orbit ring */}
          <svg
            className="pointer-events-none absolute w-[110%] max-w-[560px]"
            viewBox="0 0 500 260"
            fill="none"
          >
            <ellipse
              cx="250"
              cy="130"
              rx="235"
              ry="78"
              stroke="url(#ring-gradient)"
              strokeWidth="1.5"
              transform="rotate(-8 250 130)"
            />
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                <stop offset="50%" stopColor="#DFFF3D" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative h-[380px] w-[300px] sm:h-[420px] sm:w-[340px]">
            {/* BACK-LEFT peek — next up */}
            <motion.div
              key={`left-${peekLeft.id}`}
              initial={{ opacity: 0, x: -10, rotate: -22 }}
              animate={{ opacity: 1, x: 0, rotate: -16 }}
              transition={{ duration: 0.6 }}
              className="absolute left-[-38px] top-6 z-10 w-[150px] rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-2xl dark:border-white/10 dark:bg-[#141414]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={peekLeft.image} alt={peekLeft.name} fill className="object-cover" />
              </div>
              <p className="mt-2 truncate text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                {peekLeft.name}
              </p>
              <p className="mt-1 text-[9px] text-zinc-500 dark:text-zinc-400">{peekLeft.bid}</p>
            </motion.div>

            {/* BACK-RIGHT peek — up after that */}
            <motion.div
              key={`right-${peekRight.id}`}
              initial={{ opacity: 0, x: 10, y: 5, rotate: 20 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 12 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-[-28px] right-[-30px] z-10 w-[190px] rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#141414]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={peekRight.image} alt={peekRight.name} fill className="object-cover" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-zinc-500">Status</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{peekRight.bid}</p>
                </div>
                <button className="rounded-lg bg-[#DFFF3D] px-3 py-1.5 text-[10px] font-bold text-black">
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* BACK-TOP-RIGHT peek — FORT */}
            <motion.div
              key={`topright-${peekTopRight.id}`}
              initial={{ opacity: 0, x: 10, y: -10, rotate: -15 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
              transition={{ duration: 0.6 }}
              className="absolute top-[-20px] right-[-25px] z-10 w-[140px] rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#141414]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={peekTopRight.image} alt={peekTopRight.name} fill className="object-cover" />
              </div>
              <p className="mt-2 truncate text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                {peekTopRight.name}
              </p>
              <p className="mt-1 text-[9px] text-zinc-500 dark:text-zinc-400">{peekTopRight.bid}</p>
            </motion.div>

            {/* FRONT/FEATURED card — swaps every 5s */}
            <div className="absolute inset-x-6 top-0 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={front.id}
                  initial={{ opacity: 0, y: 28, scale: 0.94, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96, rotate: 3 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-2xl dark:border-white/10 dark:bg-[#141414]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={front.image} alt={front.name} fill className="object-cover" />
                    <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-[#DFFF3D] backdrop-blur-sm">
                      {front.time}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
                    {front.name}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                        Feature
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {front.bid}
                      </p>
                    </div>
                    <button className="rounded-lg bg-[#DFFF3D] px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95">
                      Deploy Now
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}