"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BadgeCheck,
  DatabaseArrowDown,
  Unplug,
  Activity,
  UserRoundCog,
  ChartLine,
  ChartColumn,
  ServerPlus,
  Globe,
  Medal,
  ChartColumnBig,
  Bitcoin,
  WalletCards,
  Wallet,
  Gem,
  Crown,
  LineChart,
  Bell,
  Swords,
  Target,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Users,
  UsersRound,
  ArrowUpRight,
  Settings,
  WalletMinimal,
  ChartNoAxesCombined,
  Cog,
  ChartSpline,
  Lock,
  LogOut,
  ChevronDown,
  X,
  ShieldCheck,
} from "lucide-react";
import { FaTelegram, FaDiscord, FaTwitter, FaGithub, FaWhatsapp } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type NavItem =
  | { name: string; icon: React.ElementType; href: string }
  | {
      name: string;
      icon: React.ElementType;
      children: { name: string; icon: React.ElementType; href: string }[];
    };

export default function UserSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [countdown, setCountdown] = useState(10);
  const [unreadCount, setUnreadCount] = useState(0);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Discord Bot": true,
    // "Web3": true,
    // "Arena": true,
    Community: true,
    Settings: true,
  });

  const basePath = "/UserDashboard";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/info");
        const data = await response.json();
        console.log("User data response:", data);
        if (data.success && data.user.role) {
          const role = Array.isArray(data.user.role) ? data.user.role[0] : data.user.role;
          setUserRole(role);
          console.log("User role set to:", role);
        } else if (response.status === 401 || data.error === "Unauthorized") {
          // Redirect to login if unauthorized
          window.location.href = "/auth-page/login";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // TODO: Implement chat messages when API endpoint is available
        // Currently commented out due to missing /api/chat/messages route
        setUnreadCount(0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
    // Poll every 20 seconds
    const interval = setInterval(fetchUnreadCount, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLogoutConfirm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLogoutConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showLogoutConfirm, countdown]);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },

    // Bot Hub - Phase 1 Core
    {
      name: "Discord Bot",
      icon: FaDiscord,
      children: [
        { name: "Bot Pricing", icon: Wallet, href: `${basePath}/Discord/pricing` },
        { name: "My Subscriptions", icon: Gem, href: `${basePath}/Discord/subscriptions` }, 
        { name: "Install Nexis bot", icon: DatabaseArrowDown, href: `${basePath}/Discord/install` },
        { name: "Discord Servers", icon: ServerPlus, href: `${basePath}/Discord/servers` },
      ],
    },

    // Web3 - Phase 1 Core
    {
      name: "Web3",
      icon: Globe,
      children: [
        { name: "Wallet", icon: WalletMinimal, href: `${basePath}/wallet` },
        { name: "Holdings", icon: Gem, href: `${basePath}/holdings` },
        { name: "Holder Tier", icon: Crown, href: `${basePath}/tier` },
        { name: "Market", icon: ChartColumn, href: `${basePath}/market` },
      ],
    },

    // Arena & Predictions - Phase 2
    {
      name: "Arena",
      icon: Trophy,
      children: [
        { name: "Predictions", icon: ChartLine, href: `${basePath}/predict` },
        { name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
        { name: "Streaks", icon: Flame, href: `${basePath}/streaks` },
        { name: "Achievements", icon: Medal, href: `${basePath}/achievements` },
        { name: "XP & Rewards", icon: Sparkles, href: `${basePath}/xp` },
      ],
    },

    // Community
    {
      name: "Community",
      icon: Users,
      children: [
        { name: "Referrals", icon: ArrowUpRight, href: `${basePath}/referrals` },
        { name: "Nexis Channel", icon: UsersRound, href: `${basePath}/channel` },
      ],
    },

    // Settings
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Notifications", icon: Bell, href: `${basePath}/notifications` },
        { name: "User Settings", icon: UserRoundCog, href: `${basePath}/settings` },
      ],
    },

    // Only for users with role admin
    ...(userRole === "admin"
      ? [
          {
            name: "Switch to Admin",
            icon: Lock,
            href: `/AdminDashboard/overview`,
          },
        ]
      : []),
  ];

  useEffect(() => {
    navItems.forEach((item) => {
      if ("children" in item) {
        const hasActive = item.children.some((child) =>
          isActive(pathname, child.href)
        );
        if (hasActive) {
          setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (pathname: string, href: string): boolean => {
    // For Bot Servers, check if pathname starts with the base path
    if (href === `${basePath}/Discord/servers`) {
      return pathname.startsWith(href);
    }
    // For Bot Pricing, check if pathname starts with the base path
    if (href === `${basePath}/Discord/pricing`) {
      return pathname.startsWith(href);
    }
    // For other routes, use exact match
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-65 border-r border-violet-500/20 h-screen bg-background/95 backdrop-blur-xl flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-15 px-6 border-b border-violet-500/20 ">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
              NEXIS HUB
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground/80 uppercase">
              Web3 Community Operating System
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-violet-500/30 scrollbar-track-transparent">
          {navItems.map((item) => {
            if ("href" in item) {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-600/40 ring-1 ring-violet-400/30"
                      : "text-muted-foreground hover:bg-violet-500/10 hover:text-foreground hover:ring-1 hover:ring-violet-500/20"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-4 transition-transform ${
                      active ? "scale-110 drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="text-[12px] font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                </Link>
              );
            }

            const isOpen = !!openGroups[item.name];
            const hasActiveChild = item.children.some((c) =>
              isActive(pathname, c.href)
            );

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`group w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    hasActiveChild
                      ? "text-violet-400 bg-violet-500/10"
                      : "text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-4 transition-transform ${
                      hasActiveChild ? "scale-110 text-violet-400" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 opacity-70 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`${isOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}
                >
                  <div className="ml-3 mt-1 mb-1 pl-3 border-l border-violet-500/20 space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = isActive(pathname, child.href);
                      const isChatWithAgent = child.name === "Chat with Agent";
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                            childActive
                              ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-600/40"
                              : "text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                          }`}
                        >
                          <child.icon
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              childActive
                                ? "scale-110 drop-shadow-[0_0_4px_rgba(167,139,250,0.7)]"
                                : "group-hover:scale-110"
                            }`}
                          />
                          <span className="text-[11px] font-black uppercase tracking-widest">
                            {child.name}
                          </span>
                          {isChatWithAgent && unreadCount > 0 && (
                            <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-cyan-500 text-black text-[9px] font-black flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-violet-500/20 px-3 py-3 bg-gradient-to-t from-violet-600/5 to-transparent">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all rounded-lg group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              Logout My Account
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-full h-full bg-background/95 backdrop-blur-xl z-[100] flex flex-col shadow-2xl lg:hidden border-r border-violet-500/20">
            {/* Mobile Header */}
            <div className="flex-shrink-0 flex items-center justify-between h-15 px-6 border-b border-violet-500/20 bg-gradient-to-r from-violet-600/5 via-transparent to-cyan-500/5">
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
                  NEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">IS</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground/80 uppercase">
                  Web3 Community Operating System
                </p>
              </div>
              <button
                className="rounded-lg text-foreground p-1.5 hover:bg-violet-500/10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-violet-500/30 scrollbar-track-transparent">
              {navItems.map((item) => {
                if ("href" in item) {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-600/40"
                          : "text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-4 transition-transform ${
                          active ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="text-[12px] font-black uppercase tracking-widest">
                        {item.name}
                      </span>
                    </Link>
                  );
                }

                const isOpen = !!openGroups[item.name];
                const hasActiveChild = item.children.some((c) =>
                  isActive(pathname, c.href)
                );

                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => toggleGroup(item.name)}
                      className={`group w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                        hasActiveChild
                          ? "text-violet-400 bg-violet-500/10"
                          : "text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-4 transition-transform ${
                          hasActiveChild ? "scale-110 text-violet-400" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest">
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 opacity-70 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`${isOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}
                    >
                      <div className="ml-3 mt-1 mb-1 pl-3 border-l border-violet-500/20 space-y-0.5">
                        {item.children.map((child) => {
                          const childActive = isActive(pathname, child.href);
                          const isChatWithAgent = child.name === "Chat with Agent";
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                                childActive
                                  ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-600/40"
                                  : "text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <child.icon
                                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                  childActive ? "scale-110" : "group-hover:scale-110"
                                }`}
                              />
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {child.name}
                              </span>
                              {isChatWithAgent && unreadCount > 0 && (
                                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-cyan-500 text-black text-[9px] font-black flex items-center justify-center">
                                  {unreadCount}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="flex-shrink-0 border-t border-violet-500/20 px-3 py-3">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all rounded-lg group"
              >
                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Logout My Account
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-background/95 border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-900/20 w-full max-w-sm p-8 text-center backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
              Logout?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to sign out? You&apos;ll need to log in again to
              access your account.
            </p>

            {/* Countdown Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Auto-closing in...</span>
                <span className="text-violet-400 font-bold">{countdown}s</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 cursor-pointer text-white font-bold text-xs uppercase tracking-widest hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-600/30"
              >
                Stay
              </button>
              <button
                onClick={async () => {
                  try {
                    // Call the logout API to clear the auth token
                    await fetch("/api/auth/logout", { method: "POST" });
                    toast.success("Successfully signed out");
                    setShowLogoutConfirm(false);
                    setCountdown(10);
                    // Redirect to login page
                    router.push("/auth-page/login");
                  } catch (error) {
                    console.error("Logout error:", error);
                    toast.error("Failed to sign out");
                  }
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-red-500/90 cursor-pointer text-white font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}