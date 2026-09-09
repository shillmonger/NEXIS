"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Server,
  Users,
  ShieldAlert,
  Activity,
  Settings,
  Trash2,
  RefreshCw,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Search,
  Filter,
  UserX,
  VolumeX,
  Shield,
  Ban,
  ArrowUpRight,
  BarChart2,
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

type NavigationTab = "overview" | "moderation" | "incidents" | "settings";

interface Incident {
  id: string;
  type: "Warning" | "Timeout" | "Kick" | "Ban";
  user: string;
  userId: string;
  moderator: string;
  reason: string;
  timestamp: string;
}

const MOCK_INCIDENTS: Incident[] = [
  { id: "inc_1", type: "Ban", user: "CryptoSpammer99#1029", userId: "88210392817263", moderator: "AMD Sentinel AI", reason: "Automated Malicious Link / Phishing Attempt Detected", timestamp: "10 mins ago" },
  { id: "inc_2", type: "Timeout", user: "TrollMaster#4410", userId: "77210392817299", moderator: "Mod_Alex", reason: "Excessive Spam / Caps Lock Flooding", timestamp: "42 mins ago" },
  { id: "inc_3", type: "Warning", user: "TraderJoe#0012", userId: "66210392817211", moderator: "AMD Sentinel AI", reason: "Unsolicited DM Advertising Flagged", timestamp: "2 hours ago" },
  { id: "inc_4", type: "Kick", user: "RaidBot_99#0001", userId: "11210392817200", moderator: "AMD Sentinel AI", reason: "Raid Protection System Triggered", timestamp: "5 hours ago" },
];

// ─── INCIDENT BADGE COMPONENT ────────────────────────────────────────────────

