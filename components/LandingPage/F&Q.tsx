"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is NEXIS and how does it work?",
    answer: "NEXIS is an advanced Web3 automation platform and Discord management ecosystem. It seamlessly bridges your Discord server with on-chain data, automating community role distribution, engagement reward distribution, predictions, and real-time moderation."
  },
  {
    question: "How do I connect my Discord server to NEXIS?",
    answer: "After creating your NEXIS account, add the official NEXIS bot to your Discord server via the dashboard with administrator permissions. From there, you can configure community tiers, RPC endpoints, and automated reward modules in just a few clicks."
  },
  {
    question: "Can I test NEXIS features on a dev or staging server first?",
    answer: "Yes, absolutely! We encourage community leaders to deploy NEXIS on a private test or staging server first. This allows you to verify role assignments, test Web3 wallet connections, and tune automation settings before launching to your live community."
  },
  {
    question: "How do subscription and tier plans work?",
    answer: "NEXIS offers scalable membership and subscription tiers based on server size, active automation workflows, and token gate requirements. Subscriptions can be managed directly through the NEXIS dashboard with instant access to elevated tier features."
  },
  {
    question: "How and when are community rewards distributed?",
    answer: "Community rewards, prediction payouts, and engagement incentives are tracked in real-time by NEXIS infrastructure. Depending on your server configuration, rewards can be claimed directly by members through automated on-chain or off-chain distribution channels."
  },
  {
    question: "Is my server data and Web3 credentials secure?",
    answer: "Security is our top priority. NEXIS uses enterprise-grade encryption for all API integrations and Discord OAuth processes. We never store private wallet keys, and all on-chain verification happens via secure, read-only RPC nodes and signature verifications."
  },
  {
    question: "How does NEXIS handle high-traffic Discord events and server spikes?",
    answer: "NEXIS runs on a multi-region, distributed gateway infrastructure. Unlike traditional single-node Discord bots, NEXIS automatically scales its gateway listeners during high-volume events like token mints, major announcements, or live predictions to guarantee sub-second role sync."
  },
  {
    question: "Does NEXIS support custom Web3 chains and token standards?",
    answer: "Yes! NEXIS supports EVM-compatible networks, Solana, and major Web3 ecosystems. Our adapter-driven architecture allows server administrators to integrate custom token contracts, NFT collections, and custom Web3 RPC nodes effortlessly."
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const half = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, half);
  const rightColumnFaqs = faqs.slice(half);

  return (
    <section id="faq" className="mx-auto max-w-[1500px] px-4 lg:px-8 py-15 md:pt-5 md:pb-20 w-full text-neutral-900 dark:text-neutral-100 font-sans">
      <div className="text-center mb-10 relative z-10 max-w-xl mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-foreground">
          Asked Questions
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
          Everything you need to know about the NEXIS Web3 automation platform.
          From Discord integration to Web3 token gating, rewards, and multi-region infrastructure.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {leftColumnFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightColumnFaqs.map((faq, index) => {
            const globalIndex = index + half;
            return (
              <FAQItem
                key={globalIndex}
                faq={faq}
                isOpen={openIndex === globalIndex}
                onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, onClick }: { faq: FAQ; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`group relative transition-all duration-300 rounded-xl border cursor-pointer overflow-hidden ${
        isOpen
          ? "bg-white dark:bg-neutral-900 border-violet-500/40 shadow-lg shadow-violet-500/10"
          : "bg-white/70 dark:bg-neutral-900/70 hover:bg-white dark:hover:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-violet-500/30 dark:hover:border-violet-500/30 shadow-sm"
      }`}
    >
      <div className="w-full flex items-center justify-between p-4 px-5 text-left">
        <span
          className={`text-base font-bold tracking-tight transition-colors ${
            isOpen ? "text-violet-600 dark:text-violet-400" : "text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white"
          }`}
        >
          {faq.question}
        </span>
        <div className="flex-shrink-0 ml-4">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              isOpen
                ? "bg-violet-600 text-white rotate-180 shadow-md shadow-violet-600/30"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-violet-500/10 group-hover:text-violet-500"
            }`}
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-0" onClick={(e) => e.stopPropagation()}>
          <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-normal">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}