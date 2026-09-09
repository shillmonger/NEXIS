"use client";

import React, { useState, useMemo } from "react";
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  SlidersHorizontal,
  TrendingUp,
  Crown,
  AlertTriangle,
  Gift,
  Bot,
  Users,
  Megaphone,
  Shield,
  Filter,
  X,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────────

export type NotificationCategory =
  | "Predictions"
  | "Holder tier"
  | "Market alerts"
  | "Rewards"
  | "Bot activity"
  | "Referrals"
  | "Campaigns"
  | "System";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

export interface CategoryPreference {
  category: NotificationCategory;
  enabled: boolean;
  description: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_101",
    category: "Predictions",
    title: "AI Model Prediction Triggered",
    description: "Volume surge pattern detected on BTC/USD pair with a 94.2% directional confidence score.",
    timestamp: "SEP 08, 2026 • 14:32 WAT",
    isRead: false,
  },
  {
    id: "notif_102",
    category: "Holder tier",
    title: "Tier Upgrade Unlocked",
    description: "Congratulations! You have been upgraded to Tier 2 (Gold VIP) based on your platform token balance.",
    timestamp: "SEP 08, 2026 • 11:15 WAT",
    isRead: false,
  },
  {
    id: "notif_103",
    category: "Market alerts",
    title: "Volatility Threshold Reached",
    description: "ETH/USD standard deviation moved past 4.5% over the last 1-hour candle window.",
    timestamp: "SEP 07, 2026 • 22:45 WAT",
    isRead: true,
  },
  {
    id: "notif_104",
    category: "Rewards",
    title: "Monthly Yield Disbursed",
    description: "$142.50 in service credits and reward yields have been deposited into your workspace wallet.",
    timestamp: "SEP 06, 2026 • 09:00 WAT",
    isRead: false,
  },
  {
    id: "notif_105",
    category: "Bot activity",
    title: "Auto-Trader Executed Order",
    description: "Bot #04 executed limit order #88219 (BUY 2.5 SOL @ $148.20). Slippage was sub 0.01%.",
    timestamp: "SEP 05, 2026 • 18:20 WAT",
    isRead: true,
  },
  {
    id: "notif_106",
    category: "Referrals",
    title: "New Qualified Referral",
    description: "Elena Rostova signed up using your link and completed identity verification. $25 credit awarded.",
    timestamp: "SEP 04, 2026 • 16:05 WAT",
    isRead: true,
  },
  {
    id: "notif_107",
    category: "Campaigns",
    title: "Fall Automation Hackathon Live",
    description: "Submissions for the Nexis $50k Developer Campaign are now open. Build custom AI strategies.",
    timestamp: "SEP 02, 2026 • 10:00 WAT",
    isRead: true,
  },
  {
    id: "notif_108",
    category: "System",
    title: "Scheduled Maintenance Completed",
    description: "Nexis Engine v4.2 database optimization was completed successfully with 0ms downtime.",
    timestamp: "AUG 30, 2026 • 03:00 WAT",
    isRead: true,
  },
];

