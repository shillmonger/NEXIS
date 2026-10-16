"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Server,
  CalendarDays,
  FileText,
  AlertTriangle,
  Ban,
  Trash2,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

interface UserSubscription {
  id: string;
  subscriptionId: string;
  userId: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  botName: string;
  plan: string;
  status: SubscriptionStatus;
  startDate: string;
  expirationDate: string;
  serverName: string | null;
  price: number;
  billingCycle: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUserSubscriptionsPage() {
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "activate" | "deactivate" | "delete";
    subscriptionId: string;
    userName: string;
    plan: string;
  } | null>(null);

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
      label: "Total Revenue",
      value: "$0",
      icon: TrendingUp,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
  ]);

  useEffect(() => {
    // Mock data
    const mockSubscriptions: UserSubscription[] = [
      {
        id: "sub-001",
        subscriptionId: "SUB-1048",
        userId: {
          _id: "user-001",
          username: "crypto_trader",
          fullName: "John Doe",
          email: "john@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        botName: "Nexis Bot",
        plan: "Basic Plan",
        status: "active",
        startDate: "OCT 12, 2026",
        expirationDate: "NOV 12, 2026",
        serverName: "Community Hub",
        price: 30,
        billingCycle: "Monthly",
        autoRenew: true,
        createdAt: "2026-10-12T00:00:00Z",
        updatedAt: "2026-10-12T00:00:00Z",
      },
      {
        id: "sub-002",
        subscriptionId: "SUB-1052",
        userId: {
          _id: "user-002",
          username: "investor_hub",
          fullName: "Jane Smith",
          email: "jane@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        botName: "Nexis Bot",
        plan: "Pro Plan",
        status: "active",
        startDate: "SEP 15, 2026",
        expirationDate: "NOV 20, 2026",
        serverName: "Trading Server",
        price: 70,
        billingCycle: "Monthly",
        autoRenew: true,
        createdAt: "2026-09-15T00:00:00Z",
        updatedAt: "2026-09-15T00:00:00Z",
      },
      {
        id: "sub-003",
        subscriptionId: "SUB-0981",
        userId: {
          _id: "user-003",
          username: "whale_investor",
          fullName: "Mike Johnson",
          email: "mike@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        botName: "Nexis Bot",
        plan: "Basic Plan",
        status: "expired",
        startDate: "SEP 01, 2026",
        expirationDate: "OCT 10, 2026",
        serverName: null,
        price: 30,
        billingCycle: "Monthly",
        autoRenew: false,
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: "2026-10-10T00:00:00Z",
      },
      {
        id: "sub-004",
        subscriptionId: "SUB-1060",
        userId: {
          _id: "user-004",
          username: "swing_trader",
          fullName: "Sarah Williams",
          email: "sarah@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        botName: "Nexis Bot",
        plan: "Growth Plan",
        status: "pending",
        startDate: "OCT 15, 2026",
        expirationDate: "NOV 15, 2026",
        serverName: null,
        price: 50,
        billingCycle: "Monthly",
        autoRenew: true,
        createdAt: "2026-10-15T00:00:00Z",
        updatedAt: "2026-10-15T00:00:00Z",
      },
      {
        id: "sub-005",
        subscriptionId: "SUB-1075",
        userId: {
          _id: "user-005",
          username: "newbie_trader",
          fullName: "David Brown",
          email: "david@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        botName: "Nexis Bot",
        plan: "Enterprise Plan",
        status: "active",
        startDate: "OCT 01, 2026",
        expirationDate: "DEC 01, 2026",
        serverName: "Crypto Community",
        price: 150,
        billingCycle: "Monthly",
        autoRenew: true,
        createdAt: "2026-10-01T00:00:00Z",
        updatedAt: "2026-10-01T00:00:00Z",
      },
    ];

    setTimeout(() => {
      setSubscriptions(mockSubscriptions);

      // Calculate stats
      const totalSubs = mockSubscriptions.length;
      const active = mockSubscriptions.filter((s) => s.status === "active").length;
      const pending = mockSubscriptions.filter((s) => s.status === "pending").length;
      const expired = mockSubscriptions.filter((s) => s.status === "expired").length;
      const totalRevenue = mockSubscriptions.reduce((sum, s) => sum + s.price, 0);

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
          label: "Total Revenue",
          value: `$${(totalRevenue / 1000).toFixed(1)}k`,
          icon: TrendingUp,
          color: "text-teal-500",
          bg: "bg-teal-500/10",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleActivate = async (subscriptionId: string, userName: string) => {
    setActionLoading(subscriptionId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Subscription for ${userName} activated`);
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status: "active" } : sub
        )
      );

      // Update stats
      const updatedSubs = subscriptions.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: "active" } : sub
      );
      const active = updatedSubs.filter((s) => s.status === "active").length;
      const pending = updatedSubs.filter((s) => s.status === "pending").length;
      const expired = updatedSubs.filter((s) => s.status === "expired").length;

      setStats((prev) => [
        prev[0],
        { ...prev[1], value: active.toString() },
        { ...prev[2], value: pending.toString() },
        { ...prev[3], value: expired.toString() },
        prev[4],
      ]);
    } catch (error) {
      console.error("Error activating subscription:", error);
      toast.error("Error activating subscription");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleDeactivate = async (subscriptionId: string, userName: string) => {
    setActionLoading(subscriptionId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Subscription for ${userName} deactivated`);
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status: "cancelled" } : sub
        )
      );

      // Update stats
      const updatedSubs = subscriptions.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: "cancelled" } : sub
      );
      const active = updatedSubs.filter((s) => s.status === "active").length;
      const pending = updatedSubs.filter((s) => s.status === "pending").length;
      const expired = updatedSubs.filter((s) => s.status === "expired").length;

      setStats((prev) => [
        prev[0],
        { ...prev[1], value: active.toString() },
        { ...prev[2], value: pending.toString() },
        { ...prev[3], value: expired.toString() },
        prev[4],
      ]);
    } catch (error) {
      console.error("Error deactivating subscription:", error);
      toast.error("Error deactivating subscription");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleDelete = async (subscriptionId: string, userName: string) => {
    setActionLoading(subscriptionId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Subscription for ${userName} deleted`);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));

      // Update stats
      const updatedSubs = subscriptions.filter((sub) => sub.id !== subscriptionId);
      const active = updatedSubs.filter((s) => s.status === "active").length;
      const pending = updatedSubs.filter((s) => s.status === "pending").length;
      const expired = updatedSubs.filter((s) => s.status === "expired").length;
      const totalRevenue = updatedSubs.reduce((sum, s) => sum + s.price, 0);

      setStats([
        {
          label: "Total Subscriptions",
          value: updatedSubs.length.toString(),
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
          label: "Total Revenue",
          value: `$${(totalRevenue / 1000).toFixed(1)}k`,
          icon: TrendingUp,
          color: "text-teal-500",
          bg: "bg-teal-500/10",
        },
      ]);
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Error deleting subscription");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (
    action: "activate" | "deactivate" | "delete",
    subscriptionId: string,
    userName: string,
    plan: string
  ) => {
    setConfirmModal({ isOpen: true, action, subscriptionId, userName, plan });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.action === "activate") {
      handleActivate(confirmModal.subscriptionId, confirmModal.userName);
    } else if (confirmModal.action === "deactivate") {
      handleDeactivate(confirmModal.subscriptionId, confirmModal.userName);
    } else {
      handleDelete(confirmModal.subscriptionId, confirmModal.userName);
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.subscriptionId?.toLowerCase().includes(searchTerm.toLowerCase());

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
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "cancelled":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "expired":
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      default:
        return <Clock className="w-3 h-3 mr-1" />;
    }
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
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
                    <th className="px-6 py-4">Bot</th>
                    <th className="px-6 py-4">Server</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Period</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12">
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
                        key={subscription.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={subscription.userId?.profileImage || defaultProfileImage}
                              alt={subscription.userId?.fullName || "Unknown User"}
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
                              {subscription.userId?.fullName?.charAt(0) || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {subscription.userId?.fullName || "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {subscription.userId?.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs font-mono text-violet-600 bg-violet-500/10 px-2 py-1 rounded">
                            {subscription.subscriptionId}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-foreground">
                            {subscription.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-violet-600" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {subscription.botName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {subscription.serverName ? (
                            <span className="text-xs font-medium text-emerald-600">
                              {subscription.serverName}
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-muted-foreground italic">
                              Not connected
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-foreground">
                            {formatCurrency(subscription.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-foreground">
                              {subscription.startDate}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              → {subscription.expirationDate}
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
                            {subscription.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                {subscription.status === "pending" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmModal(
                                        "activate",
                                        subscription.id,
                                        subscription.userId?.fullName || "Unknown User",
                                        subscription.plan
                                      )
                                    }
                                    disabled={actionLoading === subscription.id}
                                    className="cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                {subscription.status === "active" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmModal(
                                        "deactivate",
                                        subscription.id,
                                        subscription.userId?.fullName || "Unknown User",
                                        subscription.plan
                                      )
                                    }
                                    disabled={actionLoading === subscription.id}
                                    className="cursor-pointer"
                                  >
                                    <Ban className="w-4 h-4 mr-2 text-amber-500" />
                                    Deactivate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    openConfirmModal(
                                      "delete",
                                      subscription.id,
                                      subscription.userId?.fullName || "Unknown User",
                                      subscription.plan
                                    )
                                  }
                                  disabled={actionLoading === subscription.id}
                                  className="cursor-pointer text-rose-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={closeConfirmModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal */}
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            {/* Icon */}
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                confirmModal.action === "activate"
                  ? "bg-emerald-500/10"
                  : confirmModal.action === "deactivate"
                  ? "bg-amber-500/10"
                  : "bg-rose-500/10"
              }`}
            >
              {confirmModal.action === "activate" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : confirmModal.action === "deactivate" ? (
                <Ban className="w-8 h-8 text-amber-500" />
              ) : (
                <Trash2 className="w-8 h-8 text-rose-500" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              {confirmModal.action === "activate"
                ? "Activate Subscription"
                : confirmModal.action === "deactivate"
                ? "Deactivate Subscription"
                : "Delete Subscription"}
            </h2>

            {/* Warning */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This action <strong>cannot be undone</strong>. Please review the
                  details below before confirming.
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  User
                </span>
                <span className="text-sm font-bold text-foreground">
                  {confirmModal.userName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Plan
                </span>
                <span className="text-sm font-bold text-foreground">
                  {confirmModal.plan}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Action
                </span>
                <span
                  className={`text-sm font-bold uppercase ${
                    confirmModal.action === "activate"
                      ? "text-emerald-500"
                      : confirmModal.action === "deactivate"
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}
                >
                  {confirmModal.action}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading === confirmModal.subscriptionId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === confirmModal.subscriptionId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === "activate"
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : confirmModal.action === "deactivate"
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                {actionLoading === confirmModal.subscriptionId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmModal.action === "activate" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : confirmModal.action === "deactivate" ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {confirmModal.action === "activate"
                      ? "Activate"
                      : confirmModal.action === "deactivate"
                      ? "Deactivate"
                      : "Delete"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
