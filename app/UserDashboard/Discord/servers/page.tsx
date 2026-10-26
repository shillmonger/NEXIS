"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Users,
  ShieldAlert,
  Activity,
  Settings,
  Trash2,
  Clock,
  FolderOpen,
  MoreVertical,
  LayoutGrid,
  List,
  Copy,
  Check,
  Server,
  Radio,
  ArrowUpRight,
  ArrowUpDown,
  RefreshCw,
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

// ─── TYPES ────────────────────────────────────────────────────────────────

type BotStatus = "online" | "offline" | "installing";
type HealthStatus = "healthy" | "warning" | "critical";
type SortKey = "members" | "events" | "name";
type ViewMode = "grid" | "list";

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
  activity: number[]; // moderation events per day, last 7 days
}

const BASE = "/UserDashboard/Discord/servers";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const compact = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

function HealthBadge({ status }: { status: HealthStatus }) {
  const styles: Record<HealthStatus, string> = {
    healthy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    critical: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function StatusIndicator({ status }: { status: BotStatus }) {
  if (status === "online")
    return (
      <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Online
      </div>
    );
  if (status === "offline")
    return (
      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
        <span className="h-2 w-2 rounded-full bg-slate-500" />
        Offline
      </div>
    );
  return (
    <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
      <Clock className="w-3 h-3 animate-spin" />
      Installing
    </div>
  );
}

function Sparkline({ data, active }: { data: number[]; active: boolean }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-10" aria-hidden>
      {data.map((v, i) => (
        <div
          key={i}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          className={`w-1.5 rounded-full transition-all ${
            active
              ? i === data.length - 1
                ? "bg-violet-500"
                : "bg-violet-500/35"
              : "bg-muted-foreground/25"
          }`}
        />
      ))}
    </div>
  );
}

function ServerAvatar({ server, size = "lg" }: { server: DiscordServer; size?: "lg" | "sm" }) {
  const dim = size === "lg" ? "w-16 h-16 rounded-2xl" : "w-11 h-11 rounded-xl";
  const dot =
    server.botStatus === "online"
      ? "bg-emerald-500"
      : server.botStatus === "installing"
      ? "bg-amber-500"
      : "bg-slate-500";
  return (
    <div className="relative shrink-0">
      <div className={`${dim} bg-card border-2 border-border p-0.5 shadow-lg overflow-hidden`}>
        <img src={server.icon} alt={server.name} className="w-full h-full object-cover rounded-[inherit]" />
      </div>
      <span
        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${dot}`}
      />
    </div>
  );
}

function CopyId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy server ID"
      className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      ID: {value}
      {copied ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

function ServerMenu({
  server,
  onRemove,
}: {
  server: DiscordServer;
  onRemove: (s: DiscordServer) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Server options"
        className="p-2 text-muted-foreground hover:text-violet-600 hover:bg-violet-600/10 rounded-xl transition-colors cursor-pointer outline-none"
      >
        <MoreVertical className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
        <Link href={`${BASE}/${server.serverId}`}>
          <DropdownMenuItem className="cursor-pointer text-xs font-bold flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" /> Server Settings
          </DropdownMenuItem>
        </Link>
        <Link href={`${BASE}/${server.serverId}/activity`}>
          <DropdownMenuItem className="cursor-pointer text-xs font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" /> View Activity
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => onRemove(server)}
          className="cursor-pointer text-xs font-bold text-rose-500 focus:text-rose-500 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Remove Bot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── CARDS ────────────────────────────────────────────────────────────────────

function ServerCard({
  server,
  onRemove,
}: {
  server: DiscordServer;
  onRemove: (s: DiscordServer) => void;
}) {
  const live = server.botStatus === "online";
  return (
    <div className="group relative bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-600/5 hover:-translate-y-0.5 hover:border-violet-600/30 transition-all duration-300 flex flex-col">
      {/* Banner */}
      <div
        className={`h-24 relative ${
          live
            ? "bg-gradient-to-br from-violet-600/40 via-fuchsia-500/20 to-indigo-500/10"
            : "bg-gradient-to-br from-slate-500/25 via-slate-500/10 to-transparent"
        }`}
      >
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px] text-foreground/10" />
        <div className="absolute top-3 right-3">
          <ServerMenu server={server} onRemove={onRemove} />
        </div>
        <div className="absolute top-4 left-5">
          <HealthBadge status={server.healthStatus} />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 -mt-8 flex flex-col gap-5 flex-1">
        <div className="flex items-end gap-4">
          <ServerAvatar server={server} />
          <div className="min-w-0 pb-1">
            <h3 className="text-lg font-black uppercase tracking-tight truncate">{server.name}</h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-violet-600">
              {server.subscriptionPlan}
            </span>
          </div>
        </div>

        <CopyId value={server.serverId} />

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-muted/30 border border-border/60 p-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
              Status
            </span>
            <StatusIndicator status={server.botStatus} />
          </div>
          <div className="rounded-2xl bg-muted/30 border border-border/60 p-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
              Members
            </span>
            <span className="text-sm font-black flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              {server.memberCount.toLocaleString()}
            </span>
          </div>
          <div className="rounded-2xl bg-muted/30 border border-border/60 p-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
              Last Active
            </span>
            <span className="text-xs font-bold text-muted-foreground block truncate">
              {server.lastActivity}
            </span>
          </div>
        </div>

        {/* Activity */}
        <div className="flex items-end justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
              Mod events · 7d
            </span>
            <span className="text-2xl font-black tracking-tight flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-violet-600" />
              {server.moderationEventsCount.toLocaleString()}
            </span>
          </div>
          <Sparkline data={server.activity} active={live} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <Link
            href={`${BASE}/${server.serverId}`}
            className="flex-1 bg-violet-600 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20"
          >
            Manage <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`${BASE}/${server.serverId}/activity`}
            className="bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 border border-violet-600/20 px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" /> Activity
          </Link>
          <Link
            href={`${BASE}/${server.serverId}/settings`}
            aria-label="Server settings"
            className="bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 border border-violet-600/20 p-2.5 rounded-xl transition-all"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServerRow({
  server,
  onRemove,
}: {
  server: DiscordServer;
  onRemove: (s: DiscordServer) => void;
}) {
  return (
    <div className="bg-card border border-border/80 rounded-2xl px-4 py-3 shadow-sm hover:border-violet-600/30 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-4 md:w-[34%] min-w-0">
        <ServerAvatar server={server} size="sm" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black uppercase tracking-tight truncate">{server.name}</h3>
            <HealthBadge status={server.healthStatus} />
          </div>
          <CopyId value={server.serverId} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:flex-1 items-center">
        <StatusIndicator status={server.botStatus} />
        <span className="text-xs font-black flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          {server.memberCount.toLocaleString()}
        </span>
        <span className="text-xs font-black flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-violet-600" />
          {server.moderationEventsCount.toLocaleString()}
        </span>
        <span className="text-[11px] font-bold text-muted-foreground">{server.lastActivity}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`${BASE}/${server.serverId}`}
          className="bg-violet-600 text-white py-2 px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all"
        >
          Manage
        </Link>
        <Link
          href={`${BASE}/${server.serverId}/settings`}
          aria-label="Server settings"
          className="bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 border border-violet-600/20 p-2 rounded-xl transition-all"
        >
          <Settings className="w-4 h-4" />
        </Link>
        <ServerMenu server={server} onRemove={onRemove} />
      </div>
    </div>
  );
}

function AddServerCard() {
  return (
    <Link
      href="/UserDashboard/Discord/install"
      className="group block h-full"
    >
      <button
        type="button"
        className="relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        {/* Subtle hover glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] via-transparent to-indigo-500/[0.08] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Icon */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/15 bg-violet-500/10 text-violet-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white">
          <Plus className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90" />
        </div>

        {/* Text */}
        <div className="relative space-y-1.5">
          <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-violet-500">
            Add Another Server
          </h3>

          <p className="mx-auto max-w-[210px] text-xs leading-relaxed text-muted-foreground">
            Connect a Discord server to manage your bot integrations.
          </p>
        </div>
      </button>
    </Link>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight leading-none">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1.5">
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function BotServersPage() {
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BotStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("members");
  const [view, setView] = useState<ViewMode>("grid");
  const [serverToRemove, setServerToRemove] = useState<DiscordServer | null>(null);

  // Fetch servers on mount
  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/sentinel/servers');
      const data = await response.json();

      if (response.ok) {
        setServers(data.servers || []);
      } else {
        setError(data.error || 'Failed to fetch servers');
        toast.error(data.error || 'Failed to fetch servers');
      }
    } catch (err) {
      setError('Failed to fetch servers');
      toast.error('Failed to fetch servers');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => ({
      total: servers.length,
      online: servers.filter((s) => s.botStatus === "online").length,
      members: servers.reduce((a, s) => a + s.memberCount, 0),
      events: servers.reduce((a, s) => a + s.moderationEventsCount, 0),
    }),
    [servers]
  );

  const filteredServers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return servers
      .filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(q) || s.serverId.includes(searchQuery);
        const matchesStatus = statusFilter === "all" || s.botStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        sortKey === "name"
          ? a.name.localeCompare(b.name)
          : sortKey === "events"
          ? b.moderationEventsCount - a.moderationEventsCount
          : b.memberCount - a.memberCount
      );
  }, [servers, searchQuery, statusFilter, sortKey]);

  const countFor = (st: "all" | BotStatus) =>
    st === "all" ? servers.length : servers.filter((s) => s.botStatus === st).length;

  const handleRemoveBot = () => {
    if (serverToRemove) {
      setServers((prev) => prev.filter((s) => s.id !== serverToRemove.id));
      setServerToRemove(null);
      toast.success('Bot removed from server');
    }
  };

  const isFiltering = searchQuery !== "" || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          

            <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Discord Servers
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-0.5 max-w-2xl">
                Manage connected communities, watch bot uptime and moderation activity, and jump
                  into each server&apos;s settings.
              </p>
            </div>
          </div>
        <Link href="/UserDashboard/Discord/install">
            <button
              className="cursor-pointer bg-violet-600 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 active:scale-[0.99] transition-all flex items-center gap-2 shadow-md shadow-violet-600/20 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Server
            </button>
            </Link>
        </div>

        {/* Stats */}
        {!loading && servers.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile icon={Server} label="Servers" value={String(stats.total)} accent="bg-violet-600/10 text-violet-600" />
            <StatTile
              icon={Radio}
              label="Bots Online"
              value={`${stats.online}/${stats.total}`}
              accent="bg-emerald-500/10 text-emerald-500"
            />
            <StatTile icon={Users} label="Total Members" value={compact(stats.members)} accent="bg-blue-500/10 text-blue-500" />
            <StatTile icon={ShieldAlert} label="Mod Events" value={compact(stats.events)} accent="bg-amber-500/10 text-amber-500" />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-full mx-auto shadow-xl">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">
              Failed to Load Servers
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              {error}
            </p>
            <button
              onClick={fetchServers}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && servers.length === 0 && (
          <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-full mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">
              No Discord Servers Connected
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Your bot isn't connected to any Discord servers yet. Invite your bot to start automating moderation.
            </p>
            <Link href="/UserDashboard/Discord/install">
              <button
                className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Server Now
              </button>
            </Link>
          </div>
        )}

        {/* Toolbar */}
        {!loading && !error && servers.length > 0 && (
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full xl:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search server name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 ring-violet-600/30 focus:border-violet-600 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Status filter with counts */}
              <div className="flex bg-muted/40 p-1 rounded-xl border border-border/60">
                {(["all", "online", "offline"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-1.5 ${
                      statusFilter === st
                        ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                    <span
                      className={`text-[10px] px-1.5 rounded-full ${
                        statusFilter === st ? "bg-white/20" : "bg-muted"
                      }`}
                    >
                      {countFor(st)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative flex-1 sm:flex-none">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="w-full bg-muted/40 border border-border/60 rounded-xl pl-8 pr-3 py-2 text-xs font-bold uppercase outline-none focus:ring-2 ring-violet-600/30 cursor-pointer"
                  >
                    <option value="members">Most members</option>
                    <option value="events">Most mod events</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex bg-muted/40 p-1 rounded-xl border border-border/60">
                  {(
                    [
                      ["grid", LayoutGrid],
                      ["list", List],
                    ] as const
                  ).map(([mode, Icon]) => (
                    <button
                      key={mode}
                      type="button"
                      aria-label={`${mode} view`}
                      onClick={() => setView(mode)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        view === mode
                          ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && servers.length > 0 && filteredServers.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-full mx-auto shadow-xl">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">
              No Matching Servers
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              No connected servers match your current search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="inline-flex items-center justify-center gap-2 bg-muted border border-border px-7 py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-muted/70 transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : !loading && !error && view === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredServers.map((server) => (
              <ServerCard key={server.id} server={server} onRemove={setServerToRemove} />
            ))}
            {!isFiltering && servers.length > 0 && <AddServerCard />}
          </div>
        ) : !loading && !error && servers.length > 0 ? (
          <div className="space-y-3">
            {filteredServers.map((server) => (
              <ServerRow key={server.id} server={server} onRemove={setServerToRemove} />
            ))}
            {!isFiltering && (
              <Link href="/UserDashboard/Discord/install">
                <button
                  type="button"
                  className="w-full bg-card border border-dashed border-border/60 rounded-2xl p-4 text-center hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-violet-600">
                    <Plus className="w-4 h-4" /> Add Another Server
                  </div>
                </button>
              </Link>
            )}
          </div>
        ) : null}

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
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>This will stop all automated moderation features</li>
                <li>Bot permissions will be revoked from the server</li>
                <li>You can re-add the bot at any time from the install page</li>
              </ul>
            </div>

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={() => setServerToRemove(null)}
                className="flex-1 bg-muted border border-border px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-muted/70 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveBot}
                className="flex-1 bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-rose-700 transition-all cursor-pointer"
              >
                Remove Bot
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
