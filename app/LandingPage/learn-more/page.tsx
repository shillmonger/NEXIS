"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Trophy,
  Wallet,
  ShieldCheck,
  CreditCard,
  Building2,
  Search,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
  UserPlus,
  BarChart2,
  Target,
  ChevronRight,
  Flame,
  Zap,
  Star,
  Clock,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Gift,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "welcome", title: "Welcome to NEXIS", label: "Welcome", icon: TrendingUp },
  { id: "discord-integration", title: "Discord Integration", label: "Discord", icon: Users },
  { id: "bot-subscription", title: "Bot Subscription", label: "Bot Sub", icon: ShieldCheck },
  { id: "wallet-connection", title: "Wallet Connection", label: "Wallet", icon: Wallet },
  { id: "nft-verification", title: "NXAE NFT Verification", label: "NFT Verify", icon: CreditCard },
  { id: "holder-tiers", title: "Holder Tiers", label: "Tiers", icon: Trophy },
  { id: "arena-predictions", title: "Arena & Predictions", label: "Arena", icon: Target },
  { id: "xp-system", title: "XP & Progression", label: "XP System", icon: Coins },
  { id: "achievements", title: "Achievements", label: "Achieve", icon: Trophy },
  { id: "leaderboard", title: "Leaderboards", label: "Ranks", icon: BarChart2 },
  { id: "marketplace", title: "NFT Marketplace", label: "Market", icon: ShoppingBag },
  { id: "referrals", title: "Referrals", label: "Refer", icon: UserPlus },
];