const CATEGORY_ICONS: Record<NotificationCategory, React.ElementType> = {
  Predictions: TrendingUp,
  "Holder tier": Crown,
  "Market alerts": AlertTriangle,
  Rewards: Gift,
  "Bot activity": Bot,
  Referrals: Users,
  Campaigns: Megaphone,
  System: Shield,
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | "All">("All");
  const [readFilter, setReadFilter] = useState<"All" | "Unread" | "Read">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference Toggles State
  const [preferences, setPreferences] = useState<CategoryPreference[]>([
    { category: "Predictions", enabled: true, description: "Signals, market trends & ML forecasts" },
    { category: "Holder tier", enabled: true, description: "Tier level updates & privilege status" },
    { category: "Market alerts", enabled: true, description: "Price spikes, volatility & volume alerts" },
    { category: "Rewards", enabled: true, description: "Referral payouts & monthly credit yields" },
    { category: "Bot activity", enabled: true, description: "Automated order executions & execution logs" },
    { category: "Referrals", enabled: true, description: "New invites, signups & qualification updates" },
    { category: "Campaigns", enabled: true, description: "Community events, hackathons & bonuses" },
    { category: "System", enabled: true, description: "Security advisories, maintenance & updates" },
  ]);

  // Handle Preferences Toggle
  const togglePreference = (category: NotificationCategory) => {
    setPreferences((prev) =>
      prev.map((p) => (p.category === category ? { ...p, enabled: !p.enabled } : p))
    );
  };

  // Actions
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
      const matchesRead =
        readFilter === "All" ||
        (readFilter === "Unread" && !n.isRead) ||
        (readFilter === "Read" && n.isRead);
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesRead && matchesSearch;
    });
  }, [notifications, selectedCategory, readFilter, searchTerm]);

  // Counts
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  const categoriesList: (NotificationCategory | "All")[] = [
    "All",
    "Predictions",
    "Holder tier",
    "Market alerts",
    "Rewards",
    "Bot activity",
    "Referrals",
    "Campaigns",
    "System",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
              Notifications
              {/* {unreadCount > 0 && (
                <span className="text-xs bg-violet-600 text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {unreadCount} unread
                </span>
              )} */}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm font-medium">
              Stay updated with system alerts, bot executions, market signals, and tier privileges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-xs font-bold uppercase tracking-wider rounded-xl gap-2 border-border/80"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-600" />
              {showPreferences ? "Hide Preferences" : "Notification Preferences"}
            </Button>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl gap-2 shadow-sm"
              >
                <CheckCheck className="w-4 h-4" /> Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* NOTIFICATION PREFERENCES PANEL (EXPANDABLE) */}
        {showPreferences && (
          <Card className="rounded-3xl border-border/80 bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <CardHeader className="border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black uppercase tracking-tight">
                  Notification Delivery Preferences
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Choose which alert categories trigger browser and push notifications.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreferences(false)}
                className="rounded-xl h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {preferences.map((pref) => {
                  const Icon = CATEGORY_ICONS[pref.category];
                  return (
                    <div
                      key={pref.category}
                      className="p-4 rounded-2xl border border-border/60 bg-muted/10 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-violet-600" />
                            {pref.category}
                          </span>
                          <Switch
                            checked={pref.enabled}
                            onCheckedChange={() => togglePreference(pref.category)}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                          {pref.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Status: {pref.enabled ? "Active" : "Muted"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CONTROLS & FILTER BAR */}
        <div className="space-y-4">
          
          {/* SEARCH & READ/UNREAD FILTER ROW */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs rounded-xl h-9 bg-card border-border/80"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-black uppercase text-muted-foreground shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> State:
              </span>
              <Button
                variant={readFilter === "All" ? "default" : "outline"}
                onClick={() => setReadFilter("All")}
                className={`text-xs font-bold uppercase rounded-xl h-8 px-3.5 ${
                  readFilter === "All" ? "bg-violet-600 text-white" : ""
                }`}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={readFilter === "Unread" ? "default" : "outline"}
                onClick={() => setReadFilter("Unread")}
                className={`text-xs font-bold uppercase rounded-xl h-8 px-3.5 ${
                  readFilter === "Unread" ? "bg-violet-600 text-white" : ""
                }`}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={readFilter === "Read" ? "default" : "outline"}
                onClick={() => setReadFilter("Read")}
                className={`text-xs font-bold uppercase rounded-xl h-8 px-3.5 ${
                  readFilter === "Read" ? "bg-violet-600 text-white" : ""
                }`}
              >
                Read ({readCount})
              </Button>
            </div>
          </div>

          {/* CATEGORY CHIPS BAR */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/40">
            {categoriesList.map((cat) => {
              const Icon = cat !== "All" ? CATEGORY_ICONS[cat] : Bell;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-violet-600/10 border-violet-600 text-violet-600"
                      : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTIFICATION LIST & EMPTY STATES */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = CATEGORY_ICONS[notification.category];
              return (
                <div
                  key={notification.id}
                  className={`group relative p-4 md:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    !notification.isRead
                      ? "bg-gradient-to-r from-violet-600/5 via-card to-card border-violet-600/30 shadow-sm"
                      : "bg-card border-border/60 hover:border-border"
                  }`}
                >
                  {/* LEFT: ICON + DETAILS */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                        !notification.isRead
                          ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-foreground border border-border/60">
                          {notification.category}
                        </span>
                        {!notification.isRead && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-violet-600/10 text-violet-600 border border-violet-600/20">
                            New
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-foreground leading-snug">
                        {notification.title}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {notification.description}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: ACTIONS */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40 w-full md:w-auto justify-end">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 px-3 text-xs font-bold uppercase text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-xl gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Read
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE CONTAINER */
          <Card className="rounded-3xl border-border/80 bg-card shadow-sm p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 opacity-40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                No Notifications Found
              </h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {searchTerm || selectedCategory !== "All" || readFilter !== "All"
                  ? "No activity matches your active filters or search terms. Try clearing your filters."
                  : "You are all caught up! There are no new or unread notifications in your queue."}
              </p>
            </div>
            {(searchTerm || selectedCategory !== "All" || readFilter !== "All") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setReadFilter("All");
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-6"
              >
                Reset All Filters
              </Button>
            )}
          </Card>
        )}

        {/* BOTTOM UTILITY / CLEAR ALL BUTTON */}
        {notifications.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button
              variant="outline"
              onClick={clearAllNotifications}
              className="text-xs font-bold uppercase text-rose-500 hover:bg-rose-500/10 border-rose-500/20 rounded-xl gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Notifications
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}