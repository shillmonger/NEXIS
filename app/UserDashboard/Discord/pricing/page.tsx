"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Zap,
  ShieldAlert,
  Bot,
  Sparkles,
  ArrowRight,
  Info,
  Server,
  FolderOpen,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── TYPES & DATA CONFIGURATION ─────────────────────────────────────────────

interface BotPlan {
  amount: number;
  type: string;
  period: string;
  description: string;
  accountSize: string;
  duration: string;
  serverLimit: string;
  moderationFeatures: string;
  targetLabel: string;
  popular: boolean;
  isFree: boolean;
  planFeatures: string[];
  note: string;
}

const MOCK_PLANS: BotPlan[] = [
  {
    amount: 30,
    type: "Basic",
    period: "per month",
    description: "Essential features for getting started with community management and market insights.",
    accountSize: "Basic Access",
    duration: "1 Month",
    serverLimit: "Standard",
    moderationFeatures: "Basic",
    targetLabel: "Starter",
    popular: false,
    isFree: false,
    planFeatures: [
      "Basic moderation",
      "Basic analytics",
      "Market tracking",
    ],
    note: "The Basic plan provides essential tools for community management and market tracking, perfect for getting started.",
  },
  {
    amount: 70,
    type: "Growth",
    period: "per month",
    description: "Advanced features for growing communities with enhanced engagement tools.",
    accountSize: "Enhanced Access",
    duration: "1 Month",
    serverLimit: "Advanced",
    moderationFeatures: "Growth",
    targetLabel: "Scalable",
    popular: true,
    isFree: false,
    planFeatures: [
      "Moderation",
      "Wallet / NFT verification",
      "XP, leaderboards",
      "Campaigns, referrals",
      "Market tracking",
    ],
    note: "The Growth plan includes engagement features like XP systems, leaderboards, and campaign management to boost community participation.",
  },
  {
    amount: 100,
    type: "Pro",
    period: "per month",
    description: "Professional-grade features with prediction engines and advanced analytics.",
    accountSize: "Full Access",
    duration: "1 Month",
    serverLimit: "Pro",
    moderationFeatures: "Professional",
    targetLabel: "Premium",
    popular: false,
    isFree: false,
    planFeatures: [
      "Everything in Growth",
      "Prediction engine",
      "Advanced analytics",
      "Custom competitions",
      "Advanced market features",
    ],
    note: "The Pro plan includes powerful prediction engines and advanced analytics for data-driven decision making and competitive features.",
  },
  {
    amount: 500,
    type: "Enterprise",
    period: "per month",
    description: "Full-scale solution with custom integrations, dedicated infrastructure, and API access.",
    accountSize: "Unlimited Access",
    duration: "1 Month",
    serverLimit: "Enterprise",
    moderationFeatures: "Unlimited",
    targetLabel: "Enterprise",
    popular: false,
    isFree: false,
    planFeatures: [
      "Custom integrations",
      "Custom branding",
      "Dedicated infrastructure",
      "API access",
      "Full dashboard access",
      "Advanced support & development",
    ],
    note: "The Enterprise plan provides custom solutions with dedicated infrastructure, full API access, and priority development support for large-scale operations.",
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function BotPricingPage() {
  const router = useRouter();
  const [plans] = useState<BotPlan[]>(MOCK_PLANS);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<BotPlan | null>(null);

  const commonFeatures = [
    "24/7 Customer Support",
    "Cancel Anytime",
    "Upgrade to Another Plan Anytime",
  ];

  const comparisonData = [
    {
      metric: "Market Insights",
      manual: "Manual research, delayed updates",
      automated: "Real-time tracking with advanced analytics",
    },
    {
      metric: "Community Engagement",
      manual: "Manual campaigns, limited reach",
      automated: "Automated referrals, XP systems, leaderboards",
    },
    {
      metric: "Security & Verification",
      manual: "Manual checks, prone to errors",
      automated: "Automated NFT/wallet verification systems",
    },
    {
      metric: "Predictive Analytics",
      manual: "No prediction capabilities",
      automated: "AI-powered prediction engine for market trends",
    },
    {
      metric: "Support & Integration",
      manual: "Limited support hours",
      automated: "24/7 support with custom API integrations",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Hero Header */}
      <section className="max-w-[1200px] mx-auto pt-10 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest mb-2 text-violet-600 dark:text-violet-400">
          <span>Discord Bot Plans</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          Choose Your <span className="text-violet-600 dark:text-violet-400">Bot Plan</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed mx-auto font-normal">
          Scale from Starter to Enterprise with powerful Discord bot features including moderation, analytics,
          AI-powered protection, custom integrations, and dedicated infrastructure. Every plan includes 24/7 customer support.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="max-w-[1400px] pb-10 lg:pb-5 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`flex flex-col cursor-pointer justify-between rounded-3xl transition-all duration-300 overflow-hidden relative border bg-card text-card-foreground p-6
                ${
                  plan.popular
                    ? "lg:scale-[1.04] z-10 border-violet-500/60 shadow-2xl shadow-violet-500/10 ring-1 ring-violet-500/40"
                    : "border-border shadow-sm opacity-95 hover:opacity-100"
                }
                hover:border-violet-500/40 group
              `}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-foreground">
                    {plan.type}
                  </span>

                  {plan.popular && (
                    <div className="bg-violet-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                      Popular
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    ${plan.amount}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{plan.period}</p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[40px]">
                  {plan.description}
                </p>

                {/* CTA */}
                <button
                  onClick={() => setSelectedPlanDetails(plan)}
                  className={`w-full cursor-pointer text-sm py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 font-bold
                    ${
                      plan.popular
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
                        : "bg-foreground text-background hover:opacity-90"
                    }
                  `}
                >
                  <span>Choose this plan</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-grow flex flex-col justify-between gap-5 mt-6">
                {/* Stats row */}
                <div className="space-y-3 pt-5 border-t border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Server Limit</span>
                    <span className="text-foreground font-semibold">{plan.accountSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Plan Tier</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-md text-[11px] bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      {plan.targetLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Features &middot; Support</span>
                    <span className="text-foreground font-semibold">
                      {plan.serverLimit} &middot; {plan.moderationFeatures}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 border-t border-border pt-4">
                  {[...commonFeatures, ...plan.planFeatures].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 stroke-[2.5] shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground font-normal leading-tight">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Important note */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-violet-600 dark:text-violet-400" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                    {plan.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* View Details Modal */}
      <Dialog open={!!selectedPlanDetails} onOpenChange={() => setSelectedPlanDetails(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border p-5 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-600" />
              <DialogTitle className="font-black uppercase text-lg">
                {selectedPlanDetails?.type} Details
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {selectedPlanDetails?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedPlanDetails && (
            <div className="space-y-4 py-3">
              <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-bold uppercase">Monthly Price</span>
                  <span className="font-black">${selectedPlanDetails.amount}/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-bold uppercase">Server Limit</span>
                  <span className="font-black text-violet-600">{selectedPlanDetails.accountSize}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-bold uppercase">Duration</span>
                  <span className="font-black">{selectedPlanDetails.duration}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Included Capabilities
                </p>
                <ul className="space-y-1.5 text-xs">
                  {[...commonFeatures, ...selectedPlanDetails.planFeatures].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanDetails(null);
                  const planId = selectedPlanDetails.type.toLowerCase().replace(/\s+/g, '-');
                  router.push(
                    `/UserDashboard/Discord/pricing/${planId}?plan=${encodeURIComponent(selectedPlanDetails.type)}&amount=${selectedPlanDetails.amount}&billing=${encodeURIComponent(selectedPlanDetails.period)}`
                  );
                }}
                className="w-full cursor-pointer bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
              > Make Payment
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}