"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Gem,
  LineChart,
  Sparkles,
  Target,
  Trophy,
  Users,
  WalletCards,
  CheckCircle2,
  CheckCircle,
  Building2,
  Bitcoin,
  Crown,
  Flame,
  Unplug,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TradeRow {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entry: number;
  lotSize: number;
  date: string;
  profit: number;
  status: "WIN" | "LOSS" | "OPEN";
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  image: string;
  url?: string;
}

interface CalendarItem {
  id: string;
  country: string;
  title: string;
  time: string;
  impact: string;
}

interface DashboardData {
  totalSpent: number;
  totalProfit: number;
  todayProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  pendingPlans: number;
  activePlan: number;
  rejectedPlans: number;
  recentTrades: TradeRow[];
  news: NewsItem[];
  tradingCalendar: CalendarItem[];
  accountStatus: "VERIFIED" | "UNVERIFIED";
  joined: string;
  role: string;
  plan: {
    name: string;
    amount: number;
    accountSize: string;
    duration: string;
    startDate: string;
    expires: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
  };
}

// Banner images for hero section
const BANNER_IMAGES = ["/banner.png", "/banner1.png", "/banner2.png", "/banner3.png"];

// NFT images for Featured NFT section
const NFT_IMAGES = ["/nft1.jpeg", "/nft2.jpeg", "/nft3.jpeg", "/nft4.jpeg"];

const MOCK_NEWS_IMAGE =
  "https://i.postimg.cc/q7C5L9zC/The-West-Is-Losing-Control-Over-The-Gold-Price.jpg";

