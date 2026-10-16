"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Search,
  Loader2,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

// Types
type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending_payment" | "pending_review" | "rejected";

interface UserSubscription {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  botProductId: string;
  planName: string;
  planType: string;
  amount: number;
  billingPeriod: string;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    userName: string;
    email: string;
    avatar?: string;
  };
}

export default function AdminUserSubscriptionsPage() {
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [stats, setStats] = useState([
    {
      label: "Total Subscriptions",
      value: "0",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active",
      value: "0",
      icon: CheckCircle2,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      label: "Pending",
      value: "0",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Expired",
      value: "0",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Rejected",
      value: "0",
      icon: Ban,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Total Revenue",
      value: "$0",
      icon: TrendingUp,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
  ]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/admin/subscriptions');
        const data = await response.json();

        if (data.success) {
          setSubscriptions(data.subscriptions);

          // Calculate stats
          const totalSubs = data.subscriptions.length;
          const active = data.subscriptions.filter((s: UserSubscription) => s.status === "active").length;
          const pending = data.subscriptions.filter((s: UserSubscription) => s.status === "pending_payment" || s.status === "pending_review").length;
          const expired = data.subscriptions.filter((s: UserSubscription) => s.status === "expired").length;
          const rejected = data.subscriptions.filter((s: UserSubscription) => s.status === "rejected").length;
          const totalRevenue = data.subscriptions.reduce((sum: number, s: UserSubscription) => sum + s.amount, 0);

          setStats([
            {
              label: "Total Subscriptions",
              value: totalSubs.toString(),
              icon: Users,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Active",
              value: active.toString(),
              icon: CheckCircle2,
              color: "text-teal-500",
              bg: "bg-teal-500/10",
            },
            {
              label: "Pending",
              value: pending.toString(),
              icon: Clock,
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
            {
              label: "Expired",
              value: expired.toString(),
              icon: XCircle,
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
            {
              label: "Rejected",
              value: rejected.toString(),
              icon: Ban,
              color: "text-rose-500",
              bg: "bg-rose-500/10",
            },
            {
              label: "Total Revenue",
              value: `$${(totalRevenue / 1000).toFixed(1)}k`,
              icon: TrendingUp,
              color: "text-teal-500",
              bg: "bg-teal-500/10",
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        toast.error('Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription._id?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter
      ? subscription.status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "expired":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "pending_payment":
      case "pending_review":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "cancelled":
      case "rejected":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "expired":
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      case "pending_payment":
      case "pending_review":
        return <Clock className="w-3 h-3 mr-1" />;
      default:
        return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              User Subscriptions
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <Users className="w-3 h-3 text-violet-600" />
              Subscription Management
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 w-full md:w-64 shadow-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-card border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="pending_review">Pending Review</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
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
          ))}
        </div>

        {/* Subscriptions Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">
              All Subscriptions
            </h2>
            <Users className="w-5 h-5 text-violet-600" />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
                <p className="text-sm font-black uppercase tracking-tighter">
                  Loading subscriptions...
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Subscription ID</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Billing Period</th>
                    <th className="px-6 py-4">Period</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12">
                        <div className="flex items-center justify-center py-20">
                          <div className="text-center">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter mb-2">
                              {searchTerm || statusFilter
                                ? "No subscriptions found"
                                : "No subscriptions found"}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase mb-6">
                              {searchTerm || statusFilter
                                ? "Try adjusting your filters"
                                : "When users subscribe, they will appear here"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <tr
                        key={subscription._id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={subscription.user?.avatar || defaultProfileImage}
                              alt={subscription.userName || "Unknown User"}
                              className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                            <div
                              className={`w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 font-bold text-xs hidden`}
                            >
                              {subscription.userName?.charAt(0) || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {subscription.userName || "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {subscription.userEmail || "No email"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs font-mono text-violet-600 bg-violet-500/10 px-2 py-1 rounded">
                            {subscription._id.toString().slice(-8)}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-foreground">
                            {subscription.planName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-foreground">
                            ${subscription.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-muted-foreground capitalize">
                            {subscription.billingPeriod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-foreground">
                              {formatDate(subscription.startDate)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              → {formatDate(subscription.endDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusClasses(
                              subscription.status
                            )}`}
                          >
                            {getStatusIcon(subscription.status)}
                            {subscription.status.replace('_', ' ')}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
