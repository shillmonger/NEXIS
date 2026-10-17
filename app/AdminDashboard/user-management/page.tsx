"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserMinus,
  Briefcase,
  Search,
  Filter,
  Trash2,
  Ban,
  MoreVertical,
  Mail,
  Loader2,
  Eye,
  XCircle,
  User,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface User {
  id: string;
  _id?: string;
  name?: string;
  fullName?: string;
  email: string;
  username: string;
  status: string;
  balance?: string;
  profit?: string;
  totalDeposit?: number;
  totalWithdrawal?: number;
  roles?: string[];
  country?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  profileImage?: string;
  emailVerified?: boolean;
  accountBalance?: number;
  welcomeBonus?: number;
  totalProfits?: number;
  referralBonus?: number;
  totalReferrals?: number;
  activeReferrals?: number;
  myReferralId?: string;
  referralId?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  provider?: string;
}

interface ProfitHistoryEntry {
  date: string;
  rate: number;
  amount: number;
  timestamp: string;
}

interface UserInvestment {
  id: string;
  userId: string;
  planId: number;
  planName: string;
  roiRate: number;
  investmentAmount: number;
  durationDays: number;
  daysPassed: number;
  profitEarned: number;
  completionPercentage: number;
  status: string;
  profitHistory: ProfitHistoryEntry[];
  startDate: string;
  endDate: string;
  lastProfitDate: string;
  updatedAt: string;
  planType?: string;
  billingPeriod?: string;
}

interface UserDetails {
  user: User;
  investments?: UserInvestment[];
}

