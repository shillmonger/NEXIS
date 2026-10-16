"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, Mail, MoreVertical, ChevronDown, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  balance: string;
  profit: string;
  roles: string[];
  username: string;
  country: string;
  phoneNumber: string;
  welcomeBonus: number;
  referralBonus: number;
  totalWithdrawal: number;
  totalDeposit: number;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

export default function AdminRolesPage() {
  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    // Mock data
    const mockUsers: User[] = [
      {
        id: "user-001",
        name: "John Doe",
        email: "john@example.com",
        status: "Active",
        balance: "5000",
        profit: "1200",
        roles: ["user"],
        username: "crypto_trader",
        country: "USA",
        phoneNumber: "+1234567890",
        welcomeBonus: 100,
        referralBonus: 50,
        totalWithdrawal: 500,
        totalDeposit: 5500,
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: "2026-10-15T00:00:00Z",
        profileImage: "https://github.com/shadcn.png",
      },
      {
        id: "user-002",
        name: "Jane Smith",
        email: "jane@example.com",
        status: "Active",
        balance: "12500",
        profit: "3400",
        roles: ["user", "admin"],
        username: "investor_hub",
        country: "UK",
        phoneNumber: "+441234567890",
        welcomeBonus: 100,
        referralBonus: 150,
        totalWithdrawal: 2000,
        totalDeposit: 14500,
        createdAt: "2026-08-15T00:00:00Z",
        updatedAt: "2026-10-14T00:00:00Z",
        profileImage: "https://github.com/shadcn.png",
      },
      {
        id: "user-003",
        name: "Mike Johnson",
        email: "mike@example.com",
        status: "Active",
        balance: "8500",
        profit: "2100",
        roles: ["user"],
        username: "whale_investor",
        country: "Canada",
        phoneNumber: "+11234567890",
        welcomeBonus: 100,
        referralBonus: 75,
        totalWithdrawal: 1500,
        totalDeposit: 10000,
        createdAt: "2026-09-10T00:00:00Z",
        updatedAt: "2026-10-13T00:00:00Z",
        profileImage: "https://github.com/shadcn.png",
      },
      {
        id: "user-004",
        name: "Sarah Williams",
        email: "sarah@example.com",
        status: "Inactive",
        balance: "2500",
        profit: "300",
        roles: ["user"],
        username: "swing_trader",
        country: "Australia",
        phoneNumber: "+61234567890",
        welcomeBonus: 100,
        referralBonus: 25,
        totalWithdrawal: 0,
        totalDeposit: 2600,
        createdAt: "2026-10-01T00:00:00Z",
        updatedAt: "2026-10-12T00:00:00Z",
        profileImage: "https://github.com/shadcn.png",
      },
      {
        id: "user-005",
        name: "David Brown",
        email: "david@example.com",
        status: "Active",
        balance: "15000",
        profit: "4500",
        roles: ["user"],
        username: "newbie_trader",
        country: "Germany",
        phoneNumber: "+491234567890",
        welcomeBonus: 100,
        referralBonus: 200,
        totalWithdrawal: 3000,
        totalDeposit: 18000,
        createdAt: "2026-09-20T00:00:00Z",
        updatedAt: "2026-10-11T00:00:00Z",
        profileImage: "https://github.com/shadcn.png",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);

  // Update user role
  const changeRole = async (userId: string, newRoles: string[]) => {
    setUpdatingUserId(userId);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roles: newRoles } : u))
      );

      toast.success(
        `Role updated to ${newRoles.includes("admin") ? "Admin" : "User"}`
      );
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  // Get display role
  const getDisplayRole = (roles: string[]) => {
    return roles.includes("admin") ? "Admin" : "User";
  };

  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              Role Management
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <UserCheck className="w-3 h-3 text-violet-600" />
              Permissions Control
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name/email/username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border border-border rounded-xl py-2 pl-4 pr-4 text-sm focus:ring-2 focus:ring-violet-500/50 w-full md:w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
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
                    <td colSpan={6} className="px-6 py-12">
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
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Account Balance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Role</th>
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
                            alt={user.name}
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
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              @{user.username}
                            </span>
                            <span className="font-bold text-foreground block">
                              {user.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(user.balance)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Shadcn Role Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            disabled={updatingUserId === user.id}
                            className="flex items-center gap-2 bg-card border border-border cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                {getDisplayRole(user.roles)}
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                              </>
                            )}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="bg-card border-border rounded-lg shadow-xl"
                          >
                            <DropdownMenuItem
                              className="text-xs font-medium py-2 px-4 cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-600"
                              onClick={() => changeRole(user.id, ["user"])}
                              disabled={
                                user.roles.length === 1 && user.roles[0] === "user"
                              }
                            >
                              User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs font-medium py-2 px-4 cursor-pointer focus:bg-violet-500/10 focus:text-violet-600"
                              onClick={() => changeRole(user.id, ["user", "admin"])}
                              disabled={user.roles.includes("admin")}
                            >
                              Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                            onClick={() =>
                              toast.info(
                                `User: ${user.name} | Balance: ${formatCurrency(
                                  user.balance
                                )} | Total Deposit: ${formatCurrency(
                                  user.totalDeposit
                                )} | Total Withdrawal: ${formatCurrency(
                                  user.totalWithdrawal
                                )}`
                              )
                            }
                          >
                            <MoreVertical className="w-4 h-4" />
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
    </div>
  );
}
