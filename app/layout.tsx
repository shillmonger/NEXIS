import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NEXIS — Web3 Community Operating System & Discord Bot",
    template: "%s | NEXIS",
  },
  description:
    "Empower your Web3 community with automated Discord moderation, NFT holder tier verification, prediction markets, Arena competitions, and real-time market intelligence.",
  keywords: [
    "NEXIS",
    "Web3 Operating System",
    "Discord Bot Subscriptions",
    "Automated Moderation",
    "NXAE NFT Verification",
    "Prediction Markets",
    "Web3 Community Tools",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast: 'border-2 border-black',
                success: '!bg-green-500 !text-white !border-green-500',
                error: '!bg-red-500 !text-white !border-red-500',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}