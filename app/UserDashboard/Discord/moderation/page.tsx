"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  VolumeX,
  UserX,
  Ban,
  Trash2,
  AlertTriangle,
  Save,
  RotateCcw,
  CheckCircle2,
  Plus,
  X,
  HelpCircle,
  Hash,
  User,
  Shield,
  Info,
  Sliders,
  Clock,
  ChevronRight,
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

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────

interface ServerModerationSettings {
  spamProtection: boolean;
  floodProtection: boolean;
  suspiciousActivityDetection: boolean;
  autoWarnEnabled: boolean;
  autoTimeoutEnabled: boolean;
  autoKickEnabled: boolean;
  autoBanEnabled: boolean;
  autoDeleteMessages: boolean;
  warnThreshold: number;
  timeoutDurationMinutes: number;
  kickThreshold: number;
  banThreshold: number;
  exemptRoles: string[];
  exemptUsers: string[];
  exemptChannels: string[];
  modLogChannel: string;
}

interface ModerationAction {
  id: string;
  type: "Warning" | "Timeout" | "Kick" | "Ban" | "Message Deleted";
  targetUser: string;
  targetId: string;
  ruleTriggered: string;
  timestamp: string;
  status: "Automated" | "Manual";
}

// ─── INITIAL MOCK CONFIGURATION ─────────────────────────────────────────────

const INITIAL_SETTINGS: ServerModerationSettings = {
  spamProtection: true,
  floodProtection: true,
  suspiciousActivityDetection: true,
  autoWarnEnabled: true,
  autoTimeoutEnabled: true,
  autoKickEnabled: false,
  autoBanEnabled: true,
  autoDeleteMessages: true,
  warnThreshold: 3,
  timeoutDurationMinutes: 60,
  kickThreshold: 5,
  banThreshold: 7,
  exemptRoles: ["Administrator", "Moderator", "VIP Traders"],
  exemptUsers: ["ServerOwner#0001", "BotAdmin#9999"],
  exemptChannels: ["#bot-testing", "#announcements-staff"],
  modLogChannel: "#mod-logs",
};

