"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Headphones, Globe, Users, Trophy, ArrowUpRight } from "lucide-react";

function useCounter(end: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, active]);
  return count;
}

const TICKER_ITEMS = [
  "$1.3M+ Rewards Distributed", "3,000+ Active Members", "160+ Countries",
  "1,000+ Community", "24/7 Support", "< 60s Response",
  "Trusted Web3 Ecosystem", "Global Infrastructure",
];

export default function StatsGrid() {
  const [active, setActive] = useState(false);
  const [userAvatars, setUserAvatars] = useState([
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
  ]);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetchRandomUsers();
  }, []);

  const fetchRandomUsers = async () => {
    try {
      const response = await fetch('/api/users/random');
      const data = await response.json();
      if (data.success && data.users) {
        const avatarUrls = data.users.map((user: any) => user.profileImage);
        setUserAvatars(avatarUrls);
      }
    } catch (error) {
      console.error('Failed to fetch random users:', error);
    }
  };

  const rewards = useCounter(1.3, 1600, active);
  const members = useCounter(3000, 2000, active);
  const countries = useCounter(160, 1400, active);
  const community = useCounter(1000, 2200, active);

  return (
    <section
      ref={ref}
      className="mx-auto max-w-[1500px] px-4 lg:px-8 py-16 md:py-0 lg:pb-15 w-full"
    >
      {/* --- Header --- */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-zinc-900 dark:text-foreground">
          Numbers That Speak
        </h2>
        <p className="text-zinc-600 dark:text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Join a global Web3 community relying on NEXIS for real-time Discord orchestration, reliable automation, and transparent rewards.
        </p>
      </div>

      {/* --- Bento Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Total Rewards */}
        <div className="md:col-span-4 rounded-3xl border border-zinc-200 dark:border-violet-500/15 bg-white dark:bg-card/50 p-5 lg:p-6 min-h-[220px] flex flex-col justify-between shadow-sm dark:shadow-none transition-all hover:-translate-y-1 hover:border-violet-500/40">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-zinc-500 dark:text-muted-foreground font-semibold mb-2 font-mono">
              Total Rewards Distributed
            </p>
            <h3 className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-900 dark:text-foreground">
              ${active ? rewards : 0}<span className="text-violet-600 dark:text-violet-500">M+</span>
            </h3>
            <p className="mt-2 text-xs font-semibold text-zinc-600 dark:text-muted-foreground font-mono">
              +12.4% <span className="text-violet-600 dark:text-violet-400">↑</span> this quarter
            </p>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-[10px] tracking-widest uppercase text-zinc-400 dark:text-muted-foreground/50 font-mono font-medium">All time</span>
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/25">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Active Members */}
        <div className="md:col-span-4 rounded-3xl border border-zinc-200 dark:border-violet-500/15 bg-white dark:bg-card/50 p-5 lg:p-6 min-h-[220px] flex flex-col justify-between shadow-sm dark:shadow-none transition-all hover:-translate-y-1 hover:border-violet-500/40">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-zinc-500 dark:text-muted-foreground font-semibold mb-2 font-mono">Active Web3 Members</p>
            <h3 className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-900 dark:text-foreground">
              {active ? members.toLocaleString() : "0"}<span className="text-violet-600 dark:text-violet-500">+</span>
            </h3>
          </div>
          <div className="pt-4">
            <p className="text-[10px] tracking-[.2em] uppercase text-zinc-500 dark:text-muted-foreground font-semibold mb-3 font-mono">Recently joined</p>
            <div className="flex items-center">
              {userAvatars.map((url, i) => (
                <img key={i} src={url} alt="NEXIS member"
                  className="w-11 h-11 rounded-full border-2 border-white dark:border-background -ml-2.5 first:ml-0 transition-all object-cover shadow-sm" />
              ))}
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-bold bg-violet-100 dark:bg-violet-500/15 border-2 border-white dark:border-background text-violet-700 dark:text-violet-400 -ml-2.5 font-mono shadow-sm">
                +1.2k
              </div>
            </div>
          </div>
        </div>

        {/* Countries */}
        <div className="md:col-span-4 rounded-3xl border border-zinc-200 dark:border-violet-500/15 bg-white dark:bg-card/50 p-5 lg:p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden shadow-sm dark:shadow-none transition-all hover:-translate-y-1 hover:border-violet-500/40">
          <div className="relative z-10">
            <p className="text-[10px] tracking-[.2em] uppercase text-zinc-500 dark:text-muted-foreground font-semibold mb-2 font-mono">Countries</p>
            <h3 className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-900 dark:text-foreground">
              {active ? countries : 0}<span className="text-violet-600 dark:text-violet-500">+</span>
            </h3>
            <p className="mt-2 text-xs font-medium text-zinc-600 dark:text-muted-foreground">Global access, zero borders</p>
          </div>
          <Globe className="absolute -right-6 -bottom-6 w-32 h-32 text-violet-500/10 dark:text-violet-500/5 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-2 pt-4">
            <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-500 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-violet-700 dark:text-violet-400">Live in all regions</span>
          </div>
        </div>

        {/* Community */}
        <div className="md:col-span-7 rounded-3xl border border-zinc-200 dark:border-violet-500/15 bg-white dark:bg-card/50 p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm dark:shadow-none transition-all hover:-translate-y-1 hover:border-violet-500/40">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-zinc-500 dark:text-muted-foreground mb-2 font-mono font-semibold">Community Members</p>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-foreground">
              {active ? community.toLocaleString() : "0"}<span className="text-violet-600 dark:text-violet-500">+</span>
            </h3>
          </div>
          <div className="flex sm:flex-col items-start sm:items-end w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-[9px] tracking-widest uppercase text-zinc-500 dark:text-muted-foreground/60 font-mono font-semibold">Discord • Telegram • X</p>
          </div>
        </div>

        {/* Support */}
        <div className="md:col-span-5 rounded-3xl border border-violet-900/30 dark:border-violet-500/20 bg-gradient-to-br from-violet-900 via-slate-900 to-slate-950 p-5 lg:p-6 flex flex-col justify-between shadow-lg shadow-violet-950/20 transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-violet-300">Online now</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white">24/7 Web3 Support</h3>
            </div>
            <Headphones className="w-8 h-8 text-violet-400/40" />
          </div>
        </div>
      </div>

      {/* --- Ticker --- */}
      <div className="mt-8 py-4 border-y border-zinc-200 dark:border-border/40 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-[ticker_30s_linear_infinite]">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-[10px] tracking-[.3em] uppercase text-zinc-600 dark:text-muted-foreground font-mono font-semibold flex items-center gap-4">
              {item} <span className="w-1.5 h-1.5 rounded-full bg-violet-500/40" />
            </span>
          ))}
        </div>
      </div>

      {/* --- CTA --- */}
      <div className="mt-8 text-center">
        <Link href="/auth-page/register">
          <button className="bg-violet-600 hover:bg-violet-700 cursor-pointer text-white px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-xl active:scale-95">
            Get Started Now
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </section>
  );
}