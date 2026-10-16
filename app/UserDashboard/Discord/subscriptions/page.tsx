"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Server,
  FileText,
  CreditCard,
  ShieldAlert,
  FolderOpen,
  X,
  Banknote,
  Layers,
  CalendarDays,
  Hourglass,
  type LucideIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";
type PaymentStatus = "Paid" | "Failed" | "Pending";

interface Subscription {
  id: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  expirationDate: string;
  autoRenew: boolean;
  connectedServers: number;
  serverLimit: number;
  price: number; // USD
  billingCycle: string;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  date: string;
  amount: number; // USD
  method: string;
  status: PaymentStatus;
}

interface HistoryRecord {
  id: string;
  planName: string;
  action: "Created" | "Renewed" | "Upgraded" | "Cancelled" | "Expired";
  date: string;
  expirationDate: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_10928374",
    planName: "Pro Sentinel Tier",
    status: "active",
    startDate: "OCT 12, 2026",
    expirationDate: "NOV 12, 2026",
    autoRenew: true,
    connectedServers: 4,
    serverLimit: 5,
    price: 29,
    billingCycle: "Monthly",
  },
  {
    id: "sub_10455120",
    planName: "Growth",
    status: "active",
    startDate: "SEP 15, 2026",
    expirationDate: "OCT 15, 2026",
    autoRenew: true,
    connectedServers: 2,
    serverLimit: 10,
    price: 70,
    billingCycle: "Monthly",
  },
  {
    id: "sub_10977001",
    planName: "Basic",
    status: "active",
    startDate: "OCT 01, 2026",
    expirationDate: "NOV 01, 2026",
    autoRenew: false,
    connectedServers: 1,
    serverLimit: 3,
    price: 30,
    billingCycle: "Monthly",
  },
];

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: "tx_104", invoiceId: "INV-2026-1012", date: "OCT 12, 2026", amount: 29, method: "Crypto (USDT)", status: "Paid" },
  { id: "tx_101", invoiceId: "INV-2026-0915", date: "SEP 15, 2026", amount: 70, method: "Crypto (USDT)", status: "Paid" },
  { id: "tx_102", invoiceId: "INV-2026-1001", date: "OCT 01, 2026", amount: 30, method: "Crypto (BTC)", status: "Paid" },
];

