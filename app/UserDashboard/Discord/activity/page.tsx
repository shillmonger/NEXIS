"use client";

import React, { useState } from "react";
import {
  ChartColumnBig,
  Search,
  Filter,
  Download,
  AlertTriangle,
  VolumeX,
  UserX,
  Ban,
  Trash2,
  ShieldAlert,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Calendar,
  Server,
  X,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── TYPES & MOCK DATA ────────────────────────────────────────────────────────

type EventType =
  | "Warning"
  | "Timeout"
  | "Kick"
  | "Ban"
  | "Message deleted"
  | "Spam detected"
  | "Suspicious activity"
  | "Bot error";

type EventStatus = "Resolved" | "Pending Review" | "Failed";

interface ActivityLog {
  id: string;
  eventType: EventType;
  serverName: string;
  serverId: string;
  user: string;
  userId: string;
  actionTaken: string;
  reason: string;
  dateTime: string;
  status: EventStatus;
  metadata?: string;
}

const MOCK_SERVERS = ["All Servers", "AMD Investor Hub", "Alpha Signal Network", "Crypto Traders Lounge"];

const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: "act_101",
    eventType: "Ban",
    serverName: "AMD Investor Hub",
    serverId: "982301928374810293",
    user: "CryptoSpammer99#1029",
    userId: "88210392817263",
    actionTaken: "Permanent Guild Ban",
    reason: "Automated Malicious Link / Phishing Attempt Detected",
    dateTime: "SEP 08, 2026 - 13:42:10",
    status: "Resolved",
    metadata: "Triggered AutoMod Rule #4 (Phishing Patterns)",
  },
  {
    id: "act_102",
    eventType: "Spam detected",
    serverName: "Alpha Signal Network",
    serverId: "847192038102938471",
    user: "TrollMaster#4410",
    userId: "77210392817299",
    actionTaken: "Auto-Mute & Message Purge",
    reason: "Flood Limit Exceeded (14 msgs in 3s)",
    dateTime: "SEP 08, 2026 - 12:15:04",
    status: "Resolved",
    metadata: "Purged 12 messages from #general-chat",
  },
  {
    id: "act_103",
    eventType: "Bot error",
    serverName: "Crypto Traders Lounge",
    serverId: "129038471920384712",
    user: "System / API",
    userId: "N/A",
    actionTaken: "Webhook Dispatch Retry",
    reason: "Discord API 502 Bad Gateway Timeout",
    dateTime: "SEP 08, 2026 - 11:02:45",
    status: "Failed",
    metadata: "HTTP status 502 when sending modlog embed",
  },
  {
    id: "act_104",
    eventType: "Timeout",
    serverName: "AMD Investor Hub",
    serverId: "982301928374810293",
    user: "TraderJoe#0012",
    userId: "66210392817211",
    actionTaken: "1 Hour Timeout",
    reason: "Excessive Caps Lock and DM Self-Promotion",
    dateTime: "SEP 07, 2026 - 22:18:30",
    status: "Resolved",
    metadata: "Issued by Mod_Alex via /timeout command",
  },
  {
    id: "act_105",
    eventType: "Suspicious activity",
    serverName: "Alpha Signal Network",
    serverId: "847192038102938471",
    user: "AnonRaid_01#9912",
    userId: "55102938471200",
    actionTaken: "Flagged for Staff Review",
    reason: "Rapid Mass Join Pattern Detected (Raid Guard)",
    dateTime: "SEP 07, 2026 - 18:40:12",
    status: "Pending Review",
    metadata: "18 accounts joined in under 10 seconds",
  },
  {
    id: "act_106",
    eventType: "Message deleted",
    serverName: "AMD Investor Hub",
    serverId: "982301928374810293",
    user: "CasualUser#3321",
    userId: "44102938471299",
    actionTaken: "Message Deleted",
    reason: "Blacklisted Crypto Contract Address",
    dateTime: "SEP 07, 2026 - 15:10:00",
    status: "Resolved",
    metadata: "Deleted text containing unverified CA token",
  },
  {
    id: "act_107",
    eventType: "Warning",
    serverName: "Crypto Traders Lounge",
    serverId: "129038471920384712",
    user: "NewbieTrader#8810",
    userId: "33102938471288",
    actionTaken: "Automated Warning Issued",
    reason: "Inappropriate Language in Public Channel",
    dateTime: "SEP 06, 2026 - 09:33:21",
    status: "Resolved",
    metadata: "Warning #1 logged to user profile",
  },
];

