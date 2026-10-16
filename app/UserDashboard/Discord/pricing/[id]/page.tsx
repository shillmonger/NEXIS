"use client";

import React, { useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CloudUpload,
  Copy,
  Headphones,
  Info,
  Send,
  Server,
  ShieldCheck,
  X,
} from "lucide-react";

// ─── WALLETS ─────────────────────────────────────────────────────────────────
// TODO: replace the addresses with your real ones (or load them from your backend).
// TODO: if any coin icon URL fails to load, swap it for your own hosted image.

interface Wallet {
  id: string;
  symbol: string;
  name: string;
  network: string;
  address: string;
  iconUrl: string;
  fallbackLetter: string;
}

const WALLETS: Wallet[] = [
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum (ERC20)",
    address: "0x898db4e1bea2f325a0b4df8738afaf3e994dec37",
    iconUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    fallbackLetter: "Ξ",
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    network: "Solana",
    address: "E4ifY7Xdbjr2Xr8EBhqyW18mx3k8goXm2SGi3cUESrYy",
    iconUrl: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    fallbackLetter: "S",
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "BNB",
    network: "BNB Smart Chain (BEP20)",
    address: "0xB4Bd67ceD262A6868b64dBB1a78EdD29d2F3b929",
    iconUrl: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    fallbackLetter: "B",
  },
];

// Feature chips shown in the plan card. Customize per plan if needed.
// const PLAN_FEATURES = ["Unlimited Servers", "Advanced Features", "Priority Support"];

const HOW_IT_WORKS = [
  { title: "Send Payment", text: "Transfer the exact amount to the wallet address provided." },
  { title: "Submit Details", text: "Enter your transaction ID and upload a screenshot of the payment." },
  { title: "Wait for Approval", text: "Our team will verify your payment and activate your plan (usually within 24 hours)." },
];

const MAX_FILE_MB = 5;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// ─── COIN ICON (falls back to a letter if the image can't load) ──────────────

