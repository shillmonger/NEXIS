"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code,
  Server,
  Database,
  ShieldCheck,
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
  Search,
  RefreshCw,
  Plug,
  BarChart2,
  Globe2,
  ArrowRight,
  Copy,
  Play,
} from "lucide-react";

const sections = [
  { id: "overview", title: "API Overview", label: "Overview", icon: Globe },
  { id: "authentication", title: "Authentication", label: "Auth", icon: Lock },
  { id: "endpoints", title: "API Endpoints", label: "Endpoints", icon: Terminal },
  { id: "webhooks", title: "Webhooks", label: "Webhooks", icon: RefreshCw },
  { id: "errors", title: "Error Codes", label: "Errors", icon: AlertTriangle },
  { id: "rate-limits", title: "Rate Limits", label: "Limits", icon: Zap },
  { id: "sdks", title: "SDKs & Libraries", label: "SDKs", icon: Code },
  { id: "testing", title: "Testing & Sandbox", label: "Testing", icon: ShieldCheck },
  { id: "monitoring", title: "Monitoring & Analytics", label: "Monitor", icon: BarChart2 },
  { id: "changelog", title: "Changelog", label: "Changes", icon: FileText },
];

export default function APIPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("overview");

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
            backgroundImage: "url('https://i.postimg.cc/gkW8VrZk/Banner-1.jpg')",
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
            <span>API Reference</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 text-white leading-none"
          >
            NEXIS{" "}
            <span className="text-violet-500">API</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Complete API reference for integrating with the NEXIS Web3 Community OS platform.
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
              API Reference
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
        <div className="flex-1 min-w-0 space-y-6" id="api-content">
          {/* API Overview Section */}
          <motion.div
            id="overview"
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
                <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">API Overview</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The NEXIS API provides programmatic access to the Web3 Community OS platform. Build integrations for Discord management, NFT verification, prediction markets, and more using our RESTful API and webhooks.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  Base URL
                </h3>
                <div className="bg-background p-3 rounded-lg flex items-center justify-between">
                  <code className="text-[10px] text-muted-foreground">
                    https://api.nexis.io/v1
                  </code>
                  <button className="text-violet-600 dark:text-violet-400 hover:opacity-80">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Key Features
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>RESTful Design:</strong> Standard HTTP methods and status codes</li>
                  <li><strong>JSON Responses:</strong> All responses in JSON format</li>
                  <li><strong>OAuth 2.0:</strong> Secure authentication flow</li>
                  <li><strong>Webhooks:</strong> Real-time event notifications</li>
                  <li><strong>Rate Limiting:</strong> Fair usage controls</li>
                  <li><strong>Sandbox Environment:</strong> Test API without affecting production</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Quick Start
                </h3>
                <p className="text-xs text-muted-foreground">
                  Make your first API call in minutes.
                </p>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    curl -X GET "https://api.nexis.io/v1/health" \<br/>
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                  </code>
                </div>
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
                All NEXIS API requests require authentication using API keys or OAuth tokens. Choose the authentication method that best fits your use case.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  API Key Authentication
                </h3>
                <p className="text-xs text-muted-foreground">
                  Include your API key in the Authorization header.
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
                  OAuth 2.0
                </h3>
                <p className="text-xs text-muted-foreground">
                  Use OAuth 2.0 for user authentication and delegated access.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Authorization Endpoint:</strong> <code className="bg-background px-1 rounded">https://api.nexis.io/oauth/authorize</code></li>
                  <li><strong>Token Endpoint:</strong> <code className="bg-background px-1 rounded">https://api.nexis.io/oauth/token</code></li>
                  <li><strong>Scopes:</strong> <code className="bg-background px-1 rounded">read write admin</code></li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* API Endpoints Section */}
          <motion.div
            id="endpoints"
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
                <Terminal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">API Endpoints</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Explore all available API endpoints organized by category. Each endpoint includes HTTP method, URL, parameters, and response examples.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  User Endpoints
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>GET /users</strong> - List all users</li>
                  <li><strong>GET /users/:id</strong> - Get user details</li>
                  <li><strong>POST /users</strong> - Create new user</li>
                  <li><strong>PATCH /users/:id</strong> - Update user</li>
                  <li><strong>DELETE /users/:id</strong> - Delete user</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Bot Endpoints
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>GET /bots</strong> - List connected bots</li>
                  <li><strong>POST /bots/install</strong> - Install bot to server</li>
                  <li><strong>GET /bots/:id/status</strong> - Get bot status</li>
                  <li><strong>POST /bots/:id/configure</strong> - Configure bot</li>
                  <li><strong>DELETE /bots/:id</strong> - Remove bot</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4 text-yellow-400" />
                  Wallet Endpoints
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>GET /wallets</strong> - List user wallets</li>
                  <li><strong>POST /wallets/connect</strong> - Connect wallet</li>
                  <li><strong>POST /wallets/verify</strong> - Verify wallet signature</li>
                  <li><strong>DELETE /wallets/:id</strong> - Disconnect wallet</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  NFT Endpoints
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>GET /nft/holdings</strong> - Get NFT holdings</li>
                  <li><strong>POST /nft/verify</strong> - Verify NFT ownership</li>
                  <li><strong>GET /nft/tiers</strong> - Get holder tiers</li>
                  <li><strong>POST /nft/sync-role</strong> - Sync Discord role</li>
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
                04
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                <RefreshCw className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Webhooks</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Configure webhooks to receive real-time notifications about NEXIS events. Webhooks enable your application to react to changes without polling.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Available Events
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>user.created</strong> - New user registered</li>
                  <li><strong>user.updated</strong> - User profile updated</li>
                  <li><strong>subscription.created</strong> - New subscription</li>
                  <li><strong>subscription.updated</strong> - Subscription status changed</li>
                  <li><strong>nft.verified</strong> - NFT ownership verified</li>
                  <li><strong>tier.changed</strong> - Holder tier updated</li>
                  <li><strong>prediction.created</strong> - New prediction market</li>
                  <li><strong>prediction.settled</strong> - Prediction settled</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Webhook Security
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verify webhook signatures to ensure requests are from NEXIS.
                </p>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    X-Nexis-Signature: sha256=HASH
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Codes Section */}
          <motion.div
            id="errors"
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
                <AlertTriangle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Error Codes</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NEXIS API uses standard HTTP status codes and custom error codes for detailed error reporting.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  HTTP Status Codes
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>200 OK</strong> - Request successful</li>
                  <li><strong>201 Created</strong> - Resource created</li>
                  <li><strong>400 Bad Request</strong> - Invalid request</li>
                  <li><strong>401 Unauthorized</strong> - Authentication failed</li>
                  <li><strong>403 Forbidden</strong> - Insufficient permissions</li>
                  <li><strong>404 Not Found</strong> - Resource not found</li>
                  <li><strong>429 Too Many Requests</strong> - Rate limit exceeded</li>
                  <li><strong>500 Internal Server Error</strong> - Server error</li>
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
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key",
    "request_id": "req_1234567890"
  }
}`}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rate Limits Section */}
          <motion.div
            id="rate-limits"
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
                <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Rate Limits</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                API rate limits ensure fair usage and system stability. Different tiers have different limits.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Rate Limit Tiers
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Free:</strong> 100 requests/minute, 10,000 requests/day</li>
                  <li><strong>Starter:</strong> 1,000 requests/minute, 100,000 requests/day</li>
                  <li><strong>Pro:</strong> 10,000 requests/minute, 1,000,000 requests/day</li>
                  <li><strong>Enterprise:</strong> Custom limits</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Rate Limit Headers
                </h3>
                <p className="text-xs text-muted-foreground">
                  Rate limit information is included in response headers.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>X-RateLimit-Limit:</strong> Your rate limit</li>
                  <li><strong>X-RateLimit-Remaining:</strong> Requests remaining</li>
                  <li><strong>X-RateLimit-Reset:</strong> Unix timestamp of reset</li>
                  <li><strong>Retry-After:</strong> Seconds until retry (on 429)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* SDKs Section */}
          <motion.div
            id="sdks"
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
                <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">SDKs & Libraries</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Use official NEXIS SDKs for quick integration in your preferred programming language.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  JavaScript/TypeScript
                </h3>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    npm install @nexis/sdk
                  </code>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  Python
                </h3>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    pip install nexis-python
                  </code>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  Go
                </h3>
                <div className="bg-background p-3 rounded-lg">
                  <code className="text-[10px] text-muted-foreground">
                    go get github.com/nexis/go-sdk
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testing Section */}
          <motion.div
            id="testing"
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
              <h3 className="text-base font-bold tracking-tight text-foreground">Testing & Sandbox</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Use the NEXIS sandbox environment for testing without affecting production data. The sandbox provides full API functionality with test data.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Play className="w-4 h-4 text-green-400" />
                  Sandbox Environment
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Base URL:</strong> <code className="bg-background px-1 rounded">https://sandbox-api.nexis.io/v1</code></li>
                  <li><strong>Test Data:</strong> Pre-populated test users and data</li>
                  <li><strong>No Cost:</strong> Free testing environment</li>
                  <li><strong>Rate Limits:</strong> Generous limits for testing</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Testing Best Practices
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Mock Responses:</strong> Use mock responses for unit tests</li>
                  <li><strong>Integration Tests:</strong> Test against sandbox</li>
                  <li><strong>Error Scenarios:</strong> Test error handling</li>
                  <li><strong>Rate Limiting:</strong> Test rate limit handling</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Monitoring Section */}
          <motion.div
            id="monitoring"
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
                <BarChart2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Monitoring & Analytics</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Monitor your API usage and performance through the NEXIS dashboard. Track request counts, error rates, latency, and more.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  Available Metrics
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Request Count:</strong> Total API requests</li>
                  <li><strong>Error Rate:</strong> Percentage of failed requests</li>
                  <li><strong>Average Latency:</strong> Response time metrics</li>
                  <li><strong>Rate Limit Hits:</strong> Rate limit violations</li>
                  <li><strong>Endpoint Usage:</strong> Most used endpoints</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  Alerts & Notifications
                </h3>
                <p className="text-xs text-muted-foreground">
                  Set up alerts for critical metrics and receive notifications via email or webhooks.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Error Rate Alerts:</strong> Notify when error rate exceeds threshold</li>
                  <li><strong>Latency Alerts:</strong> Notify when response time is slow</li>
                  <li><strong>Usage Alerts:</strong> Notify when approaching rate limits</li>
                  <li><strong>Custom Alerts:</strong> Create custom alert conditions</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Changelog Section */}
          <motion.div
            id="changelog"
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
                <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Changelog</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Stay updated with the latest API changes, new features, and improvements.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Version 1.2.0 (Latest)
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Added:</strong> NFT marketplace endpoints</li>
                  <li><strong>Added:</strong> Advanced prediction analytics</li>
                  <li><strong>Improved:</strong> Rate limit headers accuracy</li>
                  <li><strong>Fixed:</strong> Webhook signature verification</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Version 1.1.0
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Added:</strong> Arena prediction endpoints</li>
                  <li><strong>Added:</strong> XP system API</li>
                  <li><strong>Improved:</strong> Error response consistency</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  Version 1.0.0
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Initial Release:</strong> Core API endpoints</li>
                  <li><strong>Features:</strong> Authentication, Users, Bots, Wallets</li>
                  <li><strong>Webhooks:</strong> Basic webhook support</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              NEXIS · API Reference
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

        </div>
      </section>
    </main>
  );
}