function formatCurrency(value: number) {
  return `$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}


function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-72 rounded-3xl bg-muted" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-96 rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

/**
 * Cycles through a list of local images, cross-fading the current image
 * out while the next one fades in. Loops forever every `intervalMs`.
 */
function CyclingImage({
  images,
  alt = "",
  className = "",
  intervalMs = 5000,
}: {
  images: string[];
  alt?: string;
  className?: string;
  intervalMs?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {images.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`border-border bg-card/70 text-card-foreground shadow-2xl backdrop-blur-xl dark:bg-card/45 ${className}`}
    >
      {children}
    </Card>
  );
}

function QuickAccess({
  href,
  icon,
  title,
  description,
  tone = "violet",
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "violet" | "gold" | "green" | "blue";
}) {
  const tones = {
    violet:
      "border-violet-500/30 bg-violet-500/10 text-violet-600 hover:border-violet-400 dark:text-violet-300",
    gold: "border-primary/40 bg-primary/10 text-primary hover:border-primary",
    green:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:border-emerald-400 dark:text-emerald-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-600 hover:border-blue-400 dark:text-blue-300",
  };

  return (
    <Link href={href}>
      <div
        className={`group flex min-h-[50px] items-center justify-between rounded-xl border px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-accent/60 ${tones[tone]}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60">
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {title}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatusPill({
  children,
  color = "green",
}: {
  children: React.ReactNode;
  color?: "green" | "purple" | "gold" | "red" | "violet";
}) {
  const colors = {
    green:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    purple:
      "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300",
    gold: "border-primary/30 bg-primary/10 text-primary",
    red: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300",
    violet:
      "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function Avatar({ src, fallback }: { src?: string; fallback: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-9 w-9 rounded-full border border-border object-cover"
    />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-foreground">
      {fallback}
    </div>
  );
}

function TokenChart() {
  return (
    <div className="relative h-16 w-full overflow-hidden">
      <svg
        viewBox="0 0 320 80"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 67 L18 60 L33 64 L48 50 L63 56 L78 38 L93 45 L108 32 L123 48 L138 43 L153 52 L168 34 L183 40 L198 20 L213 26 L228 35 L243 19 L258 25 L273 8 L288 17 L304 5 L320 12 V80 H0 Z"
          fill="url(#chartFill)"
        />
        <path
          d="M0 67 L18 60 L33 64 L48 50 L63 56 L78 38 L93 45 L108 32 L123 48 L138 43 L153 52 L168 34 L183 40 L198 20 L213 26 L228 35 L243 19 L258 25 L273 8 L288 17 L304 5 L320 12"
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function CalendarRow({ item }: { item: CalendarItem }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-600 dark:text-blue-300">
          {item.country}
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">
            {item.title}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {item.time}
          </p>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground">{item.impact}</span>
    </div>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  const content = (
    <div className="group flex gap-3 py-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground/90 group-hover:text-primary">
          {item.title}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {item.source}
        </p>
      </div>
    </div>
  );

  if (!item.url) return content;

  return (
    <Link href={item.url} target="_blank" rel="noopener noreferrer">
      {content}
    </Link>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  async function fetchDashboardData(showRefresh = false) {
    try {
      if (showRefresh) setRefreshing(true);

      const response = await fetch("/api/user/info", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load dashboard data");
      }

      const userData = await response.json();

      if (userData.success) {
        setData({
          totalSpent: 30,
          totalProfit: 15.5,
          todayProfit: 2.75,
          weeklyProfit: 8.4,
          monthlyProfit: 15.5,
          winRate: 66.7,
          totalTrades: 9,
          winningTrades: 6,
          losingTrades: 3,
          pendingPlans: 0,
          activePlan: 0,
          rejectedPlans: 1,
          recentTrades: [
            {
              id: "TRD-001",
              symbol: "XAUUSDm",
              type: "BUY",
              entry: 4388.23,
              lotSize: 0.05,
              date: "2026-08-13",
              profit: 125.5,
              status: "WIN",
            },
            {
              id: "TRD-002",
              symbol: "XAUUSDm",
              type: "SELL",
              entry: 4388.71,
              lotSize: 0.05,
              date: "2026-08-13",
              profit: -45.3,
              status: "LOSS",
            },
            {
              id: "TRD-003",
              symbol: "XAUUSDm",
              type: "SELL",
              entry: 4426.15,
              lotSize: 0.02,
              date: "2026-08-12",
              profit: 78.25,
              status: "WIN",
            },
            {
              id: "TRD-004",
              symbol: "XAUUSDm",
              type: "BUY",
              entry: 4430.74,
              lotSize: 0.02,
              date: "2026-08-12",
              profit: -32.1,
              status: "LOSS",
            },
            {
              id: "TRD-005",
              symbol: "XAUUSDm",
              type: "BUY",
              entry: 4405.72,
              lotSize: 0.02,
              date: "2026-08-12",
              profit: 56.8,
              status: "WIN",
            },
            {
              id: "TRD-006",
              symbol: "XAUUSDm",
              type: "BUY",
              entry: 4405.72,
              lotSize: 0.02,
              date: "2026-08-12",
              profit: 12.4,
              status: "WIN",
            },
          ],
          news: [
            {
              id: "NEWS-001",
              title:
                "EUR/USD Analysis: Euro Loses Momentum Following the U.S. PCE Release",
              source: "Forex.com",
              image: MOCK_NEWS_IMAGE,
            },
            {
              id: "NEWS-002",
              title:
                "Euro rally stalls against US Dollar as spreads drive trade",
              source: "FXStreet",
              image: MOCK_NEWS_IMAGE,
            },
            {
              id: "NEWS-003",
              title:
                "Pound Sterling Price News and Forecast: GBP/USD retreats",
              source: "FXStreet",
              image: MOCK_NEWS_IMAGE,
            },
          ],
          tradingCalendar: [
            {
              id: "CAL-001",
              country: "US",
              title: "Non-Farm Payrolls",
              time: "08:30 AM",
              impact: "High",
            },
            {
              id: "CAL-002",
              country: "EU",
              title: "ECB Interest Rate Decision",
              time: "12:45 PM",
              impact: "High",
            },
            {
              id: "CAL-003",
              country: "UK",
              title: "GDP Growth Rate",
              time: "09:00 AM",
              impact: "Medium",
            },
          ],
          accountStatus: "VERIFIED",
          joined: "JUL 2026",
          role: "ADMIN",
          plan: {
            name: "STANDARD PLAN",
            amount: 20,
            accountSize: "$200 - $500",
            duration: "14 DAYS",
            startDate: "2026-07-21",
            expires: "2026-08-04",
            status: "APPROVED",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useMemo(() => (data ? data.totalSpent + data.totalProfit : 0), [data]);

  if (loading) {
    return <LoadingDashboard />;
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-lg font-bold">Dashboard unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We could not load your account information.
            </p>
            <Button
              onClick={() => fetchDashboardData(true)}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-foreground">
      <div className="mx-auto max-w-[1500px] space-y-4 py-3">
        {/* 75 / 25 layout: left column carries the primary content, right column carries the identity + market rail */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* LEFT — 75% */}
          <div className="space-y-4 lg:col-span-9">
            {/* Hero */}
            <section className="relative min-h-[300px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="absolute inset-0 lg:w-[100%] lg:h-[100%] opacity-100">
                <CyclingImage images={BANNER_IMAGES} alt="Nexis featured artwork" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              <div className="relative flex min-h-[310px] items-center px-6 py-8 sm:px-10">
                <div className="max-w-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                    Welcome to
                  </p>
                  <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
                    NEXIS
                  </h1>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
                    Digital Identity. Real Utility.
                    <br />
                    Built for the Future.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link href="/user-dashboard/bots/pricing">
                      <Button className="rounded-full bg-primary p-5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                        Get Bot Subscription
                      </Button>
                    </Link>
                    <Link
                      href="/user-dashboard/wallet"
                      className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border">
                        ▶
                      </span>
                      Connect Wallet
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick access */}
            <section>
              <p className="mb-3 text-[12px] font-black uppercase tracking-widest text-muted-foreground">
                Quick Access
              </p>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAccess
                  href="/user-dashboard/bots/pricing"
                  title="Bot Plans"
                  description="View subscription plans"
                  icon={<CheckCircle className="h-5 w-5" />}
                  tone="violet"
                />
                <QuickAccess
                  href="/user-dashboard/bots/servers"
                  title="My Servers"
                  description="Manage Discord servers"
                  icon={<Building2 className="h-5 w-5" />}
                  tone="gold"
                />
                <QuickAccess
                  href="/user-dashboard/wallet"
                  title="Wallet"
                  description="Connect & verify wallet"
                  icon={<WalletCards className="h-5 w-5" />}
                  tone="green"
                />
                <QuickAccess
                  href="/user-dashboard/holdings"
                  title="NXAE Holdings"
                  description="View your NFTs"
                  icon={<Gem className="h-5 w-5" />}
                  tone="blue"
                />
              </div>
            </section>

            {/* Bot Subscription Status + Web3 Status */}
            <section className="grid gap-4 md:grid-cols-2">
              <GlassCard>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                      Bot Subscription
                    </CardTitle>
                    <StatusPill color="green">
                      Active
                    </StatusPill>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Standard Plan
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Connected Servers
                        </p>
                        <p className="mt-1 text-2xl font-black text-foreground">
                          3
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-violet-600 dark:text-violet-300" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      All servers operational
                    </div>
                  </div>

                  <Link
                    href="/user-dashboard/bots/servers"
                    className="mt-4 flex items-center justify-between rounded-xl border border-border px-3 py-3 text-xs text-muted-foreground hover:bg-accent"
                  >
                    Manage Servers
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </GlassCard>

              <GlassCard>
                <CardHeader className="pb-3">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                    Web3 Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Wallet Status
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <StatusPill color="green">
                              Connected
                            </StatusPill>
                            <span className="text-xs text-muted-foreground">
                              0x1234...5678
                            </span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Bitcoin className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            NXAE Holdings
                          </p>
                          <p className="mt-1 text-2xl font-black text-foreground">
                            3
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Gold Tier
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                          <Crown className="h-6 w-6 text-violet-600 dark:text-violet-300" />
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/user-dashboard/holdings"
                      className="flex items-center justify-between rounded-xl border border-border px-3 py-3 text-xs text-muted-foreground hover:bg-accent"
                    >
                      View Holdings
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </GlassCard>
            </section>
          </div>

          {/* RIGHT — 25% */}
          <div className="space-y-4 lg:col-span-3">
            {/* User Profile */}
            <GlassCard>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <Avatar fallback="F" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">FUTUREX</p>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Gold Tier Holder
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    NXAE Holdings
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[60%] rounded-full bg-violet-500" />
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  3 / 5 NFTs
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg border border-border bg-muted/30 py-2">
                    <Building2 className="mx-auto h-4 w-4 text-violet-600 dark:text-violet-300" />
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Servers
                    </p>
                    <p className="mt-1 text-xs font-bold">3</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 py-2">
                    <ShieldCheck className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Status
                    </p>
                    <p className="mt-1 text-xs font-bold">Active</p>
                  </div>
                </div>
              </CardContent>
              <CardContent className="border-t border-border px-5 py-3">
                <Link
                  href="/user-dashboard/profile"
                  className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground"
                >
                  View Full Profile
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </GlassCard>

            {/* Notifications */}
            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                  Notifications
                </CardTitle>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-300">
                  3 New
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      Bot subscription renewed
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      New server connected
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      5 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      Moderation action taken
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      1 day ago
                    </p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard>
              <CardHeader className="pb-3">
                <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/user-dashboard/bots/install-discord"
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <Unplug className="h-4 w-4" />
                  Install Discord Bot
                </Link>
                <Link
                  href="/user-dashboard/wallet"
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <Bitcoin className="h-4 w-4" />
                  Connect Wallet
                </Link>
                <Link
                  href="/user-dashboard/bots/pricing"
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  Upgrade Subscription
                </Link>
              </CardContent>
            </GlassCard>
          </div>
        </div>

        {/* Platform Overview */}
        <section className="grid gap-4 lg:grid-cols-3">
          <GlassCard>
            <CardHeader>
              <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                Account Overview
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Your platform status and entitlements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Holder Tier</span>
                <span className="font-bold text-violet-600 dark:text-violet-300">
                  Gold
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">NXAE Holdings</span>
                <span className="font-bold">3 NFTs</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bot Subscription</span>
                <StatusPill color="green">
                  Active
                </StatusPill>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Account Status
                </span>
                <StatusPill color="green">
                  <ShieldCheck className="h-3 w-3" />
                  {data.accountStatus}
                </StatusPill>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                  Bot Activity
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Recent moderation actions.
                </CardDescription>
              </div>
              <Link href="/user-dashboard/bots/activity">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border bg-transparent text-xs text-muted-foreground"
                >
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Spam blocked
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Server #1 • 2 min ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-red-600 dark:text-red-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    User timeout
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Server #2 • 15 min ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Warning issued
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Server #3 • 1 hour ago
                  </p>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[12px] font-black uppercase tracking-widest">
                Market Snapshot
              </CardTitle>
              <Link href="/user-dashboard/market">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border bg-transparent text-xs text-muted-foreground"
                >
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {data.news.map((item) => (
                <NewsRow key={item.id} item={item} />
              ))}
            </CardContent>
          </GlassCard>
        </section>

        {/* Bottom utility bar */}
        <section className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-bold">Secure & Verified</p>
              <p className="text-[10px] text-muted-foreground">
                Built on trusted systems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WalletCards className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-bold">NFT Utility</p>
              <p className="text-[10px] text-muted-foreground">
                Real use beyond art
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-bold">Community Driven</p>
              <p className="text-[10px] text-muted-foreground">
                Powered by you
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-bold">Rewards & XP</p>
              <p className="text-[10px] text-muted-foreground">
                Earn while you engage
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}