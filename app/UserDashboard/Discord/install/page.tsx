"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Hash,
  HelpCircle,
  Info,
  Loader2,
  RefreshCw,
  Server,
  Settings2,
} from "lucide-react";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// ─── TYPES ───────────────────────────────────────────────────────────────

type EntitlementStatus = "active" | "expired" | "revoked";

interface Entitlement {
  id: string;
  subscriptionId: string;
  botProductId: string;
  botName: string;
  planName: string;
  planType: string;
  status: EntitlementStatus;
  startedAt: string;
  expiresAt: string;
  createdAt: string;
  serverName: string | null;
  serverId: string | null;
  serverStatus: 'not_connected' | 'connected' | 'removed';
  subscriptionDetails?: {
    billingPeriod: string;
    amount: number;
  };
}

// ─── STYLE HELPERS ───────────────────────────────────────────────────────────

const card = "bg-card border border-border rounded-2xl p-6 shadow-sm";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer";
const secondaryBtn =
  "inline-flex items-center justify-center gap-2 bg-muted border border-border hover:bg-muted/80 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-muted px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer";

// ─── DISCORD ICON (lucide has no brand icon) ─────────────────────────────────

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3a14.7 14.7 0 0 0-.68 1.397 18.4 18.4 0 0 0-5.487 0A14.6 14.6 0 0 0 9.03 3a19.74 19.74 0 0 0-4.433 1.37C1.79 8.56 1.03 12.64 1.41 16.66a19.9 19.9 0 0 0 5.993 3.03 14.6 14.6 0 0 0 1.284-2.086 12.9 12.9 0 0 1-2.02-.97c.17-.124.335-.253.495-.386a14.2 14.2 0 0 0 12.076 0c.161.133.326.262.495.386-.645.385-1.322.71-2.023.97a14.5 14.5 0 0 0 1.284 2.085 19.86 19.86 0 0 0 5.996-3.03c.446-4.66-.762-8.7-3.273-12.29ZM8.68 14.18c-1.18 0-2.15-1.085-2.15-2.42 0-1.334.95-2.42 2.15-2.42 1.2 0 2.17 1.086 2.15 2.42 0 1.335-.95 2.42-2.15 2.42Zm6.64 0c-1.18 0-2.15-1.085-2.15-2.42 0-1.334.95-2.42 2.15-2.42 1.2 0 2.17 1.086 2.15 2.42 0 1.335-.95 2.42-2.15 2.42Z" />
    </svg>
  );
}

// ─── SUBSCRIPTION CARD ───────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-bold text-right min-w-0 truncate">{children}</span>
    </div>
  );
}

