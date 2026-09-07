"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code,
  ShieldCheck,
  Database,
  Server,
  Globe,
  Lock,
  Key,
  FileText,
  ChevronRight,
  Terminal,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Users,
  Building2,
  Search,
  RefreshCw,
} from "lucide-react";

const sections = [
  { id: "getting-started", title: "Getting Started", label: "Start", icon: BookOpen },
  { id: "authentication", title: "Authentication", label: "Auth", icon: Lock },
  { id: "discord-integration", title: "Discord Integration", label: "Discord", icon: Users },
  { id: "wallet-integration", title: "Wallet Integration", label: "Wallet", icon: Key },
  { id: "nft-verification", title: "NFT Verification", label: "NFT", icon: ShieldCheck },
  { id: "bot-api", title: "Bot API", label: "Bot API", icon: Terminal },
  { id: "database-schema", title: "Database Schema", label: "Database", icon: Database },
  { id: "security", title: "Security Best Practices", label: "Security", icon: ShieldCheck },
  { id: "webhooks", title: "Webhooks", label: "Webhooks", icon: RefreshCw },
  { id: "rate-limiting", title: "Rate Limiting", label: "Limits", icon: Zap },
  { id: "error-handling", title: "Error Handling", label: "Errors", icon: AlertTriangle },
  { id: "deployment", title: "Deployment", label: "Deploy", icon: Server },
];

