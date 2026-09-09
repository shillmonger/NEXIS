"use client";

import React, { useState } from "react";
import {
  BadgeQuestionMark,
  CheckCircle2,
  ShieldCheck,
  Server,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Lock,
  AlertTriangle,
  Bot,
  Zap,
  Check,
  Sparkles,
  Settings,
  X,
  HelpCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type InstallationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface ServerOption {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  alreadyInstalled: boolean;
}

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  granted: boolean;
}

interface PlanOption {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const PLANS: PlanOption[] = [
  {
    id: "starter",
    name: "Starter Guard",
    price: "$0",
    billingPeriod: "Free Forever",
    features: [
      "Up to 1 Server",
      "Standard AutoMod Filters",
      "Basic Moderation Logs",
      "Community Support",
    ],
  },
  {
    id: "pro",
    name: "Pro Shield",
    price: "$19",
    billingPeriod: "per month",
    popular: true,
    features: [
      "Up to 5 Servers",
      "Advanced Anti-Raid & Spam Protection",
      "Real-time Threat Intelligence API",
      "Custom Bot Branding & Commands",
      "24/7 Priority Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Core",
    price: "$49",
    billingPeriod: "per month",
    features: [
      "Unlimited Servers",
      "Dedicated High-Speed Bot Instance",
      "Full API & Webhook Integrations",
      "Custom SLA & Audit Exporting",
      "Dedicated Account Manager",
    ],
  },
];

const MOCK_SERVERS: ServerOption[] = [
  {
    id: "982301928374810293",
    name: "AMD Investor Hub",
    icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    memberCount: 14200,
    alreadyInstalled: false,
  },
  {
    id: "847192038102938471",
    name: "Alpha Signal Network",
    icon: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&auto=format&fit=crop&q=60",
    memberCount: 5800,
    alreadyInstalled: false,
  },
  {
    id: "129038471920384712",
    name: "Crypto Traders Lounge",
    icon: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=100&auto=format&fit=crop&q=60",
    memberCount: 28900,
    alreadyInstalled: true,
  },
];

const INITIAL_PERMISSIONS: PermissionItem[] = [
  {
    id: "perm_admin",
    name: "Administrator",
    description: "Grants full control over server settings and moderation tools.",
    required: true,
    granted: true,
  },
  {
    id: "perm_kick",
    name: "Kick & Ban Members",
    description: "Allows the bot to automatically remove malicious or flagged accounts.",
    required: true,
    granted: true,
  },
  {
    id: "perm_msg",
    name: "Manage Messages & Channels",
    description: "Enables automated spam deletion, filtering, and channel lockdown.",
    required: true,
    granted: true,
  },
  {
    id: "perm_audit",
    name: "View Audit Log",
    description: "Required to trace recent actions and cross-reference automated security flags.",
    required: true,
    granted: true,
  },
  {
    id: "perm_roles",
    name: "Manage Roles & Timeouts",
    description: "Needed to issue timed mutes, quarantine roles, and verify new users.",
    required: false,
    granted: true,
  },
];

const STEPS = [
  { step: 1, label: "Select Plan" },
  { step: 2, label: "Connect Discord" },
  { step: 3, label: "Select Server" },
  { step: 4, label: "Permissions" },
  { step: 5, label: "Confirm" },
  { step: 6, label: "Install" },
  { step: 7, label: "Configure" },
  { step: 8, label: "Complete" },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function InstallDiscordPage() {
  const [currentStep, setCurrentStep] = useState<InstallationStep>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(PLANS[1]);
  const [isDiscordConnected, setIsDiscordConnected] = useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<ServerOption | null>(null);
  const [permissions, setPermissions] = useState<PermissionItem[]>(INITIAL_PERMISSIONS);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Configuration state in step 7
  const [prefix, setPrefix] = useState("!");
  const [autoModEnabled, setAutoModEnabled] = useState(true);
  const [modLogChannel, setModLogChannel] = useState("#mod-logs");

  // Toggle optional permission
  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, granted: !p.granted } : p))
    );
  };

  // Simulating Discord Authorization
  const handleAuthorizeDiscord = () => {
    setIsDiscordConnected(true);
    setCurrentStep(3);
  };

  // Simulating Installation Process
  const handleTriggerInstall = () => {
    setShowConfirmModal(false);
    setCurrentStep(6);
    setIsInstalling(true);
    setHasError(false);

    // Simulate potential network/permission fail or success
    setTimeout(() => {
      setIsInstalling(false);
      // Change to true to test simulated error state
      const shouldFail = false; 

      if (shouldFail) {
        setHasError(true);
        setErrorMessage("Discord API returned 403 Forbidden: Missing 'Manage Roles' permission on the target guild.");
      } else {
        setCurrentStep(7);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5 pb-5 md:p-8 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Install Discord Bot
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
              Authorize, authorize guild scope, configure moderation parameters, and link your server in a few simple steps.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted/40 border border-border px-4 py-2.5 rounded-xl text-xs font-bold text-muted-foreground self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified OAuth2 Integration
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-card border border-border/80 p-4 md:p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2 md:pb-0">
            {STEPS.map((s) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <div key={s.step} className="flex items-center gap-2 min-w-max">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                      isPassed
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : s.step}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCurrent
                        ? "text-foreground"
                        : isPassed
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.step < 8 && (
                    <div
                      className={`w-4 md:w-8 h-0.5 mx-1 ${
                        isPassed ? "bg-emerald-500" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SELECT SUBSCRIPTION PLAN */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Step 1: Choose Your Protection Plan</h2>
              <p className="text-xs text-muted-foreground font-medium">
                Select the tier that best matches your Discord server scale and automated moderation requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    selectedPlan.id === plan.id
                      ? "bg-card border-violet-600 ring-2 ring-violet-600/20 shadow-xl"
                      : "bg-card/50 border-border hover:border-border/80"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">{plan.name}</h3>
                    <div className="mt-4 mb-6">
                      <span className="text-3xl font-black">{plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ {plan.billingPeriod}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      selectedPlan.id === plan.id
                        ? "bg-violet-600 text-white shadow-md hover:bg-violet-700"
                        : "bg-muted text-foreground border border-border hover:bg-muted/80"
                    }`}
                  >
                    {selectedPlan.id === plan.id ? "Plan Selected" : "Select Plan"}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                Continue to Authorization <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONNECT DISCORD */}
        {currentStep === 2 && (
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xl">
            <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
              <Bot className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Step 2: Connect Discord Account</h2>
              <p className="text-xs text-muted-foreground font-medium max-w-md mx-auto">
                Authorize our Discord OAuth2 application to fetch your manageable servers and inject the bot application into your guild.
              </p>
            </div>

            <div className="bg-muted/30 border border-border/80 p-4 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> OAuth2 Security Guarantee
              </div>
              <p className="text-muted-foreground">
                We only request access to list your servers (`guilds`) and create bot permissions. We will never access private user messages outside bot logs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleAuthorizeDiscord}
                className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/20 cursor-pointer"
              >
                <Bot className="w-4 h-4" /> Authorize Discord Account
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DISCORD SERVER */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Step 3: Select Target Server</h2>
              <p className="text-xs text-muted-foreground font-medium">
                Choose the server where you have Administrator permissions to deploy the bot.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                Select Discord Server
              </label>

              <div className="space-y-3">
                {MOCK_SERVERS.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => !srv.alreadyInstalled && setSelectedServer(srv)}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      srv.alreadyInstalled
                        ? "opacity-50 bg-muted/20 border-border cursor-not-allowed"
                        : selectedServer?.id === srv.id
                        ? "bg-card border-violet-600 ring-2 ring-violet-600/20 shadow-md cursor-pointer"
                        : "bg-muted/30 border-border/80 hover:border-border cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.icon}
                        alt={srv.name}
                        className="w-10 h-10 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <h4 className="font-bold text-sm">{srv.name}</h4>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {srv.memberCount.toLocaleString()} Members • ID: {srv.id}
                        </p>
                      </div>
                    </div>

                    {srv.alreadyInstalled ? (
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                        Already Installed
                      </span>
                    ) : selectedServer?.id === srv.id ? (
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Select
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedServer}
                onClick={() => setCurrentStep(4)}
                className="bg-violet-600 disabled:opacity-40 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                Review Permissions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PERMISSIONS CHECKLIST */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Step 4: Check Required Permissions</h2>
              <p className="text-xs text-muted-foreground font-medium">
                Verify the scope of authority granted to the bot on <span className="text-foreground font-bold">{selectedServer?.name}</span>.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Permission Scope
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Security Verified
                </span>
              </div>

              <div className="space-y-3">
                {permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{perm.name}</span>
                        {perm.required ? (
                          <span className="text-[9px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20 px-1.5 py-0.5 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                    </div>

                    <input
                      type="checkbox"
                      disabled={perm.required}
                      checked={perm.granted}
                      onChange={() => togglePermission(perm.id)}
                      className="mt-1 w-4 h-4 rounded border-border text-violet-600 focus:ring-violet-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                Confirm Setup <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRM INSTALLATION SUMMARY */}
        {currentStep === 5 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Step 5: Review & Confirm</h2>
              <p className="text-xs text-muted-foreground font-medium">
                Double check your selected server and subscription plan before deploying.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-lg">
              
              {/* Selected Plan Summary */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/80">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                    Selected Plan
                  </span>
                  <h4 className="font-black text-base">{selectedPlan.name}</h4>
                  <p className="text-xs text-muted-foreground">{selectedPlan.price} / {selectedPlan.billingPeriod}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-violet-600 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Target Server Summary */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/80">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedServer?.icon}
                    alt={selectedServer?.name}
                    className="w-10 h-10 rounded-xl object-cover border border-border"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                      Target Server
                    </span>
                    <h4 className="font-black text-sm">{selectedServer?.name}</h4>
                    <p className="text-[10px] font-mono text-muted-foreground">ID: {selectedServer?.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-violet-600 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Security Information */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Ready for Installation
                </div>
                <p className="text-xs text-muted-foreground">
                  By clicking "Install Bot", you authorize our core service to inject an active bot token into your guild and initialize standard monitoring.
                </p>
              </div>

            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                Install Bot <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: INSTALLATION IN PROGRESS OR ERROR */}
        {currentStep === 6 && (
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl">
            {isInstalling && (
              <>
                <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Installing Bot...</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Communicating with Discord API, injecting permissions, and building server cache for <span className="text-foreground font-bold">{selectedServer?.name}</span>.
                  </p>
                </div>
              </>
            )}

            {hasError && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-rose-500">Installation Failed</h2>
                  <p className="text-xs text-muted-foreground font-medium max-w-md mx-auto">
                    We encountered an unexpected error while trying to register the bot with Discord servers.
                  </p>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs p-4 rounded-xl text-left">
                  {errorMessage}
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
                  >
                    Adjust Permissions
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerInstall}
                    className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Retry Installation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: CONFIGURE BOT */}
        {currentStep === 7 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Step 7: Quick Configuration</h2>
              <p className="text-xs text-muted-foreground font-medium">
                Bot successfully linked! Set initial execution parameters for <span className="text-foreground font-bold">{selectedServer?.name}</span>.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-lg">
              
              {/* Command Prefix */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  Command Prefix
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
                />
              </div>

              {/* Mod Log Channel */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  Moderation Log Channel
                </label>
                <input
                  type="text"
                  value={modLogChannel}
                  onChange={(e) => setModLogChannel(e.target.value)}
                  className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
                />
              </div>

              {/* AutoMod Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/60 rounded-xl">
                <div>
                  <h4 className="font-bold text-xs">Enable Automated Anti-Spam</h4>
                  <p className="text-[11px] text-muted-foreground">Automatically delete suspicious links and rapid messages upon install.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoModEnabled}
                  onChange={(e) => setAutoModEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-violet-600 focus:ring-violet-600 cursor-pointer"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                Save & Finish <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: SUCCESS SCREEN */}
        {currentStep === 8 && (
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Installation Complete!</h2>
              <p className="text-xs text-muted-foreground font-medium max-w-md mx-auto">
                The bot is now online, active, and actively protecting <span className="text-foreground font-bold">{selectedServer?.name}</span>.
              </p>
            </div>

            <div className="bg-muted/30 border border-border/80 p-4 rounded-xl text-left text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Server Linked</span>
                <span className="font-bold">{selectedServer?.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Active Plan</span>
                <span className="font-bold">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Command Prefix</span>
                <span className="font-mono font-bold text-violet-600">{prefix}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="/bots/activity"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted border border-border hover:bg-muted/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                View Activity Logs
              </a>
              <a
                href={`/bots/settings?server=${selectedServer?.id}`}
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                <Settings className="w-4 h-4" /> Go to Server Settings
              </a>
            </div>
          </div>
        )}

        {/* INSTALLATION CONFIRMATION MODAL */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-black uppercase text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-violet-600" /> Confirm Bot Authorization
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <p className="text-muted-foreground">
                You are about to deploy the bot into <span className="font-bold text-foreground">{selectedServer?.name}</span> under the <span className="font-bold text-foreground">{selectedPlan.name}</span> plan.
              </p>

              <div className="bg-muted/30 p-3 rounded-xl border border-border/60 space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Target Guild ID:</span>
                  <span className="font-bold">{selectedServer?.id}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Permissions:</span>
                  <span className="font-bold text-emerald-500">Verified ({permissions.filter(p=>p.granted).length} active)</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerInstall}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                Confirm & Deploy
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}