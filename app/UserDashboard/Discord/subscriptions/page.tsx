"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
  FolderOpen,
  ExternalLink,
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

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SubscriptionStatus = "active" | "expired" | "pending" | "rejected";
type PaymentStatus = "Paid" | "Failed" | "Pending";

interface Subscription {
  id: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  expirationDate: string;
  connectedServers: number;
  serverLimit: number;
  price: number; // USD
  billingCycle: string;
  _raw?: any;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  date: string;
  amount: number; // USD
  method: string;
  status: PaymentStatus;
  proofFileUrl?: string;
  subscriptionId?: string;
}

interface HistoryRecord {
  id: string;
  planName: string;
  action: "Created" | "Renewed" | "Upgraded" | "Expired";
  date: string;
  expirationDate: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Removed - now fetching from API

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
  rejected: {
    label: "Rejected",
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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/subscriptions');
      const data = await response.json();

      if (response.ok) {
        setSubscriptions(data.subscriptions);
        setPayments(data.payments);
        setHistory(data.history);
      } else {
        toast.error(data.error || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = (id: string, patch: Partial<Subscription>) =>
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  // Derived stats
  const stats = useMemo(() => {
    const count = (status: SubscriptionStatus) =>
      subscriptions.filter((s) => s.status === status).length;

    return {
      active: count("active"),
      pending: count("pending"),
      expired: count("expired"),
      rejected: count("rejected"),
    };
  }, [subscriptions]);



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
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-5 animate-pulse">
                <div className="h-8 bg-muted rounded-lg mb-2"></div>
                <div className="h-6 bg-muted rounded-lg mb-1"></div>
                <div className="h-4 bg-muted rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Active"
              value={stats.active}
              hint="Plans currently running"
              icon={CheckCircle2}
              iconClassName="bg-emerald-500/10 text-emerald-500"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              hint="Awaiting approval"
              icon={Clock}
              iconClassName="bg-amber-500/10 text-amber-500"
            />
            <StatCard
              label="Expired"
              value={stats.expired}
              hint="Plans past their end date"
              icon={AlertTriangle}
              iconClassName="bg-slate-500/10 text-slate-400"
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              hint="Payments not approved"
              icon={XCircle}
              iconClassName="bg-rose-500/10 text-rose-500"
            />
          </div>
        )}

        {/* 3. Current plans (or empty state) */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 rounded-3xl border border-border/70 bg-card p-4 shadow-sm md:p-5 animate-pulse">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-muted"></div>
                    <div className="min-w-0 space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full bg-muted"></div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 md:p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
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
              href="/UserDashboard/Discord/pricing"
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
      Your subscription is scheduled to end on {sub.expirationDate}.
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
    <span className="text-sm text-muted-foreground">Plan status</span>
    <span
      className={`text-sm font-medium capitalize ${
        sub.status === "active"
          ? "text-emerald-500"
          : sub.status === "rejected"
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
      {sub.id?.replace(/[{}]/g, '')}
    </code>
  </div>

  {/* Actions */}
  <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
    {sub.status === "rejected" ? (
      <Link
        href="/UserDashboard/Discord/pricing"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 sm:flex-1"
      >
        <RefreshCw className="h-4 w-4" />
        Subscribe again
      </Link>
    ) : sub.status === "active" ? (
      <>
        <Link
          href="/UserDashboard/Discord/pricing"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-1"
        >
          <ArrowUpRight className="h-4 w-4" />
          Upgrade plan
        </Link>
        <Link
          href="#"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:flex-1"
        >
          <RefreshCw className="h-4 w-4" />
          Renew plan
        </Link>
      </>
    ) : sub.status === "expired" ? (
      <Link
        href="/UserDashboard/Discord/pricing"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:flex-1"
      >
        <RefreshCw className="h-4 w-4" />
        Renew plan
      </Link>
    ) : sub.status === "pending" ? (
      <Link
        href="/UserDashboard/Discord/pricing"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-1"
      >
        <ArrowUpRight className="h-4 w-4" />
        Upgrade plan
      </Link>
    ) : null}
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
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-black uppercase tracking-tighter mt-4 text-muted-foreground">
                  Loading payments...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Invoice Ref</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Date</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Method</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Amount</TableHead>
                    <TableHead className="font-black uppercase text-[10px] md:text-xs">Proof</TableHead>
                    <TableHead className="text-right font-black uppercase text-[10px] md:text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-6 py-12 text-center">
                        <p className="text-sm font-black uppercase tracking-tighter text-muted-foreground">
                          No payment history
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p) => (
                      <TableRow key={p.id} className="border-border/60">
                        <TableCell className="font-mono text-[10px] md:text-xs font-bold text-violet-600">{p.invoiceId}</TableCell>
                        <TableCell className="text-[10px] md:text-xs font-medium">{p.date}</TableCell>
                        <TableCell className="text-[10px] md:text-xs font-medium">{p.method}</TableCell>
                        <TableCell className="text-[10px] md:text-xs font-black">{formatUSD(p.amount)}</TableCell>
                        <TableCell className="text-[10px] md:text-xs font-medium">
                          {p.proofFileUrl ? (
                            <a
                              href={p.proofFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-600 hover:text-violet-700 underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <PaymentBadge status={p.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </SectionCard>

      </div>
    </div>
  );
}