"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  ExternalLink,
  Filter,
  Gavel,
  Gem,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Unplug,
  UserPlus,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Range = "7" | "14" | "30";
type ServerStatus = "Active" | "Pending" | "Offline";
type SubscriptionStatus = "Active" | "Pending" | "Expired";
type Tone = "primary" | "violet" | "emerald" | "amber" | "blue" | "orange";

interface DailyActivity {
  date: string;
  commands: number;
  moderation: number;
}

interface DiscordServer {
  id: string;
  name: string;
  initials: string;
  members: number;
  plan: string;
  status: ServerStatus;
  commands: number;
  renewalDate: string;
  tone: Tone;
}

interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "moderation" | "subscription" | "server" | "automation";
}

interface Subscription {
  id: string;
  name: string;
  description: string;
  serverName: string;
  price: number;
  interval: "month" | "year";
  status: SubscriptionStatus;
  renewalDate: string;
  usage: number;
  limit: number;
  tone: Tone;
}

interface BotModule {
  id: string;
  name: string;
  category: string;
  servers: number;
  actions: number;
  icon: "spam" | "welcome" | "timeout" | "chat";
}

interface Web3Status {
  wallet: string | null;
  holdings: number;
  maxHoldings: number;
  tier: string;
}

interface DashboardData {
  dailyActivity: DailyActivity[];
  servers: DiscordServer[];
  activity: ActivityEvent[];
  subscriptions: Subscription[];
  modules: BotModule[];
  web3: Web3Status;
}

/* -------------------------------------------------------------------------- */
/* Demo data                                                                  */
/* -------------------------------------------------------------------------- */

const DEMO_DATA: DashboardData = {
  dailyActivity: Array.from({ length: 30 }, (_, index) => {
    const commands = [
      180, 240, 310, 275, 220, 260, 345, 390, 360, 435,
      325, 280, 410, 460, 395, 360, 425, 505, 570, 540,
      460, 380, 420, 490, 455, 510, 585, 530, 610, 640,
    ];

    const moderation = [
      55, 72, 95, 82, 65, 78, 105, 115, 98, 130,
      88, 80, 120, 145, 115, 105, 138, 160, 185, 165,
      140, 115, 125, 155, 138, 170, 195, 175, 205, 220,
    ];

    return {
      date: `2026-10-${String(index + 1).padStart(2, "0")}`,
      commands: commands[index],
      moderation: moderation[index],
    };
  }),

  servers: [
    {
      id: "srv-001",
      name: "Nexis Community",
      initials: "NX",
      members: 12480,
      plan: "Pro",
      status: "Active",
      commands: 8452,
      renewalDate: "2026-11-01",
      tone: "primary",
    },
    {
      id: "srv-002",
      name: "FutureX Hub",
      initials: "FX",
      members: 5830,
      plan: "Standard",
      status: "Active",
      commands: 3291,
      renewalDate: "2026-11-05",
      tone: "violet",
    },
    {
      id: "srv-003",
      name: "Creators Lounge",
      initials: "CL",
      members: 2340,
      plan: "Standard",
      status: "Active",
      commands: 1847,
      renewalDate: "2026-11-12",
      tone: "emerald",
    },
    {
      id: "srv-004",
      name: "Gaming Central",
      initials: "GC",
      members: 1820,
      plan: "Starter",
      status: "Pending",
      commands: 0,
      renewalDate: "",
      tone: "amber",
    },
  ],

  activity: [
    {
      id: "event-001",
      title: "Spam messages blocked",
      description: "Nexis Community · Auto-moderation",
      time: "2 min ago",
      type: "moderation",
    },
    {
      id: "event-002",
      title: "Subscription renewed",
      description: "FutureX Hub · Standard plan",
      time: "18 min ago",
      type: "subscription",
    },
    {
      id: "event-003",
      title: "Welcome automation triggered",
      description: "Creators Lounge · 12 new members",
      time: "42 min ago",
      type: "automation",
    },
    {
      id: "event-004",
      title: "Server awaiting activation",
      description: "Gaming Central · Complete setup",
      time: "1 hour ago",
      type: "server",
    },
  ],

  subscriptions: [
    {
      id: "sub-001",
      name: "Nexis Pro",
      description: "Advanced moderation & automation",
      serverName: "Nexis Community",
      price: 29,
      interval: "month",
      status: "Active",
      renewalDate: "2026-11-01",
      usage: 8452,
      limit: 25000,
      tone: "primary",
    },
    {
      id: "sub-002",
      name: "Nexis Standard",
      description: "Essential tools for growing communities",
      serverName: "FutureX Hub",
      price: 15,
      interval: "month",
      status: "Active",
      renewalDate: "2026-11-05",
      usage: 3291,
      limit: 10000,
      tone: "violet",
    },
    {
      id: "sub-003",
      name: "Nexis Standard",
      description: "Essential tools for growing communities",
      serverName: "Creators Lounge",
      price: 15,
      interval: "month",
      status: "Active",
      renewalDate: "2026-11-12",
      usage: 1847,
      limit: 10000,
      tone: "emerald",
    },
  ],

  modules: [
    {
      id: "mod-1",
      name: "Anti-Spam Shield",
      category: "Moderation",
      servers: 3,
      actions: 987,
      icon: "spam",
    },
    {
      id: "mod-2",
      name: "Welcome & Verify",
      category: "Onboarding",
      servers: 3,
      actions: 645,
      icon: "welcome",
    },
    {
      id: "mod-3",
      name: "Auto Timeout",
      category: "Moderation",
      servers: 2,
      actions: 521,
      icon: "timeout",
    },
    {
      id: "mod-4",
      name: "Chat Filters",
      category: "Moderation",
      servers: 1,
      actions: 192,
      icon: "chat",
    },
  ],

  web3: {
    wallet: "0x1234...5678",
    holdings: 3,
    maxHoldings: 5,
    tier: "Gold",
  },
};

