"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Clock, DollarSign, Search, Filter, ExternalLink, Loader2, AlertTriangle, Wallet, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Deposit {
  _id: string;
  paymentMethod: string;
  amount: number;
  proofFileUrl?: string;
  status: "pending" | "verified" | "rejected";
  userId: {
    _id: string;
    userName: string;
    email: string;
    avatar?: string;
  };
  walletAddress?: string;
  transactionId: string;
  subscriptionId: {
    _id: string;
    status: string;
    planName: string;
    planType: string;
    billingPeriod: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Helpers using brand colors (violet/purple theme)
const getStatusClasses = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "rejected":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    default:
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
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
    rejectionReason?: string;
  } | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/api/admin/payments?status=${statusFilter}`
        : '/api/admin/payments';

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setDeposits(data.payments);

        // Calculate stats
        const totalDeposits = data.payments.length;
        const pending = data.payments.filter((d: Deposit) => d.status === "pending").length;
        const approved = data.payments.filter((d: Deposit) => d.status === "verified").length;
        const rejected = data.payments.filter((d: Deposit) => d.status === "rejected").length;
        const totalAmount = data.payments.reduce((sum: number, d: Deposit) => sum + d.amount, 0);

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
      } else {
        toast.error('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: string, userName: string) => {
    setActionLoading(depositId);
    try {
      const response = await fetch(`/api/admin/payments/${depositId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Payment from ${userName} approved`);
        fetchDeposits();
      } else {
        toast.error(data.error || 'Failed to approve payment');
      }
    } catch (error) {
      console.error("Error approving deposit:", error);
      toast.error("Error approving payment");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleReject = async (depositId: string, userName: string, reason: string) => {
    setActionLoading(depositId);
    try {
      const response = await fetch(`/api/admin/payments/${depositId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.error(`Payment from ${userName} rejected`);
        fetchDeposits();
      } else {
        toast.error(data.error || 'Failed to reject payment');
      }
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
      if (!confirmModal.rejectionReason || confirmModal.rejectionReason.trim().length === 0) {
        toast.error('Please provide a rejection reason');
        return;
      }
      handleReject(confirmModal.depositId, confirmModal.userName, confirmModal.rejectionReason);
    }
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch =
      deposit.userId?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

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
              <option value="verified">Approved</option>
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
                    <th className="px-6 py-4">Plan</th>
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
                              src={deposit.userId?.avatar || defaultProfileImage}
                              alt={deposit.userId?.userName || "Unknown User"}
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
                              {deposit.userId?.userName?.charAt(0) || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {deposit.userId?.userName || "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {deposit.userId?.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">
                              {deposit.subscriptionId?.planName || "N/A"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {deposit.subscriptionId?.planType || ""}
                            </span>
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
                          {deposit.proofFileUrl ? (
                            <a
                              href={deposit.proofFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-600 hover:text-violet-700 text-xs font-medium underline flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Proof
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">No proof</span>
                          )}
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
                                      deposit.userId?.userName || "Unknown User",
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
                                      deposit.userId?.userName || "Unknown User",
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
              <div className="flex justify-between items-center py-2 border-b border-border/50">
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

              {confirmModal.action === "reject" && (
                <div className="py-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Rejection Reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={confirmModal.rejectionReason || ''}
                    onChange={(e) =>
                      setConfirmModal({
                        ...confirmModal,
                        rejectionReason: e.target.value,
                      })
                    }
                    placeholder="Please provide a reason for rejection..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                    rows={3}
                    required
                  />
                </div>
              )}
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
