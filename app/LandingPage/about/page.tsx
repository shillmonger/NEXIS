"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Cpu,
  Gift,
  ShieldCheck,
  Headphones,
  BarChart2,
  FileSearch,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    id: "automation",
    title: "Intelligent Bot Automation",
    label: "Technology",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2070&auto=format&fit=crop",
    stat: "24/7",
    statLabel: "Bot uptime",
    description:
      "NEXIS utilizes cutting-edge automation technology powered by advanced Discord API integration to put your community management on autopilot. Our proprietary bot systems process thousands of events per second, executing commands and moderation actions with precision timing that human moderators simply cannot match.",
    details:
      "By deploying bots through our platform, you trigger automated moderation, custom commands, and community management tasks that run consistently, regardless of server activity. Our systems are designed to handle multiple Discord servers simultaneously, processing welcome messages, auto-roles, moderation rules, and custom commands in real-time. The platform continuously adapts to your community's needs, optimizing performance and resource allocation automatically.",
    cta: "Our Technology",
  },
  {
    id: "scaling",
    title: "Scalable Infrastructure",
    label: "Growth",
    icon: Gift,
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2070&auto=format&fit=crop",
    stat: "99.9%",
    statLabel: "Uptime guarantee",
    description:
      "Every NEXIS plan includes scalable infrastructure that grows with your community. Start with our Free tier for testing, then seamlessly upgrade to Starter, Pro, or Enterprise plans as your server count and member base expand.",
    details:
      "What sets our infrastructure apart is its flexibility: upgrade or downgrade plans anytime without service interruption. Our cloud-based hosting ensures your bots remain online even during traffic spikes, with automatic load balancing and redundancy across multiple data centers. Each plan includes dedicated RAM allocation, webhook limits, and server caps designed to match different community sizes and usage patterns.",
    cta: "View Plans",
  },
  {
    id: "security",
    title: "Enterprise-Grade Security",
    label: "Trust",
    icon: ShieldCheck,
    image: "https://i.postimg.cc/y6PG31Lb/Strong-Passwords.jpg",
    stat: "AES-256",
    statLabel: "Encryption standard",
    description:
      "Security is not an afterthought — it's the foundation upon which everything we build. We employ military-grade AES-256 encryption for all data transmission and storage, ensuring your bot tokens, server data, and user information remain protected at all times.",
    details:
      "Our platform utilizes multi-layer security protocols including secure token storage, rate limiting to prevent API abuse, and real-time threat detection. We maintain secure environments for bot deployment with isolated containers preventing cross-contamination. Our servers are hosted in SOC 2 Type II certified data centers with 24/7 physical security, DDoS protection, and automatic failover systems.",
    cta: "Security Features",
  },
  {
    id: "support",
    title: "Round-the-Clock Support",
    label: "Global",
    icon: Headphones,
    image: "https://i.postimg.cc/d3t4jCWP/Delivering-247.jpg",
    stat: "<2 min",
    statLabel: "Avg. response time",
    description:
      "Discord communities never sleep, and neither do we. Our dedicated support team is available 24 hours a day, 7 days a week, 365 days a year. Whether you need help setting up custom commands, troubleshooting bot issues, or scaling your infrastructure, we're ready.",
    details:
      "Our support team consists of experienced Discord developers, DevOps specialists, and community management experts distributed across multiple time zones. We offer multiple channels including live chat, email, and Discord support channels. For Enterprise plan customers, we offer dedicated account managers who provide personalized support, priority response times, and custom integration assistance.",
    cta: "Contact Support",
  },
  {
    id: "features",
    title: "Powerful Feature Set",
    label: "Capabilities",
    icon: BarChart2,
    image: "https://i.postimg.cc/g0FsBQM3/Forex.jpg",
    stat: "200+",
    statLabel: "Active integrations",
    description:
      "Gain full control over your Discord servers with our comprehensive feature set. From automated moderation and custom commands to webhooks and API access, NEXIS provides everything needed to manage communities of any size efficiently.",
    details:
      "Our platform includes auto-moderation with customizable rules, welcome messages and auto-roles, custom command creation with rich embeds, real-time analytics dashboards, and webhook integration for external services. Enterprise customers get access to custom white-label bot instances, full API access for custom integrations, and priority thread handling for high-traffic servers. All features are managed through an intuitive dashboard.",
    cta: "Feature Overview",
  },
  {
    id: "transparency",
    title: "Transparent Pricing",
    label: "Fairness",
    icon: FileSearch,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop",
    stat: "0%",
    statLabel: "Hidden fees",
    description:
      "Transparency is the bedrock of our platform. From plan pricing to resource limits, from uptime statistics to performance metrics — we make it all visible so you can understand exactly what you're getting without hidden costs or surprises.",
    details:
      "Our pricing structure is straightforward with clear plan tiers: Free for testing, Starter for small communities, Pro for active servers, and Enterprise for large networks. Each plan clearly lists server limits, RAM allocation, webhook maximums, and feature access. You can monitor your bot's performance, resource usage, and uptime in real-time through our dashboard. No hidden charges, surprise overages, or confusing fine print — just honest, predictable pricing.",
    cta: "Pricing Details",
  },
];

