"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserMinus,
  UserCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Layers,
  DollarSign,
  Shield,
  Gift,
  Trophy,
  Star,
  CreditCard,
  Wallet,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";

// ─── Helper Functions ───────────────────────────────────────────────────────
function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
}

interface DashboardStats {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  user: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentinelStatus, setSentinelStatus] = useState<'online' | 'offline' | 'unavailable' | 'loading'>('loading');
  const [sentinelMessage, setSentinelMessage] = useState<string>('');

  const iconMap: { [key: string]: any } = {
    Users,
    UserCheck,
    UserMinus,
    Layers,
    TrendingUp,
    Clock,
    ArrowDownLeft,
    ArrowUpRight,
    Shield,
    Gift,
    Trophy,
    Star,
    DollarSign,
    CreditCard,
    Wallet,
  };

  const fetchSentinelStatus = async () => {
    try {
      const response = await fetch('/api/admin/sentinel/status');
      const data = await response.json();

      if (response.ok) {
        setSentinelStatus(data.status);
        setSentinelMessage(data.message || '');
      } else {
        setSentinelStatus('unavailable');
        setSentinelMessage('Unable to check status');
      }
    } catch (error) {
      console.error('Error fetching Sentinel status:', error);
      setSentinelStatus('unavailable');
      setSentinelMessage('Unable to check status');
    }
  };

  useEffect(() => {
    fetchOverviewData();
    fetchSentinelStatus();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await fetch('/api/admin/overview');
      const data = await response.json();

      if (data.success && data.stats) {
        const s = data.stats;
        const dashboardStats: DashboardStats[] = [
          { label: "Total Users", value: s.users.total.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Users This Week", value: s.users.thisWeek.toString(), icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10" },
          { label: "Suspended Users", value: s.users.suspended.toString(), icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Active Subscriptions", value: s.subscriptions.active.toString(), icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Expired Subscriptions", value: s.subscriptions.expired.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Pending Review", value: s.subscriptions.pendingReview.toString(), icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Rejected Subscriptions", value: s.subscriptions.suspended.toString(), icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Total Revenue", value: `$${formatCompactNumber(s.payments.totalRevenue)}`, icon: DollarSign, color: "text-teal-500", bg: "bg-teal-500/10" },
          { label: "Pending Payments", value: s.payments.pending.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Rejected Payments", value: s.payments.rejected.toString(), icon: ArrowDownLeft, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Accepted Payments", value: s.payments.accepted.toString(), icon: UserCheck, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Active Entitlements", value: s.entitlements.active.toString(), icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Expired Entitlements", value: s.entitlements.expired.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Revoked Entitlements", value: s.entitlements.revoked.toString(), icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-500/10" },
        ];
        setStats(dashboardStats);
      }

      if (data.success && data.recentPayments) {
        const transactions: Transaction[] = data.recentPayments.map((p: any) => ({
          id: p._id,
          type: p.planName,
          amount: p.amount,
          status: p.status === 'verified' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending',
          user: p.userName,
          email: p.userEmail,
          paymentMethod: 'Crypto',
          createdAt: p.createdAt,
        }));
        setRecentTransactions(transactions);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
            Dashboard Overview
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
            <Layers className="w-3 h-3 text-primary" />
            Platform Analytics
          </p>
        </div>

        {/* Sentinel Status Indicator */}
        <div className="mb-6">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              sentinelStatus === 'online'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : sentinelStatus === 'offline'
                ? 'bg-rose-500/10 border-rose-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}
          >
            {sentinelStatus === 'loading' ? (
              <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : sentinelStatus === 'online' ? (
              <Wifi className="w-5 h-5 text-emerald-500" />
            ) : sentinelStatus === 'offline' ? (
              <WifiOff className="w-5 h-5 text-rose-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                NEXIS Service Status
              </p>
              <p className="text-[10px] text-muted-foreground">
                {sentinelStatus === 'loading'
                  ? 'Checking status...'
                  : sentinelStatus === 'online'
                  ? sentinelMessage || 'NEXIS is operational'
                  : sentinelStatus === 'offline'
                  ? sentinelMessage || 'NEXIS is not operational'
                  : sentinelMessage || 'Unable to verify service status'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-muted animate-pulse">
                    <div className="w-5 h-5 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div>
                  <div className="h-3 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card px-5 py-3 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground mb-1">{stat.value}</p>
                  <h4 className="text-muted-foreground text-xs font-medium">{stat.label}</h4>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">
                Recent Payments
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Latest payment submissions and their status
              </p>
            </div>
            <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
              View All
            </button>
          </div>
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-card-foreground">
                          #{transaction.id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground font-semibold">
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{transaction.user}</span>
                          <span className="text-xs text-muted-foreground">{transaction.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">
                        ${transaction.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            transaction.status === 'Approved'
                              ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                              : transaction.status === 'Rejected'
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                              : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-black uppercase tracking-tighter mb-2">
                  No payments yet
                </p>
                <p className="text-[10px] text-muted-foreground uppercase mb-6">
                  Once payments are submitted, they will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
