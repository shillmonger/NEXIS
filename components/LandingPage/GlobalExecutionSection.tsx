"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalExecutionSection() {
  return (
    <section className="relative w-full overflow-hidden pt-12 md:pt-0 pb-0">
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-6 md:mb-10 relative z-10 w-full max-w-3xl mx-auto">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 text-foreground">
            Edge Infrastructure
          </h2>

          {/* Subtitle Paragraph */}
          <p className="text-muted-foreground text-sm sm:text-sm md:text-base leading-relaxed sm:leading-7">
            Standard Web3 Discord bots rely on single-node gateways, leading to delayed role synchronization, missed moderation triggers, and unstable state management during high-traffic events.{" "}
            <span className="inline-flex items-center align-middle mx-0.5 text-[11px] md:text-xs font-semibold text-violet-300 bg-violet-950/80 border border-violet-700/60 px-2 py-0.5 rounded-md shadow-sm">
              NEXIS PLATFORM
            </span>{" "}
            operates on a high-availability, distributed gateway network. With modular provider adapters for Discord, blockchain RPCs, and state synchronization, Nexis delivers real-time moderation, instant tier updates, and reliable prediction settlement.
          </p>
        </div>

        {/* ── Map ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full overflow-hidden leading-none hidden sm:block"
        >
          {/* Mask container eliminating trailing space */}
          <div className="relative w-full h-auto max-h-[600px] flex justify-center [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            <img
              src="/map_vps.svg"
              alt="Global VPS execution network map"
              className="w-full h-auto max-h-[600px] object-contain object-top opacity-90 drop-shadow-sm"
              style={{ filter: "grayscale(0) brightness(0.90)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}