function SubscriptionCard({
  entitlement,
  featured,
  busy,
  verifying,
  onAdd,
  onManage,
}: {
  entitlement: Entitlement;
  featured: boolean;
  busy: boolean;
  verifying: boolean;
  onAdd: (id: string) => void;
  onManage: (id: string) => void;
}) {
  const expired = entitlement.status === "expired" || entitlement.status === "revoked";
  const connected = !expired && entitlement.serverStatus === 'connected';
  const verifyingConnection = verifying && !connected;

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-card p-6 transition-all ${
        featured
          ? "border-2 border-violet-600 shadow-md ring-4 ring-violet-600/10"
          : "border-border shadow-sm"
      }`}
    >
      {/* Header: avatar, name, plan, badge */}
      <div className={`flex items-start gap-4 pb-5 border-b border-border/60 ${expired ? "opacity-60" : ""}`}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="/discord-broken.png"
            alt="Discord Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-black tracking-tight truncate">{entitlement.botName}</h3>
            {expired ? (
              <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                Expired
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Plan: <span className="font-bold text-violet-600">{entitlement.planName}</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className={`mt-5 space-y-4 ${expired ? "opacity-60" : ""}`}>
        <InfoRow icon={<FileText className="w-4 h-4" />} label="Subscription ID">
          {entitlement.subscriptionId?.replace(/[{}]/g, '')}
        </InfoRow>

        <InfoRow icon={<CheckCircle2 className="w-4 h-4" />} label="Server status">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                expired ? "bg-rose-500" : connected ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {expired ? "Expired" : connected ? "Connected" : "Not connected"}
          </span>
        </InfoRow>

        {connected && entitlement.serverName && (
          <InfoRow icon={<Server className="w-4 h-4" />} label="Discord server">
            {entitlement.serverName}
          </InfoRow>
        )}

        <InfoRow icon={<CalendarDays className="w-4 h-4" />} label="Started">
          {new Date(entitlement.startedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </InfoRow>

        <InfoRow icon={<CalendarDays className="w-4 h-4" />} label="Created">
          {new Date(entitlement.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </InfoRow>

        <InfoRow icon={<CalendarDays className="w-4 h-4" />} label="Expiration">
          {new Date(entitlement.expiresAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </InfoRow>
      </div>

      {/* Action — pinned to the bottom so buttons line up across cards */}
      <div className="mt-auto pt-6">
        {expired ? (
          <button type="button" disabled className={`${secondaryBtn} w-full`}>
            <RefreshCw className="w-4 h-4" />
            Renew Subscription
          </button>
        ) : verifyingConnection ? (
          <button type="button" disabled className={`${secondaryBtn} w-full`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying connection…
          </button>
        ) : connected ? (
          <button
            type="button"
            onClick={() => onManage(entitlement.id)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600/5 px-5 py-3 text-xs font-bold uppercase tracking-wider text-emerald-600 transition-all hover:bg-emerald-600/10 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Discord Connected
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAdd(entitlement.id)}
            className={`${primaryBtn} w-full`}
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <DiscordIcon className="w-5 h-5" />}
            Add to Discord
          </button>
        )}
      </div>
    </article>
  );
}

// ─── VISUAL GUIDE SECTION WITH IMAGE URLS ────────────────────────────────────

function VisualGuide() {
  const visualSteps = [
    { label: "1. Discord Authorization", url: "https://i.postimg.cc/XJCCmTST/Screenshot-2026-10-15-173258.png" },
    { label: "2. Permission Review", url: "https://i.postimg.cc/yxhSYcNj/Screenshot-2026-10-15-173331.png" },
    { label: "3. Connected Successfully", url: "https://i.postimg.cc/qvvC4tdH/Screenshot-2026-10-15-173357.png" },
  ];

  return (
    <section className={`${card} space-y-4`}>
      <h2 className="text-sm font-black uppercase tracking-tight">What you&apos;ll see</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visualSteps.map((step) => (
          <figure key={step.label} className="space-y-2">
            <div className="aspect-[16/10] rounded-xl border border-border overflow-hidden bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={step.url} alt={step.label} className="h-full w-full object-cover" />
            </div>
            <figcaption className="text-[11px] font-bold text-center text-muted-foreground">{step.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function InstallBotPage() {
  const searchParams = useSearchParams();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Fetch entitlements on mount
  useEffect(() => {
    fetchEntitlements();
  }, []);

  // Handle Sentinel redirect query parameters
  useEffect(() => {
    const status = searchParams.get('status');
    const guildId = searchParams.get('guild_id');
    const ref = searchParams.get('ref');

    if (status === 'added' && guildId) {
      // Find the entitlement matching the ref (subscription ID)
      const matchingEntitlement = entitlements.find(
        (e) => e.subscriptionId === ref
      );

      if (matchingEntitlement) {
        verifyServerConnection(matchingEntitlement.id, guildId);
      }
    } else if (status === 'no_subscription') {
      toast.error('No active subscription found in Sentinel');
    } else if (status === 'cancelled') {
      toast.info('Installation was cancelled');
    } else if (status === 'error') {
      toast.error('An error occurred during installation');
    }

    // Clean up URL parameters after handling
    if (status) {
      window.history.replaceState({}, '', '/UserDashboard/Discord/install');
    }
  }, [searchParams, entitlements]);

  const fetchEntitlements = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/entitlements');
      const data = await response.json();

      if (response.ok) {
        setEntitlements(data.entitlements);
      } else {
        toast.error(data.error || 'Failed to fetch entitlements');
      }
    } catch (error) {
      console.error('Error fetching entitlements:', error);
      toast.error('Failed to fetch entitlements');
    } finally {
      setLoading(false);
    }
  };

  const verifyServerConnection = async (entitlementId: string, guildId: string) => {
    setVerifyingId(entitlementId);
    try {
      const response = await fetch('/api/user/sentinel/verify-server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entitlementId, guildId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Server connected successfully!');
        await fetchEntitlements(); // Refresh entitlements to get updated server status
      } else {
        toast.error(data.error || 'Failed to verify server connection');
      }
    } catch (error) {
      console.error('Error verifying server connection:', error);
      toast.error('Failed to verify server connection');
    } finally {
      setVerifyingId(null);
    }
  };

  // The first active, not-yet-connected entitlement is the most prominent card.
  const featuredId = entitlements.find((e) => {
    return e.status === "active" && e.serverStatus !== 'connected';
  })?.id;

  const handleAddToDiscord = async (id: string) => {
    const entitlement = entitlements.find((e) => e.id === id);
    // Only active entitlements can ever be installed.
    if (!entitlement || entitlement.status !== "active") return;
    setBusyId(id);

    try {
      // Call the server-side installation route
      const response = await fetch(`/api/user/sentinel/install/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to initiate installation');
        setBusyId(null);
        return;
      }

      // The API route returns the Sentinel redirect URL
      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error('Failed to get installation URL');
        setBusyId(null);
      }
    } catch (error) {
      console.error('Error initiating installation:', error);
      toast.error('Failed to initiate installation');
      setBusyId(null);
    }
  };

  const handleManageServer = (id: string) => {
    const entitlement = entitlements.find((e) => e.id === id);
    if (!entitlement?.serverName) return;
    toast.info(`Opening management for ${entitlement.serverName}...`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Install Your Bot</h1>
            <p className="text-sm text-muted-foreground font-medium max-w-2xl">
              Connect your active subscription to your Discord server.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors shrink-0"
          >
            <HelpCircle className="w-4 h-4" /> Need help?
          </a>
        </header>

        {/* INFO BANNER */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-violet-600">
              Before you begin
            </p>
            <p className="text-xs text-muted-foreground">
              Make sure you have linked your Discord account in Settings and have admin permissions on the server where you want to add the bot.
            </p>
          </div>
        </div>

        {/* ENTITLEMENTS GRID */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : entitlements.length === 0 ? (
          <div className={`${card} text-center py-12`}>
            <Hash className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-sm font-black uppercase tracking-tight mb-2">No Active Subscriptions</h3>
            <p className="text-xs text-muted-foreground mb-4">
              You don&apos;t have any active subscriptions yet. Purchase a plan to get started.
            </p>
            <a
              href="/UserDashboard/Discord/pricing"
              className={`${primaryBtn} inline-flex`}
            >
              View Plans
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entitlements.map((entitlement) => (
              <SubscriptionCard
                key={entitlement.id}
                entitlement={entitlement}
                featured={entitlement.id === featuredId}
                busy={busyId === entitlement.id}
                verifying={verifyingId === entitlement.id}
                onAdd={handleAddToDiscord}
                onManage={handleManageServer}
              />
            ))}
          </div>
        )}

        {/* VISUAL GUIDE */}
        {!loading && entitlements.length > 0 && <VisualGuide />}
      </div>
    </div>
  );
}