const MOCK_RECENT_ACTIONS: ModerationAction[] = [
  {
    id: "act_201",
    type: "Ban",
    targetUser: "PhishBot99#1029",
    targetId: "88210392817263",
    ruleTriggered: "AutoMod Rule #4 (Malicious Link/Phishing)",
    timestamp: "SEP 08, 2026 - 13:42:10",
    status: "Automated",
  },
  {
    id: "act_202",
    type: "Message Deleted",
    targetUser: "SpamMaster#4410",
    targetId: "77210392817299",
    ruleTriggered: "Flood Protection (12 msgs/sec)",
    timestamp: "SEP 08, 2026 - 12:15:04",
    status: "Automated",
  },
  {
    id: "act_203",
    type: "Timeout",
    targetUser: "ToxicUser#0012",
    targetId: "66210392817211",
    ruleTriggered: "Exceeded Warning Threshold (3 Warns)",
    timestamp: "SEP 07, 2026 - 22:18:30",
    status: "Automated",
  },
  {
    id: "act_204",
    type: "Warning",
    targetUser: "NewbieTrader#8810",
    targetId: "33102938471288",
    ruleTriggered: "Profanity Filter Violation",
    timestamp: "SEP 06, 2026 - 09:33:21",
    status: "Automated",
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ServerModerationPage({
  params,
}: {
  params?: { id?: string };
}) {
  const serverId = params?.id || "982301928374810293";
  const serverName = "AMD Investor Hub";

  const [settings, setSettings] = useState<ServerModerationSettings>(INITIAL_SETTINGS);
  const [initialState] = useState<ServerModerationSettings>(INITIAL_SETTINGS);
  
  // Feedback & Modal state
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isExemptionModalOpen, setIsExemptionModalOpen] = useState(false);
  const [exemptionType, setExemptionType] = useState<"role" | "user" | "channel">("role");
  const [newItemInput, setNewItemInput] = useState("");

  // Check if form has changes
  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialState);

  const handleToggle = (key: keyof ServerModerationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNumberChange = (key: keyof ServerModerationSettings, val: number) => {
    setSettings((prev) => ({ ...prev, [key]: Math.max(1, val) }));
  };

  const handleSaveChanges = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 4000);
  };

  const handleResetChanges = () => {
    setSettings(initialState);
  };

  const handleAddExemption = () => {
    if (!newItemInput.trim()) return;
    const formatted = exemptionType === "channel" && !newItemInput.startsWith("#") 
      ? `#${newItemInput.trim()}` 
      : newItemInput.trim();

    if (exemptionType === "role") {
      setSettings((prev) => ({ ...prev, exemptRoles: [...prev.exemptRoles, formatted] }));
    } else if (exemptionType === "user") {
      setSettings((prev) => ({ ...prev, exemptUsers: [...prev.exemptUsers, formatted] }));
    } else {
      setSettings((prev) => ({ ...prev, exemptChannels: [...prev.exemptChannels, formatted] }));
    }

    setNewItemInput("");
    setIsExemptionModalOpen(false);
  };

  const handleRemoveExemption = (type: "role" | "user" | "channel", item: string) => {
    if (type === "role") {
      setSettings((prev) => ({ ...prev, exemptRoles: prev.exemptRoles.filter((r) => r !== item) }));
    } else if (type === "user") {
      setSettings((prev) => ({ ...prev, exemptUsers: prev.exemptUsers.filter((u) => u !== item) }));
    } else {
      setSettings((prev) => ({ ...prev, exemptChannels: prev.exemptChannels.filter((c) => c !== item) }));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* Top Sticky Saved Notification */}
        {showSavedFeedback && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <div className="text-xs font-bold uppercase tracking-wider">
              Moderation Settings Saved Successfully
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Server Moderation
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
              Configure automated shield protection, action escalation thresholds, and bypass lists for{" "}
              <span className="text-foreground font-bold">{serverName}</span> (ID: {serverId}).
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              disabled={!isDirty}
              onClick={handleResetChanges}
              className="cursor-pointer bg-muted hover:bg-muted/80 disabled:opacity-40 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              disabled={!isDirty}
              onClick={handleSaveChanges}
              className="cursor-pointer bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white shadow-lg shadow-violet-600/20 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left / Main Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">

            {/* SECTION 1: SHIELD & DETECTIONS */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <ShieldAlert className="w-5 h-5 text-violet-600" />
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Detection Engines</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Toggle active real-time threat monitoring modules.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Spam Protection */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Spam Protection</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Detects duplicate messages, rapid link blasts, and text pattern repetition.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("spamProtection")}
                    className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      settings.spamProtection
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {settings.spamProtection ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {/* Flood Protection */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Flood Protection</span>
                      <Sliders className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Prevents high-frequency messaging (exceeding 5 messages per 3 seconds).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("floodProtection")}
                    className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      settings.floodProtection
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {settings.floodProtection ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {/* Suspicious Activity */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Suspicious Activity</span>
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Monitors rapid account joins, brand new user flags, and raid vectors.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("suspiciousActivityDetection")}
                    className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      settings.suspiciousActivityDetection
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {settings.suspiciousActivityDetection ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: AUTOMATIC ACTIONS & THRESHOLDS */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <Sliders className="w-5 h-5 text-violet-600" />
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Automated Enforcement & Thresholds</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Configure penalty escalation rules based on offense count.
                  </p>
                </div>
              </div>

              {/* Action Toggles Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Auto Warn</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("autoWarnEnabled")}
                    className={`w-full py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                      settings.autoWarnEnabled
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.autoWarnEnabled ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Auto Purge</span>
                    <Trash2 className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("autoDeleteMessages")}
                    className={`w-full py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                      settings.autoDeleteMessages
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.autoDeleteMessages ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Auto Mute</span>
                    <VolumeX className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("autoTimeoutEnabled")}
                    className={`w-full py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                      settings.autoTimeoutEnabled
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.autoTimeoutEnabled ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Auto Kick</span>
                    <UserX className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("autoKickEnabled")}
                    className={`w-full py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                      settings.autoKickEnabled
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.autoKickEnabled ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-2 col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Auto Ban</span>
                    <Ban className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("autoBanEnabled")}
                    className={`w-full py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                      settings.autoBanEnabled
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.autoBanEnabled ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {/* Threshold Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Warning Threshold */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Warning Limit Before Timeout</span>
                    <span className="text-foreground font-mono">{settings.warnThreshold} Warnings</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={settings.warnThreshold}
                      onChange={(e) => handleNumberChange("warnThreshold", parseInt(e.target.value))}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Timeout Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Timeout Duration</span>
                    <span className="text-foreground font-mono">{settings.timeoutDurationMinutes} Minutes</span>
                  </label>
                  <select
                    value={settings.timeoutDurationMinutes}
                    onChange={(e) => handleNumberChange("timeoutDurationMinutes", parseInt(e.target.value))}
                    className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2 text-xs font-bold uppercase outline-none focus:ring-2 ring-violet-600/30"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={720}>12 Hours</option>
                    <option value={1440}>24 Hours</option>
                  </select>
                </div>

                {/* Kick Threshold */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Warnings Before Auto-Kick</span>
                    <span className="text-foreground font-mono">{settings.kickThreshold} Warnings</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={settings.kickThreshold}
                    onChange={(e) => handleNumberChange("kickThreshold", parseInt(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                {/* Ban Threshold */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Warnings Before Permanent Ban</span>
                    <span className="text-foreground font-mono">{settings.banThreshold} Warnings</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={settings.banThreshold}
                    onChange={(e) => handleNumberChange("banThreshold", parseInt(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* SECTION 3: EXEMPTIONS (ROLES, USERS, CHANNELS) */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Exemptions & Bypasses</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Entities listed here bypass automated spam and moderation filters.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                
                {/* Exempt Roles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-violet-600" /> Exempt Roles
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setExemptionType("role");
                        setIsExemptionModalOpen(true);
                      }}
                      className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Role
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {settings.exemptRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-muted border border-border"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => handleRemoveExemption("role", role)}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exempt Users */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" /> Exempt Users
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setExemptionType("user");
                        setIsExemptionModalOpen(true);
                      }}
                      className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add User
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {settings.exemptUsers.map((user) => (
                      <span
                        key={user}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-muted border border-border"
                      >
                        {user}
                        <button
                          type="button"
                          onClick={() => handleRemoveExemption("user", user)}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exempt Channels */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-emerald-400" /> Exempt Channels
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setExemptionType("channel");
                        setIsExemptionModalOpen(true);
                      }}
                      className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Channel
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {settings.exemptChannels.map((chan) => (
                      <span
                        key={chan}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-muted border border-border"
                      >
                        {chan}
                        <button
                          type="button"
                          onClick={() => handleRemoveExemption("channel", chan)}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (1 Col): Moderation Logs Channel & Rules Guide & Recent Actions */}
          <div className="space-y-8">

            {/* MOD LOG CHANNEL SELECTOR */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Hash className="w-5 h-5 text-violet-600" />
                <h3 className="font-black uppercase tracking-tight text-base">Audit Log Target</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  Moderation Log Channel
                </label>
                <select
                  value={settings.modLogChannel}
                  onChange={(e) => setSettings({ ...settings, modLogChannel: e.target.value })}
                  className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase focus:ring-2 ring-violet-600/30 outline-none cursor-pointer"
                >
                  <option value="#mod-logs">#mod-logs</option>
                  <option value="#security-audit">#security-audit</option>
                  <option value="#admin-private">#admin-private</option>
                  <option value="#bot-alerts">#bot-alerts</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  All automated timeouts, spam purges, and bans will output detailed embeds to this text channel.
                </p>
              </div>
            </div>

            {/* MODERATION RULES EXPLANATION CARD */}
            <div className="bg-muted/30 rounded-2xl border border-border/80 p-6 space-y-4">
              <div className="flex items-center gap-2 text-foreground font-black uppercase text-xs">
                <Info className="w-4 h-4 text-violet-600" /> How Moderation Rules Work
              </div>

              <ul className="space-y-3 text-xs text-muted-foreground font-medium">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Detection Pipeline:</strong> Inbound messages are scanned within ~12ms before being rendered in channel.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Warn Accumulation:</strong> Warnings expire automatically after 30 days unless threshold is breached.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Raid Mode:</strong> If 10+ suspicious members join in under 15 seconds, the bot automatically engages verification locks.
                  </span>
                </li>
              </ul>
            </div>

            {/* RECENT MODERATION ACTIONS TABLE */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-600" />
                  <h3 className="font-black uppercase tracking-tight text-base">Recent Enforcement</h3>
                </div>
                <a href="/bots/activity" className="text-[10px] font-bold uppercase text-violet-600 hover:underline">
                  View Full Audit
                </a>
              </div>

              <div className="space-y-3">
                {MOCK_RECENT_ACTIONS.map((action) => (
                  <div key={action.id} className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{action.targetUser}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-violet-600/10 text-violet-600 border border-violet-600/20">
                        {action.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{action.ruleTriggered}</p>
                    <p className="text-[9px] font-mono text-muted-foreground/80">{action.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ADD EXEMPTION DIALOG */}
        <Dialog open={isExemptionModalOpen} onOpenChange={setIsExemptionModalOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-black uppercase text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-600" /> Add {exemptionType.toUpperCase()} Exemption
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">
                Type the name or ID of the {exemptionType} you want to add to the bypass list.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  {exemptionType} Identifier
                </label>
                <input
                  type="text"
                  placeholder={
                    exemptionType === "role"
                      ? "e.g. Moderator"
                      : exemptionType === "user"
                      ? "e.g. Username#1234"
                      : "e.g. #general"
                  }
                  value={newItemInput}
                  onChange={(e) => setNewItemInput(e.target.value)}
                  className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-2 ring-violet-600/30 outline-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <button
                type="button"
                onClick={() => setIsExemptionModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExemption}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Add Exemption
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}