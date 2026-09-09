"use client";

import React, { useState } from "react";
import {
  BadgeCheck,
  Check,
  X,
  Zap,
  ShieldAlert,
  Bot,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Info,
  Server,
  Layers,
  Sliders,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── TYPES & DATA CONFIGURATION ─────────────────────────────────────────────

interface PlanFeature {
  text: string;
  included: boolean;
}

interface BotPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  fixedPrice: number;
  popular?: boolean;
  recommended?: boolean;
  current?: boolean;
  serverLimit: string;
  moderationFeatures: string;
  usageLimits: string;
  durationText: string;
  features: PlanFeature[];
}

const MOCK_PLANS: BotPlan[] = [
  {
    id: "starter",
    name: "Starter Bot",
    tagline: "Essential automation for growing micro-communities.",
    monthlyPrice: 9,
    fixedPrice: 90,
    current: true,
    serverLimit: "1 Discord Server",
    moderationFeatures: "Basic Auto-mod & Spam Filter",
    usageLimits: "10,000 Bot Commands / mo",
    durationText: "Monthly or 1 Year Access",
    features: [
      { text: "1 Discord Server Connection", included: true },
      { text: "Standard Auto-Moderation", included: true },
      { text: "Basic Welcome & Logging System", included: true },
      { text: "Custom Prefix Support", included: true },
      { text: "Advanced AI Chat Engine", included: false },
      { text: "Custom Branded Bot Persona", included: false },
      { text: "Dedicated VIP Host Node", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro Sentinel",
    tagline: "High-performance bot features for thriving public hubs.",
    monthlyPrice: 29,
    fixedPrice: 280,
    recommended: true,
    serverLimit: "Up to 5 Discord Servers",
    moderationFeatures: "AI Anti-Raid, Image Recognition & Custom Rules",
    usageLimits: "250,000 Bot Commands / mo",
    durationText: "Monthly or 1 Year Access",
    features: [
      { text: "Up to 5 Discord Servers", included: true },
      { text: "AI-Powered Anti-Raid & Spam Filtering", included: true },
      { text: "Custom Bot Avatar & Name", included: true },
      { text: "99.9% Uptime SLA Guarantees", included: true },
      { text: "Custom Reaction Roles & Tickets", included: true },
      { text: "Analytics & Member Growth Heatmaps", included: true },
      { text: "Dedicated VIP Host Node", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Core",
    tagline: "Unrestricted power & custom nodes for mega networks.",
    monthlyPrice: 79,
    fixedPrice: 750,
    serverLimit: "Unlimited Servers",
    moderationFeatures: "Enterprise Threat Guard & Live Mod Logs",
    usageLimits: "Unlimited Bot Commands",
    durationText: "Monthly or 1 Year Access",
    features: [
      { text: "Unlimited Discord Server Connections", included: true },
      { text: "Enterprise AI Security & Anti-Spam", included: true },
      { text: "Fully White-labeled Bot Identity", included: true },
      { text: "Custom API & Webhook Integrations", included: true },
      { text: "Dedicated Priority Hosting Node", included: true },
      { text: "24/7 Priority Discord Support", included: true },
      { text: "Custom Feature Development On-Demand", included: true },
    ],
  },
];

const FAQS = [
  {
    q: "Can I upgrade or downgrade my bot plan at any time?",
    a: "Yes! You can instantly scale your subscription up or down from your dashboard. Pro-rated credits will be automatically applied to your account.",
  },
  {
    q: "How does server limiting work for Discord bots?",
    a: "Each plan authorizes your custom bot token to join a specified max count of Discord guilds. Moving to a higher tier expands your server quota immediately.",
  },
  {
    q: "What happens if I reach my monthly command limit?",
    a: "Your bot will remain online, but non-essential interactive commands may be throttled until the billing reset or until you upgrade to a higher quota.",
  },
  {
    q: "Do you offer custom bots tailored specifically for my server?",
    a: "Yes! Enterprise Core users get direct access to our development team to request custom modules and unique integrations.",
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function BotPricingPage() {
  const [plans] = useState<BotPlan[]>(MOCK_PLANS);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "fixed">("monthly");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<BotPlan | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">
        
        {/* Page Title & Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Bot Subscription Plans
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
              Scale your Discord server moderation, engagement, and custom AI tools with reliable tier options built for communities of any size.
            </p>
          </div>

          {/* Billing Toggle Control */}
          {plans.length > 0 && (
            <div className="flex items-center self-start md:self-auto bg-muted/40 p-1.5 rounded-2xl border border-border shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("fixed")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "fixed"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Fixed / Annual
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                  SAVE 20%
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State Display */}
        {plans.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">No Subscription Plans Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              There are currently no bot subscription tiers available. Please check back later or contact platform support.
            </p>
          </div>
        ) : (
          <>
            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.fixedPrice;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl bg-card border transition-all duration-300 flex flex-col justify-between p-6 shadow-lg hover:shadow-xl ${
                      plan.recommended
                        ? "border-violet-600 ring-2 ring-violet-600/20 scale-[1.02] md:scale-105"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="absolute -top-3 left-6 flex items-center gap-2">
                      {plan.recommended && (
                        <span className="bg-violet-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Recommended Tier
                        </span>
                      )}
                      {plan.current && (
                        <span className="bg-slate-800 dark:bg-slate-200 text-slate-100 dark:text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          Current Plan
                        </span>
                      )}
                    </div>

                    <div>
                      {/* Card Header */}
                      <div className="mt-2 mb-6">
                        <h3 className="text-xl font-black uppercase tracking-tight">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Pricing Tag */}
                      <div className="mb-6 pb-6 border-b border-border/60">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black tracking-tight">${price}</span>
                          <span className="text-xs font-bold text-muted-foreground uppercase">
                            / {billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mt-1">
                          {plan.durationText}
                        </span>
                      </div>

                      {/* High Level Limits */}
                      <div className="space-y-2 mb-6 bg-muted/30 p-3.5 rounded-xl border border-border/60 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <Server className="w-3.5 h-3.5 text-violet-600" />
                          <span>{plan.serverLimit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-violet-600" />
                          <span className="truncate">{plan.moderationFeatures}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-violet-600" />
                          <span>{plan.usageLimits}</span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Included Specifications:
                        </p>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                            )}
                            <span className={feature.included ? "font-medium" : "text-muted-foreground line-through"}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="space-y-2 pt-4 border-t border-border/60">
                      {plan.current ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-3 rounded-xl font-bold text-xs bg-muted text-muted-foreground cursor-not-allowed uppercase tracking-wider"
                        >
                          Active Subscription
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-full cursor-pointer bg-violet-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 active:scale-[0.99] transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5"
                        >
                          {plan.recommended ? "Upgrade Now" : "Subscribe Tier"} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedPlanDetails(plan)}
                        className="w-full cursor-pointer py-2.5 rounded-xl font-bold text-xs bg-muted/40 hover:bg-muted border border-border/80 text-foreground transition-all flex items-center justify-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5 text-muted-foreground" /> View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Comparison Table */}
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-black uppercase tracking-tight">Plan Features Comparison</h2>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-[300px] font-black uppercase text-xs">Bot Capability</TableHead>
                      {plans.map((p) => (
                        <TableHead key={p.id} className="text-center font-black uppercase text-xs">
                          {p.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-border/60">
                      <TableCell className="font-bold text-xs">Discord Guild Limits</TableCell>
                      {plans.map((p) => (
                        <TableCell key={p.id} className="text-center text-xs font-semibold">
                          {p.serverLimit}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/60">
                      <TableCell className="font-bold text-xs">Moderation Complexity</TableCell>
                      {plans.map((p) => (
                        <TableCell key={p.id} className="text-center text-xs text-muted-foreground">
                          {p.moderationFeatures}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/60">
                      <TableCell className="font-bold text-xs">Monthly Command Cap</TableCell>
                      {plans.map((p) => (
                        <TableCell key={p.id} className="text-center text-xs font-semibold">
                          {p.usageLimits}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/60">
                      <TableCell className="font-bold text-xs">White-label Persona Customization</TableCell>
                      {plans.map((p) => (
                        <TableCell key={p.id} className="text-center">
                          {p.id !== "starter" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/60">
                      <TableCell className="font-bold text-xs">Dedicated Priority Node</TableCell>
                      {plans.map((p) => (
                        <TableCell key={p.id} className="text-center">
                          {p.id === "enterprise" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Frequently Asked Questions (FAQ) Section */}
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-black uppercase tracking-tight">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-border/80 rounded-xl overflow-hidden transition-colors bg-muted/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-sm cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-4 h-4 text-violet-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === index && (
                      <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 bg-background/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* View Details Modal */}
        <Dialog open={!!selectedPlanDetails} onOpenChange={() => setSelectedPlanDetails(null)}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-violet-600" />
                <DialogTitle className="font-black uppercase text-lg">
                  {selectedPlanDetails?.name} Details
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {selectedPlanDetails?.tagline}
              </DialogDescription>
            </DialogHeader>

            {selectedPlanDetails && (
              <div className="space-y-4 py-3">
                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-bold uppercase">Monthly Price</span>
                    <span className="font-black">${selectedPlanDetails.monthlyPrice}/mo</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-bold uppercase">Fixed Annual Price</span>
                    <span className="font-black">${selectedPlanDetails.fixedPrice}/yr</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-bold uppercase">Guild Limit</span>
                    <span className="font-black text-violet-600">{selectedPlanDetails.serverLimit}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Included Capabilities
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    {selectedPlanDetails.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                        )}
                        <span className={f.included ? "font-medium" : "text-muted-foreground line-through"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}