function CoinIcon({ wallet, size = 40 }: { wallet: Wallet; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-violet-600/10 text-violet-600 flex items-center justify-center font-black shrink-0"
      >
        {wallet.fallbackLetter}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={wallet.iconUrl}
      alt={`${wallet.name} logo`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="rounded-full shrink-0 object-contain"
    />
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  const planName =
    searchParams.get("plan") ||
    id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const amount = searchParams.get("amount") || "0";
  const billing = (searchParams.get("billing") || "per month").replace(/^per\s+/i, "");
  const amountNumber = Number(amount);
  const amountDisplay = Number.isFinite(amountNumber) ? amountNumber.toFixed(2) : amount;

  const [selectedWalletId, setSelectedWalletId] = useState<string>(WALLETS[0].id);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wallet = WALLETS.find((w) => w.id === selectedWalletId) ?? WALLETS[0];

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}......${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Only PNG, JPG or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File is too large. Max ${MAX_FILE_MB}MB.`);
      return;
    }
    setFileError(null);
    setScreenshot(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => acceptFile(e.target.files?.[0]);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Payment proof submitted successfully! We'll verify and activate your plan within 24 hours.");
      router.push("/UserDashboard/Discord/subscriptions");
    }, 1500);
  };

  // ─── MAIN PAGE ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground py-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.push("/UserDashboard/Discord/pricing")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </button>
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-xl font-black uppercase tracking-tight">Complete Your Purchase</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Follow the steps below to pay with cryptocurrency and activate your plan.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* ───────── LEFT COLUMN ───────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* PLAN SUMMARY */}
            <section className="bg-gradient-to-br from-violet-600/10 to-violet-900/5 border border-violet-600/20 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between gap-5 flex-wrap">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-600/30 shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Selected plan
                    </p>
                    <h2 className="text-xl md:text-xl font-black uppercase tracking-tight truncate">{planName}</h2>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl md:text-2xl font-black tracking-tighter leading-none">
                    ${amountDisplay}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">/ {billing}</span>
                </div>
              </div>
            </section>

            {/* PAYMENT DETAILS + SUBMIT (one card, like the reference) */}
            <section className="bg-card border border-border rounded-3xl p-6 shadow-lg space-y-6">
              {/* Payment details */}
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Payment Details</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Send the exact amount to the address below.</p>
                </div>

                {/* Pay with */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pay with</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {WALLETS.map((w) => {
                      const isSelected = w.id === selectedWalletId;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => {
                            setSelectedWalletId(w.id);
                            setCopied(false);
                          }}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-violet-600 bg-violet-600/5 shadow-md"
                              : "border-border/80 bg-muted/20 hover:border-border"
                          }`}
                        >
                          <CoinIcon wallet={w} size={36} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black leading-tight">{w.symbol}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{w.name}</p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-violet-600 bg-violet-600" : "border-border"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wallet address */}
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CoinIcon wallet={wallet} size={20} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {wallet.name} wallet address
                    </p>
                  </div>

                  <div className="flex items-stretch gap-2">
                    <div className="flex-1 min-w-0 rounded-xl border border-border bg-background px-4 py-3 flex items-center">
                      <p className="w-full min-w-0 truncate text-xs font-mono font-medium">
                        <span className="sm:hidden">{truncateAddress(wallet.address)}</span>
                        <span className="hidden sm:inline">{wallet.address}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={copyAddress}
                      aria-label={copied ? "Address copied" : "Copy wallet address"}
                      title={copied ? "Copied" : "Copy address"}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-3 sm:px-5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 shrink-0" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {wallet.network}
                  </p>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-3 rounded-2xl border border-violet-600/20 bg-violet-600/10 p-4">
                  <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Send the exact amount shown above on the <strong className="text-foreground">{wallet.network}</strong>{" "}
                    network only. Sending a different coin or network may result in lost funds.
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60" />

              {/* Submit transaction */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Submit Transaction</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    After sending the payment, enter the transaction details below and upload a screenshot. Our team
                    will verify and activate your plan.
                  </p>
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <label htmlFor="txid" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Transaction ID / Hash
                  </label>
                  <input
                    id="txid"
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter the transaction ID or hash (e.g. 7f3a9...e2c4)"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all"
                    required
                  />
                </div>

                {/* Screenshot upload */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Upload Screenshot
                  </span>
                  <div className="relative">
                    <input
                      type="file"
                      id="screenshot"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="screenshot"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                        screenshot || dragActive
                          ? "border-violet-600 bg-violet-600/5"
                          : "border-border/60 bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      {screenshot ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-violet-600" />
                          <div className="text-center">
                            <p className="text-sm font-bold text-foreground break-all">{screenshot.name}</p>
                            <p className="text-xs text-muted-foreground">File selected</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-8 h-8 text-violet-600" />
                          <div className="text-center">
                            <p className="text-sm font-bold text-foreground">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max {MAX_FILE_MB}MB)</p>
                          </div>
                        </>
                      )}
                    </label>
                    {screenshot && (
                      <button
                        type="button"
                        onClick={() => setScreenshot(null)}
                        aria-label="Remove screenshot"
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {fileError && <p className="text-[11px] font-medium text-rose-500">{fileError}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !transactionId.trim()}
                  className="w-full cursor-pointer bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Payment
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>

          {/* ───────── RIGHT COLUMN ───────── */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* How it works */}
            <section className="bg-card border border-border rounded-3xl p-6 shadow-lg space-y-5">
              <h2 className="text-sm font-black uppercase tracking-tight">How It Works</h2>
              <ol className="space-y-5">
                {HOW_IT_WORKS.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{s.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Need help */}
            <section className="bg-card border border-border rounded-3xl p-6 shadow-lg space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-tight">Need Help?</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  If you run into any issues or the approval is taking more time, feel free to contact our support team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/support")} // TODO: point to your support route
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-violet-600/30 bg-violet-600/5 hover:bg-violet-600/10 text-violet-600 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Headphones className="w-4 h-4" /> Contact Support
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}