export default function AdminUsersPage() {
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "suspend" | "activate" | "delete";
    userId: string;
    userName: string;
    currentStatus?: string;
  } | null>(null);
  const [stats, setStats] = useState([
    {
      label: "Total Users",
      value: "0",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Users",
      value: "0",
      icon: UserCheck,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      label: "Blocked Users",
      value: "0",
      icon: UserMinus,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Users Deposited",
      value: "0",
      icon: Briefcase,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setStats([
          {
            label: "Total Users",
            value: data.stats.totalUsers.toString(),
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Active Users",
            value: data.stats.activeUsers.toString(),
            icon: UserCheck,
            color: "text-teal-500",
            bg: "bg-teal-500/10",
          },
          {
            label: "Blocked Users",
            value: data.stats.blockedUsers.toString(),
            icon: UserMinus,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
          {
            label: "Users This Week",
            value: data.stats.usersThisWeek.toString(),
            icon: Briefcase,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ]);
      } else {
        toast.error(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setUpdatingUserId(userId);

    try {
      // Convert frontend status to backend status
      const newStatus = currentStatus === "Active" ? "suspended" : "active";

      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user status');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: data.user.status } : u))
      );

      const actionMessage = newStatus === 'active' ? 'activated' : 'suspended';
      toast.success(`User ${actionMessage}`);

      // Refresh stats
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user status');
    } finally {
      setUpdatingUserId(null);
      setConfirmModal(null);
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      toast.success(`User ${userName} deleted successfully`);

      // Refresh stats
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setUpdatingUserId(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (
    action: "suspend" | "activate" | "delete",
    userId: string,
    userName: string,
    currentStatus?: string
  ) => {
    setConfirmModal({ isOpen: true, action, userId, userName, currentStatus });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.action === "delete") {
      deleteUser(confirmModal.userId, confirmModal.userName);
    } else {
      toggleUserStatus(confirmModal.userId, confirmModal.currentStatus || "Active");
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setLoadingUserDetails(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedUser({
          user: data.user,
          investments: data.investments || [],
        });
      } else {
        toast.error(data.error || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoadingUserDetails(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName?.toLowerCase() || user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              User Management
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <Users className="w-3 h-3 text-violet-600" />
              Community Control and Management
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search by /email/username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500/50 w-full md:w-64 shadow-sm"
              />
            </div>
            <button className="p-3 bg-card border border-border rounded-xl text-violet-600 shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* User Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-tighter">
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm font-black uppercase tracking-tighter mb-2">
                            {searchTerm ? "No users found" : "No users found"}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase mb-6">
                            {searchTerm
                              ? "Try adjusting your search terms"
                              : "When users register, they will appear here"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 hidden sm:table-cell">
                      Email Verified
                    </th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profileImage || defaultProfileImage}
                            alt={user.fullName || user.name}
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
                            {(user.fullName || user.name || 'U').charAt(0)}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm text-foreground">
                              {user.fullName || user.name}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-gray-500 font-medium">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.emailVerified
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => fetchUserDetails(user.id)}
                            disabled={loadingUserDetails === user.id}
                            className="p-3 bg-violet-500/10 text-violet-600 cursor-pointer hover:bg-violet-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View User Details"
                          >
                            {loadingUserDetails === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              openConfirmModal(
                                user.status === "Active" ? "suspend" : "activate",
                                user.id,
                                user.fullName || user.name || 'User',
                                user.status
                              )
                            }
                            disabled={updatingUserId === user.id}
                            className={`p-3 cursor-pointer rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.status === "Active"
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            }`}
                            title={
                              user.status === "Active"
                                ? "Suspend User"
                                : "Activate User"
                            }
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openConfirmModal("delete", user.id, user.fullName || user.name || 'User')}
                            disabled={updatingUserId === user.id}
                            className="p-3 bg-rose-500/10 text-rose-500 cursor-pointer hover:bg-rose-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/10 backdrop-blur-sm px-4">
          <div
            className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col"
            style={{
              height: "90vh",
              animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border rounded-t-3xl">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-foreground">User Details</h3>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                    selectedUser.user.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
                >
                  {selectedUser.user.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <img
                  src={selectedUser.user.profileImage || defaultProfileImage}
                  alt={selectedUser.user.fullName || selectedUser.user.name}
                  className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0"
                />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {selectedUser.user.fullName || selectedUser.user.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    @{selectedUser.user.username} · {selectedUser.user.email}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <p className="text-[11px] font-medium text-violet-600 uppercase tracking-widest mb-3">
                  Personal Information
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Full name</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedUser.user.fullName || selectedUser.user.name}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Email Verified</p>
                    <span
                      className={`text-sm font-medium ${
                        selectedUser.user.emailVerified
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {selectedUser.user.emailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Provider</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {selectedUser.user.provider || 'local'}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Last Login</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedUser.user.lastLoginAt
                        ? formatDate(selectedUser.user.lastLoginAt)
                        : "Never"}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Joined</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedUser.user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Financial Information */}
              <div>
                <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-widest mb-3">
                  Financial Information
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Total deposits</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(selectedUser.user.totalDeposit || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground mb-1">Total withdrawals</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(selectedUser.user.totalWithdrawal || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Role Information */}
              <div>
                <p className="text-[11px] font-medium text-violet-600 uppercase tracking-widest mb-3">
                  Role Information
                </p>
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="text-[11px] text-muted-foreground mb-1">Roles</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(selectedUser.user.roles?.length
                      ? selectedUser.user.roles
                      : ["N/A"]
                    ).map((role) => (
                      <span
                        key={role}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Subscription Information */}
              <div>
                <p className="text-[11px] font-medium text-teal-600 uppercase tracking-widest mb-3">
                  Subscription Information
                </p>

                {selectedUser.investments && selectedUser.investments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.investments.map((investment) => (
                      <div
                        key={investment.id}
                        className="p-4 bg-muted/30 rounded-xl border border-border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {investment.planName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {investment.billingPeriod || 'monthly'} subscription
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              investment.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : investment.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : investment.status === "rejected"
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                            }`}
                          >
                            {investment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2 bg-background/50 rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">Amount</p>
                            <p className="text-sm font-bold text-foreground">
                              {formatCurrency(investment.investmentAmount)}
                            </p>
                          </div>
                          <div className="p-2 bg-background/50 rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">Plan Type</p>
                            <p className="text-sm font-bold text-foreground">
                              {investment.planType || 'Standard'}
                            </p>
                          </div>
                          <div className="p-2 bg-background/50 rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">Start Date</p>
                            <p className="text-sm font-bold text-foreground">
                              {formatDate(investment.startDate)}
                            </p>
                          </div>
                          <div className="p-2 bg-background/50 rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">End Date</p>
                            <p className="text-sm font-bold text-foreground">
                              {investment.endDate ? formatDate(investment.endDate) : 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {investment.endDate && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span>Subscription Progress</span>
                              <span>{investment.completionPercentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                              <div
                                className="bg-teal-500 h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, investment.completionPercentage)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/30 rounded-xl border border-border text-center">
                    <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">No subscriptions found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-border rounded-b-3xl">
              <p className="text-xs text-muted-foreground font-mono">
                ID: {selectedUser.user._id || selectedUser.user.id}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-xs font-medium px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  className={`text-xs font-medium px-4 py-2 rounded-lg border cursor-pointer transition-opacity hover:opacity-80 ${
                    selectedUser.user.status === "Active"
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  }`}
                >
                  {selectedUser.user.status === "Active" ? "Suspend user" : "Activate user"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                confirmModal.action === "delete"
                  ? "bg-rose-500/10"
                  : confirmModal.action === "suspend"
                  ? "bg-amber-500/10"
                  : "bg-emerald-500/10"
              }`}
            >
              {confirmModal.action === "delete" ? (
                <Trash2 className="w-8 h-8 text-rose-500" />
              ) : confirmModal.action === "suspend" ? (
                <Ban className="w-8 h-8 text-amber-500" />
              ) : (
                <UserCheck className="w-8 h-8 text-emerald-500" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              {confirmModal.action === "delete"
                ? "Delete User"
                : confirmModal.action === "suspend"
                ? "Suspend User"
                : "Activate User"}
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
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Action
                </span>
                <span
                  className={`text-sm font-bold uppercase ${
                    confirmModal.action === "delete"
                      ? "text-rose-500"
                      : confirmModal.action === "suspend"
                      ? "text-amber-500"
                      : "text-emerald-500"
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
                disabled={updatingUserId === confirmModal.userId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={updatingUserId === confirmModal.userId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === "delete"
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : confirmModal.action === "suspend"
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {updatingUserId === confirmModal.userId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmModal.action === "delete" ? (
                      <Trash2 className="w-4 h-4" />
                    ) : confirmModal.action === "suspend" ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                    {confirmModal.action === "delete" ? "Delete" : confirmModal.action}
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
