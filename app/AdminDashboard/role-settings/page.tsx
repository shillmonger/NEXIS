"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, Mail, ChevronDown, Loader2 } from "lucide-react";
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
  name?: string;
  fullName?: string;
  email: string;
  status: string;
  role: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  emailVerified?: boolean;
}

export default function AdminRolesPage() {
  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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

  // Update user role
  const changeRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: data.user.role } : u))
      );

      toast.success(`Role updated to ${newRole === 'admin' ? 'Admin' : 'User'}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      (user.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display role
  const getDisplayRole = (role: string) => {
    return role === "admin" ? "Admin" : "User";
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
                            alt={user.fullName || user.username}
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
                            {(user.username || user.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              @{user.username}
                            </span>
                            <span className="font-bold text-foreground block">
                              {user.fullName || user.username}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
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
                                {getDisplayRole(user.role)}
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
                              onClick={() => changeRole(user.id, "user")}
                              disabled={user.role === "user"}
                            >
                              User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs font-medium py-2 px-4 cursor-pointer focus:bg-violet-500/10 focus:text-violet-600"
                              onClick={() => changeRole(user.id, "admin")}
                              disabled={user.role === "admin"}
                            >
                              Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-muted-foreground">
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </span>
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
