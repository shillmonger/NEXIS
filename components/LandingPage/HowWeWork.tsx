"use client";

// components/landing-page/why-platform-section.tsx
import React from "react";
import {
  Bot,
  CreditCard,
  Crown,
  ShieldCheck,
  Swords,
  Wallet,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function WhyPlatformSection() {
  const steps = [
    {
      step: "01",
      title: "Join & Link Discord",
      desc: "Create your Nexis identity and connect your Discord account to get started in our Web3 ecosystem.",
      icon: <Bot className="w-[18px] h-[18px] text-violet-500" />,
      accentColor: "border-violet-500/20 bg-violet-500/10 text-violet-500",
    },
    {
      step: "02",
      title: "Verify Crypto Wallet",
      desc: "Connect your wallet and sign a verification challenge to prove ownership without risking assets.",
      icon: <Wallet className="w-[18px] h-[18px] text-violet-600" />,
      accentColor: "border-violet-600/20 bg-violet-600/10 text-violet-600",
    },
    {
      step: "03",
      title: "Unlock Holder Tiers",
      desc: "Backend automatically verifies your NXAE holdings to assign your holder tier and sync Discord roles.",
      icon: <Crown className="w-[18px] h-[18px] text-violet-500" />,
      accentColor: "border-violet-500/20 bg-violet-500/10 text-violet-500",
    },
    {
      step: "04",
      title: "Subscribe to Bot Plan",
      desc: "Choose a subscription plan to unlock full access to our automated moderation bot infrastructure.",
      icon: <CreditCard className="w-[18px] h-[18px] text-violet-700" />,
      accentColor: "border-violet-700/20 bg-violet-700/10 text-violet-700",
    },
    {
      step: "05",
      title: "Install & Configure Bot",
      desc: "Authorize the Nexis bot into your Discord server and set up automated rules, thresholds, and logs.",
      icon: <ShieldCheck className="w-[18px] h-[18px] text-violet-800" />,
      accentColor: "border-violet-800/20 bg-violet-800/10 text-violet-800",
    },
    {
      step: "06",
      title: "Enter Arena & Compete",
      desc: "Participate in prediction markets, earn XP, climb the leaderboards, and claim ecosystem rewards.",
      icon: <Swords className="w-[18px] h-[18px] text-violet-900" />,
      accentColor: "border-violet-900/20 bg-violet-900/10 text-violet-900",
    },
  ];

  return (
    <section
      id="why-this-platform"
      className="mx-auto max-w-[1500px] px-4 lg:px-8 pb-10 lg:py-0 w-full"
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-foreground">
          How It Works
        </h2>

        <p className="text-muted-foreground max-w-lg text-base md:text-lg font-light leading-relaxed">
          A streamlined 6-step journey — from Discord integration and wallet
          verification to community moderation and Arena predictions.
        </p>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {steps.map((step, i) => (
              <CarouselItem key={i}>
                <StepCard step={step} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-6">
            <CarouselPrevious className="static translate-y-0 w-11 h-11 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-xl text-violet-500" />
            <CarouselNext className="static translate-y-0 w-11 h-11 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-xl text-violet-500" />
          </div>
        </Carousel>
      </div>

      {/* Footer rule */}
      <div className="mt-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
          Enter the Nexis Ecosystem
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>
    </section>
  );
}

// ─── Step Card Sub-component ──────────────────────────────────────────────────

type Step = {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: string;
};

function StepCard({ step }: { step: Step }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.25)] cursor-default overflow-hidden">
      {/* Top accent line — visible on hover using violet-500 */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-violet-500 to-violet-800 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Step label + Icon */}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-500">
          Step {step.step}
        </span>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors duration-200 group-hover:opacity-80 ${step.accentColor}`}
        >
          {step.icon}
        </div>
      </div>

      {/* Text */}
      <h3 className="font-bold text-[1rem] tracking-tight text-foreground mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-light">
        {step.desc}
      </p>
    </div>
  );
}