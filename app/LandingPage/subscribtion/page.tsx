"use client";

import { useRouter } from "next/navigation";
import { Check, X, Info, Sparkles, Infinity as InfinityIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SubscriptionPage() {
  const router = useRouter();

  const commonFeatures = [
    "24/7 Customer Support",
    "Cancel Anytime",
    "Upgrade to Another Plan Anytime",
  ];

  const accessPlans = [
    {
      amount: 0,
      type: "Free",
      period: "No expiry",
      description: "Test bot deployment and custom commands on a staging server, risk-free.",
      accountSize: "1 Server",
      duration: "Unlimited",
      lotSize: "50 MB",
      maxTrades: 3,
      targetLabel: "Testing",
      popular: false,
      isFree: true,
      planFeatures: [
        "Full dashboard access",
        "Basic moderation & commands",
        "Max RAM: 50 MB",
        "Up to 3 Custom Commands",
      ],
      note:
        "The Free plan is designed for testing bot features and staging your Discord integration with zero downtime or hosting costs for as long as you like.",
    },
    {
      amount: 10,
      type: "Starter",
      period: "per 5 days",
      description: "Short-term automated bot hosting for small growing communities.",
      accountSize: "Up to 3 Servers",
      duration: "5 Days",
      lotSize: "256 MB",
      maxTrades: 15,
      targetLabel: "99.9% Uptime",
      popular: false,
      isFree: false,
      planFeatures: [
        "Maximum 15 Active Integrations",
        "24/7 Automated Bot Hosting",
        "RAM Allocation: 256 MB",
        "Duration: 5 Days",
      ],
      note:
        "The bot manager executes scheduled tasks and event listeners continuously. System capacity prioritizes uptime and reaction times over heavy background jobs.",
    },
    {
      amount: 20,
      type: "Pro",
      period: "per 14 days",
      description: "Our most popular plan for active communities needing automated moderation.",
      accountSize: "Up to 10 Servers",
      duration: "14 Days",
      lotSize: "512 MB",
      maxTrades: 50,
      targetLabel: "Priority Host",
      popular: true,
      isFree: false,
      planFeatures: [
        "Maximum 50 Active Integrations",
        "Automated Auto-Role & Embeds",
        "RAM Allocation: 512 MB",
        "Duration: 14 Days",
      ],
      note:
        "High-frequency events like auto-moderation and welcoming users are processed in real-time. Execution rate limits are managed automatically to avoid Discord API blocks.",
    },
    {
      amount: 50,
      type: "Enterprise",
      period: "per month",
      description: "Full-scale bot management for massive Discord networks with no limits.",
      accountSize: "Unlimited Servers",
      duration: "1 Month",
      lotSize: "2 GB",
      maxTrades: 200,
      targetLabel: "Uncapped",
      popular: false,
      isFree: false,
      planFeatures: [
        "Maximum 200 Active Integrations",
        "Custom Webhooks & API Access",
        "RAM Allocation: 2 GB",
        "Duration: 1 Month",
      ],
      note:
        "Unlike short-term plans, Enterprise grants unrestricted bandwidth, priority thread handling, custom white-label bot instances, and full database persistence.",
    },
  ];

  const comparisonData = [
    {
      metric: "Command Execution",
      manual: "Slow, manual staff responses",
      automated: "Instant, sub-millisecond bot response",
    },
    {
      metric: "Moderation",
      manual: "Subjective, prone to fatigue/bias",
      automated: "Strict, continuous rule enforcement",
    },
    {
      metric: "Consistency",
      manual: "Varies depending on online moderators",
      automated: "Always active with automated triggers",
    },
    {
      metric: "Availability",
      manual: "Active only when staff members are online",
      automated: "Runs 24/7/365 without interruption",
    },
    {
      metric: "Setup & Maintenance",
      manual: "Complex setup & custom script debugging",
      automated: "1-Click deployment with ready-made modules",
    },
  ];

  const handleSelectPlan = (plan: string, amount: number) => {
    if (plan === "Free") {
      router.push("/auth-page/register");
      return;
    }
    router.push("/auth-page/login");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground font-sans pb-15">
      {/* Hero Header */}
      <section className="max-w-[1200px] mx-auto px-4 lg:px-10 pt-15 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest mb-2 text-violet-600 dark:text-violet-400">
          {/* <Sparkles className="w-3.5 h-3.5" /> */}
          <span>Discord Bot Management Plans</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          Choose Your <span className="text-violet-600 dark:text-violet-400">Automation Scale</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed mx-auto font-normal">
          Start free on a testing server, then scale into Starter, Pro, or Enterprise access as your
          community grows. Every paid plan includes automated 24/7 uptime, ticket management,
          auto-moderation, and full Discord API integration.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-10 lg:pb-15 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {accessPlans.map((plan, i) => (
            <Card
              key={i}
              className={`flex flex-col cursor-pointer justify-between rounded-3xl transition-all duration-300 overflow-hidden relative border bg-card text-card-foreground p-6
                ${
                  plan.popular
                    ? "lg:scale-[1.04] z-10 border-violet-500/60 shadow-2xl shadow-violet-500/10 ring-1 ring-violet-500/40"
                    : plan.isFree
                    ? "border-dashed border-border shadow-sm opacity-95 hover:opacity-100"
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
                  {plan.isFree && (
                    <div className="bg-muted text-muted-foreground text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
                      Demo
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
                  onClick={() => handleSelectPlan(plan.type, plan.amount)}
                  className={`w-full cursor-pointer text-sm py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 font-bold
                    ${
                      plan.popular
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
                        : "bg-foreground text-background hover:opacity-90"
                    }
                  `}
                >
                  {plan.isFree ? (
                    <>
                      {/* <InfinityIcon className="w-4 h-4" /> */}
                      <span>Start Free Demo</span>
                    </>
                  ) : (
                    <span>Choose this plan</span>
                  )}
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-grow flex flex-col justify-between gap-5 mt-6">
                {/* Stats row */}
                <div className="space-y-3 pt-5 border-t border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Server Limits</span>
                    <span className="text-foreground font-semibold">{plan.accountSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Performance</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-md text-[11px] bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      {plan.targetLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">RAM &middot; Max Webhooks</span>
                    <span className="text-foreground font-semibold">
                      {plan.lotSize} &middot; {plan.maxTrades}
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
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Section (Automated vs Manual) */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-6 w-full">
        <div className="max-w-3xl mx-auto pb-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Automated Bot vs Manual Moderation
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mx-auto font-normal">
            Choose a plan and let our automated bot management systems protect and run your community.
            Logs and analytics updated continuously every 24 hours.
          </p>
        </div>

        {/* Flat Modern Container Table */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-3 border-b border-border bg-muted p-5 text-xs font-bold uppercase tracking-wider">
            <div className="text-foreground">Metric</div>
            <div className="text-rose-500">Manual Management</div>
            <div className="text-emerald-500">Automated Bot Management</div>
          </div>

          {/* Table Body rows */}
          <div className="divide-y divide-border">
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 p-5 gap-3 md:gap-4 items-center hover:bg-muted/40 transition-colors"
              >
                {/* Metric Label */}
                <div className="text-sm font-semibold text-foreground">
                  {row.metric}
                </div>

                {/* Manual Column */}
                <div className="flex items-start gap-2.5 md:pr-4">
                  <span className="md:hidden text-xs font-semibold text-rose-500 block mb-1">
                    Manual:
                  </span>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 stroke-[2.5] text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-muted-foreground font-normal leading-relaxed">
                      {row.manual}
                    </span>
                  </div>
                </div>

                {/* Automated Column */}
                <div className="flex items-start gap-2.5">
                  <span className="md:hidden text-xs font-semibold text-emerald-500 block mb-1">
                    Automated:
                  </span>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 stroke-[2.5] text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-foreground font-medium leading-relaxed">
                      {row.automated}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}