function IncidentBadge({ type }: { type: Incident["type"] }) {
  switch (type) {
    case "Ban":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <Ban className="w-3 h-3" /> Ban
        </span>
      );
    case "Kick":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <UserX className="w-3 h-3" /> Kick
        </span>
      );
    case "Timeout":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <VolumeX className="w-3 h-3" /> Timeout
        </span>
      );
    case "Warning":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <AlertTriangle className="w-3 h-3" /> Warning
        </span>
      );
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>("overview");
  const [isRestarting, setIsRestarting] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [incidentSearch, setIncidentSearch] = useState("");

  const filteredIncidents = MOCK_INCIDENTS.filter(
    (inc) =>
      inc.user.toLowerCase().includes(incidentSearch.toLowerCase()) ||
      inc.reason.toLowerCase().includes(incidentSearch.toLowerCase()) ||
      inc.type.toLowerCase().includes(incidentSearch.toLowerCase())
  );

  const handleRestartBot = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
    }, 2000);
  };

  return (
       <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* Back Link */}
        <div>
          <Link
            href="/UserDashboard/Discord/servers"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-violet-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Servers
          </Link>
        </div>

        {/* Server Header Card */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-bl-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border p-1 shadow-inner shrink-0 overflow-hidden">
                <img
                  src="https://i.postimg.cc/pLhcx2Vd/bitcoin-128.png"
                  alt="AMD Investor Hub"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black uppercase tracking-tight">
                    AMD Investor Hub
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  ID: {params.id || "982301928374810293"} • Plan:{" "}
                  <span className="text-violet-600 font-bold">Pro Sentinel Tier</span>
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRestartBot}
                disabled={isRestarting}
                className="cursor-pointer bg-muted hover:bg-muted/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRestarting ? "animate-spin text-violet-600" : ""}`} />
                {isRestarting ? "Restarting..." : "Restart Bot"}
              </button>

              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(true)}
                className="cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Remove Bot
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Bot Status
              </span>
              <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Online & Operational
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Total Members
              </span>
              <p className="text-xs font-black flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" /> 24,500
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                System Health
              </span>
              <p className="text-xs font-black text-emerald-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> 99.98% Healthy
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Active Tier Limit
              </span>
              <p className="text-xs font-black text-violet-600">
                1/5 Servers Connected
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border/80 space-x-2 overflow-x-auto">
          {[
            { key: "overview", label: "Overview", icon: BarChart2 },
            { key: "moderation", label: "Moderation Rules", icon: Sliders },
            { key: "incidents", label: "Incident History", icon: ShieldAlert },
            { key: "settings", label: "Server Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as NavigationTab)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & MODERATION STATS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Moderation Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Warnings Issued
                </span>
                <p className="text-2xl font-black">842</p>
                <p className="text-[11px] text-emerald-500 font-bold">+12% from last week</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Timeouts Applied
                </span>
                <p className="text-2xl font-black text-blue-500">314</p>
                <p className="text-[11px] text-muted-foreground font-medium">Avg duration: 1 hour</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Users Kicked
                </span>
                <p className="text-2xl font-black text-amber-500">128</p>
                <p className="text-[11px] text-muted-foreground font-medium">Auto-raid responses</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Permanent Bans
                </span>
                <p className="text-2xl font-black text-rose-500">136</p>
                <p className="text-[11px] text-rose-500 font-bold">+4 malicious links today</p>
              </div>
            </div>

            {/* Moderation Overview Chart Placeholder */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Moderation Activity Chart</h3>
                  <p className="text-xs text-muted-foreground font-medium">30-day enforcement events timeline</p>
                </div>
                <span className="text-xs font-mono font-bold text-violet-600 bg-violet-600/10 px-3 py-1 rounded-lg border border-violet-600/20">
                  REAL-TIME LOGS
                </span>
              </div>

              {/* Visual Simulated Chart Bars */}
              <div className="h-48 w-full bg-muted/20 border border-border/60 rounded-xl p-4 flex items-end justify-between gap-2">
                {[40, 65, 30, 85, 95, 45, 60, 75, 100, 55, 80, 90, 70, 85].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full bg-violet-600/80 hover:bg-violet-600 rounded-t-md transition-all cursor-pointer"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground hidden sm:block">
                      D{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INCIDENTS TABLE */}
        {(activeTab === "overview" || activeTab === "incidents") && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Recent Incidents</h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Latest automated and manual moderation actions logged in this guild
                </p>
              </div>

              {/* Search Bar for Incidents */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter incidents..."
                  value={incidentSearch}
                  onChange={(e) => setIncidentSearch(e.target.value)}
                  className="w-full bg-muted/30 border border-border/80 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-black uppercase text-xs">Action Type</TableHead>
                    <TableHead className="font-black uppercase text-xs">Target User</TableHead>
                    <TableHead className="font-black uppercase text-xs">Moderator</TableHead>
                    <TableHead className="font-black uppercase text-xs">Reason / Trigger</TableHead>
                    <TableHead className="text-right font-black uppercase text-xs">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                        No incident logs found matching query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIncidents.map((inc) => (
                      <TableRow key={inc.id} className="border-border/60">
                        <TableCell>
                          <IncidentBadge type={inc.type} />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-bold">{inc.user}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{inc.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-violet-600">
                          {inc.moderator}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate text-muted-foreground font-medium">
                          {inc.reason}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono font-medium">
                          {inc.timestamp}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* TAB 3 & 4 PLACEHOLDERS */}
        {activeTab === "moderation" && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
            <Sliders className="w-8 h-8 text-violet-600 mx-auto" />
            <h3 className="text-lg font-black uppercase">Guild Moderation Configuration</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Configure automated spam filters, banned keywords, link whitelists, and raid detection sensitivity thresholds for this guild.
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
            <Settings className="w-8 h-8 text-violet-600 mx-auto" />
            <h3 className="text-lg font-black uppercase">Server Bot Settings</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Adjust bot command prefixes, log channels, custom status messages, and role permissions for server administrators.
            </p>
          </div>
        )}

        {/* Remove Bot Modal */}
        <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-500">
                <Trash2 className="w-5 h-5" />
                <DialogTitle className="font-black uppercase text-lg">
                  Disconnect Bot
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Are you sure you want to disconnect the bot from <span className="font-bold text-foreground">AMD Investor Hub</span>?
              </DialogDescription>
            </DialogHeader>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs space-y-2 text-rose-400 my-2">
              <p className="font-bold uppercase tracking-wider">Warning:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Automated moderation, raid protection, and logging will immediately cease.</li>
                <li>You can re-authorize this server at any time from the Bot Hub.</li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href="/bots/servers"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 text-center transition-colors shadow-md shadow-rose-600/20"
              >
                Confirm Removal
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}