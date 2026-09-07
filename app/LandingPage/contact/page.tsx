"use client";

import React, { useState } from "react";
import FAQ from "@/components/LandingPage/F&Q";

import Link from "next/link";

import { Send, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactReason: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      contactReason: value || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (!formData.contactReason) {
      toast.warning("Please select a contact reason");
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to send message. Please try again.');
        return;
      }

      toast.success(data.message || "Your inquiry has been sent to our NEXIS Web3 Community OS team!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactReason: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">

      <div className="flex-1 pb-0 pt-15 sm:pb-10 lg:pt-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Title */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
            >
              Get in <span className="text-violet-600 dark:text-violet-400">Touch</span>
            </motion.h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to revolutionize your Web3 community? Our NEXIS experts are here to assist with Discord bot subscriptions, NXAE verification, and community management.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border border-border bg-card rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-5 md:p-8 pb-0">
                  <CardTitle className="text-2xl font-bold">
                    Connect with our Experts
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Have questions about the NEXIS Web3 Community OS, Discord bot subscriptions, NXAE NFT verification, or Arena predictions? Send us a message below.
                  </p>
                </CardHeader>


                <CardContent className="p-5 md:p-8">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-bold uppercase tracking-widest text-[10px] text-violet-600 dark:text-violet-400">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="h-12 bg-secondary/50 border-border focus:ring-violet-500 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-bold uppercase tracking-widest text-[10px] text-violet-600 dark:text-violet-400">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="h-12 bg-secondary/50 border-border focus:ring-violet-500 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold uppercase tracking-widest text-[10px] text-violet-600 dark:text-violet-400">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="h-12 bg-secondary/50 border-border focus:ring-violet-500 rounded-xl w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactReason" className="font-bold uppercase tracking-widest text-[10px] text-violet-600 dark:text-violet-400">
                          Inquiry Reason
                        </Label>
                        <Select onValueChange={handleSelectChange} value={formData.contactReason}>
                          <SelectTrigger className="h-15 w-full px-5 py-6 bg-secondary/30 border-none rounded-xl focus:ring-1 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer text-muted-foreground/70">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general" className="py-3 cursor-pointer">General NEXIS Platform Inquiry</SelectItem>
                            <SelectItem value="bot" className="py-3 cursor-pointer">Discord Bot Subscription & Support</SelectItem>
                            <SelectItem value="subscription" className="py-3 cursor-pointer">Subscription & Billing</SelectItem>
                            <SelectItem value="wallet" className="py-3 cursor-pointer">Wallet Connection & NXAE Verification</SelectItem>
                            <SelectItem value="arena" className="py-3 cursor-pointer">Arena & Predictions</SelectItem>
                            <SelectItem value="marketplace" className="py-3 cursor-pointer">NFT Marketplace</SelectItem>
                            <SelectItem value="community" className="py-3 cursor-pointer">Community & Referrals</SelectItem>
                            <SelectItem value="other" className="py-3 cursor-pointer">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-bold uppercase tracking-widest text-[10px] text-violet-600 dark:text-violet-400">
                        Your Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you with your Web3 community, Discord bot, or NEXIS platform..."
                        className="w-full rounded-xl border border-border bg-secondary/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto px-10 py-6 bg-violet-600 cursor-pointer text-white hover:bg-violet-700 hover:scale-105 transition-transform rounded-xl font-bold uppercase tracking-tighter  flex items-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Send Inquiry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>




            {/* Sidebar Info */}
            <aside className="space-y-6">
              <div className="bg-violet-600 p-6 sm:p-7 rounded-[1.5rem] text-white shadow-md space-y-8">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
                    NEXIS Support
                  </h3>
                  <p className="opacity-90 text-sm leading-relaxed">
                    Our Web3 Community OS experts are available to help with Discord bot subscriptions, NXAE verification, Arena predictions, and all NEXIS platform features.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Discord Link */}
                  <a
                    href="https://discord.gg/nexis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group transition-opacity hover:opacity-90"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Community</p>
                      <p className="font-bold border-b border-transparent group-hover:border-white/50 transition-colors inline-block">
                        Join NEXIS Discord
                      </p>
                    </div>
                  </a>

                  {/* Telegram Link */}
                  <a
                    href="https://t.me/nexisofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group transition-opacity hover:opacity-90"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Telegram</p>
                      <p className="font-bold border-b border-transparent group-hover:border-white/50 transition-colors inline-block text-sm sm:text-base break-all">
                        @NexisOfficial
                      </p>
                    </div>
                  </a>
                </div>
              </div>





              <div className="bg-card border border-border p-6 sm:p-7 rounded-[1.5rem]">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  Platform Overview
                </h4>
                <p className="text-sm text-muted-foreground mb-4">Discover the complete NEXIS Web3 Community OS — Discord integration, bot subscriptions, NXAE verification, Arena predictions, and more.</p>
                <Link href="/LandingPage/learn-more">
                  <Button variant="link" className="p-0 text-violet-600 dark:text-violet-400 font-bold uppercase tracking-tighter ">
                    <Send className="h-5 w-5" /> Explore NEXIS Features
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <FAQ />
    </main>
  );
}