export default function LearnMorePage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("welcome");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[30vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.postimg.cc/CKFgjjwZ/BANNA.jpg')",
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest mb-6 text-violet-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span>Platform Guide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 text-white leading-none"
          >
            Learn{" "}
            <span className="text-violet-500">More</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Comprehensive guide to NEXIS Web3 Community OS features, from Discord integration to Arena predictions.
          </motion.p>

          {/* Progress bar — sections overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1.5 mt-8"
          >
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                aria-label={s.title}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  s.id === activeSection
                    ? "bg-violet-500 w-8"
                    : i < activeIndex
                    ? "bg-violet-500/40 w-4"
                    : "bg-white/20 w-4"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-24 pt-12 flex flex-col lg:flex-row gap-10 w-full">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-1.5">
            {/* Header label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mb-5 px-1">
              Sections
            </p>

            {sections.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono shrink-0 transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-secondary text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-tight">{item.title}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                </button>
              );
            })}

            {/* Reading progress */}
            <div className="mt-6 px-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                  Progress
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {activeIndex + 1}/{sections.length}
                </span>
              </div>
              <div className="h-[3px] bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 rounded-full transition-all duration-500"
                  style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile sticky nav ── */}
        <div className="lg:hidden sticky top-[80px] z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeSection === s.id
                      ? "bg-violet-600 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-6" id="learn-more-content">
          {/* Welcome to Secure Rise Section */}
          <motion.div
            id="welcome"
            className="scroll-mt-32 bg-gradient-to-br from-primary/10 via-card to-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                01
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Welcome to NEXIS</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS is a complete Web3 Community Operating System built by Nexiae. It combines Discord community management, moderation, bot subscriptions, Web3 wallet integration, NFT verification, and competitive features into one powerful platform. NEXIS is NOT simply a Discord bot — it's a modular ecosystem designed to scale from Phase 1 foundations to future multi-community SaaS functionality.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Core Platform Features
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Discord Integration:</strong> Complete Discord community management and moderation capabilities</li>
                  <li><strong>Bot Subscriptions:</strong> Subscription-based Discord moderation bot with configurable plans</li>
                  <li><strong>Web3 Wallet Connection:</strong> Connect crypto wallets with cryptographic signature verification</li>
                  <li><strong>NXAE NFT Verification:</strong> Verify NFT ownership to determine holder tiers and access</li>
                  <li><strong>Arena & Predictions:</strong> Competitive prediction markets with XP, streaks, and leaderboards</li>
                  <li><strong>NFT Marketplace:</strong> Portfolio management and marketplace functionality</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  User Journey
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Create NEXIS Account:</strong> Sign up and connect your Discord account</li>
                  <li><strong>Subscribe to Bot:</strong> Choose a moderation bot plan and complete payment</li>
                  <li><strong>Install Bot:</strong> Install the Discord bot into servers you manage</li>
                  <li><strong>Configure Moderation:</strong> Set up moderation rules, channels, and thresholds</li>
                  <li><strong>Connect Wallet:</strong> Link your crypto wallet and sign verification challenge</li>
                  <li><strong>Verify NXAE:</strong> Verify NFT ownership to unlock holder tier benefits</li>
                  <li><strong>Participate in Arena:</strong> Join predictions, earn XP, and climb leaderboards</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Technology Stack
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Frontend:</strong> Next.js, React, TypeScript, App Router</li>
                  <li><strong>Backend:</strong> Node.js/TypeScript or Next.js server-side API</li>
                  <li><strong>Database:</strong> MongoDB with MongoDB Atlas</li>
                  <li><strong>Blockchain:</strong> Wallet connection, signature verification, NFT ownership verification</li>
                  <li><strong>Discord:</strong> Discord OAuth, Bot API, Gateway, slash commands</li>
                  <li><strong>Architecture:</strong> Modular design with adapter pattern for third-party providers</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  Phase Overview
                </h3>
                <p className="text-xs text-muted-foreground">
                  NEXIS is built in phases: Phase 1 (Foundation + Discord Bot), Phase 2 (Arena & Predictions), Phase 3 (NFT Marketplace), Phase 4 (Advanced Predictions), Phase 5 (Community Growth), and Phase 6 (Scale/SaaS). Each phase builds upon the previous without requiring rewrites.
                </p>
              </div>
            </div>
            </motion.div>

          {/* Payment Methods Section */}
          <motion.div
            id="payment-methods"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                02
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Wallet className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Payment Methods</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS offers flexible payment options for Discord bot subscriptions through our integrated payment provider. Choose from various payment methods to activate your bot subscription and unlock moderation features for your Discord servers.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  Subscription Payment Methods
                </h3>
                <p className="text-xs text-muted-foreground">
                  We support multiple payment methods for bot subscriptions including credit/debit cards, cryptocurrencies, and other digital payment options. The exact payment provider and methods are configurable based on your region and preferences.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, and other major cards</li>
                  <li><strong>Cryptocurrency:</strong> USDT, BTC, ETH, and other supported coins</li>
                  <li><strong>Digital Wallets:</strong> Various digital payment solutions</li>
                  <li><strong>Secure Processing:</strong> All payments processed through PCI-compliant providers</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Subscription Security
                </h3>
                <p className="text-xs text-muted-foreground">
                  All subscription payments are secured with industry-standard encryption. Payment secrets are never exposed to the browser, and subscription entitlement is always validated server-side.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Webhook Validation:</strong> Payment webhooks are cryptographically verified</li>
                  <li><strong>Server-Side Validation:</strong> Bot access is checked on every request</li>
                  <li><strong>Secure Storage:</strong> No payment secrets stored in frontend code</li>
                  <li><strong>Fraud Protection:</strong> Real-time monitoring of subscription activity</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Subscription Lifecycle
                </h3>
                <p className="text-xs text-muted-foreground">
                  Subscriptions follow a clear lifecycle from activation to expiration. We handle subscription states, grace periods, and failed payment recovery automatically.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Active:</strong> Subscription is current and bot features are enabled</li>
                  <li><strong>Trial:</strong> Free trial period with full feature access</li>
                  <li><strong>Past Due:</strong> Payment failed, grace period in effect</li>
                  <li><strong>Cancelled:</strong> User cancelled, features active until period end</li>
                  <li><strong>Expired:</strong> Subscription ended, paid features disabled</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Automatic Renewal
                </h3>
                <p className="text-xs text-muted-foreground">
                  Subscriptions can be set to auto-renew to ensure uninterrupted bot service. Renewal attempts are made automatically, and you'll receive notifications before each renewal.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Auto-Renew:</strong> Optional automatic subscription renewal</li>
                  <li><strong>Renewal Notifications:</strong> Email alerts before renewal date</li>
                  <li><strong>Payment Retry:</strong> Automatic retry for failed payments</li>
                  <li><strong>Manual Control:</strong> Cancel or modify anytime from dashboard</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Discord Integration Section */}
          <motion.div
            id="discord-integration"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                02
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Discord Integration</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS provides deep Discord integration allowing users to connect their Discord accounts, manage communities, and utilize advanced moderation features. The Discord integration is a core component of the platform, enabling seamless community management and role synchronization.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Discord OAuth
                </h3>
                <p className="text-xs text-muted-foreground">
                  Connect your Discord account through secure OAuth authentication. This enables identity linking and authorization for Discord server management.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Secure Authentication:</strong> OAuth 2.0 for safe Discord account linking</li>
                  <li><strong>Identity Verification:</strong> Verify Discord identity for platform access</li>
                  <li><strong>Server Permissions:</strong> Validate server management permissions</li>
                  <li><strong>Role Synchronization:</strong> Sync holder tiers with Discord roles</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Bot Installation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Subscribed users can install the NEXIS moderation bot into Discord servers they manage. The installation process includes authorization validation and server configuration.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Authorization Flow:</strong> Discord OAuth installation process</li>
                  <li><strong>Server Selection:</strong> Choose Discord servers to install bot</li>
                  <li><strong>Permission Validation:</strong> Server-side verification of management rights</li>
                  <li><strong>Server Recording:</strong> Track installed servers and configurations</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Role Synchronization
                </h3>
                <p className="text-xs text-muted-foreground">
                  NEXIS automatically synchronizes holder tiers with Discord roles based on NXAE NFT ownership. This ensures users receive appropriate Discord permissions based on their tier.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Automatic Sync:</strong> Roles update based on NFT holdings</li>
                  <li><strong>Tier Mapping:</strong> Configurable tier-to-role mappings</li>
                  <li><strong>Real-time Updates:</strong> Changes reflected immediately in Discord</li>
                  <li><strong>Access Control:</strong> Server-side enforcement of role permissions</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security Measures
                </h3>
                <p className="text-xs text-muted-foreground">
                  All Discord operations are secured with proper validation and authorization checks. The backend never trusts client-side claims about server ownership or permissions.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Server-Side Validation:</strong> All permissions verified on backend</li>
                  <li><strong>Token Security:</strong> Discord tokens stored securely</li>
                  <li><strong>Rate Limiting:</strong> API abuse prevention through rate limits</li>
                  <li><strong>Audit Logging:</strong> All Discord operations logged for security</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Bot Subscription Section */}
          <motion.div
            id="bot-subscription"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                03
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Bot Subscription</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS offers subscription-based Discord moderation bot services. Users can subscribe to different plans that determine the features, server limits, and moderation capabilities available. The subscription system uses webhooks for payment processing and server-side entitlement validation.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Subscription Plans
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choose from multiple subscription tiers designed for different community sizes and needs.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Free Tier:</strong> Basic features for testing and small communities</li>
                  <li><strong>Starter:</strong> Enhanced features for growing communities</li>
                  <li><strong>Pro:</strong> Advanced features for active servers</li>
                  <li><strong>Enterprise:</strong> Full feature set for large networks</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Plan Features
                </h3>
                <p className="text-xs text-muted-foreground">
                  Each plan includes specific features, server limits, and capabilities.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Server Limits:</strong> Maximum number of Discord servers per plan</li>
                  <li><strong>Moderation Modules:</strong> Access to advanced moderation features</li>
                  <li><strong>Webhook Limits:</strong> Maximum number of webhook integrations</li>
                  <li><strong>Support Level:</strong> Response time and support channel access</li>
                  <li><strong>Analytics:</strong> Bot performance and activity analytics</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  Subscription Flow
                </h3>
                <p className="text-xs text-muted-foreground">
                  The subscription process is designed to be secure and seamless.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Plan Selection:</strong> Choose a plan from the Bot Hub</li>
                  <li><strong>Payment Processing:</strong> Complete payment through provider</li>
                  <li><strong>Webhook Validation:</strong> Server validates payment webhook</li>
                  <li><strong>Subscription Recording:</strong> Subscription recorded in database</li>
                  <li><strong>Entitlement Grant:</strong> Bot management access granted</li>
                  <li><strong>Bot Installation:</strong> Install bot into Discord servers</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Entitlement Validation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Bot functionality is always validated server-side based on subscription status. The frontend never decides whether a user has access.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Server-Side Checks:</strong> All bot operations validated on backend</li>
                  <li><strong>Subscription Status:</strong> Active, trial, past due, cancelled, expired</li>
                  <li><strong>Grace Period:</strong> Configurable grace period for failed payments</li>
                  <li><strong>Feature Gating:</strong> Features enabled/disabled based on plan</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Wallet Connection Section */}
          <motion.div
            id="wallet-connection"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                04
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Wallet className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Wallet Connection</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS supports crypto wallet connections for Web3 identity and NFT verification. Users can connect supported wallets, verify ownership through cryptographic signatures, and link their wallets to their NEXIS account for holder tier determination.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  Supported Wallets
                </h3>
                <p className="text-xs text-muted-foreground">
                  Connect with popular crypto wallets that support the required blockchain networks for NXAE NFT verification.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>MetaMask:</strong> Most popular Web3 wallet</li>
                  <li><strong>WalletConnect:</strong> Mobile wallet integration</li>
                  <li><strong>Phantom:</strong> Solana-native wallet</li>
                  <li><strong>Other EVM Wallets:</strong> Coinbase Wallet, Trust Wallet, etc.</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Wallet Verification
                </h3>
                <p className="text-xs text-muted-foreground">
                  Wallet ownership is verified through cryptographic signature challenges. Simply connecting a wallet is not proof of ownership — users must sign a verification message.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Signature Challenge:</strong> Sign a unique message to prove ownership</li>
                  <li><strong>Backend Verification:</strong> Server validates cryptographic signature</li>
                  <li><strong>One-Time Setup:</strong> Verification required per wallet connection</li>
                  <li><strong>Re-verification:</strong> Required if wallet address changes</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security Principles
                </h3>
                <p className="text-xs text-muted-foreground">
                  NEXIS follows strict security principles for wallet management. We never request or store sensitive wallet data.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>No Private Keys:</strong> Never request or store private keys</li>
                  <li><strong>No Seed Phrases:</strong> Never ask for wallet seed phrases</li>
                  <li><strong>No Custody:</strong> NEXIS does not custody user funds or NFTs</li>
                  <li><strong>Signature Only:</strong> Only request message signatures for verification</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Wallet Management
                </h3>
                <p className="text-xs text-muted-foreground">
                  Users can manage their connected wallets through the dashboard, including connecting new wallets, changing primary wallets, and disconnecting wallets.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Connect Wallet:</strong> Add new wallet to account</li>
                  <li><strong>Change Wallet:</strong> Switch primary wallet for verification</li>
                  <li><strong>Disconnect:</strong> Remove wallet from account</li>
                  <li><strong>View Status:</strong> See verification status of each wallet</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* NXAE NFT Verification Section */}
          <motion.div
            id="nft-verification"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                05
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <CreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">NXAE NFT Verification</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NXAE NFT verification is the core access control mechanism for NEXIS. Users verify their NXAE NFT holdings to determine their holder tier, which controls platform access, features, and Discord role synchronization. The system automatically detects changes in NFT ownership and updates tiers accordingly.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  Verification Process
                </h3>
                <p className="text-xs text-muted-foreground">
                  The verification process reads NFT ownership from a trusted blockchain provider and maps holdings to holder tier rules.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Read Holdings:</strong> Query blockchain for NXAE NFT ownership</li>
                  <li><strong>Count NFTs:</strong> Determine quantity of eligible NXAE NFTs</li>
                  <li><strong>Map to Tier:</strong> Apply configurable tier rules based on quantity</li>
                  <li><strong>Assign Tier:</strong> Update user's holder tier in database</li>
                  <li><strong>Sync Discord:</strong> Synchronize corresponding Discord role</li>
                  <li><strong>Record Timestamp:</strong> Track verification time for audit trail</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Holder Tiers
                </h3>
                <p className="text-xs text-muted-foreground">
                  Holder tiers are configurable and determine what features and access users receive.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Required Quantity:</strong> NFT count needed for each tier</li>
                  <li><strong>Access Rules:</strong> Features unlocked per tier</li>
                  <li><strong>Discord Role Mapping:</strong> Corresponding Discord roles</li>
                  <li><strong>Progress Information:</strong> User's progress toward next tier</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Dynamic Updates
                </h3>
                <p className="text-xs text-muted-foreground">
                  The system automatically detects changes in NFT ownership and updates tiers accordingly.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Transfer Detection:</strong> Detect NFT transfers and sales</li>
                  <li><strong>Automatic Re-verification:</strong> Re-check holdings on significant changes</li>
                  <li><strong>Tier Adjustment:</strong> Update tier based on new holdings</li>
                  <li><strong>Role Resync:</strong> Update Discord roles when tier changes</li>
                  <li><strong>Notification:</strong> Alert users of tier changes</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security & Validation
                </h3>
                <p className="text-xs text-muted-foreground">
                  All NFT verification is performed server-side using trusted blockchain providers. The system never trusts client-side claims about NFT ownership.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Trusted Provider:</strong> Use reputable NFT/balance API</li>
                  <li><strong>Server-Side Validation:</strong> All checks performed on backend</li>
                  <li><strong>Audit Trail:</strong> Track all verification attempts and changes</li>
                  <li><strong>Rate Limiting:</strong> Prevent abuse of verification endpoints</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Holder Tiers Section */}
          <motion.div
            id="holder-tiers"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                06
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Trophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Holder Tiers</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Holder tiers are the access control system for NEXIS. Based on the quantity of NXAE NFTs owned, users are assigned different tiers that determine their platform access, unlocked features, and Discord roles. The tier system is fully configurable and enforced server-side.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Tier Structure
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tiers are determined by the number of NXAE NFTs held in a verified wallet.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Basic Tier:</strong> 0 NXAE NFTs - Public access features</li>
                  <li><strong>Holder Tier:</strong> 1+ NXAE NFTs - Enhanced features</li>
                  <li><strong>Premium Tier:</strong> 5+ NXAE NFTs - Advanced features</li>
                  <li><strong>Elite Tier:</strong> 10+ NXAE NFTs - Full platform access</li>
                  <li><strong>Custom Tiers:</strong> Configurable based on community needs</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Tier Benefits
                </h3>
                <p className="text-xs text-muted-foreground">
                  Each tier unlocks specific features and access levels across the platform.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Discord Roles:</strong> Corresponding Discord roles for each tier</li>
                  <li><strong>Arena Access:</strong> Participation in prediction markets</li>
                  <li><strong>Bot Features:</strong> Enhanced moderation capabilities</li>
                  <li><strong>Marketplace:</strong> NFT marketplace access and trading</li>
                  <li><strong>Competitions:</strong> Entry into exclusive competitions</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" />
                  Tier Progress
                </h3>
                <p className="text-xs text-muted-foreground">
                  Users can track their progress toward the next tier through the dashboard.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Current Holdings:</strong> Number of NXAE NFTs owned</li>
                  <li><strong>Next Tier:</strong> NFTs needed for next tier</li>
                  <li><strong>Progress Bar:</strong> Visual progress toward tier upgrade</li>
                  <li><strong>Unlocked Features:</strong> Features available at current tier</li>
                  <li><strong>Pending Features:</strong> Features to unlock at next tier</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Server-Side Enforcement
                </h3>
                <p className="text-xs text-muted-foreground">
                  All tier-based access control is enforced server-side. The frontend only displays what the backend authorizes.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>API Validation:</strong> Every request checks user tier</li>
                  <li><strong>Feature Gates:</strong> Features enabled/disabled based on tier</li>
                  <li><strong>Role Sync:</strong> Discord roles updated based on tier</li>
                  <li><strong>Audit Logging:</strong> All tier changes logged for compliance</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Arena & Predictions Section */}
          <motion.div
            id="arena-predictions"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                07
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Arena & Predictions</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The Arena is NEXIS's competitive hub where users participate in prediction markets and competitions. Users can make predictions on various outcomes, earn XP for correct predictions, build streaks, unlock achievements, and climb leaderboards. The Arena is a key component of Phase 2.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Prediction Markets
                </h3>
                <p className="text-xs text-muted-foreground">
                  Administrators create prediction markets with questions, options, rules, deadlines, and XP rewards. Users can browse predictions, filter by category, and enter eligible markets.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Market Creation:</strong> Admins create prediction markets</li>
                  <li><strong>Browse & Filter:</strong> Users browse available predictions</li>
                  <li><strong>Eligibility Check:</strong> Tier and status validation before entry</li>
                  <li><strong>Submission:</strong> Users submit predictions before deadline</li>
                  <li><strong>Locking:</strong> Markets become immutable at deadline</li>
                  <li><strong>Settlement:</strong> Results determined from configured sources</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  XP & Rewards
                </h3>
                <p className="text-xs text-muted-foreground">
                  Correct predictions earn XP based on market configuration. XP is awarded after settlement and contributes to overall progression.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>XP Rewards:</strong> Configurable XP per correct prediction</li>
                  <li><strong>Streak Bonuses:</strong> Multipliers for consecutive correct predictions</li>
                  <li><strong>Competition Rewards:</strong> Additional XP for competition winners</li>
                  <li><strong>Achievement Unlocks:</strong> Prediction-based achievements</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  Competitions
                </h3>
                <p className="text-xs text-muted-foreground">
                  The Arena hosts regular competitions where users compete for prizes and recognition.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Weekly Leagues:</strong> Regular competition cycles</li>
                  <li><strong>Championships:</strong> Major tournament events</li>
                  <li><strong>Leaderboards:</strong> Real-time competition rankings</li>
                  <li><strong>Prizes:</strong> XP, NFTs, and other rewards</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Settlement & Security
                </h3>
                <p className="text-xs text-muted-foreground">
                  Prediction settlement is handled through configured data providers with full audit trails. All validation is server-side.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Data Providers:</strong> Configurable settlement sources</li>
                  <li><strong>Admin Override:</strong> Override capability with audit logging</li>
                  <li><strong>Immutable Records:</strong> Locked predictions cannot be modified</li>
                  <li><strong>Duplicate Prevention:</strong> Server-side duplicate entry checks</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* XP System Section */}
          <motion.div
            id="xp-system"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                08
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Coins className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">XP & Progression</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The NEXIS XP System is a comprehensive progression system that rewards users for platform engagement. XP is stored as a ledger for full transparency and can be earned through predictions, achievements, competitions, and community activities. The system is designed to be fair, transparent, and fraud-resistant.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  XP Sources
                </h3>
                <p className="text-xs text-muted-foreground">
                  XP can be earned through various activities across the NEXIS platform.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Correct Predictions:</strong> XP for accurate market predictions</li>
                  <li><strong>Competitions:</strong> Bonus XP for competition participation</li>
                  <li><strong>Achievements:</strong> Milestone-based XP rewards</li>
                  <li><strong>Community Activities:</strong> Approved engagement activities</li>
                  <li><strong>Streak Bonuses:</strong> Multipliers for consecutive achievements</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  XP Ledger
                </h3>
                <p className="text-xs text-muted-foreground">
                  XP is stored as a transaction ledger rather than a simple number, ensuring full transparency and auditability.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Transaction History:</strong> Complete record of all XP transactions</li>
                  <li><strong>Source Tracking:</strong> Each transaction tagged with source type</li>
                  <li><strong>Timestamp:</strong> Exact time of each XP transaction</li>
                  <li><strong>Audit Trail:</strong> Full traceability for compliance</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Streak System
                </h3>
                <p className="text-xs text-muted-foreground">
                  Build streaks through consistent platform engagement to earn bonus XP and unlock special achievements.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Current Streak:</strong> Active engagement streak</li>
                  <li><strong>Best Streak:</strong> Personal best record</li>
                  <li><strong>Streak Milestones:</strong> Bonus XP at milestone points</li>
                  <li><strong>Streak History:</strong> Track streak performance over time</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security & Validation
                </h3>
                <p className="text-xs text-muted-foreground">
                  All XP transactions are validated server-side to prevent manipulation and ensure fairness.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Server Validation:</strong> All XP calculations performed server-side</li>
                  <li><strong>Duplicate Prevention:</strong> No duplicate XP for same activity</li>
                  <li><strong>Fraud Detection:</strong> Automated detection of suspicious patterns</li>
                  <li><strong>Immutable Records:</strong> XP ledger cannot be modified after recording</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Achievements Section */}
          <motion.div
            id="achievements"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                09
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Trophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Achievements</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The NEXIS Achievements system rewards users for completing milestones across the platform. Achievements are organized into categories with different rarity levels, each granting XP based on difficulty. Users can track their progress and unlock achievements to earn rewards and recognition.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Achievement Categories
                </h3>
                <p className="text-xs text-muted-foreground">
                  Achievements are organized into categories based on platform activities.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Onboarding:</strong> Initial setup and account verification</li>
                  <li><strong>Discord:</strong> Discord integration and bot setup achievements</li>
                  <li><strong>Wallet:</strong> Wallet connection and verification milestones</li>
                  <li><strong>NFT:</strong> NXAE NFT verification and tier achievements</li>
                  <li><strong>Arena:</strong> Prediction and competition achievements</li>
                  <li><strong>Community:</strong> Referral and engagement achievements</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Rarity Levels
                </h3>
                <p className="text-xs text-muted-foreground">
                  Achievements have different rarity levels, with higher rarity granting more XP.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Common:</strong> Basic achievements (50-150 XP)</li>
                  <li><strong>Rare:</strong> Intermediate milestones (150-400 XP)</li>
                  <li><strong>Epic:</strong> Advanced achievements (400-750 XP)</li>
                  <li><strong>Legendary:</strong> Elite milestones (750-1,500 XP)</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Achievement Tracking
                </h3>
                <p className="text-xs text-muted-foreground">
                  Users can track their achievement progress through the dashboard with detailed status information.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Locked:</strong> Requirements not yet met</li>
                  <li><strong>In Progress:</strong> Partially completed requirements</li>
                  <li><strong>Unlocked:</strong> Achievement completed and XP awarded</li>
                  <li><strong>Progress Bar:</strong> Visual progress toward completion</li>
                  <li><strong>Unlock Timestamp:</strong> When achievement was earned</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  XP Integration
                </h3>
                <p className="text-xs text-muted-foreground">
                  All XP earned from achievements is recorded in the XP ledger and contributes to overall progression.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Automatic Award:</strong> XP credited immediately upon unlock</li>
                  <li><strong>Ledger Recording:</strong> Transaction recorded in XP ledger</li>
                  <li><strong>Source Tagging:</strong> Tagged as achievement source</li>
                  <li><strong>Total Progress:</strong> Contributes to overall XP total</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Leaderboard Section */}
          <motion.div
            id="leaderboard"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                10
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <BarChart2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Leaderboards</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS leaderboards rank users based on various performance metrics including XP, prediction accuracy, streak records, and community contributions. Leaderboards provide competitive motivation and recognition for top performers across different categories and time periods.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Leaderboard Types
                </h3>
                <p className="text-xs text-muted-foreground">
                  Multiple leaderboard categories track different aspects of user performance.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>XP Leaderboard:</strong> Total XP earned across all activities</li>
                  <li><strong>Prediction Accuracy:</strong> Win rate in Arena predictions</li>
                  <li><strong>Streak Records:</strong> Best prediction and activity streaks</li>
                  <li><strong>Competition Rankings:</strong> Performance in competitions</li>
                  <li><strong>Community Impact:</strong> Referrals and engagement metrics</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Time Periods
                </h3>
                <p className="text-xs text-muted-foreground">
                  Leaderboards track performance across different time frames.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Daily:</strong> Performance over the last 24 hours</li>
                  <li><strong>Weekly:</strong> Performance over the last 7 days</li>
                  <li><strong>Monthly:</strong> Performance over the last 30 days</li>
                  <li><strong>All-Time:</strong> Cumulative performance since account creation</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Ranking Display
                </h3>
                <p className="text-xs text-muted-foreground">
                  Leaderboards display comprehensive user information for comparison and competition.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Rank Position:</strong> Current ranking on the leaderboard</li>
                  <li><strong>User Profile:</strong> Username and avatar display</li>
                  <li><strong>Score/Metric:</strong> Primary ranking metric value</li>
                  <li><strong>Tier Badge:</strong> Holder tier indicator</li>
                  <li><strong>Trend Indicator:</strong> Movement up or down in rankings</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  Search & Filtering
                </h3>
                <p className="text-xs text-muted-foreground">
                  Users can search for specific players and filter leaderboards by various criteria.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Player Search:</strong> Find specific users by username</li>
                  <li><strong>Tier Filter:</strong> Filter by holder tier</li>
                  <li><strong>Time Period:</strong> Switch between different time frames</li>
                  <li><strong>Category Filter:</strong> Focus on specific leaderboard types</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* NFT Marketplace Section */}
          <motion.div
            id="marketplace"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                11
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <ShoppingBag className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">NFT Marketplace</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The NEXIS NFT Marketplace provides portfolio management and trading functionality for NXAE and other supported NFTs. Users can view their NFT holdings, create listings, manage offers, and track marketplace activity. All marketplace transactions are user-signed with clear status tracking.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  NFT Portfolio
                </h3>
                <p className="text-xs text-muted-foreground">
                  Users can view and manage their complete NFT portfolio through the dashboard.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Holdings Overview:</strong> View all owned NFTs</li>
                  <li><strong>NFT Details:</strong> Detailed information for each NFT</li>
                  <li><strong>Collection View:</strong> Organized by collection</li>
                  <li><strong>Value Tracking:</strong> Portfolio value estimation</li>
                  <li><strong>Ownership History:</strong> Acquisition and transfer history</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Listing Creation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Users can create listings to sell their NFTs on the marketplace.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Select NFT:</strong> Choose NFT from portfolio to list</li>
                  <li><strong>Set Price:</strong> Define listing price in supported currency</li>
                  <li><strong>Create Listing:</strong> User-signed transaction to create listing</li>
                  <li><strong>Status Tracking:</strong> Real-time listing status updates</li>
                  <li><strong>Listing Management:</strong> Cancel or modify active listings</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Transaction States
                </h3>
                <p className="text-xs text-muted-foreground">
                  All marketplace transactions follow clear state progression for transparency.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>IDLE:</strong> Transaction not started</li>
                  <li><strong>PREPARING:</strong> Transaction being prepared</li>
                  <li><strong>WALLET PROMPT:</strong> Awaiting user wallet signature</li>
                  <li><strong>SIGNING:</strong> User is signing the transaction</li>
                  <li><strong>SUBMITTED:</strong> Transaction submitted to blockchain</li>
                  <li><strong>CONFIRMED:</strong> Transaction confirmed successfully</li>
                  <li><strong>FAILED:</strong> Transaction failed</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Security Principles
                </h3>
                <p className="text-xs text-muted-foreground">
                  NEXIS never takes custody of user NFTs. All transactions are user-signed with non-custodial wallet integration.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Non-Custodial:</strong> NEXIS never holds user NFTs</li>
                  <li><strong>User-Signed:</strong> All transactions require user signature</li>
                  <li><strong>Direct Wallet:</strong> Transactions go directly to/from user wallet</li>
                  <li><strong>No Private Keys:</strong> Never request or store private keys</li>
                </ul>
              </div>
            </div>
            </motion.div>

          {/* Referrals Section */}
          <motion.div
            id="referrals"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                12
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <UserPlus className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Referrals</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The NEXIS Referral System allows users to grow the community by inviting new users. Referrers can earn rewards for successful referrals, while referred users may receive benefits. The system includes anti-abuse measures and comprehensive tracking for transparency.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  Referral Links
                </h3>
                <p className="text-xs text-muted-foreground">
                  Each user receives a unique referral link to share with friends, family, and on social media.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Unique Links:</strong> Personalized referral URL for each user</li>
                  <li><strong>Share Options:</strong> Share via email, social media, messaging</li>
                  <li><strong>Tracking:</strong> Real-time tracking of clicks and conversions</li>
                  <li><strong>QR Codes:</strong> Generate QR codes for offline sharing</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-400" />
                  Referral Rewards
                </h3>
                <p className="text-xs text-muted-foreground">
                  Both referrers and referred users can receive benefits from successful referrals.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Referrer Rewards:</strong> XP or other benefits for successful referrals</li>
                  <li><strong>Referee Benefits:</strong> Welcome bonuses or tier boosts</li>
                  <li><strong>Milestone Rewards:</strong> Additional rewards for referral milestones</li>
                  <li><strong>Community Campaigns:</strong> Special referral events with enhanced rewards</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Referral Tracking
                </h3>
                <p className="text-xs text-muted-foreground">
                  Comprehensive tracking dashboard for monitoring referral performance.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Total Referrals:</strong> Number of users referred</li>
                  <li><strong>Active Referrals:</strong> Referrals who are active users</li>
                  <li><strong>Conversion Rate:</strong> Percentage of clicks that convert</li>
                  <li><strong>Earnings:</strong> Total rewards earned from referrals</li>
                  <li><strong>Referral Status:</strong> Track each referral's journey</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Anti-Abuse Measures
                </h3>
                <p className="text-xs text-muted-foreground">
                  The referral system includes protections against fraud and abuse to ensure fair rewards.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Fraud Detection:</strong> Automated detection of suspicious patterns</li>
                  <li><strong>Self-Referral Prevention:</strong> Cannot refer yourself</li>
                  <li><strong>Quality Requirements:</strong> Referred users must meet activity criteria</li>
                  <li><strong>Rate Limiting:</strong> Limits on referral velocity</li>
                  <li><strong>Audit Trail:</strong> Complete tracking of all referral activity</li>
                </ul>
              </div>
            </div>
            </motion.div>



          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              NEXIS · Platform Guide
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

        </div>
      </section>
    </main>
  );
}
