"use client";

import React from "react";
import {
  UsersRound,
  Send,
  MessageSquare,
  Globe,
  ShieldCheck,
  Megaphone,
  ExternalLink,
  Sparkles,
  Users,
  Activity,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── CONSTANTS & CONFIGURATION ───────────────────────────────────────────────

export const OFFICIAL_LINKS = {
  TELEGRAM_CHANNEL: "https://t.me/NexisOfficial",
  DISCORD_COMMUNITY: "https://discord.gg/nexis",
  TWITTER_X: "https://x.com/NexisNetwork",
  GITHUB: "https://github.com/nexis-network",
  REDDIT: "https://reddit.com/r/NexisNetwork",
};

interface Announcement {
  id: string;
  title: string;
  category: "Release" | "Event" | "Security" | "Governance";
  date: string;
  summary: string;
  link: string;
}

const COMMUNITY_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_101",
    title: "Nexis Engine v4.2 Upgrade & Moderation API Launch",
    category: "Release",
    date: "SEP 05, 2026",
    summary:
      "Automated spam filters now process over 10,000 requests per second with sub-10ms response times. Learn about the new AutoMod features.",
    link: OFFICIAL_LINKS.TELEGRAM_CHANNEL,
  },
  {
    id: "ann_102",
    title: "Global Community Townhall & AMA Session",
    category: "Event",
    date: "AUG 28, 2026",
    summary:
      "Join us on Discord Voice Stage for our monthly developer roadmap presentation and open Q&A with the core engineering team.",
    link: OFFICIAL_LINKS.DISCORD_COMMUNITY,
  },
  {
    id: "ann_103",
    title: "Security Advisory: Verified Official Bot Signatures",
    category: "Security",
    date: "AUG 14, 2026",
    summary:
      "Always verify bot permissions and cryptographic signatures. Core admins will never send direct messages asking for private keys.",
    link: OFFICIAL_LINKS.TELEGRAM_CHANNEL,
  },
];

const GUIDELINES = [
  {
    title: "Be Respectful & Inclusive",
    description: "Treat all members with courtesy. Zero tolerance for hate speech, harassment, or personal attacks.",
  },
  {
    title: "No Unsolicited DMs or Spam",
    description: "Refrain from sending promotional links, unverified bots, or phishing attempts to community members.",
  },
  {
    title: "Use Correct Channels",
    description: "Keep technical questions in dev channels and general discussions in main lounges to ensure high signal.",
  },
  {
    title: "Verify Official Team Members",
    description: "Staff members wear verified badges. Never trust unofficial third-party support requests.",
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function CommunityPage() {
  return (
       <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* HERO / INTRODUCTION SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted/40 border border-border/80 p-8 md:p-12 shadow-sm">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-600 text-xs font-black uppercase tracking-widest">
              <UsersRound className="w-3.5 h-3.5" /> Nexis Ecosystem Hub
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground">
              Join the Global Nexis Community
            </h1>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
              Connect with tens of thousands of server administrators, bot developers, and community leaders. Get real-time ecosystem announcements, share custom automation workflows, and receive 24/7 technical support.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={OFFICIAL_LINKS.TELEGRAM_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#24A1DE] hover:bg-[#1f8ebd] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#24A1DE]/20"
              >
                <Send className="w-4 h-4" /> Open Telegram Channel <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <a
                href={OFFICIAL_LINKS.DISCORD_COMMUNITY}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#5865F2]/20"
              >
                <MessageSquare className="w-4 h-4" /> Join Discord Server <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>


        {/* FEATURED PLATFORMS CARDS (TELEGRAM & DISCORD) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* TELEGRAM CARD */}
          <Card className="rounded-2xl border-border/80 shadow-sm flex flex-col justify-between overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#24A1DE]/10 text-[#24A1DE]">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Broadcast Hub
                </span>
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight mt-3">
                Official Telegram Channel
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                The primary source for real-time announcements, emergency security advisories, release notes, and patch highlights.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 space-y-3 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant push alerts for major system updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified cryptographic security signatures</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No chat noise — high-signal broadcast feed</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/60 pt-4">
              <a
                href={OFFICIAL_LINKS.TELEGRAM_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#24A1DE] hover:bg-[#1f8ebd] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#24A1DE]/20"
              >
                <span>Subscribe to Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </CardFooter>
          </Card>

          {/* DISCORD CARD */}
          <Card className="rounded-2xl border-border/80 shadow-sm flex flex-col justify-between overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#5865F2]/10 text-[#5865F2]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Interactive Community
                </span>
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight mt-3">
                Discord Developer Guild
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Engage in live technical support, request custom features, participate in governance polls, and collaborate with creators.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 space-y-3 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 dedicated community support forums</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Exclusive developer channels & API early access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Monthly live AMA sessions with core engineering</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/60 pt-4">
              <a
                href={OFFICIAL_LINKS.DISCORD_COMMUNITY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5865F2]/20"
              >
                <span>Join Discord Server</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </CardFooter>
          </Card>

        </div>

        {/* RECENT ANNOUNCEMENTS */}
        <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-violet-600" />
              <h2 className="text-xl font-black uppercase tracking-tight">Recent Community Broadcasts</h2>
            </div>
            <a
              href={OFFICIAL_LINKS.TELEGRAM_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase text-violet-600 hover:underline flex items-center gap-1"
            >
              View Feed <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between space-y-4 hover:border-border transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase">
                    <span className="px-2 py-0.5 rounded bg-violet-600/10 text-violet-600 border border-violet-600/20">
                      {ann.category}
                    </span>
                    <span className="font-mono text-muted-foreground">{ann.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground leading-snug">{ann.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {ann.summary}
                  </p>
                </div>

                <a
                  href={ann.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1 self-start pt-2"
                >
                  Read Full Post <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* COMMUNITY GUIDELINES & SOCIAL LINKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GUIDELINES (2 Cols) */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border/80 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-border/60 pb-4">
              <ShieldCheck className="w-5 h-5 text-violet-600" />
              <h2 className="text-xl font-black uppercase tracking-tight">Community Guidelines</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GUIDELINES.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                  <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" /> {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL LINKS (1 Col) */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <Globe className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-black uppercase tracking-tight">Ecosystem Links</h2>
              </div>

              <div className="space-y-2">
                <a
                  href={OFFICIAL_LINKS.TWITTER_X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-xs font-bold"
                >
                  <span>X (Twitter) Updates</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>

                <a
                  href={OFFICIAL_LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-xs font-bold"
                >
                  <span>GitHub Repositories</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>

                <a
                  href={OFFICIAL_LINKS.REDDIT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-xs font-bold"
                >
                  <span>Official Subreddit</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-600/20 space-y-2 text-xs">
              <span className="font-bold text-violet-600 block uppercase tracking-wider">
                Need Priority Support?
              </span>
              <p className="text-muted-foreground font-medium text-[11px]">
                Enterprise and verified guild partners can open direct tickets through the admin dashboard.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}