"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const LEFT_FEATURES = [
  {
    title: "Automated Discord Moderation",
    desc: "Configure rule sets, spam limits, auto-actions, and exempt roles to keep your community safe 24/7.",
  },
  {
    title: "Web3 Identity Verification",
    desc: "Cryptographic wallet signature verification without exposing private keys or risking asset custody.",
  },
  {
    title: "NXAE Holder Tier Engine",
    desc: "Automated NFT holdings verification mapping token quantities directly to holder tiers and Discord roles.",
  },
];

const RIGHT_FEATURES = [
  {
    title: "Arena Prediction Markets",
    desc: "Engage your community with interactive prediction challenges, streak tracking, and automated settlement.",
  },
  {
    title: "Ecosystem XP & Rewards",
    desc: "Reward activity and accuracy with on-platform XP, achievements, and real-time community leaderboards.",
  },
  {
    title: "Real-time Operations & Analytics",
    desc: "Monitor bot health, server incidents, membership growth, and active moderation events in one dashboard.",
  },
];

function FeatureItem({
  title,
  desc,
  align,
  index,
  visible,
}: {
  title: string;
  desc: string;
  align: "left" | "right";
  index: number;
  visible: boolean;
}) {
  const isLeft = align === "left";

  return (
    <div
      className="flex items-start gap-4"
      style={{
        flexDirection: isLeft ? "row-reverse" : "row",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(24px)`,
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {/* Violet Dot Indicator using project color scale */}
      <div className="shrink-0 mt-1 h-8 w-8 rounded-full bg-violet-500/15 border border-violet-500/40 flex items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-violet-500 block" />
      </div>

      {/* Text */}
      <div className={isLeft ? "text-right" : "text-left"}>
        <h3
          className={`${montserrat.className} text-foreground font-extrabold text-base xl:text-lg mb-1.5 leading-tight`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const visible = true;

  return (
    <section className="relative w-full overflow-hidden bg-background py-5 md:py-20">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow behind center media — violet-600 accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px] z-0" />

      {/* ── SECTION HEADER ── */}
      <div
        className="relative z-10 text-center mb-5 px-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          className={`${montserrat.className} text-3xl mb-4 md:text-5xl xl:text-4xl font-black uppercase tracking-tight text-foreground`}
        >
          Core Capabilities
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Powering Web3 communities with an integrated operating system for automated Discord moderation, NXAE holder synchronization, predictions, and engagement analytics.
        </p>
      </div>

      {/* ── MOBILE LAYOUT (< lg) ── */}
      <div className="lg:hidden relative z-10 px-5 flex flex-col items-center gap-10">
        <div
          className="relative flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}
        >
          <Image
            src="/discord-broken.png"
            alt="NEXIS Web3 Community Operating System"
            width={450}
            height={900}
            className="relative z-10 object-contain w-[100vw] max-w-[300px]"
            priority
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (lg+) ── */}
      <div
        className="hidden lg:grid relative z-10 mx-auto max-w-[1440px] px-8 xl:px-12"
        style={{
          gridTemplateColumns: "1fr 400px 1fr",
          gap: "0 2rem",
          alignItems: "center",
        }}
      >
        {/* LEFT FEATURES */}
        <div className="flex flex-col gap-5 xl:gap-25">
          {LEFT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="left"
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* CENTER MEDIA */}
        <div
          className="relative flex justify-center items-center py-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.1s",
          }}
        >
          <Image
            src="/discord-broken.png"
            alt="NEXIS Web3 Community Operating System"
            width={400}
            height={800}
            className="relative z-10 object-contain w-[360px] xl:w-[400px]"
            priority
          />
        </div>

        {/* RIGHT FEATURES */}
        <div className="flex flex-col gap-5 xl:gap-25">
          {RIGHT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}