// ─── EVENT TYPE BADGE COMPONENT ──────────────────────────────────────────────

function EventBadge({ type }: { type: EventType }) {
  switch (type) {
    case "Ban":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <Ban className="w-3 h-3" /> Ban
        </span>
      );
    case "Kick":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <UserX className="w-3 h-3" /> Kick
        </span>
      );
    case "Timeout":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <VolumeX className="w-3 h-3" /> Timeout
        </span>
      );
    case "Warning":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <AlertTriangle className="w-3 h-3" /> Warning
        </span>
      );
    case "Message deleted":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Trash2 className="w-3 h-3" /> Msg Deleted
        </span>
      );
    case "Spam detected":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <ShieldAlert className="w-3 h-3" /> Spam
        </span>
      );
    case "Suspicious activity":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          <Clock className="w-3 h-3" /> Suspicious
        </span>
      );
    case "Bot error":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600/20 text-rose-400 border border-rose-500/40">
          <Bot className="w-3 h-3" /> Bot Error
        </span>
      );
  }
}

function StatusBadge({ status }: { status: EventStatus }) {
  switch (status) {
    case "Resolved":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Resolved
        </span>
      );
    case "Pending Review":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    case "Failed":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <XCircle className="w-3 h-3" /> Failed
        </span>
      );
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function BotActivityPage() {
  const [activities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [serverFilter, setServerFilter] = useState("All Servers");
  const [eventTypeFilter, setEventTypeFilter] = useState("All Types");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.actionTaken.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesServer =
      serverFilter === "All Servers" || act.serverName === serverFilter;

    const matchesType =
      eventTypeFilter === "All Types" || act.eventType === eventTypeFilter;

    const matchesDate = !dateFilter || act.dateTime.includes(dateFilter);

    return matchesSearch && matchesServer && matchesType && matchesDate;
  });

  const handleExport = () => {
    const headers = "ID,Event Type,Server,User,Action,Reason,Date,Status\n";
    const rows = filteredActivities
      .map(
        (a) =>
          `"${a.id}","${a.eventType}","${a.serverName}","${a.user}","${a.actionTaken}","${a.reason}","${a.dateTime}","${a.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bot-activity-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Bot Activity Audit
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
              Complete real-time moderation logs, automated filter actions, system errors, and suspicious user behavior logs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="cursor-pointer bg-violet-600 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all flex items-center gap-2 self-start md:self-auto shadow-md shadow-violet-600/20"
          >
            <Download className="w-4 h-4" /> Export Audit Log
          </button>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="bg-card border border-border/80 p-4 md:p-5 rounded-2xl shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user, reason, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
              />
            </div>

            {/* Server Filter */}
            <div className="relative">
              <select
                value={serverFilter}
                onChange={(e) => setServerFilter(e.target.value)}
                className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all cursor-pointer appearance-none"
              >
                {MOCK_SERVERS.map((srv) => (
                  <option key={srv} value={srv} className="bg-card text-foreground">
                    {srv}
                  </option>
                ))}
              </select>
              <Server className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Event Type Filter */}
            <div className="relative">
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all cursor-pointer appearance-none"
              >
                {[
                  "All Types",
                  "Warning",
                  "Timeout",
                  "Kick",
                  "Ban",
                  "Message deleted",
                  "Spam detected",
                  "Suspicious activity",
                  "Bot error",
                ].map((type) => (
                  <option key={type} value={type} className="bg-card text-foreground">
                    {type}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Date Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter date (e.g. SEP 08)..."
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

          </div>
        </div>

        {/* Activity Table & Empty State */}
        {filteredActivities.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">No Activity Logged</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              No moderation events or system activity matched your search and filter parameters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setServerFilter("All Servers");
                setEventTypeFilter("All Types");
                setDateFilter("");
              }}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all cursor-pointer shadow-md shadow-violet-600/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight">Activity Log</h2>
              <span className="text-xs text-muted-foreground font-mono">
                Showing {filteredActivities.length} Events
              </span>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-black uppercase text-xs">Event Type</TableHead>
                    <TableHead className="font-black uppercase text-xs">Server</TableHead>
                    <TableHead className="font-black uppercase text-xs">Target Member</TableHead>
                    <TableHead className="font-black uppercase text-xs">Action Taken</TableHead>
                    <TableHead className="font-black uppercase text-xs">Reason</TableHead>
                    <TableHead className="font-black uppercase text-xs">Date & Time</TableHead>
                    <TableHead className="font-black uppercase text-xs">Status</TableHead>
                    <TableHead className="text-right font-black uppercase text-xs">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((act) => (
                    <TableRow key={act.id} className="border-border/60">
                      <TableCell>
                        <EventBadge type={act.eventType} />
                      </TableCell>
                      <TableCell className="text-xs font-bold">{act.serverName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs font-bold">{act.user}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{act.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-violet-600">
                        {act.actionTaken}
                      </TableCell>
                      <TableCell className="text-xs max-w-xs truncate text-muted-foreground font-medium">
                        {act.reason}
                      </TableCell>
                      <TableCell className="text-xs font-mono whitespace-nowrap">{act.dateTime}</TableCell>
                      <TableCell>
                        <StatusBadge status={act.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedActivity(act)}
                          className="p-2 text-violet-600 hover:text-violet-700 hover:bg-violet-600/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
              <span className="text-xs text-muted-foreground font-mono">
                Page {currentPage} of 1
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-2 bg-violet-600/10 text-violet-600 border border-violet-600/20 rounded-lg disabled:opacity-40 text-xs font-bold transition-all cursor-pointer hover:bg-violet-600/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={true}
                  className="p-2 bg-violet-600/10 text-violet-600 border border-violet-600/20 rounded-lg disabled:opacity-40 text-xs font-bold transition-all cursor-pointer hover:bg-violet-600/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Detail Modal */}
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="font-black uppercase text-lg flex items-center gap-2">
                  <ChartColumnBig className="w-5 h-5 text-violet-600" />
                  Activity Detail
                </DialogTitle>
              </div>
            </DialogHeader>

            {selectedActivity && (
              <div className="space-y-4 py-2 text-xs">
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/60">
                  <span className="font-mono text-muted-foreground">ID: {selectedActivity.id}</span>
                  <EventBadge type={selectedActivity.eventType} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                      Server Name
                    </span>
                    <p className="font-bold text-sm">{selectedActivity.serverName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">ID: {selectedActivity.serverId}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                      Target User
                    </span>
                    <p className="font-bold text-sm">{selectedActivity.user}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">ID: {selectedActivity.userId}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                    Enforcement Action
                  </span>
                  <p className="font-bold text-violet-600">{selectedActivity.actionTaken}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                    Trigger Reason
                  </span>
                  <p className="font-medium text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/60">
                    {selectedActivity.reason}
                  </p>
                </div>

                {selectedActivity.metadata && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                      System Metadata
                    </span>
                    <p className="font-mono text-[11px] bg-muted/40 p-3 rounded-xl border border-border/60">
                      {selectedActivity.metadata}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-muted-foreground">{selectedActivity.dateTime}</span>
                  <StatusBadge status={selectedActivity.status} />
                </div>
              </div>
            )}

            <DialogFooter>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors cursor-pointer"
              >
                Close Detail
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}