const MOCK_HISTORY: HistoryRecord[] = [
  { id: "h_1", planName: "Pro Sentinel Tier", action: "Created", date: "OCT 12, 2026", expirationDate: "NOV 12, 2026" },
  { id: "h_2", planName: "Growth", action: "Created", date: "SEP 15, 2026", expirationDate: "OCT 15, 2026" },
  { id: "h_3", planName: "Basic", action: "Created", date: "OCT 01, 2026", expirationDate: "NOV 01, 2026" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  SubscriptionStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  expired: {
    label: "Expired",
    icon: AlertTriangle,
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { label, icon: Icon, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${className}`}
    >
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const ACTION_STYLES: Record<HistoryRecord["action"], string> = {
  Created: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Renewed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Upgraded: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  Cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Expired: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${PAYMENT_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-5 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <p className="text-2xl md:text-3xl font-black tracking-tighter">{value}</p>
        <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium">{hint}</p>
      </div>
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}>
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  meta,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-2xl border border-border shadow-lg p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-violet-600" />}
          <h2 className="text-base md:text-xl font-black uppercase tracking-tight">{title}</h2>
        </div>
        {meta && <span className="text-[10px] md:text-xs text-muted-foreground font-mono">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-muted/40 rounded-xl p-2.5 md:p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
        {label}
      </div>
      <p className={`text-[10px] md:text-xs font-bold ${valueClassName || "text-foreground"}`}>{value}</p>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [payments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [history] = useState<HistoryRecord[]>(MOCK_HISTORY);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const updateSubscription = (id: string, patch: Partial<Subscription>) =>
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const handleCancelSubscription = () => {
    if (subscription) updateSubscription(subscription.id, { status: "cancelled", autoRenew: false });
    setIsCancelModalOpen(false);
  };

  // Derived stats
  const stats = useMemo(() => {
    const count = (status: SubscriptionStatus) =>
      subscriptions.filter((s) => s.status === status).length;
    const amountSpent = payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const paidCount = payments.filter((p) => p.status === "Paid").length;

    return {
      active: count("active"),
      expired: count("expired"),
      pending: count("pending"),
      amountSpent,
      paidCount,
    };
  }, [subscriptions, payments]);

  const usagePercentage = subscription
    ? Math.min(Math.round((subscription.connectedServers / subscription.serverLimit) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">
        {/* 1. Header */}
        <header className="border-b border-border/60 pb-6 md:pb-8">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Subscription Management</h1>
          <p className="text-muted-foreground text-xs md:text-sm font-medium mt-1 max-w-2xl">
            Monitor active bot service plans, track connected server quotas, review payment receipts, and manage
            renewal options.
          </p>
        </header>

        {/* 2. Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Plans"
            value={subscriptions.length}
            hint="All subscription plans"
            icon={CheckCircle2}
            iconClassName="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard
            label="Active"
            value={stats.active}
            hint="Plans currently running"
            icon={CheckCircle2}
            iconClassName="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard
            label="Expired"
            value={stats.expired}
            hint="Plans past their end date"
            icon={AlertTriangle}
            iconClassName="bg-slate-500/10 text-slate-400"
          />
          <StatCard
            label="Spendings"
            value={formatUSD(stats.amountSpent)}
            hint={`${stats.paidCount} paid transaction${stats.paidCount === 1 ? "" : "s"}`}
            icon={Banknote}
            iconClassName="bg-violet-600/10 text-violet-600"
          />
        </div>

        {/* 3. Current plans (or empty state) */}
        {subscriptions.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-full mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">No Active Subscription</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              You do not have an active bot plan linked to your server cluster. Browse available pricing tiers to
              deploy your bot.
            </p>
            <Link
              href="/bots/pricing"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20"
            >
              Explore Bot Plans <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => {
              return (
<section
  key={sub.id}
  className="group space-y-4 rounded-3xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md md:p-5"
>
  {/* Header */}
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
        <Server className="h-5 w-5" />
      </div>

      <div className="min-w-0 space-y-1">
        <h2 className="truncate text-sm font-semibold tracking-tight md:text-base">
          {sub.planName}
        </h2>
        <p className="text-xs text-muted-foreground">
          Subscription plan
        </p>
      </div>
    </div>

    <StatusBadge status={sub.status} />
  </div>

  {/* Pricing */}
  <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 md:p-4">
    <p className="text-xs font-medium text-muted-foreground">
      Your subscription
    </p>

    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-2xl font-bold tracking-tight md:text-3xl">
        {formatUSD(sub.price)}
      </span>

      <span className="text-sm text-muted-foreground">
        / {sub.billingCycle}
      </span>
    </div>

    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
      {sub.autoRenew
        ? `Your next payment of ${formatUSD(sub.price)} is scheduled for ${sub.expirationDate}.`
        : `Your subscription is scheduled to end on ${sub.expirationDate}.`}
    </p>
  </div>

  
{/* Subscription details */}
<div className="divide-y divide-border/60">
  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-sm text-muted-foreground">Start date</span>
    <span className="text-sm font-medium text-right">{sub.startDate}</span>
  </div>

  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-sm text-muted-foreground">Expiration date</span>
    <span className="text-sm font-medium text-right">{sub.expirationDate}</span>
  </div>

  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-sm text-muted-foreground">Auto renewal</span>
    <span
      className={`text-sm font-medium ${
        sub.autoRenew ? "text-emerald-500" : "text-muted-foreground"
      }`}
    >
      {sub.autoRenew ? "Enabled" : "Disabled"}
    </span>
  </div>

  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-sm text-muted-foreground">Plan status</span>
    <span
      className={`text-sm font-medium capitalize ${
        sub.status === "active"
          ? "text-emerald-500"
          : sub.status === "cancelled"
          ? "text-rose-500"
          : "text-amber-600"
      }`}
    >
      {sub.status}
    </span>
  </div>
</div>

  {/* Subscription ID */}
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
    <span className="text-xs text-muted-foreground">
      Subscription ID
    </span>

    <code className="max-w-full break-all rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
      {sub.id}
    </code>
  </div>

  {/* Actions */}
  <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
    <Link
      href="/UserDashboard/Discord/pricing"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-1"
    >
      <ArrowUpRight className="h-4 w-4" />
      Upgrade plan
    </Link>

    {sub.status === "active" && (
      <button
        type="button"
        onClick={() => {
          setSubscription(sub);
          setIsCancelModalOpen(true);
        }}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:bg-rose-700 active:scale-[0.99] sm:flex-1"
      >
        <X className="h-4 w-4" />
        Cancel plan
      </button>
    )}

    {sub.status === "cancelled" && (
      <button
        type="button"
        onClick={() => {
          setSubscription(sub);
          updateSubscription(sub.id, {
            status: "active",
            autoRenew: true,
          });
        }}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:bg-emerald-700 active:scale-[0.99] sm:flex-1"
      >
        <RefreshCw className="h-4 w-4" />
        Renew plan
      </button>
    )}
  </div>
</section>
              );
            })}
          </div>
        )}

        {/* 4. All subscriptions + Subscription Activity History (side by side on wide screens) */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          <SectionCard title="All Subscriptions" meta={`${subscriptions.length} Plans`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Plan</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Period</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Price</TableHead>
                    <TableHead className="text-right font-black uppercase text-[10px] md:text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((s) => (
                    <TableRow key={s.id} className="border-border/60">
                      <TableCell className="text-[10px] md:text-xs font-bold">{s.planName}</TableCell>
                      <TableCell className="text-[10px] md:text-xs font-medium">
                        {s.startDate} → {s.expirationDate}
                      </TableCell>
                      <TableCell className="text-[10px] md:text-xs font-black">{formatUSD(s.price)}</TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={s.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>

          <SectionCard title="Activity History" meta={`${history.length} Records`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Plan</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Date</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Expiration Date</TableHead>
                    <TableHead className="text-right font-black uppercase text-[10px] md:text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id} className="border-border/60">
                      <TableCell className="text-[10px] md:text-xs font-bold">{h.planName}</TableCell>
                      <TableCell className="text-[10px] md:text-xs font-medium">{h.date}</TableCell>
                      <TableCell className="text-[10px] md:text-xs font-medium">{h.expirationDate}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-black uppercase text-[9px] md:text-[10px] px-2 md:px-2.5 py-1 rounded-md border ${ACTION_STYLES[h.action]}`}>
                          {h.action}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </div>

        {/* 5. Payment History (full width below) */}
        <SectionCard title="Payment History" meta={`${payments.length} Transactions`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-black uppercase text-[10px] md:text-xs">Invoice Ref</TableHead>
                  <TableHead className="font-black uppercase text-[10px] md:text-xs">Date</TableHead>
                  <TableHead className="font-black uppercase text-[10px] md:text-xs">Method</TableHead>
                  <TableHead className="font-black uppercase text-[10px] md:text-xs">Amount</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px] md:text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className="border-border/60">
                    <TableCell className="font-mono text-[10px] md:text-xs font-bold text-violet-600">{p.invoiceId}</TableCell>
                    <TableCell className="text-[10px] md:text-xs font-medium">{p.date}</TableCell>
                    <TableCell className="text-[10px] md:text-xs font-medium">{p.method}</TableCell>
                    <TableCell className="text-[10px] md:text-xs font-black">{formatUSD(p.amount)}</TableCell>
                    <TableCell className="text-right">
                      <PaymentBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        {/* Cancellation confirmation modal */}
        <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <DialogTitle className="font-black uppercase text-lg">Confirm Cancellation</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Are you sure you want to cancel your bot subscription?
              </DialogDescription>
            </DialogHeader>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs space-y-2 text-rose-400 my-2">
              <p className="font-bold uppercase tracking-wider">Warning:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Your bot will lose premium moderation tools at the end of the current billing cycle (
                  {subscription?.expirationDate}).
                </li>
                <li>Guild connection limits will revert to free tier limits.</li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
              >
                Confirm Cancellation
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}