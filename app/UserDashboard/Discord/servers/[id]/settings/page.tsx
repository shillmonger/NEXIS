"use client";

import React, { useState } from "react";
import {
  Settings2,
  Server,
  Activity,
  Hash,
  Bell,
  Shield,
  User,
  Sliders,
  Globe,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Plus,
  X,
  Info,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────

interface NotificationPreferences {
  emailAlerts: boolean;
  discordDmAlerts: boolean;
  webhookAlerts: boolean;
  weeklyDigest: boolean;
}

interface ModerationPreferences {
  strictnessLevel: "Low" | "Medium" | "High" | "Extreme";
  autoDeleteSpam: boolean;
  autoQuarantineRaids: boolean;
  requireVerification: boolean;
}

interface FeatureToggles {
  autoMod: boolean;
  welcomeMessages: boolean;
  analyticsTracking: boolean;
  customCommands: boolean;
  reactionRoles: boolean;
}

interface ServerSettingsState {
  logChannel: string;
  auditChannel: string;
  notificationPrefs: NotificationPreferences;
  moderationPrefs: ModerationPreferences;
  exemptRoles: string[];
  exemptUsers: string[];
  exemptChannels: string[];
  features: FeatureToggles;
  timezone: string;
  language: string;
}

// ─── INITIAL MOCK CONFIGURATION ─────────────────────────────────────────────

const INITIAL_SETTINGS: ServerSettingsState = {
  logChannel: "#mod-logs",
  auditChannel: "#security-audit",
  notificationPrefs: {
    emailAlerts: true,
    discordDmAlerts: true,
    webhookAlerts: false,
    weeklyDigest: true,
  },
  moderationPrefs: {
    strictnessLevel: "High",
    autoDeleteSpam: true,
    autoQuarantineRaids: true,
    requireVerification: false,
  },
  exemptRoles: ["Administrator", "Server Moderator", "VIP Member"],
  exemptUsers: ["ServerOwner#0001", "LeadDev#1337"],
  exemptChannels: ["#testing-bot", "#staff-chat"],
  features: {
    autoMod: true,
    welcomeMessages: true,
    analyticsTracking: true,
    customCommands: true,
    reactionRoles: false,
  },
  timezone: "America/New_York (UTC-05:00)",
  language: "en-US (English - United States)",
};

const MOCK_SERVER_INFO = {
  id: "982301928374810293",
  name: "AMD Investor Hub",
  icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
  memberCount: "14,250",
  region: "US East",
  joinedDate: "JAN 12, 2026",
  botStatus: "Online",
  botLatency: "24 ms",
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ServerSettingsPage({
  params,
}: {
  params?: { id?: string };
}) {
  const serverId = params?.id || MOCK_SERVER_INFO.id;

  const [settings, setSettings] = useState<ServerSettingsState>(INITIAL_SETTINGS);
  const [initialState] = useState<ServerSettingsState>(INITIAL_SETTINGS);

  // Modal & Feedback States
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Exemption Tag In-Flight Inputs
  const [isExemptionModalOpen, setIsExemptionModalOpen] = useState(false);
  const [exemptionType, setExemptionType] = useState<"role" | "user" | "channel">("role");
  const [newExemptionInput, setNewExemptionInput] = useState("");

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialState);

  const handleToggleFeature = (key: keyof FeatureToggles) => {
    setSettings((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] },
    }));
  };

  const handleToggleNotification = (key: keyof NotificationPreferences) => {
    setSettings((prev) => ({
      ...prev,
      notificationPrefs: {
        ...prev.notificationPrefs,
        [key]: !prev.notificationPrefs[key],
      },
    }));
  };

  const handleToggleModPref = (key: keyof ModerationPreferences) => {
    if (typeof settings.moderationPrefs[key] === "boolean") {
      setSettings((prev) => ({
        ...prev,
        moderationPrefs: {
          ...prev.moderationPrefs,
          [key]: !prev.moderationPrefs[key],
        },
      }));
    }
  };

  const handleSaveChanges = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 4000);
  };

  const handleResetChanges = () => {
    setSettings(initialState);
  };

  const handleAddExemption = () => {
    if (!newExemptionInput.trim()) return;
    const formatted =
      exemptionType === "channel" && !newExemptionInput.startsWith("#")
        ? `#${newExemptionInput.trim()}`
        : newExemptionInput.trim();

    if (exemptionType === "role") {
      setSettings((prev) => ({ ...prev, exemptRoles: [...prev.exemptRoles, formatted] }));
    } else if (exemptionType === "user") {
      setSettings((prev) => ({ ...prev, exemptUsers: [...prev.exemptUsers, formatted] }));
    } else {
      setSettings((prev) => ({ ...prev, exemptChannels: [...prev.exemptChannels, formatted] }));
    }

    setNewExemptionInput("");
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

  const handleRemoveBot = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsRemoving(false);
      setShowRemoveModal(false);
      window.location.href = "/bots/install-discord";
    }, 2000);
  };

  return (
       <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* Top Notification Feedback */}
        {showSavedFeedback && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <div className="text-xs font-bold uppercase tracking-wider">
              Server Settings Updated Successfully
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Server Settings
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-2xl">
              Manage bot operational parameters, channel logging, feature toggles, and safety exemptions for target server.
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

        {/* SECTION 1: SERVER OVERVIEW CARD */}
        <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={MOCK_SERVER_INFO.icon}
                alt={MOCK_SERVER_INFO.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-border shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    {MOCK_SERVER_INFO.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Activity className="w-3 h-3" /> {MOCK_SERVER_INFO.botStatus}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  Server ID: {serverId} • Members: {MOCK_SERVER_INFO.memberCount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                  Region
                </span>
                <span className="text-xs font-bold">{MOCK_SERVER_INFO.region}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                  Bot Latency
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {MOCK_SERVER_INFO.botLatency}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                  Bot Installed
                </span>
                <span className="text-xs font-bold">{MOCK_SERVER_INFO.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT / MAIN COLUMN (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">

            {/* LOG CHANNEL SELECTION */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <Hash className="w-5 h-5 text-violet-600" />
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Channel Logging</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Configure target Discord text channels for moderation events and system audits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                    Primary Moderation Channel
                  </label>
                  <select
                    value={settings.logChannel}
                    onChange={(e) => setSettings({ ...settings, logChannel: e.target.value })}
                    className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 ring-[#ED1C24]/30 outline-none cursor-pointer"
                  >
                    <option value="#mod-logs">#mod-logs</option>
                    <option value="#bot-actions">#bot-actions</option>
                    <option value="#mod-private">#mod-private</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground">
                    Receives warnings, timeouts, kicks, bans, and message deletion logs.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                    Security Audit Channel
                  </label>
                  <select
                    value={settings.auditChannel}
                    onChange={(e) => setSettings({ ...settings, auditChannel: e.target.value })}
                    className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 ring-[#ED1C24]/30 outline-none cursor-pointer"
                  >
                    <option value="#security-audit">#security-audit</option>
                    <option value="#admin-alerts">#admin-alerts</option>
                    <option value="#raid-watch">#raid-watch</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground">
                    Receives high-priority raid warnings, API failures, and mass join flags.
                  </p>
                </div>
              </div>
            </div>

            {/* FEATURE TOGGLES */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <Sliders className="w-5 h-5 text-violet-600" />
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Active Bot Modules</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Enable or disable specific bot systems operating on this guild.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs">Automated AutoMod</h4>
                    <p className="text-[11px] text-muted-foreground">Filters phishing links & profanity.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.features.autoMod}
                    onChange={() => handleToggleFeature("autoMod")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs">Welcome Messages</h4>
                    <p className="text-[11px] text-muted-foreground">Greets new members on join.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.features.welcomeMessages}
                    onChange={() => handleToggleFeature("welcomeMessages")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs">Analytics Tracking</h4>
                    <p className="text-[11px] text-muted-foreground">Logs activity & message metrics.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.features.analyticsTracking}
                    onChange={() => handleToggleFeature("analyticsTracking")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs">Custom Commands</h4>
                    <p className="text-[11px] text-muted-foreground">Enables prefix and slash triggers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.features.customCommands}
                    onChange={() => handleToggleFeature("customCommands")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* EXEMPTIONS (ROLES, USERS, CHANNELS) */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Exempt Lists</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Entities excluded from security scans, automated muting, or rate limits.
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

            {/* DANGER ZONE: REMOVE BOT SECTION */}
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-500 font-black uppercase text-sm">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </div>
              <p className="text-xs text-muted-foreground">
                Disconnecting or removing the bot will revoke all active security scanning, stop AutoMod rules, and purge guild-level cache.
              </p>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowRemoveModal(true)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Remove Bot From Server
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (1 Col): PREFERENCES & LOCALIZATION */}
          <div className="space-y-8">

            {/* MODERATION PREFERENCES */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <ShieldAlert className="w-5 h-5 text-violet-600" />
                <h3 className="font-black uppercase tracking-tight text-base">Safety Level</h3>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  Enforcement Strictness
                </label>
                <select
                  value={settings.moderationPrefs.strictnessLevel}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      moderationPrefs: {
                        ...settings.moderationPrefs,
                        strictnessLevel: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase focus:ring-2 ring-[#ED1C24]/30 outline-none cursor-pointer"
                >
                  <option value="Low">Low - Warnings Only</option>
                  <option value="Medium">Medium - Auto-Delete Spam</option>
                  <option value="High">High - Auto-Mute & Purge</option>
                  <option value="Extreme">Extreme - Auto-Ban Suspicious</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Auto-Quarantine Raids</span>
                  <input
                    type="checkbox"
                    checked={settings.moderationPrefs.autoQuarantineRaids}
                    onChange={() => handleToggleModPref("autoQuarantineRaids")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Require Captcha Verification</span>
                  <input
                    type="checkbox"
                    checked={settings.moderationPrefs.requireVerification}
                    onChange={() => handleToggleModPref("requireVerification")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* NOTIFICATION PREFERENCES */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Bell className="w-5 h-5 text-violet-600" />
                <h3 className="font-black uppercase tracking-tight text-base">Notifications</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Owner Email Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.notificationPrefs.emailAlerts}
                    onChange={() => handleToggleNotification("emailAlerts")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Discord Owner DM Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.notificationPrefs.discordDmAlerts}
                    onChange={() => handleToggleNotification("discordDmAlerts")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Weekly Summary Digest</span>
                  <input
                    type="checkbox"
                    checked={settings.notificationPrefs.weeklyDigest}
                    onChange={() => handleToggleNotification("weeklyDigest")}
                    className="w-4 h-4 rounded border-border text-violet-600 focus:ring-[#ED1C24] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* TIMEZONE & LOCALIZATION */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Globe className="w-5 h-5 text-violet-600" />
                <h3 className="font-black uppercase tracking-tight text-base">Localization</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 ring-[#ED1C24]/30 outline-none cursor-pointer"
                  >
                    <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                    <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                    <option value="Asia/Tokyo (UTC+09:00)">Asia/Tokyo (UTC+09:00)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                    Bot Response Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full bg-muted/30 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 ring-[#ED1C24]/30 outline-none cursor-pointer"
                  >
                    <option value="en-US (English - United States)">en-US (English - United States)</option>
                    <option value="es-ES (Spanish - Espanol)">es-ES (Spanish - Espanol)</option>
                    <option value="de-DE (German - Deutsch)">de-DE (German - Deutsch)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ADD EXEMPTION MODAL */}
        <Dialog open={isExemptionModalOpen} onOpenChange={setIsExemptionModalOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-black uppercase text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-600" /> Add {exemptionType.toUpperCase()} Exemption
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">
                Enter the name or ID of the {exemptionType} you want to add to the exemption list.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  {exemptionType} Identifier
                </label>
                <input
                  type="text"
                  placeholder={
                    exemptionType === "role"
                      ? "e.g. VIP Member"
                      : exemptionType === "user"
                      ? "e.g. Username#0000"
                      : "e.g. #lounge"
                  }
                  value={newExemptionInput}
                  onChange={(e) => setNewExemptionInput(e.target.value)}
                  className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-2 ring-[#ED1C24]/30 outline-none"
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

        {/* REMOVE BOT CONFIRMATION MODAL */}
        <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-black uppercase text-lg text-rose-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Remove Bot Confirmation
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-2">
                Are you sure you want to remove the bot from <span className="font-bold text-foreground">{MOCK_SERVER_INFO.name}</span>? This action will disconnect real-time security monitoring immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-rose-400 font-mono text-[11px] my-2">
              Warning: All active warning counts and custom moderation rules linked to this server ID ({serverId}) will be unlinked.
            </div>

            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRemoveModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRemoving}
                onClick={handleRemoveBot}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
              >
                {isRemoving ? "Removing..." : "Yes, Remove Bot"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}