export default function AboutUs() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("automation");
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
     
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[30vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest mb-6 text-violet-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span>About NEXIS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 text-white leading-none"
          >
            Built to{" "}
            <span className="text-violet-500">Automate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-normal leading-relaxed text-white/70 max-w-2xl mx-auto"
          >
            Advanced Discord bot management, enterprise-grade security, and seamless scalability — in one platform.
          </motion.p>

          {/* Section progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1.5 mt-8"
          >
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                aria-label={s.title}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  s.id === activeSection
                    ? "bg-violet-500 w-8"
                    : i < activeIndex
                    ? "bg-violet-500/40 w-4"
                    : "bg-white/20 w-4"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-medium">Scroll</span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-24 pt-12 flex flex-col lg:flex-row gap-10 w-full">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mb-5 px-1">
              Our Platform
            </p>

            {sections.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono shrink-0 transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-secondary text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-tight">{item.title}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                </button>
              );
            })}

            {/* Reading progress */}
            <div className="mt-6 px-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                  Progress
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {activeIndex + 1}/{sections.length}
                </span>
              </div>
              <div className="h-[3px] bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 rounded-full transition-all duration-500"
                  style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile sticky nav ── */}
        <div className="lg:hidden sticky top-[80px] z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeSection === s.id
                      ? "bg-violet-600 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                id={item.id}
                className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4 }}
              >
                {/* Card header */}
                <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
                  <span className="text-[10px] font-mono font-bold text-violet-600/60 dark:text-violet-400/60 tracking-widest leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10">
                    <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-foreground flex-1">
                    {item.title}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                    <span className="h-1 w-1 rounded-full bg-violet-600/60 dark:bg-violet-400/60" />
                    {item.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 lg:p-6 space-y-5">

                  {/* Image with floating stat */}
                  <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-border/40 group">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating stat chip */}
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                      <div className="text-xl font-black text-violet-500 tracking-tighter leading-none">
                        {item.stat}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-white/50 mt-0.5 font-medium">
                        {item.statLabel}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.description}
                  </p>

                  {/* Expandable details */}
                  <details className="group/details" open={isDesktop}>
                    <summary className="cursor-pointer list-none">
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Read more
                        <span className="inline-block transition-transform group-open/details:rotate-90">→</span>
                      </span>
                    </summary>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-l-2 border-violet-500/30 pl-4">
                      {item.details}
                    </p>
                  </details>

                  {/* Card footer */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <a
                      href="#"
                      className="group/link inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
                    >
                      {item.cta}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </a>
                    <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-wider">
                      {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* ── CTA footer card ── */}
          <div className="p-8 md:p-10 bg-violet-500/5 border border-violet-500/20 rounded-[1.5rem] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/10 mb-5">
              <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h4 className="font-black text-2xl uppercase tracking-tighter mb-2">
              Ready to Automate?
            </h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              Join thousands of Discord communities already powered by NEXIS automation.
            </p>
            <a
              href="/LandingPage/subscribtion"
              className="inline-flex items-center gap-2 bg-violet-600 cursor-pointer text-white px-6 py-3 rounded-xl font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg shadow-violet-500/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              NEXIS · About
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}