"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Activity,
  Save,
  RotateCcw,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ServerSettingsState {
  // Channels
  logChannel: string;
  auditChannel: string;

  // Bot modules
  autoMod: boolean;
  welcomeMessages: boolean;
  analyticsTracking: boolean;
  customCommands: boolean;
  reactionRoles: boolean;

  // Protection
  spamProtection: boolean;
  floodProtection: boolean;
  suspiciousActivityDetection: boolean;
  autoQuarantineRaids: boolean;
  requireVerification: boolean;

  // Enforcement
  autoWarnEnabled: boolean;
  autoDeleteMessages: boolean;
  autoTimeoutEnabled: boolean;
  autoKickEnabled: boolean;
  autoBanEnabled: boolean;
  warnThreshold: number;
  timeoutDurationMinutes: number;
  kickThreshold: number;
  banThreshold: number;

  // Notifications
  emailAlerts: boolean;
  discordDmAlerts: boolean;
  webhookAlerts: boolean;
  weeklyDigest: boolean;

  // Exemptions
  exemptRoles: string[];
  exemptUsers: string[];
  exemptChannels: string[];
}

type BooleanKey = {
  [K in keyof ServerSettingsState]: ServerSettingsState[K] extends boolean ? K : never;
}[keyof ServerSettingsState];

type NumberKey = {
  [K in keyof ServerSettingsState]: ServerSettingsState[K] extends number ? K : never;
}[keyof ServerSettingsState];

type ExemptionType = "role" | "user" | "channel";

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

const INITIAL_SETTINGS: ServerSettingsState = {
  logChannel: "#mod-logs",
  auditChannel: "#security-audit",

  autoMod: true,
  welcomeMessages: true,
  analyticsTracking: true,
  customCommands: true,
  reactionRoles: false,

  spamProtection: true,
  floodProtection: true,
  suspiciousActivityDetection: true,
  autoQuarantineRaids: true,
  requireVerification: false,

  autoWarnEnabled: true,
  autoDeleteMessages: true,
  autoTimeoutEnabled: true,
  autoKickEnabled: false,
  autoBanEnabled: true,
  warnThreshold: 3,
  timeoutDurationMinutes: 60,
  kickThreshold: 5,
  banThreshold: 7,

  emailAlerts: true,
  discordDmAlerts: true,
  webhookAlerts: false,
  weeklyDigest: true,

  exemptRoles: ["Administrator", "Moderator", "VIP Member"],
  exemptUsers: ["ServerOwner#0001", "LeadDev#1337"],
  exemptChannels: ["#bot-testing", "#staff-chat"],
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

const CHANNEL_OPTIONS = [
  "#mod-logs",
  "#bot-actions",
  "#mod-private",
  "#security-audit",
  "#admin-alerts",
  "#raid-watch",
];

const TIMEOUT_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 720, label: "12 hours" },
  { value: 1440, label: "24 hours" },
];

// ─── SMALL UI PIECES ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
        checked ? "bg-indigo-600" : "bg-muted-foreground/25"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Card({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-card rounded-2xl border border-border/80 shadow-sm p-6 ${className}`}
    >
      <div className="pb-4 border-b border-border/60">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="[&>*:last-child]:border-b-0 [&>*:last-child]:pb-0">{children}</div>
    </section>
  );
}

function Row({
  label,
  description,
  children,
  indent = false,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3.5 border-b border-border/60 ${
        indent ? "pl-5" : ""
      }`}
    >
      <div className="min-w-0">
        <div className={`text-sm ${indent ? "text-muted-foreground" : "text-foreground/90"}`}>
          {label}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  children,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted/40 border border-border rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 ring-indigo-500/30 cursor-pointer max-w-[190px]"
    >
      {children}
    </select>
  );
}