export default function DocsPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("getting-started");

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
            backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop')",
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
            <span>Documentation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 text-white leading-none"
          >
            Developer{" "}
            <span className="text-violet-500">Docs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Comprehensive documentation for integrating with the NEXIS Web3 Community OS platform.
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
              Documentation
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
        <div className="flex-1 min-w-0 space-y-6" id="docs-content">
          {/* Getting Started Section */}
          <motion.div
            id="getting-started"
            className="scroll-mt-32 bg-gradient-to-br from-violet-500/10 via-card to-card border border-border rounded-3xl overflow-hidden"
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
                <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Getting Started</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Welcome to the NEXIS Developer Documentation. This guide will help you integrate with the NEXIS Web3 Community OS platform, covering authentication, Discord integration, wallet connection, NFT verification, and API usage.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Prerequisites
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Node.js 18+</strong> or higher for server-side development</li>
                  <li><strong>Next.js 14+</strong> for frontend integration</li>
                  <li><strong>TypeScript</strong> for type-safe development</li>
                  <li><strong>MongoDB</strong> account for database integration</li>
                  <li><strong>Discord Developer Account</strong> for bot integration</li>
                  <li><strong>Web3 Wallet</strong> (MetaMask, Phantom, etc.) for testing</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  API Keys
                </h3>
                <p className="text-xs text-muted-foreground">
                  To access NEXIS APIs, you'll need to obtain API credentials from your dashboard.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>NEXIS API Key:</strong> Primary authentication key for API requests</li>
                  <li><strong>Webhook Secret:</strong> For validating webhook signatures</li>
                  <li><strong>Discord Bot Token:</strong> For Discord bot integration</li>
                  <li><strong>Environment Variables:</strong> Store credentials securely</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  Quick Start
                </h3>
                <p className="text-xs text-muted-foreground">
                  Get up and running with NEXIS integration in minutes.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Step 1:</strong> Create a NEXIS developer account</li>
                  <li><strong>Step 2:</strong> Generate API keys from dashboard</li>
                  <li><strong>Step 3:</strong> Install NEXIS SDK: <code className="bg-background px-1.5 py-0.5 rounded text-[10px]">npm install @nexis/sdk</code></li>
                  <li><strong>Step 4:</strong> Configure environment variables</li>
                  <li><strong>Step 5:</strong> Make your first API call</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Authentication Section */}
          <motion.div
            id="authentication"
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
                <Lock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Authentication</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS uses secure authentication mechanisms to protect API access and user data. All API requests require proper authentication using API keys or OAuth tokens.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  API Key Authentication
                </h3>
                <p className="text-xs text-muted-foreground">
                  Use your API key in the request header for authentication.
                </p>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  OAuth 2.0 Flow
                </h3>
                <p className="text-xs text-muted-foreground">
                  NEXIS supports OAuth 2.0 for user authentication and authorization.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Authorization Code:</strong> Standard OAuth 2.0 authorization code flow</li>
                  <li><strong>PKCE:</strong> Proof Key for Code Exchange for mobile apps</li>
                  <li><strong>Token Refresh:</strong> Automatic token refresh mechanism</li>
                  <li><strong>Scope Management:</strong> Granular permission scopes</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security Best Practices
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Never expose keys:</strong> Store API keys in environment variables</li>
                  <li><strong>Use HTTPS:</strong> All API calls must use HTTPS</li>
                  <li><strong>Rotate keys:</strong> Regularly rotate API keys</li>
                  <li><strong>Monitor usage:</strong> Track API usage for unusual activity</li>
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
                03
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Discord Integration</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Integrate Discord functionality into your application using NEXIS Discord APIs. This includes bot management, server administration, user authentication, and role synchronization.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Bot API
                </h3>
                <p className="text-xs text-muted-foreground">
                  Control Discord bots through NEXIS APIs for moderation and management.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Bot Commands:</strong> Execute slash commands and custom commands</li>
                  <li><strong>Moderation:</strong> Automate moderation actions and rules</li>
                  <li><strong>Server Management:</strong> Manage Discord servers and channels</li>
                  <li><strong>Role Management:</strong> Synchronize roles with holder tiers</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  OAuth Integration
                </h3>
                <p className="text-xs text-muted-foreground">
                  Implement Discord OAuth for user authentication and identity linking.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>User Authentication:</strong> Discord OAuth 2.0 flow</li>
                  <li><strong>Identity Linking:</strong> Link Discord accounts to NEXIS users</li>
                  <li><strong>Server Permissions:</strong> Validate server management permissions</li>
                  <li><strong>Webhook Events:</strong> Receive Discord webhook events</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Wallet Integration Section */}
          <motion.div
            id="wallet-integration"
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
                <Key className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Wallet Integration</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Integrate Web3 wallet functionality for cryptographic verification and NFT ownership validation. NEXIS supports multiple wallet providers and blockchain networks.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4 text-yellow-400" />
                  Supported Wallets
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>MetaMask:</strong> Most popular Web3 wallet</li>
                  <li><strong>WalletConnect:</strong> Mobile wallet integration</li>
                  <li><strong>Phantom:</strong> Solana-native wallet</li>
                  <li><strong>Other EVM Wallets:</strong> Coinbase Wallet, Trust Wallet</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Signature Verification
                </h3>
                <p className="text-xs text-muted-foreground">
                  Implement cryptographic signature verification for wallet ownership proof.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Challenge Generation:</strong> Generate unique verification challenges</li>
                  <li><strong>Signature Request:</strong> Request wallet signature from users</li>
                  <li><strong>Verification:</strong> Server-side signature validation</li>
                  <li><strong>Recovery:</strong> Handle signature failures gracefully</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* NFT Verification Section */}
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
                <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">NFT Verification</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Verify NXAE NFT ownership to determine holder tiers and access control. The verification system integrates with blockchain providers to ensure accurate and up-to-date ownership data.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Verification Process
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Query Blockchain:</strong> Query NFT ownership from blockchain</li>
                  <li><strong>Count Holdings:</strong> Determine quantity of eligible NFTs</li>
                  <li><strong>Apply Rules:</strong> Map holdings to tier configuration</li>
                  <li><strong>Update Database:</strong> Record verification results</li>
                  <li><strong>Sync Discord:</strong> Update Discord roles based on tier</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Real-time Updates
                </h3>
                <p className="text-xs text-muted-foreground">
                  Implement webhook handlers for real-time NFT ownership updates.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Transfer Events:</strong> Handle NFT transfer events</li>
                  <li><strong>Automatic Re-verification:</strong> Trigger re-verification on changes</li>
                  <li><strong>Tier Updates:</strong> Update holder tiers dynamically</li>
                  <li><strong>Notifications:</strong> Send notifications for tier changes</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Bot API Section */}
          <motion.div
            id="bot-api"
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
                <Terminal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Bot API</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Control NEXIS Discord bots through comprehensive APIs for moderation, commands, and server management. The Bot API provides full control over bot behavior and configuration.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  Bot Endpoints
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>POST /bot/install:</strong> Install bot to Discord server</li>
                  <li><strong>GET /bot/status:</strong> Get bot operational status</li>
                  <li><strong>POST /bot/configure:</strong> Configure bot settings</li>
                  <li><strong>GET /bot/servers:</strong> List connected servers</li>
                  <li><strong>POST /bot/command:</strong> Execute bot commands</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Moderation API
                </h3>
                <p className="text-xs text-muted-foreground">
                  Implement automated moderation through API endpoints.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Rule Management:</strong> Create and update moderation rules</li>
                  <li><strong>Action Execution:</strong> Execute moderation actions</li>
                  <li><strong>Log Access:</strong> Access moderation logs</li>
                  <li><strong>Configuration:</strong> Configure thresholds and exemptions</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Database Schema Section */}
          <motion.div
            id="database-schema"
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
                <Database className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Database Schema</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS uses MongoDB as its primary database with a comprehensive schema designed for scalability and performance. Understanding the database structure is essential for advanced integrations.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Core Collections
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>users:</strong> User accounts and profiles</li>
                  <li><strong>wallets:</strong> Connected wallet information</li>
                  <li><strong>nft_holdings:</strong> NFT ownership records</li>
                  <li><strong>holder_tiers:</strong> Tier configurations and assignments</li>
                  <li><strong>bot_subscriptions:</strong> Subscription records</li>
                  <li><strong>discord_servers:</strong> Connected Discord servers</li>
                  <li><strong>predictions:</strong> Prediction market data</li>
                  <li><strong>xp_transactions:</strong> XP ledger records</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-400" />
                  Indexes & Performance
                </h3>
                <p className="text-xs text-muted-foreground">
                  Critical database indexes for optimal query performance.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Unique Indexes:</strong> User emails, Discord IDs, wallet addresses</li>
                  <li><strong>Compound Indexes:</strong> User + timestamp, prediction + status</li>
                  <li><strong>Geospatial Indexes:</strong> Location-based queries</li>
                  <li><strong>Text Indexes:</strong> Full-text search capabilities</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            id="security"
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
                <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Security Best Practices</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Security is paramount when integrating with NEXIS. Follow these best practices to ensure your integration is secure and compliant with industry standards.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  API Security
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Always use HTTPS:</strong> Never expose API keys in URLs</li>
                  <li><strong>Validate Inputs:</strong> Sanitize all user inputs</li>
                  <li><strong>Rate Limiting:</strong> Implement client-side rate limiting</li>
                  <li><strong>Error Handling:</strong> Never expose sensitive data in errors</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  Data Protection
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Encrypt at Rest:</strong> Encrypt sensitive data in database</li>
                  <li><strong>Encrypt in Transit:</strong> Use TLS for all communications</li>
                  <li><strong>Minimal Data:</strong> Only collect necessary user data</li>
                  <li><strong>Retention Policies:</strong> Implement data retention policies</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Webhooks Section */}
          <motion.div
            id="webhooks"
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
                <RefreshCw className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Webhooks</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Use webhooks to receive real-time notifications about NEXIS events. Webhooks enable your application to react to changes in user data, subscription status, NFT ownership, and more.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Webhook Events
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>user.created:</strong> New user registration</li>
                  <li><strong>subscription.updated:</strong> Subscription status changes</li>
                  <li><strong>nft.verified:</strong> NFT ownership verification completed</li>
                  <li><strong>tier.changed:</strong> Holder tier updated</li>
                  <li><strong>prediction.settled:</strong> Prediction market settled</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Webhook Security
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Signature Verification:</strong> Verify webhook signatures</li>
                  <li><strong>Idempotency:</strong> Handle duplicate webhook events</li>
                  <li><strong>Retry Logic:</strong> Implement exponential backoff</li>
                  <li><strong>Timestamp Validation:</strong> Reject old webhook events</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Rate Limiting Section */}
          <motion.div
            id="rate-limiting"
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
                <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Rate Limiting</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS APIs implement rate limiting to ensure fair usage and system stability. Understanding rate limits is essential for building robust integrations.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Rate Limit Tiers
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Free Tier:</strong> 100 requests/minute</li>
                  <li><strong>Starter:</strong> 1,000 requests/minute</li>
                  <li><strong>Pro:</strong> 10,000 requests/minute</li>
                  <li><strong>Enterprise:</strong> Unlimited with custom limits</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Headers & Responses
                </h3>
                <p className="text-xs text-muted-foreground">
                  Rate limit information is included in response headers.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>X-RateLimit-Limit:</strong> Request limit per window</li>
                  <li><strong>X-RateLimit-Remaining:</strong> Remaining requests</li>
                  <li><strong>X-RateLimit-Reset:</strong> Unix timestamp of reset</li>
                  <li><strong>Retry-After:</strong> Seconds until retry (429 response)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Error Handling Section */}
          <motion.div
            id="error-handling"
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
                <AlertTriangle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Error Handling</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Implement proper error handling to create robust integrations. NEXIS APIs use standard HTTP status codes and detailed error messages.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  HTTP Status Codes
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>200 OK:</strong> Request successful</li>
                  <li><strong>400 Bad Request:</strong> Invalid request parameters</li>
                  <li><strong>401 Unauthorized:</strong> Invalid or missing authentication</li>
                  <li><strong>403 Forbidden:</strong> Insufficient permissions</li>
                  <li><strong>404 Not Found:</strong> Resource not found</li>
                  <li><strong>429 Too Many Requests:</strong> Rate limit exceeded</li>
                  <li><strong>500 Internal Server Error:</strong> Server error</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Error Response Format
                </h3>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    {`{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid wallet address format",
    "details": {
      "field": "wallet_address",
      "value": "invalid_address"
    }
  }
}`}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Deployment Section */}
          <motion.div
            id="deployment"
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
                <Server className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Deployment</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Deploy your NEXIS integration to production with confidence. Follow these guidelines for secure and scalable deployment.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Server className="w-4 h-4 text-green-400" />
                  Environment Configuration
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Environment Variables:</strong> Store all secrets in environment variables</li>
                  <li><strong>Production Keys:</strong> Use production API keys in production</li>
                  <li><strong>Database Connection:</strong> Use production MongoDB instance</li>
                  <li><strong>Logging:</strong> Enable comprehensive logging</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security Checklist
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>HTTPS Only:</strong> Force HTTPS in production</li>
                  <li><strong>CORS Configuration:</strong> Configure CORS properly</li>
                  <li><strong>Input Validation:</strong> Validate all inputs on server-side</li>
                  <li><strong>Rate Limiting:</strong> Implement rate limiting</li>
                  <li><strong>Monitoring:</strong> Set up error monitoring and alerts</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              NEXIS · Developer Documentation
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

        </div>
      </section>
    </main>
  );
}