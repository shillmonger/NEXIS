"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import ScrollToTop from "@/components/LandingPage/ScrollToTop";

import {
  LineChart,
  ShieldCheck,
  Wallet,
  Activity,
  Cpu,
  Bot,
  Trophy,
  Dices
} from "lucide-react";
import { FaTelegram, FaDiscord, FaTwitter, FaGithub, FaWhatsapp } from "react-icons/fa";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function Footer() {
  const socialLinks = [
    { name: "Discord", icon: <FaDiscord size={20} />, href: "#" },
    { name: "X (Twitter)", icon: <FaTwitter size={20} />, href: "#" },
    { name: "Telegram", icon: <FaTelegram size={20} />, href: "#" },
    { name: "GitHub", icon: <FaGithub size={20} />, href: "#" },
    { name: "Community", icon: <FaWhatsapp size={20} />, href: "#" },
  ];

  return (
    <footer className="bg-background border-t border-border text-foreground pb-10 pt-7 px-4 md:px-10 relative">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        
        {/* Logo + Platform Description */}
        <div className="flex flex-col space-y-6 md:col-span-4 lg:col-span-2">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              {/* Text Logo */}
              <span
                className={`${montserrat.className} 
                text-2xl md:text-3xl font-black italic tracking-tight 
                bg-gradient-to-b from-foreground to-foreground/40 
                bg-clip-text text-transparent uppercase`}
              >
                NEX<span className="text-violet-500">IS</span>
              </span>
            </Link>
            <p className="mt-5 leading-relaxed text-muted-foreground max-w-sm">
              Nexis is a Web3 Community Operating System connecting Discord management, NFT holder verification, predictions, XP leaderboards, and subscription moderation bots[cite: 1].
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-violet-500 font-bold uppercase tracking-wider text-sm mb-4">
              Join Our Community
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-3 bg-secondary/50 rounded-xl hover:bg-violet-600 hover:text-white transition-all duration-300 shadow-sm border border-border text-violet-500"
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Modules Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[18px] font-bold uppercase tracking-tight flex items-center gap-2 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            Platform Modules
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">NXAE Arena</Link></li>
            <li><Link href="/LandingPage/api" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Developers API</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Prediction Markets</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">NFT Marketplace</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Market Intelligence</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[18px] font-bold uppercase tracking-tight bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">Ecosystem Area</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/LandingPage/about" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">About Nexis</Link></li>
            <li><Link href="/LandingPage/privacy" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Privacy Policy</Link></li>
            <li><Link href="/LandingPage/terms" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Terms of Service</Link></li>
            <li><Link href="/LandingPage/docs" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Dev Documentation</Link></li>
            <li><Link href="/LandingPage/subscribtion" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Bot Pricing Plans</Link></li>
          </ul>
        </div>

        {/* Navigation Pages Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[18px] font-bold uppercase tracking-tight bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            Our Pages
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/auth/login" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Account Login</Link></li>
            <li><Link href="/auth/register" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Create Account</Link></li>
            <li><Link href="/LandingPage/learn-more" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Learn More</Link></li>
            <li><Link href="/LandingPage/contact" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">Contact Support</Link></li>
            <li><Link href="/dashboard/tier" className="text-[15px] hover:text-violet-500 transition-colors text-muted-foreground">NXAE Holder Tiers</Link></li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-[1300px] mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-border pt-10">
        <div className="flex items-center gap-4 text-muted-foreground">
          <ShieldCheck className="text-violet-500" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Wallet Verification</h4>
            <p className="text-xs">Signature verification ensures true NXAE ownership.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Bot className="text-violet-600" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Automated Moderation</h4>
            <p className="text-xs">Subscription bots protect servers with customizable rule engines.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Trophy className="text-violet-700" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Gamified Ecosystem</h4>
            <p className="text-xs">Climb leaderboards, achieve streaks, and claim rewards in Arena.</p>
          </div>
        </div>
      </div>

      {/* Financial & Web3 Disclaimer */}
      <div className="max-w-[1500px] mx-auto mt-10 space-y-8 text-[12px] leading-relaxed text-muted-foreground/70 border-t border-border pt-10">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">RISK & DISCLAIMER:</span> Participating in Web3, NFT collection holding, and prediction markets involves inherent risk[cite: 1]. Prediction outcomes are settled based on verifiable third-party sources[cite: 1]. Nexis does not custody user private keys or digital assets[cite: 1]. Nexis operates as a Web3 community infrastructure and Discord automation suite[cite: 1]. Past marketplace performance and prediction streaks do not guarantee future reward allocations[cite: 1].
          </p>
        </div>

        <div className="space-y-2 border-t border-border/20">
          <p className="font-bold text-foreground uppercase tracking-widest text-[10px]">
            Security & Compliance
          </p>
          <p className="text-sm text-muted-foreground">
            Nexis strictly enforces server-side authorization and non-custodial wallet signatures[cite: 1]. Platform data and credentials are kept secure in accordance with production Web3 security standards[cite: 1].
          </p>
        </div>
      </div>

      {/* Final Copyright */}
      <div className="max-w-[1500px] mx-auto border-t border-border mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {new Date().getFullYear()} NEXIS — Web3 Community Operating System[cite: 1].</p>
          <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-x-4 gap-y-2 text-[12px]">
            <Link href="/privacy" className="underline hover:text-violet-500 whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="underline hover:text-violet-500 whitespace-nowrap">
              Terms of Service
            </Link>
            <Link href="/docs" className="underline hover:text-violet-500 whitespace-nowrap">
              Documentation
            </Link>
          </div>
        </div>
        <p className="italic text-xs text-center md:text-right max-w-md opacity-80">
          Nexis is a community OS connecting Discord, NFTs, Arena competitions, and moderation bots[cite: 1].
        </p>
      </div>

      <ScrollToTop />
    </footer>
  );
}