function ExemptList({
  title,
  items,
  addLabel,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (item: string) => void;
}) {
  return (
    <div className="py-3.5 border-b border-border/60 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/90">{title}</span>
        <button
          type="button"
          onClick={onAdd}
          className="cursor-pointer text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && <span className="text-xs text-muted-foreground">None added</span>}
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-muted border border-border"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              aria-label={`Remove ${item}`}
              className="cursor-pointer hover:text-rose-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function ServerSettingsPage({ params }: { params?: { id?: string } }) {
  const serverId = params?.id || MOCK_SERVER_INFO.id;

  const [settings, setSettings] = useState<ServerSettingsState>(INITIAL_SETTINGS);
  const [savedState, setSavedState] = useState<ServerSettingsState>(INITIAL_SETTINGS);

  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [isExemptionModalOpen, setIsExemptionModalOpen] = useState(false);
  const [exemptionType, setExemptionType] = useState<ExemptionType>("role");
  const [newExemptionInput, setNewExemptionInput] = useState("");

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedState);

  const toggle = (key: BooleanKey) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const setNumber = (key: NumberKey, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: Math.max(1, parseInt(value, 10) || 1) }));

  const setChannel = (key: "logChannel" | "auditChannel", value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSavedState(settings);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3500);
  };

  const handleReset = () => setSettings(savedState);

  const listKey = (type: ExemptionType) =>
    type === "role" ? "exemptRoles" : type === "user" ? "exemptUsers" : "exemptChannels";

  const openExemptionModal = (type: ExemptionType) => {
    setExemptionType(type);
    setNewExemptionInput("");
    setIsExemptionModalOpen(true);
  };

  const handleAddExemption = () => {
    const raw = newExemptionInput.trim();
    if (!raw) return;
    const value = exemptionType === "channel" && !raw.startsWith("#") ? `#${raw}` : raw;
    const key = listKey(exemptionType);
    setSettings((prev) =>
      prev[key].includes(value) ? prev : { ...prev, [key]: [...prev[key], value] }
    );
    setNewExemptionInput("");
    setIsExemptionModalOpen(false);
  };

  const handleRemoveExemption = (type: ExemptionType, item: string) => {
    const key = listKey(type);
    setSettings((prev) => ({ ...prev, [key]: prev[key].filter((i) => i !== item) }));
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
        {/* Saved toast */}
        {showSavedFeedback && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold">Settings saved</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Server Settings
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-0.5 max-w-2xl">
                Manage logging, bot modules, moderation and safety exemptions for this server.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              disabled={!isDirty}
              onClick={handleReset}
              className="cursor-pointer bg-muted hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              disabled={!isDirty}
              onClick={handleSave}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/20 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
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

        {/* MAIN 2-COLUMN GRID (stacks on mobile, left/right on large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ───────── LEFT COLUMN ───────── */}
          <div className="space-y-8">
            <Card title="Channels" description="Where the bot posts moderation and security events.">
              <Row label="Moderation log" description="Warnings, timeouts, kicks, bans, deletions">
                <SelectBox value={settings.logChannel} onChange={(v) => setChannel("logChannel", v)}>
                  {CHANNEL_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </SelectBox>
              </Row>
              <Row label="Security audit" description="Raid warnings, API failures, mass-join flags">
                <SelectBox value={settings.auditChannel} onChange={(v) => setChannel("auditChannel", v)}>
                  {CHANNEL_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </SelectBox>
              </Row>
            </Card>

            <Card title="Bot Modules" description="Turn bot systems on or off for this server.">
              <Row label="AutoMod" description="Filters phishing links and profanity">
                <Toggle checked={settings.autoMod} onChange={() => toggle("autoMod")} label="AutoMod" />
              </Row>
              <Row label="Welcome messages" description="Greets new members when they join">
                <Toggle checked={settings.welcomeMessages} onChange={() => toggle("welcomeMessages")} label="Welcome messages" />
              </Row>
              <Row label="Analytics tracking" description="Logs activity and message metrics">
                <Toggle checked={settings.analyticsTracking} onChange={() => toggle("analyticsTracking")} label="Analytics tracking" />
              </Row>
              <Row label="Custom commands" description="Enables prefix and slash triggers">
                <Toggle checked={settings.customCommands} onChange={() => toggle("customCommands")} label="Custom commands" />
              </Row>
              <Row label="Reaction roles">
                <Toggle checked={settings.reactionRoles} onChange={() => toggle("reactionRoles")} label="Reaction roles" />
              </Row>
            </Card>

            <Card title="Protection" description="Real-time threat monitoring.">
              <Row label="Spam protection" description="Duplicate messages and rapid link blasts">
                <Toggle checked={settings.spamProtection} onChange={() => toggle("spamProtection")} label="Spam protection" />
              </Row>
              <Row label="Flood protection" description="More than 5 messages in 3 seconds">
                <Toggle checked={settings.floodProtection} onChange={() => toggle("floodProtection")} label="Flood protection" />
              </Row>
              <Row label="Suspicious activity detection" description="Rapid joins and brand-new account flags">
                <Toggle
                  checked={settings.suspiciousActivityDetection}
                  onChange={() => toggle("suspiciousActivityDetection")}
                  label="Suspicious activity detection"
                />
              </Row>
              <Row label="Auto-quarantine raids">
                <Toggle checked={settings.autoQuarantineRaids} onChange={() => toggle("autoQuarantineRaids")} label="Auto-quarantine raids" />
              </Row>
              <Row label="Require captcha verification">
                <Toggle checked={settings.requireVerification} onChange={() => toggle("requireVerification")} label="Require captcha verification" />
              </Row>
            </Card>
          </div>

          {/* ───────── RIGHT COLUMN ───────── */}
          <div className="space-y-8">
            <Card title="Automated Enforcement" description="What the bot does automatically when rules are broken.">
              <Row label="Auto warn">
                <Toggle checked={settings.autoWarnEnabled} onChange={() => toggle("autoWarnEnabled")} label="Auto warn" />
              </Row>
              <Row label="Auto delete flagged messages">
                <Toggle checked={settings.autoDeleteMessages} onChange={() => toggle("autoDeleteMessages")} label="Auto delete flagged messages" />
              </Row>

              <Row label="Auto mute (timeout)">
                <Toggle checked={settings.autoTimeoutEnabled} onChange={() => toggle("autoTimeoutEnabled")} label="Auto mute" />
              </Row>
              {settings.autoTimeoutEnabled && (
                <>
                  <Row label="Warnings before timeout" indent>
                    <SelectBox value={settings.warnThreshold} onChange={(v) => setNumber("warnThreshold", v)}>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </SelectBox>
                  </Row>
                  <Row label="Timeout duration" indent>
                    <SelectBox
                      value={settings.timeoutDurationMinutes}
                      onChange={(v) => setNumber("timeoutDurationMinutes", v)}
                    >
                      {TIMEOUT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </SelectBox>
                  </Row>
                </>
              )}

              <Row label="Auto kick">
                <Toggle checked={settings.autoKickEnabled} onChange={() => toggle("autoKickEnabled")} label="Auto kick" />
              </Row>
              {settings.autoKickEnabled && (
                <Row label="Warnings before kick" indent>
                  <SelectBox value={settings.kickThreshold} onChange={(v) => setNumber("kickThreshold", v)}>
                    {Array.from({ length: 14 }, (_, i) => i + 2).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </SelectBox>
                </Row>
              )}

              <Row label="Auto ban">
                <Toggle checked={settings.autoBanEnabled} onChange={() => toggle("autoBanEnabled")} label="Auto ban" />
              </Row>
              {settings.autoBanEnabled && (
                <Row label="Warnings before permanent ban" indent>
                  <SelectBox value={settings.banThreshold} onChange={(v) => setNumber("banThreshold", v)}>
                    {Array.from({ length: 18 }, (_, i) => i + 3).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </SelectBox>
                </Row>
              )}
            </Card>

            <Card title="Exemptions" description="Excluded from automated moderation and rate limits.">
              <ExemptList
                title="Roles"
                items={settings.exemptRoles}
                addLabel="Add role"
                onAdd={() => openExemptionModal("role")}
                onRemove={(i) => handleRemoveExemption("role", i)}
              />
              <ExemptList
                title="Users"
                items={settings.exemptUsers}
                addLabel="Add user"
                onAdd={() => openExemptionModal("user")}
                onRemove={(i) => handleRemoveExemption("user", i)}
              />
              <ExemptList
                title="Channels"
                items={settings.exemptChannels}
                addLabel="Add channel"
                onAdd={() => openExemptionModal("channel")}
                onRemove={(i) => handleRemoveExemption("channel", i)}
              />
            </Card>

            <Card title="Notifications" description="How you get alerted about important events.">
              <Row label="Owner email alerts">
                <Toggle checked={settings.emailAlerts} onChange={() => toggle("emailAlerts")} label="Owner email alerts" />
              </Row>
              <Row label="Owner Discord DM alerts">
                <Toggle checked={settings.discordDmAlerts} onChange={() => toggle("discordDmAlerts")} label="Owner Discord DM alerts" />
              </Row>
              <Row label="Webhook alerts">
                <Toggle checked={settings.webhookAlerts} onChange={() => toggle("webhookAlerts")} label="Webhook alerts" />
              </Row>
              <Row label="Weekly summary digest">
                <Toggle checked={settings.weeklyDigest} onChange={() => toggle("weeklyDigest")} label="Weekly summary digest" />
              </Row>
            </Card>
          </div>
        </div>

        {/* DANGER ZONE (full width) */}
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-500 font-black uppercase text-sm">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Removing the bot stops all security scanning and AutoMod rules, and clears the guild cache.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowRemoveModal(true)}
            className="cursor-pointer shrink-0 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Trash2 className="w-4 h-4" /> Remove Bot From Server
          </button>
        </div>

        {/* ADD EXEMPTION MODAL */}
        <Dialog open={isExemptionModalOpen} onOpenChange={setIsExemptionModalOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold capitalize">
                Add exempt {exemptionType}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enter the name or ID to exclude from automated moderation.
              </DialogDescription>
            </DialogHeader>

            <input
              type="text"
              autoFocus
              placeholder={
                exemptionType === "role"
                  ? "e.g. VIP Member"
                  : exemptionType === "user"
                  ? "e.g. Username#0000"
                  : "e.g. #lounge"
              }
              value={newExemptionInput}
              onChange={(e) => setNewExemptionInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddExemption()}
              className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-indigo-500/30"
            />

            <DialogFooter className="gap-2">
              <button
                type="button"
                onClick={() => setIsExemptionModalOpen(false)}
                className="cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 border border-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExemption}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* REMOVE BOT MODAL */}
        <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Remove bot?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-2">
                This removes the bot from{" "}
                <span className="font-semibold text-foreground">{MOCK_SERVER_INFO.name}</span> and
                disconnects real-time security monitoring immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-rose-400 text-xs">
              Warning counts and custom moderation rules linked to server {serverId} will be
              unlinked.
            </div>

            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRemoveModal(false)}
                className="cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 border border-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRemoving}
                onClick={handleRemoveBot}
                className="cursor-pointer bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                {isRemoving ? "Removing..." : "Yes, remove bot"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}