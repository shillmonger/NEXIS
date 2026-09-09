"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Landmark,
  Plus,
  Search,
  Server,
  Users,
  ShieldAlert,
  Activity,
  Settings,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  FolderOpen,
  ChevronRight,
  MoreVertical,
  Radio,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── TYPES & MOCK DATA ────────────────────────────────────────────────────────

type BotStatus = "online" | "offline" | "installing";
type HealthStatus = "healthy" | "warning" | "critical";

interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  serverId: string;
  botStatus: BotStatus;
  subscriptionPlan: string;
  memberCount: number;
  lastActivity: string;
  moderationEventsCount: number;
  healthStatus: HealthStatus;
}

const MOCK_SERVERS: DiscordServer[] = [
  {
    id: "srv_1",
    name: "AMD Investor Hub",
    icon: "https://i.postimg.cc/pLhcx2Vd/bitcoin-128.png",
    serverId: "982301928374810293",
    botStatus: "online",
    subscriptionPlan: "Pro Sentinel Tier",
    memberCount: 24500,
    lastActivity: "2 mins ago",
    moderationEventsCount: 1420,
    healthStatus: "healthy",
  },
  {
    id: "srv_2",
    name: "Alpha Signal Network",
    icon: "https://i.postimg.cc/FzHG6vnh/solana-128.png",
    serverId: "847192038102938471",
    botStatus: "online",
    subscriptionPlan: "Pro Sentinel Tier",
    memberCount: 8900,
    lastActivity: "14 mins ago",
    moderationEventsCount: 680,
    healthStatus: "healthy",
  },
  {
    id: "srv_3",
    name: "Crypto Traders Lounge",
    icon: "https://i.postimg.cc/nLKkcr6W/tether-128.png",
    serverId: "129038471920384712",
    botStatus: "offline",
    subscriptionPlan: "Starter Bot Tier",
    memberCount: 1200,
    lastActivity: "3 hours ago",
    moderationEventsCount: 94,
    healthStatus: "warning",
  },
];

// ─── HELPER BADGE COMPONENTS ─────────────────────────────────────────────────

function HealthBadge({ status }: { status: HealthStatus }) {
  switch (status) {
    case "healthy":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Healthy
        </span>
      );
    case "warning":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
          Warning
        </span>
      );
    case "critical":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
          Critical
        </span>
      );
  }
}

function StatusIndicator({ status }: { status: BotStatus }) {
  switch (status) {
    case "online":
      return (
        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Online
        </div>
      );
    case "offline":
      return (
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-slate-500"></span>
          Offline
        </div>
      );
    case "installing":
      return (
        <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
          <Clock className="w-3 h-3 animate-spin" />
          Installing...
        </div>
      );
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function BotServersPage() {
  const [servers, setServers] = useState<DiscordServer[]>(MOCK_SERVERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serverToRemove, setServerToRemove] = useState<DiscordServer | null>(null);

  // Filter logic
  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.serverId.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || server.botStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRemoveBot = () => {
    if (serverToRemove) {
      setServers((prev) => prev.filter((s) => s.id !== serverToRemove.id));
      setServerToRemove(null);
    }
  };

  return (
       <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Discord Servers
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
              Manage connected Discord communities, monitor bot uptime, inspect moderation event counters, and adjust server settings.
            </p>
          </div>

          <button
            type="button"
            className="cursor-pointer bg-violet-600 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 active:scale-[0.99] transition-all flex items-center gap-2 shadow-md shadow-violet-600/20 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Server
          </button>
        </div>

        {/* Search & Filter Bar */}
        {servers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search server name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Filter Uptime:
              </span>
              <div className="flex bg-muted/40 p-1 rounded-xl border border-border/60 w-full sm:w-auto">
                {["all", "online", "offline"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex-1 sm:flex-none ${
                      statusFilter === st
                        ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Server Cards Display */}
        {filteredServers.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">No Discord Servers Connected</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "No connected servers match your current search criteria."
                : "Your bot isn't connected to any Discord servers yet. Invite your bot to start automating moderation."}
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Server Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServers.map((server) => (
              <div
                key={server.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                {/* Server Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border p-1 shadow-inner shrink-0 overflow-hidden">
                      <img
                        src={server.icon}
                        alt={server.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black uppercase tracking-tight">{server.name}</h3>
                        <HealthBadge status={server.healthStatus} />
                      </div>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        ID: {server.serverId}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-violet-600">
                        {server.subscriptionPlan}
                      </span>
                    </div> 
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button
                        type="button"
                        className="p-2 text-violet-600 hover:text-violet-700 hover:bg-violet-600/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                      <Link href={`/UserDashboard/Discord/servers/${server.serverId}/settings`}>
                        <DropdownMenuItem className="cursor-pointer text-xs font-bold flex items-center gap-2">
                          <Settings className="w-4 h-4 text-muted-foreground" /> Server Settings
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="cursor-pointer text-xs font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" /> View Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setServerToRemove(server)}
                        className="cursor-pointer text-xs font-bold text-rose-500 focus:text-rose-500 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Remove Bot
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Server Metrics Dashboard Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                      Status
                    </span>
                    <StatusIndicator status={server.botStatus} />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                      Members
                    </span>
                    <span className="text-xs font-black flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {server.memberCount.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                      Mod Logs
                    </span>
                    <span className="text-xs font-black flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-violet-600" />
                      {server.moderationEventsCount}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                      Last Active
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground truncate block">
                      {server.lastActivity}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                  <Link
                    href={`/UserDashboard/Discord/servers/${server.serverId}`}
                    className="flex-1 cursor-pointer bg-violet-600 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20"
                  >
                    Manage
                  </Link>

                  <button
                    type="button"
                    className="cursor-pointer bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 border border-violet-600/20 px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1"
                  >
                    <Activity className="w-3.5 h-3.5" /> Activity
                  </button>

                  <Link
                    href={`/UserDashboard/Discord/servers/${server.serverId}/settings`}
                    className="cursor-pointer bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 border border-violet-600/20 p-2.5 rounded-xl transition-all"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Remove Bot Confirmation Modal */}
        <Dialog open={!!serverToRemove} onOpenChange={() => setServerToRemove(null)}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-500">
                <Trash2 className="w-5 h-5" />
                <DialogTitle className="font-black uppercase text-lg">
                  Remove Bot From Server
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Are you sure you want to remove the bot from{" "}
                <span className="font-bold text-foreground">{serverToRemove?.name}</span>?
              </DialogDescription>
            </DialogHeader>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs space-y-2 text-rose-400 my-2">
              <p className="font-bold uppercase tracking-wider">Notice:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Automated moderation filters and custom AI responses will stop functioning immediately.</li>
                <li>Your subscription allocation slot for this guild will be freed up.</li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <button
                type="button"
                onClick={() => setServerToRemove(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveBot}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Confirm Removal
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}