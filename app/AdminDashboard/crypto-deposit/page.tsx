"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Clock, DollarSign, Search, Filter, ExternalLink, Loader2, AlertTriangle, Wallet, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Deposit {
  _id: string;
  paymentMethod: string;
  amount: number;
  proofImageUrl: string;
  status: "pending" | "approved" | "rejected";
  userId: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  walletAddress: string;
  network: string;
  createdAt: string;
  updatedAt: string;
}

// Helpers using brand colors (violet/purple theme)
const getStatusClasses = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "rejected":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    default:
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <Check className="w-3 h-3 mr-1" />;
    case "rejected":
      return <X className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

export default function AdminCryptoDepositPage() {
  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [stats, setStats] = useState([
    {
      label: "Total Deposits",
      value: "0",
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending",
      value: "0",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Approved",
      value: "0",
      icon: CheckCircle2,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      label: "Rejected",
      value: "0",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Total Amount",
      value: "$0",
      icon: TrendingUp,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
  ]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "approve" | "reject";
    depositId: string;
    userName: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    // Mock data
    const mockDeposits: Deposit[] = [
      {
        _id: "dep-001",
        paymentMethod: "USDT (TRC20)",
        amount: 500,
        proofImageUrl: "https://example.com/proof1.jpg",
        status: "pending",
        userId: {
          _id: "user-001",
          username: "crypto_trader",
          fullName: "John Doe",
          email: "john@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        walletAddress: "0x1234...5678",
        network: "Tron",
        createdAt: "2026-10-15T10:30:00Z",
        updatedAt: "2026-10-15T10:30:00Z",
      },
      {
        _id: "dep-002",
        paymentMethod: "USDT (ERC20)",
        amount: 1000,
        proofImageUrl: "https://example.com/proof2.jpg",
        status: "approved",
        userId: {
          _id: "user-002",
          username: "investor_hub",
          fullName: "Jane Smith",
          email: "jane@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        walletAddress: "0xabcd...efgh",
        network: "Ethereum",
        createdAt: "2026-10-14T15:20:00Z",
        updatedAt: "2026-10-14T16:00:00Z",
      },
      {
        _id: "dep-003",
        paymentMethod: "BTC",
        amount: 250,
        proofImageUrl: "https://example.com/proof3.jpg",
        status: "pending",
        userId: {
          _id: "user-003",
          username: "whale_investor",
          fullName: "Mike Johnson",
          email: "mike@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        walletAddress: "bc1q...xyz",
        network: "Bitcoin",
        createdAt: "2026-10-14T09:15:00Z",
        updatedAt: "2026-10-14T09:15:00Z",
      },
      {
        _id: "dep-004",
        paymentMethod: "ETH",
        amount: 750,
        proofImageUrl: "https://example.com/proof4.jpg",
        status: "rejected",
        userId: {
          _id: "user-004",
          username: "swing_trader",
          fullName: "Sarah Williams",
          email: "sarah@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        walletAddress: "0x9876...5432",
        network: "Ethereum",
        createdAt: "2026-10-13T14:45:00Z",
        updatedAt: "2026-10-13T15:30:00Z",
      },
      {
        _id: "dep-005",
        paymentMethod: "USDT (TRC20)",
        amount: 1500,
        proofImageUrl: "https://example.com/proof5.jpg",
        status: "pending",
        userId: {
          _id: "user-005",
          username: "newbie_trader",
          fullName: "David Brown",
          email: "david@example.com",
          profileImage: "https://github.com/shadcn.png",
        },
        walletAddress: "0x5555...6666",
        network: "Tron",
        createdAt: "2026-10-13T08:00:00Z",
        updatedAt: "2026-10-13T08:00:00Z",
      },
    ];

    setTimeout(() => {
      setDeposits(mockDeposits);

      // Calculate stats
      const totalDeposits = mockDeposits.length;
      const pending = mockDeposits.filter((d) => d.status === "pending").length;
      const approved = mockDeposits.filter((d) => d.status === "approved").length;
      const rejected = mockDeposits.filter((d) => d.status === "rejected").length;
      const totalAmount = mockDeposits.reduce((sum, d) => sum + d.amount, 0);

      setStats([
        {
          label: "Total Deposits",
          value: totalDeposits.toString(),
          icon: Wallet,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          label: "Pending",
          value: pending.toString(),
          icon: Clock,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
        },
        {
          label: "Approved",
          value: approved.toString(),
          icon: CheckCircle2,
          color: "text-teal-500",
          bg: "bg-teal-500/10",
        },
        {
          label: "Rejected",
          value: rejected.toString(),
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-500/10",
        },
        {
          label: "Total Amount",
          value: `$${(totalAmount / 1000).toFixed(1)}k`,
          icon: TrendingUp,
          color: "text-teal-500",
          bg: "bg-teal-500/10",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (depositId: string, userName: string) => {
    setActionLoading(depositId);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Payment from ${userName} approved`);
      setDeposits((prev) =>
        prev.map((dep) =>
          dep._id === depositId ? { ...dep, status: "approved" } : dep
        )
      );

      // Update stats
      const updatedDeposits = deposits.map((dep) =>
        dep._id === depositId ? { ...dep, status: "approved" } : dep
      );
      const pending = updatedDeposits.filter((d) => d.status === "pending").length;
      const approved = updatedDeposits.filter((d) => d.status === "approved").length;
      const rejected = updatedDeposits.filter((d) => d.status === "rejected").length;

      setStats((prev) => [
        prev[0],
        { ...prev[1], value: pending.toString() },
        { ...prev[2], value: approved.toString() },
        { ...prev[3], value: rejected.toString() },
        prev[4],
      ]);
    } catch (error) {
      console.error("Error approving deposit:", error);
      toast.error("Error approving payment");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleReject = async (depositId: string, userName: string) => {
    setActionLoading(depositId);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.error(`Payment from ${userName} rejected`);
      setDeposits((prev) =>
        prev.map((dep) =>
          dep._id === depositId ? { ...dep, status: "rejected" } : dep
        )
      );

      // Update stats
      const updatedDeposits = deposits.map((dep) =>
        dep._id === depositId ? { ...dep, status: "rejected" } : dep
      );
      const pending = updatedDeposits.filter((d) => d.status === "pending").length;
      const approved = updatedDeposits.filter((d) => d.status === "approved").length;
      const rejected = updatedDeposits.filter((d) => d.status === "rejected").length;

      setStats((prev) => [
        prev[0],
        { ...prev[1], value: pending.toString() },
        { ...prev[2], value: approved.toString() },
        { ...prev[3], value: rejected.toString() },
        prev[4],
      ]);
    } catch (error) {
      console.error("Error rejecting deposit:", error);
      toast.error("Error rejecting payment");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (
    action: "approve" | "reject",
    depositId: string,
    userName: string,
    amount: number
  ) => {
    setConfirmModal({ isOpen: true, action, depositId, userName, amount });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.action === "approve") {
      handleApprove(confirmModal.depositId, confirmModal.userName);
    } else {
      handleReject(confirmModal.depositId, confirmModal.userName);
    }
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch =
      deposit.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter
      ? deposit.status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatusPill = ({ status }: { status: string }) => (
    <div
      className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status}
    </div>
  );

  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              Crypto Deposits
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <DollarSign className="w-3 h-3 text-violet-600" />
              Finance Management
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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

        {/* Deposits Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">
              Transaction History
            </h2>
            <DollarSign className="w-5 h-5 text-violet-600" />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
                <p className="text-sm font-black uppercase tracking-tighter">
                  Loading deposits...
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4">Proof</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDeposits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12">
                        <div className="flex items-center justify-center py-20">
                          <div className="text-center">
                            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter mb-2">
                              {searchTerm || statusFilter
                                ? "No deposits found"
                                : "No deposits found"}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase mb-6">
                              {searchTerm || statusFilter
                                ? "Try adjusting your filters"
                                : "When deposits are made, they will appear here"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDeposits.map((deposit) => (
                      <tr
                        key={deposit._id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={deposit.userId?.profileImage || defaultProfileImage}
                              alt={deposit.userId?.fullName || "Unknown User"}
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
                              {deposit.userId?.fullName?.charAt(0) || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {deposit.userId?.fullName || "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {deposit.userId?.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-foreground">
                            ${deposit.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">
                            {deposit.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={deposit.proofImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:text-violet-700 text-xs font-medium underline flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Proof
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatDate(deposit.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={deposit.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {deposit.status === "pending" ? (
                              <>
                                <button
                                  onClick={() =>
                                    openConfirmModal(
                                      "approve",
                                      deposit._id,
                                      deposit.userId?.fullName || "Unknown User",
                                      deposit.amount
                                    )
                                  }
                                  disabled={actionLoading === deposit._id}
                                  className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    openConfirmModal(
                                      "reject",
                                      deposit._id,
                                      deposit.userId?.fullName || "Unknown User",
                                      deposit.amount
                                    )
                                  }
                                  disabled={actionLoading === deposit._id}
                                  className="p-3 bg-rose-500/10 text-rose-500 cursor-pointer rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground uppercase italic">
                                Locked
                              </span>
                            )}
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
                confirmModal.action === "approve"
                  ? "bg-emerald-500/10"
                  : "bg-rose-500/10"
              }`}
            >
              {confirmModal.action === "approve" ? (
                <Check className="w-8 h-8 text-emerald-500" />
              ) : (
                <X className="w-8 h-8 text-rose-500" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              {confirmModal.action === "approve"
                ? "Confirm Deposit"
                : "Reject Deposit"}
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
                  Amount
                </span>
                <span className="text-sm font-bold text-foreground">
                  ${confirmModal.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Action
                </span>
                <span
                  className={`text-sm font-bold uppercase ${
                    confirmModal.action === "approve"
                      ? "text-emerald-500"
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
                disabled={actionLoading === confirmModal.depositId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === confirmModal.depositId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === "approve"
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                {actionLoading === confirmModal.depositId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmModal.action === "approve" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {confirmModal.action === "approve" ? "Confirm" : "Reject"}
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
