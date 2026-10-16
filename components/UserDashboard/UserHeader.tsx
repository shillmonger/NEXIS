"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Wallet,
  Check,
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onLeftClick: () => void;
}

interface UserData {
  userName: string;
  email: string;
  avatar?: string;
}

interface Notification {
  id: string;
  type: "security" | "moderation" | "system" | "message";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function UserHeader({
  onLeftClick,
}: HeaderProps) {
  // Theme state
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  
  // Fetch user data from backend
  const [user, setUser] = useState<UserData>({
    userName: "Loading...",
    email: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Notification count
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/info");
        const data = await response.json();

        if (data.success) {
          const userData = data.user;
          setUser({
            userName: userData.userName || "User",
            email: userData.email || "",
            avatar: userData.avatar || "",
          });

          // Fetch notification count
          await fetchNotificationCount(userData._id);
        } else if (response.status === 401 || data.error === "Unauthorized") {
          // Redirect to login if unauthorized
          window.location.href = "/auth-page/login";
        } else {
          console.error("Failed to fetch user data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
        setNotificationLoading(false);
      }
    };

    const fetchNotificationCount = async (userId: string) => {
      try {
        // TODO: Implement notification count when API endpoints are available
        // Currently commented out due to missing API routes
        setNotificationCount(0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
        setNotificationCount(0);
      }
    };

    fetchData();
  }, []);

  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  // Mock notifications data
  const MOCK_NOTIFICATIONS: Notification[] = [
    {
      id: "notif_1",
      type: "security",
      title: "Security Alert",
      message: "New login detected from a new device",
      time: "2 mins ago",
      read: false,
    },
    {
      id: "notif_2",
      type: "moderation",
      title: "Bot Activity",
      message: "AMD Investor Hub: 3 users were banned for spam",
      time: "15 mins ago",
      read: false,
    },
    {
      id: "notif_3",
      type: "system",
      title: "Subscription Renewed",
      message: "Your Pro Sentinel Tier has been renewed",
      time: "1 hour ago",
      read: true,
    },
    {
      id: "notif_4",
      type: "message",
      title: "New Server Invite",
      message: "Crypto Traders Lounge invited your bot",
      time: "3 hours ago",
      read: true,
    },
  ];

  // Load mock notifications
  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS);
    setNotificationCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "security":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "moderation":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "system":
        return <Check className="w-4 h-4 text-emerald-500" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <header className="h-15 lg:h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={onLeftClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="space-y-0.5">
          <p className="text-[8px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
            Member Experience
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2">
        {/* Connect Wallet Button */}
        {/* <Link
          href="/UserDashboard/wallet"
          className="hidden sm:flex items-center gap-1 px-3 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold text-xs tracking-widest transition-colors shadow-lg cursor-pointer"
        >
          <span>Connect Wallet</span>
        </Link> */}

        {/* Mobile Wallet Icon Only */}
        {/* <Link
          href="/UserDashboard/wallet"
          className="sm:hidden p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-full cursor-pointer transition-colors shadow-lg shadow-violet-600/30"
        >
          <Wallet className="w-5 h-5" />
        </Link> */}

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl cursor-pointer bg-secondary transition-colors"
          title="Toggle theme"
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            ))}
        </button>

        {/* Notification Bell with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 bg-secondary rounded-xl relative cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none">
            <Bell className="h-5 w-5" />

            {!notificationLoading && notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black rounded-xl min-w-[16px] h-4 px-1 flex items-center justify-center border-2 border-background leading-none">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-xs font-black uppercase tracking-wider">Notifications</h3>
              {notificationCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-border/60 hover:bg-muted/30 transition-colors cursor-pointer ${
                      !notification.read ? "bg-muted/10" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-foreground">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-violet-600 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <Link
                  href="/UserDashboard/notifications"
                  className="block text-center text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Details - No dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            {!isLoading ? (
              <>
                <p className="text-xs font-black uppercase tracking-widest text-foreground">{user.userName}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{user.email}</p>
              </>
            ) : (
              <>
                <div className="h-3 w-20 bg-muted animate-pulse rounded mb-1" />
                <div className="h-2 w-28 bg-muted animate-pulse rounded" />
              </>
            )}
          </div>
          <Avatar className="h-10 w-10 border-2 border-violet-500 rounded-xl">
            <AvatarImage
              src={user.avatar || defaultProfileImage}
              alt={user.userName}
              className="rounded-xl"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-xl">
              {user.userName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}