/**
 * Preview data only.
 *
 * Replace this function with your real dashboard request and return
 * a validated DashboardData object.
 */
async function loadDashboardData(): Promise<DashboardData> {
  return DEMO_DATA;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const numberFormatter = new Intl.NumberFormat("en-US");

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatCompact(value: number) {
  return compactFormatter.format(value);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "Not activated";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

const toneStyles: Record<
  Tone,
  { text: string; background: string; gradient: string; border: string; pill: string }
> = {
  primary: {
    text: "text-primary",
    background: "bg-primary/10",
    gradient: "from-primary/20 via-primary/5 to-card",
    border: "border-primary/30",
    pill: "bg-primary/15 text-primary",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-300",
    background: "bg-violet-500/10",
    gradient: "from-violet-500/20 via-violet-500/5 to-card",
    border: "border-violet-500/30",
    pill: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-300",
    background: "bg-emerald-500/10",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-card",
    border: "border-emerald-500/30",
    pill: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-300",
    background: "bg-amber-500/10",
    gradient: "from-amber-500/20 via-amber-500/5 to-card",
    border: "border-amber-500/30",
    pill: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-300",
    background: "bg-blue-500/10",
    gradient: "from-blue-500/20 via-blue-500/5 to-card",
    border: "border-blue-500/30",
    pill: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  },
  orange: {
    text: "text-orange-600 dark:text-orange-300",
    background: "bg-orange-500/10",
    gradient: "from-orange-500/20 via-orange-500/5 to-card",
    border: "border-orange-500/30",
    pill: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
  },
};

type Point = { x: number; y: number };

function getPoints(
  values: number[],
  width: number,
  height: number,
  padding: number,
  maximum?: number,
): Point[] {
  const max = Math.max(maximum ?? Math.max(...values), 1);
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return values.map((value, index) => ({
    x: padding + (index / Math.max(values.length - 1, 1)) * usableWidth,
    y: height - padding - (value / max) * usableHeight,
  }));
}

/** Smooth curve through points (Catmull-Rom converted to cubic Beziers). */
function smoothPath(points: Point[]) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

/* -------------------------------------------------------------------------- */
/* Shared components                                                          */
/* -------------------------------------------------------------------------- */

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border border-border bg-card/80 text-card-foreground shadow-lg backdrop-blur-xl dark:bg-card/50 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>

        {description && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function StatusBadge({
  status,
}: {
  status: ServerStatus | SubscriptionStatus;
}) {
  const styles: Record<string, string> = {
    Active:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    Pending:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    Offline: "border-border bg-muted text-muted-foreground",
    Expired:
      "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

const planStyles: Record<string, string> = {
  Pro: "border-primary/30 bg-primary/10 text-primary",
  Standard:
    "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  Starter:
    "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300",
};

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[10px] font-medium ${
        planStyles[plan] ?? "border-border bg-muted/50"
      }`}
    >
      {plan}
    </span>
  );
}

function ServerAvatar({
  initials,
  tone,
}: {
  initials: string;
  tone: Tone;
}) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold ${toneStyles[tone].background} ${toneStyles[tone].text} ${toneStyles[tone].border}`}
    >
      {initials}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const id = `spark-${useId().replace(/:/g, "")}`;
  const width = 180;
  const height = 65;
  const points = getPoints(values, width, height, 4);
  const path = smoothPath(points);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={`${path} L ${width - 4} ${height} L 4 ${height} Z`}
        fill={`url(#${id})`}
      />

      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon,
  tone,
  values,
}: {
  title: string;
  value: string;
  subtitle: string;
  change: number;
  icon: ReactNode;
  tone: Tone;
  values: number[];
}) {
  const styles = toneStyles[tone];
  const positive = change >= 0;

  return (
    <div
      className={`relative min-h-[140px] overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-lg ${styles.border} ${styles.gradient}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 right-0 h-[70px] w-[58%] opacity-80 ${styles.text}`}
      >
        <Sparkline values={values} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className={styles.text}>{icon}</span>
            {title}
          </p>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles.pill}`}
          >
            {positive ? "+" : "-"}
            {Math.abs(change)}%
          </span>
        </div>

        <p className="mt-3 text-[27px] font-bold leading-none tracking-tight sm:text-[30px]">
          {value}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-[10px]">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              positive
                ? "text-emerald-600 dark:text-emerald-300"
                : "text-red-600 dark:text-red-300"
            }`}
          >
            {positive ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </span>

          <span className="text-muted-foreground">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main chart                                                                 */
/* -------------------------------------------------------------------------- */

function ActivityChart({ items }: { items: DailyActivity[] }) {
  const id = `activity-${useId().replace(/:/g, "")}`;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 800;
  const height = 230;
  const padding = 12;

  const maximum = Math.max(
    100,
    Math.ceil(Math.max(...items.map((item) => item.commands)) / 100) * 100,
  );

  const commandPoints = getPoints(
    items.map((item) => item.commands),
    width,
    height,
    padding,
    maximum,
  );

  const moderationPoints = getPoints(
    items.map((item) => item.moderation),
    width,
    height,
    padding,
    maximum,
  );

  const commandsPath = smoothPath(commandPoints);
  const moderationPath = smoothPath(moderationPoints);

  const selectedIndex =
    hoveredIndex === null ? null : Math.min(hoveredIndex, items.length - 1);

  const selected = selectedIndex === null ? null : items[selectedIndex];
  const selectedPoint =
    selectedIndex === null ? null : commandPoints[selectedIndex];

  const labelIndices = Array.from(
    new Set([
      0,
      Math.floor((items.length - 1) * 0.25),
      Math.floor((items.length - 1) * 0.5),
      Math.floor((items.length - 1) * 0.75),
      items.length - 1,
    ]),
  );

  return (
    <div className="px-4 pb-5 sm:px-5">
      <div className="flex gap-3">
        <div className="flex h-[230px] w-8 shrink-0 flex-col justify-between py-2 text-right text-[10px] text-muted-foreground">
          {[1, 0.75, 0.5, 0.25, 0].map((fraction) => (
            <span key={fraction}>{formatCompact(maximum * fraction)}</span>
          ))}
        </div>

        <div
          className="relative min-w-0 flex-1"
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <svg
            role="img"
            aria-label="Daily commands and moderation actions over the selected period"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="h-[230px] w-full overflow-visible"
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();

              const fraction = Math.max(
                0,
                Math.min(1, (event.clientX - bounds.left) / bounds.width),
              );

              setHoveredIndex(Math.round(fraction * (items.length - 1)));
            }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
              const y = padding + fraction * (height - padding * 2);

              return (
                <line
                  key={fraction}
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-border"
                  strokeDasharray="4 6"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            <g className="text-primary">
              <path
                d={`${commandsPath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
                fill={`url(#${id})`}
              />

              <path
                d={commandsPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <path
              d={moderationPath}
              fill="none"
              stroke="currentColor"
              className="text-violet-500 dark:text-violet-400"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {selectedPoint && (
              <g className="text-primary">
                <line
                  x1={selectedPoint.x}
                  x2={selectedPoint.x}
                  y1={padding}
                  y2={height - padding}
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                />

                <circle
                  cx={selectedPoint.x}
                  cy={selectedPoint.y}
                  r="4"
                  fill="currentColor"
                />
              </g>
            )}
          </svg>

          {selected && (
            <div className="pointer-events-none absolute right-2 top-2 rounded-lg border border-border bg-popover px-3 py-2 text-[11px] text-popover-foreground shadow-lg">
              <p className="mb-1 font-medium">{formatDate(selected.date)}</p>

              <p className="text-primary">
                {formatNumber(selected.commands)} commands
              </p>

              <p className="text-violet-600 dark:text-violet-300">
                {formatNumber(selected.moderation)} moderation actions
              </p>
            </div>
          )}

          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            {labelIndices.map((index) => (
              <span key={items[index].date}>{formatDate(items[index].date)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent activity                                                            */
/* -------------------------------------------------------------------------- */

const eventStyles = {
  moderation: {
    icon: ShieldCheck,
    color: "text-amber-600 dark:text-amber-300",
    background: "bg-amber-500/10",
  },
  subscription: {
    icon: CreditCard,
    color: "text-emerald-600 dark:text-emerald-300",
    background: "bg-emerald-500/10",
  },
  automation: {
    icon: Zap,
    color: "text-violet-600 dark:text-violet-300",
    background: "bg-violet-500/10",
  },
  server: {
    icon: Server,
    color: "text-primary",
    background: "bg-primary/10",
  },
};

function RecentActivity({ items }: { items: ActivityEvent[] }) {
  return (
    <Panel className="flex h-full flex-col">
      <SectionTitle
        title="Recent Activity"
        description="Latest updates across your servers"
        action={<Activity className="h-4 w-4 text-muted-foreground" />}
      />

      <div className="flex-1 space-y-2 px-4 pb-4 sm:px-5">
        {items.map((item) => {
          const style = eventStyles[item.type];
          const Icon = style.icon;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.background} ${style.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{item.title}</p>

                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                <Clock3 className="h-2.5 w-2.5" />
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      <Link
        href="/user-dashboard/bots/activity"
        className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary/5"
      >
        View all activity
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Modules, Web3, Quick actions                                               */
/* -------------------------------------------------------------------------- */

function ModuleIcon({ type }: { type: BotModule["icon"] }) {
  const cls = "h-4 w-4";
  if (type === "spam") return <ShieldCheck className={cls} />;
  if (type === "welcome") return <UserPlus className={cls} />;
  if (type === "timeout") return <Gavel className={cls} />;
  return <MessageSquare className={cls} />;
}

function TopModules({ items }: { items: BotModule[] }) {
  const max = Math.max(...items.map((item) => item.actions), 1);

  return (
    <Panel className="flex h-full flex-col">
      <SectionTitle
        title="Top Bot Modules"
        description="Most used automations this month"
        action={<TextLink href="/user-dashboard/bots/modules">View all</TextLink>}
      />

      <div className="flex-1 space-y-3 px-4 pb-5 sm:px-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <ModuleIcon type={item.icon} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-medium">{item.name}</p>
                <p className="text-xs font-semibold tabular-nums">
                  {formatNumber(item.actions)}
                </p>
              </div>

              <div
                role="progressbar"
                aria-label={`${item.name} share of actions`}
                aria-valuenow={item.actions}
                aria-valuemin={0}
                aria-valuemax={max}
                className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.actions / max) * 100}%` }}
                />
              </div>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {item.category} · {item.servers}{" "}
                {item.servers === 1 ? "server" : "servers"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Web3Panel({ web3 }: { web3: Web3Status }) {
  const percent = Math.min(
    100,
    (web3.holdings / Math.max(web3.maxHoldings, 1)) * 100,
  );

  return (
    <Panel className="flex h-full flex-col">
      <SectionTitle
        title="Web3 & Holdings"
        description="Wallet connection and holder tier"
        action={
          <span className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
            <Crown className="h-3 w-3" />
            {web3.tier} tier
          </span>
        }
      />

      <div className="flex-1 space-y-3 px-4 pb-5 sm:px-5">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <WalletCards className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-medium">Wallet</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {web3.wallet ?? "Not connected"}
              </p>
            </div>
          </div>

          {web3.wallet ? (
            <StatusBadge status="Active" />
          ) : (
            <Link
              href="/user-dashboard/wallet"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Connect
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300">
                <Gem className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-medium">NXAE Holdings</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {web3.holdings} / {web3.maxHoldings} NFTs
                </p>
              </div>
            </div>

            <Link
              href="/user-dashboard/holdings"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              View
            </Link>
          </div>

          <div
            role="progressbar"
            aria-label="NXAE holdings progress"
            aria-valuenow={web3.holdings}
            aria-valuemin={0}
            aria-valuemax={web3.maxHoldings}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function QuickActions() {
  const actions = [
    {
      href: "/UserDashboard/Discord/install",
      icon: Unplug,
      title: "Install Discord bot",
      description: "Add the bot to a new server",
    },
    {
      href: "/user-dashboard/wallet",
      icon: WalletCards,
      title: "Connect wallet",
      description: "Verify your holder tier",
    },
    {
      href: "/UserDashboard/Discord/pricing",
      icon: Sparkles,
      title: "Upgrade subscription",
      description: "Unlock more commands",
    },
  ];

  return (
    <Panel className="flex h-full flex-col">
      <SectionTitle
        title="Quick Actions"
        description="Common things you can do next"
      />

      <div className="flex-1 space-y-2 px-4 pb-5 sm:px-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-medium">{action.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function LoadingDashboard() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading dashboard"
      className="min-h-screen bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1500px] animate-pulse space-y-4 px-4 py-6 sm:px-6">
        <div className="h-12 w-60 rounded-lg bg-muted" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-[140px] rounded-2xl bg-muted" />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="h-[400px] rounded-2xl bg-muted lg:col-span-8" />
          <div className="h-[400px] rounded-2xl bg-muted lg:col-span-4" />
        </div>

        <div className="h-72 rounded-2xl bg-muted" />
        <div className="h-64 rounded-2xl bg-muted" />
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const [range, setRange] = useState<Range>("30");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await loadDashboardData();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your dashboard.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const selectedActivity = useMemo(
    () => data?.dailyActivity.slice(-Number(range)) ?? [],
    [data, range],
  );

  const filteredServers = useMemo(() => {
    if (!data) return [];

    const query = search.trim().toLowerCase();

    return data.servers.filter((server) => {
      const matchesSearch =
        server.name.toLowerCase().includes(query) ||
        server.plan.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || server.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(() => {
    if (!data) {
      return {
        activeBots: 0,
        connectedServers: 0,
        members: 0,
        commands: 0,
        moderation: 0,
        monthlySpend: 0,
      };
    }

    return {
      activeBots: data.servers.filter((server) => server.status === "Active")
        .length,

      connectedServers: data.servers.length,

      members: data.servers.reduce((total, server) => total + server.members, 0),

      commands: selectedActivity.reduce((total, day) => total + day.commands, 0),

      moderation: selectedActivity.reduce(
        (total, day) => total + day.moderation,
        0,
      ),

      monthlySpend: data.subscriptions
        .filter((subscription) => subscription.status === "Active")
        .reduce(
          (total, subscription) =>
            total +
            (subscription.interval === "year"
              ? subscription.price / 12
              : subscription.price),
          0,
        ),
    };
  }, [data, selectedActivity]);

  if (loading) {
    return <LoadingDashboard />;
  }

  if (!data || error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 text-foreground">
        <Panel className="w-full max-w-md p-8 text-center">
          <Bot className="mx-auto h-10 w-10 text-primary" />

          <h1 className="mt-4 text-lg font-semibold">Dashboard unavailable</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "We could not load your account information."}
          </p>

          <Button
            onClick={() => setRetryKey((value) => value + 1)}
            className="mt-5"
          >
            Try again
          </Button>
        </Panel>
      </main>
    );
  }

  const firstDate = selectedActivity[0]?.date;
  const lastDate = selectedActivity[selectedActivity.length - 1]?.date;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1500px] space-y-5 py-5">
        {/* Header */}

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Dashboard
              </h1>

              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                NEXIS
              </span>

              <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
              Manage your bots, subscriptions, and Discord communities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/UserDashboard/Discord/pricing"
              className="inline-flex items-center justify-center gap-2 h-9 px-2.5 rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-xs font-medium transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              View plans
            </Link>

            <Link
              href="/UserDashboard/Discord/install"
              className="inline-flex items-center justify-center gap-2 h-9 px-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 text-xs font-medium transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Discord bot
            </Link>
          </div>
        </header>

        {/* Four overview cards */}

        <section
          aria-label="Account overview"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            title="Active Bots"
            value={formatNumber(stats.activeBots)}
            subtitle="currently running"
            change={15.2}
            icon={<Bot className="h-4 w-4" />}
            tone="blue"
            values={[1, 1, 2, 2, 2, 3, 3, 3, 3, 3]}
          />

          <MetricCard
            title="Connected Servers"
            value={formatNumber(stats.connectedServers)}
            subtitle="linked to your account"
            change={-8.1}
            icon={<Server className="h-4 w-4" />}
            tone="orange"
            values={[4, 4, 3, 4, 3, 3, 4, 3, 4, 4]}
          />

          <MetricCard
            title="Community Members"
            value={formatNumber(stats.members)}
            subtitle="across all servers"
            change={3.5}
            icon={<Users className="h-4 w-4" />}
            tone="violet"
            values={[8, 11, 10, 14, 13, 17, 16, 19, 21, 22]}
          />

          <MetricCard
            title="Monthly Cost"
            value={formatMoney(stats.monthlySpend)}
            subtitle="active plans"
            change={2.1}
            icon={<CreditCard className="h-4 w-4" />}
            tone="emerald"
            values={[15, 15, 29, 29, 44, 44, 44, 59, 59, 59]}
          />
        </section>

        {/* Activity overview + recent activity */}

        <section className="grid items-stretch gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-8">
            <SectionTitle
              title="Bot Activity Overview"
              description={`Daily commands and moderation · last ${range} days`}
              action={
                <label className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-[11px]">
                  <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />

                  <span className="sr-only">Activity date range</span>

                  <select
                    value={range}
                    onChange={(event) => setRange(event.target.value as Range)}
                    className="cursor-pointer bg-transparent text-foreground outline-none"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="14">Last 14 days</option>
                    <option value="30">Last 30 days</option>
                  </select>
                </label>
              }
            />

            <div className="flex flex-wrap items-start justify-between gap-4 px-4 pb-4 sm:px-5">
              <div className="flex gap-7">
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Commands
                  </p>

                  <p className="mt-1 text-xl font-semibold tracking-tight">
                    {formatNumber(stats.commands)}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    Moderation actions
                  </p>

                  <p className="mt-1 text-xl font-semibold tracking-tight">
                    {formatNumber(stats.moderation)}
                  </p>
                </div>
              </div>

              {firstDate && lastDate && (
                <span className="rounded-md bg-muted/60 px-2 py-1 text-[10px] text-muted-foreground">
                  {formatDate(firstDate)} – {formatDate(lastDate)}
                </span>
              )}
            </div>

            {selectedActivity.length > 0 ? (
              <ActivityChart items={selectedActivity} />
            ) : (
              <div className="flex h-[270px] items-center justify-center text-sm text-muted-foreground">
                No activity recorded for this period.
              </div>
            )}
          </Panel>

          <div className="min-w-0 lg:col-span-4">
            <RecentActivity items={data.activity} />
          </div>
        </section>

        {/* Server management */}

        <Panel>
          <SectionTitle
            title="Server Management"
            description="Activate your bot and manage each connected community."
            action={
              <TextLink href="/user-dashboard/bots/servers">
                View all servers
              </TextLink>
            }
          />

          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="relative w-full sm:max-w-[290px]">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="search"
                aria-label="Search servers or plans"
                placeholder="Search servers or plans..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background/60 pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="flex items-center gap-3">
              <p
                aria-live="polite"
                className="whitespace-nowrap text-[11px] text-muted-foreground"
              >
                {filteredServers.length} of {data.servers.length} servers
              </p>

              <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background/60 px-3">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />

                <span className="sr-only">Filter servers by status</span>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="cursor-pointer bg-transparent text-xs outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="offline">Offline</option>
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-y border-border bg-muted/40 text-[10px] font-medium text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Server
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Members
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Bot Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Commands This Month
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Next Renewal
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {filteredServers.map((server) => (
                  <tr
                    key={server.id}
                    className="transition-colors hover:bg-muted/25"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ServerAvatar
                          initials={server.initials}
                          tone={server.tone}
                        />

                        <div>
                          <p className="text-xs font-medium">{server.name}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            Discord community
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                      {formatNumber(server.members)}
                    </td>

                    <td className="px-4 py-3">
                      <PlanBadge plan={server.plan} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={server.status} />
                    </td>

                    <td className="px-4 py-3 text-xs tabular-nums">
                      {formatNumber(server.commands)}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(server.renewalDate)}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <Link
                        href={
                          server.status === "Pending"
                            ? "/user-dashboard/bots/install-discord"
                            : "/user-dashboard/bots/servers"
                        }
                        aria-label={`${
                          server.status === "Pending"
                            ? "Activate bot for"
                            : "Manage"
                        } ${server.name}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                      >
                        {server.status === "Pending" ? "Activate bot" : "Manage"}

                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredServers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <Search className="mx-auto h-6 w-6 text-muted-foreground" />

                      <p className="mt-3 text-sm font-medium">
                        No matching servers
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Try another name or change your status filter.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("all");
                        }}
                        className="mt-3 text-xs font-medium text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/15 px-5 py-3">
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Manage bot permissions and activation from your server settings.
            </p>

            <Link
              href="/user-dashboard/bots/install-discord"
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Connect another server
            </Link>
          </div>
        </Panel>

        {/* Subscription table */}

        <Panel>
          <SectionTitle
            title="Your Bot Subscriptions"
            description="Your plans, billing schedules, and command allowances."
            action={
              <TextLink href="/user-dashboard/bots/pricing">
                Explore plans
              </TextLink>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead>
                <tr className="border-y border-border bg-muted/40 text-[10px] text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Subscription
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Connected Server
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Command Usage
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Renewal
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {data.subscriptions.map((subscription) => {
                  const usagePercent =
                    subscription.limit > 0
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            (subscription.usage / subscription.limit) * 100,
                          ),
                        )
                      : 0;

                  return (
                    <tr
                      key={subscription.id}
                      className="transition-colors hover:bg-muted/25"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${toneStyles[subscription.tone].background} ${toneStyles[subscription.tone].text} ${toneStyles[subscription.tone].border}`}
                          >
                            <Bot className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-xs font-medium">
                              {subscription.name}
                            </p>

                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {subscription.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {subscription.serverName}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="text-xs font-medium">
                          {formatMoney(subscription.price)}
                        </span>

                        <span className="text-[10px] text-muted-foreground">
                          /{subscription.interval === "month" ? "mo" : "yr"}
                        </span>
                      </td>

                      <td className="min-w-[155px] px-4 py-3.5">
                        <div className="max-w-[145px]">
                          <div className="flex items-center justify-between gap-2 text-[10px]">
                            <span>{formatCompact(subscription.usage)}</span>

                            <span className="text-muted-foreground">
                              / {formatCompact(subscription.limit)}
                            </span>
                          </div>

                          <div
                            role="progressbar"
                            aria-label={`${subscription.serverName} command usage`}
                            aria-valuenow={subscription.usage}
                            aria-valuemin={0}
                            aria-valuemax={Math.max(
                              subscription.limit,
                              subscription.usage,
                              1,
                            )}
                            className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
                          >
                            <div
                              className={`h-full rounded-full ${
                                usagePercent >= 90 ? "bg-amber-500" : "bg-primary"
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {formatDate(subscription.renewalDate)}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={subscription.status} />
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href="/user-dashboard/bots/pricing"
                          aria-label={`View plan options for ${subscription.serverName}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {data.subscriptions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-xs text-muted-foreground"
                    >
                      No subscriptions yet. Choose a plan to activate your bot.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Modules + Web3 + Quick actions */}

        <section className="grid items-stretch gap-4 lg:grid-cols-3">
          <TopModules items={data.modules} />
          <Web3Panel web3={data.web3} />
          <QuickActions />
        </section>

        {/* Compact bottom bar */}

        <footer className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {stats.activeBots} active bot installations
            </span>

            <span className="flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5" />
              {stats.connectedServers} connected servers
            </span>

            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              {formatMoney(stats.monthlySpend)}/mo in active plans
            </span>
          </div>

          <Link
            href="/user-dashboard/bots/servers"
            className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:underline"
          >
            Open server settings
            <ExternalLink className="h-3 w-3" />
          </Link>
        </footer>
      </div>
    </main>
  );
}