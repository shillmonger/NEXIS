"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Check,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Percent,
  Share2,
  ShieldAlert,
  Search,
  ExternalLink,
  Gift,
  HelpCircle,
  Send,
} from "lucide-react";
import { FaTelegram, FaDiscord, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────────

export type ReferralStatus = "Qualified" | "Pending" | "Ineligible";
export type RewardStatus = "Paid" | "Pending" | "Processing" | "Forfeited";

export interface ReferredUser {
  id: string;
  userName: string;
  emailMasked: string;
  dateJoined: string;
  referralStatus: ReferralStatus;
  rewardStatus: RewardStatus;
  rewardAmount: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_REFERRALS: ReferredUser[] = [
  {
    id: "ref_101",
    userName: "Alex Rivers",
    emailMasked: "al***@devstudio.io",
    dateJoined: "SEP 02, 2026",
    referralStatus: "Qualified",
    rewardStatus: "Paid",
    rewardAmount: "$25.00",
  },
  {
    id: "ref_102",
    userName: "Elena Rostova",
    emailMasked: "el***@techcorp.com",
    dateJoined: "AUG 29, 2026",
    referralStatus: "Qualified",
    rewardStatus: "Paid",
    rewardAmount: "$25.00",
  },
  {
    id: "ref_103",
    userName: "David Chen",
    emailMasked: "da***@startup.co",
    dateJoined: "AUG 24, 2026",
    referralStatus: "Pending",
    rewardStatus: "Pending",
    rewardAmount: "$25.00",
  },
  {
    id: "ref_104",
    userName: "Sarah Jenkins",
    emailMasked: "sa***@freelance.org",
    dateJoined: "AUG 18, 2026",
    referralStatus: "Qualified",
    rewardStatus: "Processing",
    rewardAmount: "$25.00",
  },
  {
    id: "ref_105",
    userName: "Marcus Vance",
    emailMasked: "ma***@agency.net",
    dateJoined: "AUG 10, 2026",
    referralStatus: "Ineligible",
    rewardStatus: "Forfeited",
    rewardAmount: "$0.00",
  },
];

const REFERRAL_RULES = [
  {
    step: "1",
    title: "Share Your Unique Link",
    description: "Send your personal referral link or share it on social media platforms.",
  },
  {
    step: "2",
    title: "Friend Signs Up & Verifies",
    description: "Your referee creates an account and completes primary email/account verification.",
  },
  {
    step: "3",
    title: "Qualifying Action",
    description: "When your friend activates an enterprise plan or executes their first workflow, the referral qualifies.",
  },
  {
    step: "4",
    title: "Claim Cash Credit",
    description: "You both receive $25 in service credits automatically added to your respective balances.",
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState<ReferredUser[]>(MOCK_REFERRALS);

  const personalLink = "https://nexis.network/ref?code=NEXIS-ALEX-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(personalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculated Metrics
  const totalReferrals = referrals.length;
  const qualifiedCount = referrals.filter((r) => r.referralStatus === "Qualified").length;
  const pendingCount = referrals.filter((r) => r.referralStatus === "Pending").length;
  const totalEarned = referrals
    .filter((r) => r.rewardStatus === "Paid")
    .reduce((acc, r) => acc + parseFloat(r.rewardAmount.replace("$", "")), 0);
  
  const conversionRate = totalReferrals > 0 
    ? ((qualifiedCount / totalReferrals) * 100).toFixed(1) 
    : "0.0";

  const filteredReferrals = referrals.filter(
    (item) =>
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.emailMasked.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
       <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
              Referrals & Rewards
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm font-medium">
              Invite colleagues and teammates to Nexis. Earn $25 in platform credits for every qualified signup.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setReferrals([])}
              className="text-xs font-bold uppercase tracking-wider rounded-xl"
            >
              Simulate Empty State
            </Button>
            {referrals.length === 0 && (
              <Button
                onClick={() => setReferrals(MOCK_REFERRALS)}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Restore Data
              </Button>
            )}
          </div>
        </div>

        {/* HERO / PERSONAL LINK & SHARE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PERSONAL LINK BOX (2 COLS) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-card via-card to-muted/30 rounded-3xl border border-border/80 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-violet-600">
                Your Invite URL
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Share Nexis with Your Network
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Anyone who signs up using your personal referral link will instantly receive a $25 credit toward their first workspace invoice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-background border border-border/80 p-2 rounded-2xl shadow-inner">
              <Input
                readOnly
                value={personalLink}
                className="border-none bg-transparent font-mono text-xs font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                onClick={handleCopy}
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all shadow-md shadow-violet-600/20"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Referral Link"}</span>
              </Button>
            </div>

            {/* QUICK SOCIAL SHARE BUTTONS */}
            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-border/40">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mr-1">
                Share via:
              </span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(personalLink)}&text=${encodeURIComponent("Join me on Nexis and get $25 in credits!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 text-foreground transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <FaTwitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                <span className="hidden sm:inline">Twitter / X</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(personalLink)}&text=${encodeURIComponent("Join me on Nexis!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 text-foreground transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5 text-[#24A1DE]" />
                <span className="hidden sm:inline">Telegram</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(personalLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 text-foreground transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <FaLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* REWARD SUMMARY BANNER (1 COL) */}
          <div className="bg-card rounded-3xl border border-border/80 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Available Credits
                </span>
                <div className="p-2 rounded-xl bg-violet-600/10 text-violet-600">
                  <Gift className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-4xl font-black font-mono tracking-tight text-foreground">
                  ${totalEarned.toFixed(2)}
                </div>
                <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready for platform billing or payout
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-foreground block">
                Next Tier Bonus: $100
              </span>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Reach 10 qualified referrals to unlock VIP Partner status and earn $50 per invite.
              </p>
            </div>
          </div>

        </div>

        {/* METRICS / STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-card rounded-2xl border border-border/80 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Total Invites
              </span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-black font-mono">{totalReferrals}</div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Qualified
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-500">
              {qualifiedCount}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Pending Verification
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-500">
              {pendingCount}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Total Rewards
              </span>
              <Award className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-black font-mono text-violet-600">
              ${totalEarned.toFixed(2)}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 space-y-2 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Conversion Rate
              </span>
              <Percent className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black font-mono text-blue-500">
              {conversionRate}%
            </div>
          </div>
        </div>

        {/* REFERRAL HISTORY TABLE */}
        <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">
                Referral History
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Detailed record of users who joined using your link and their current reward progress.
              </CardDescription>
            </div>

            {referrals.length > 0 && (
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search user or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs rounded-xl h-9"
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {filteredReferrals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 font-black uppercase tracking-wider text-muted-foreground text-[10px]">
                      <th className="py-3.5 px-6">User</th>
                      <th className="py-3.5 px-6">Joined Date</th>
                      <th className="py-3.5 px-6">Referral Status</th>
                      <th className="py-3.5 px-6">Reward Status</th>
                      <th className="py-3.5 px-6 text-right">Reward Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {filteredReferrals.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <div className="font-bold text-foreground">{user.userName}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {user.emailMasked}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-muted-foreground">
                          {user.dateJoined}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              user.referralStatus === "Qualified"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : user.referralStatus === "Pending"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}
                          >
                            {user.referralStatus === "Qualified" && (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {user.referralStatus === "Pending" && <Clock className="w-3 h-3" />}
                            {user.referralStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              user.rewardStatus === "Paid"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : user.rewardStatus === "Processing"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : user.rewardStatus === "Pending"
                                ? "bg-muted text-muted-foreground border-border/60"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}
                          >
                            {user.rewardStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-foreground">
                          {user.rewardAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* EMPTY STATE CONTAINER */
              <div className="p-12 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                  <Share2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                    No Referrals Found
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {searchTerm
                      ? "No referrals matched your search term. Try adjusting your query."
                      : "You haven't referred anyone yet. Share your referral link above to start earning platform credits."}
                  </p>
                </div>
                {!searchTerm && (
                  <Button
                    onClick={handleCopy}
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-6"
                  >
                    Copy Invite Link
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PROGRAM RULES & ANTI-ABUSE POLICIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* HOW IT WORKS / RULES (2 COLS) */}
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border/80 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/60 pb-4">
              <HelpCircle className="w-5 h-5 text-violet-600" />
              <h2 className="text-xl font-black uppercase tracking-tight">How Program Rules Work</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {REFERRAL_RULES.map((rule) => (
                <div key={rule.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-600 border border-violet-600/20 font-mono font-black text-xs flex items-center justify-center shrink-0">
                    0{rule.step}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANTI-ABUSE NOTICE (1 COL) */}
          <div className="bg-card rounded-3xl border border-border/80 p-6 md:p-8 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="text-base font-black uppercase tracking-tight text-foreground">
                  Anti-Abuse Policy
                </h2>
              </div>

              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                To maintain program integrity, self-referrals, duplicate accounts, and automated spamming are strictly prohibited.
              </p>

              <ul className="text-xs text-muted-foreground space-y-2 font-medium list-disc list-inside">
                <li>Multiple accounts on the same IP are flagged.</li>
                <li>Self-referring using secondary emails is barred.</li>
                <li>Paid ads on brand keywords are disallowed.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[10px] text-muted-foreground font-medium flex items-center justify-between">
              <span>Violations lead to reward forfeiture.</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}