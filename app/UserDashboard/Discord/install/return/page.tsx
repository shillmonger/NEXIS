"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Home,
  RefreshCw,
} from "lucide-react";

type SentinelStatus = "added" | "no_subscription" | "cancelled" | "error" | null;

export default function SentinelReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<SentinelStatus>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse query parameters from Sentinel
    const statusParam = searchParams.get("status");
    const guildId = searchParams.get("guild_id");
    const ref = searchParams.get("ref");

    console.log("Sentinel return parameters:", { status: statusParam, guildId, ref });

    // Validate status parameter
    if (statusParam && ["added", "no_subscription", "cancelled", "error"].includes(statusParam)) {
      setStatus(statusParam as SentinelStatus);
    } else {
      setStatus("error");
    }

    setLoading(false);

    // Note: We do NOT automatically mark entitlements as active based on status=added
    // The entitlement was already active before the user clicked "Add to Discord"
    // This page only displays the result of the Sentinel authorization flow
  }, [searchParams]);

  const handleGoBack = () => {
    router.push("/UserDashboard/Discord/install");
  };

  const handleGoHome = () => {
    router.push("/UserDashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-violet-600" />
          <p className="text-sm text-muted-foreground">Processing return from Sentinel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Status Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {status === "added" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">Bot Added Successfully</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your bot has been authorized and added to your Discord server.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>The bot will join your Discord server</li>
                  <li>Your paid features will be activated automatically</li>
                  <li>You can manage your bot settings from the Discord server</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Home className="w-4 h-4" />
                  Back to Install Page
                </button>
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center justify-center gap-2 bg-muted border border-border hover:bg-muted/80 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}

          {status === "no_subscription" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">No Active Subscription</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sentinel could not find an active subscription for your account.
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">
                  Please ensure your payment has been approved and your subscription is active. If you believe this is an error, please contact support.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center justify-center gap-2 bg-muted border border-border hover:bg-muted/80 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}

          {status === "cancelled" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">Installation Cancelled</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    You cancelled the bot installation process.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center justify-center gap-2 bg-muted border border-border hover:bg-muted/80 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">Installation Failed</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    An error occurred during the bot installation process.
                  </p>
                </div>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">
                  Please try again. If the problem persists, please contact support with details about what happened.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center justify-center gap-2 bg-muted border border-border hover:bg-muted/80 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Security Note:</strong> This page only displays the result of the Sentinel authorization flow. Your entitlement status is managed server-side and is not affected by browser return parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
