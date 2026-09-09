"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
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
  ChevronRight,
  X,
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

// ─── TYPES & MOCK DATA ────────────────────────────────────────────────────────

type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

interface Subscription {
  id: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  expirationDate: string;
  autoRenew: boolean;
  connectedServers: number;
  serverLimit: number;
  price: string;
  billingCycle: string;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  date: string;
  amount: string;
  method: string;
  status: "Paid" | "Failed" | "Pending";
}

interface HistoryRecord {
  id: string;
  planName: string;
  action: "Created" | "Renewed" | "Upgraded" | "Cancelled";
  date: string;
}

const MOCK_ACTIVE_SUBSCRIPTION: Subscription = {
  id: "sub_10928374",
  planName: "Pro Sentinel Tier",
  status: "active",
  startDate: "AUG 12, 2026",
  expirationDate: "SEP 12, 2026",
  autoRenew: true,
  connectedServers: 4,
  serverLimit: 5,
  price: "$29.00",
  billingCycle: "Monthly",
};

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: "tx_101", invoiceId: "INV-2026-0812", date: "AUG 12, 2026", amount: "$29.00", method: "Crypto (USDT)", status: "Paid" },
  { id: "tx_102", invoiceId: "INV-2026-0712", date: "JUL 12, 2026", amount: "$29.00", method: "Crypto (USDT)", status: "Paid" },
  { id: "tx_103", invoiceId: "INV-2026-0612", date: "JUN 12, 2026", amount: "$9.00", method: "Crypto (BTC)", status: "Paid" },
];

const MOCK_HISTORY: HistoryRecord[] = [
  { id: "h_1", planName: "Pro Sentinel Tier", action: "Renewed", date: "AUG 12, 2026" },
  { id: "h_2", planName: "Pro Sentinel Tier", action: "Upgraded", date: "JUL 12, 2026" },
  { id: "h_3", planName: "Starter Bot Tier", action: "Created", date: "JUN 12, 2026" },
];

// ─── STATUS BADGE COMPONENT ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Active
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <XCircle className="w-3 h-3" /> Cancelled
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <AlertTriangle className="w-3 h-3" /> Expired
        </span>
      );
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(MOCK_ACTIVE_SUBSCRIPTION);
  const [payments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [history] = useState<HistoryRecord[]>(MOCK_HISTORY);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: "cancelled",
        autoRenew: false,
      });
    }
    setIsCancelModalOpen(false);
  };

  const handleRenewSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: "active",
        autoRenew: true,
      });
    }
  };

  // Usage percentage logic
  const usagePercentage = subscription
    ? Math.min(Math.round((subscription.connectedServers / subscription.serverLimit) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="border-b border-border/60 pb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            Subscription Management
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
            Monitor active bot service plans, track connected server quotas, review payment receipts, and manage renewal options.
          </p>
        </div>

        {/* Conditional Rendering: Empty State vs Content */}
        {!subscription ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">No Active Subscription</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              You do not have an active bot plan linked to your server cluster. Browse available pricing tiers to deploy your bot.
            </p>
            <Link
              href="/bots/pricing"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20"
            >
              Explore Bot Plans <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Current Active Plan Card */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-bl-full pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{subscription.planName}</h2>
                    <StatusBadge status={subscription.status} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: {subscription.id} • {subscription.price} / {subscription.billingCycle}
                  </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/bots/pricing"
                    className="cursor-pointer bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 active:scale-[0.99] transition-all flex items-center gap-1.5 shadow-md shadow-violet-600/20"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Upgrade Plan
                  </Link>

                  {subscription.status === "active" && (
                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="cursor-pointer bg-muted/50 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 border border-border/80 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Cancel Plan
                    </button>
                  )}

                  {subscription.status === "cancelled" && (
                    <button
                      type="button"
                      onClick={handleRenewSubscription}
                      className="cursor-pointer bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <RefreshCw className="w-4 h-4" /> Renew Plan
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-Details & Server Usage Meter */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                
                {/* Billing Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Subscription Dates
                  </span>
                  <div className="text-xs font-bold space-y-1 pt-1">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span>{subscription.startDate}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Expiration Date:</span>
                      <span>{subscription.expirationDate}</span>
                    </p>
                  </div>
                </div>

                {/* Renewal Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Renewal Info
                  </span>
                  <div className="text-xs font-bold pt-1 space-y-1">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Auto Renew:</span>
                      <span className={subscription.autoRenew ? "text-emerald-500" : "text-rose-500"}>
                        {subscription.autoRenew ? "Enabled" : "Disabled"}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground font-normal">
                      {subscription.autoRenew
                        ? "Next charge occurs on expiration date."
                        : "Plan will terminate on expiration date."}
                    </p>
                  </div>
                </div>

                {/* Connected Server Limit & Progress Bar */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1 bg-muted/20 p-4 rounded-xl border border-border/60">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Server className="w-3.5 h-3.5 text-violet-600" /> Server Quota
                    </span>
                    <span>
                      {subscription.connectedServers} / {subscription.serverLimit} Guilds
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600 transition-all duration-500 rounded-full"
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>

                  <p className="text-[10px] font-bold text-right text-muted-foreground uppercase">
                    {usagePercentage}% Capacity Used
                  </p>
                </div>

              </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-black uppercase tracking-tight">Payment History</h2>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{payments.length} Transactions</span>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-black uppercase text-xs">Invoice Ref</TableHead>
                      <TableHead className="font-black uppercase text-xs">Date</TableHead>
                      <TableHead className="font-black uppercase text-xs">Payment Method</TableHead>
                      <TableHead className="font-black uppercase text-xs">Amount</TableHead>
                      <TableHead className="text-right font-black uppercase text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id} className="border-border/60">
                        <TableCell className="font-mono text-xs font-bold text-violet-600">
                          {p.invoiceId}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{p.date}</TableCell>
                        <TableCell className="text-xs font-medium">{p.method}</TableCell>
                        <TableCell className="text-xs font-black">{p.amount}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {p.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Subscription Log History */}
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-black uppercase tracking-tight">Subscription Activity History</h2>
              </div>

              <div className="space-y-3">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-4 bg-muted/20 border border-border/60 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center font-black text-violet-600">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold">{h.planName}</p>
                        <p className="text-muted-foreground text-[10px] uppercase font-mono">{h.date}</p>
                      </div>
                    </div>
                    <span className="font-black uppercase text-[10px] px-2.5 py-1 rounded-md bg-muted border border-border">
                      {h.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <DialogTitle className="font-black uppercase text-lg">
                  Confirm Cancellation
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Are you sure you want to cancel your bot subscription?
              </DialogDescription>
            </DialogHeader>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs space-y-2 text-rose-400 my-2">
              <p className="font-bold uppercase tracking-wider">Warning:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your bot will lose premium moderation tools at the end of the current billing cycle ({subscription?.expirationDate}).</li>
                <li>Guild connection limits will revert to free tier limits.</li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
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