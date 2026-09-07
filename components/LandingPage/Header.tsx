"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Automatically close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const desktopNavLinks = [
    { label: "Subscription", href: "/LandingPage/subscribtion" },
    { label: "API", href: "/LandingPage/api" },
    { label: "About Nexis", href: "/LandingPage/about" },
    { label: "Developer Docs", href: "/LandingPage/docs" },
    { label: "Learn More", href: "/LandingPage/learn-more" },
    { label: "Contact Us", href: "/LandingPage/contact" },
  ];

  const mobileNavLinks = [
    { label: "Home", href: "/" },
    { label: "About Nexis", href: "/LandingPage/about" },
    { label: "Subscription", href: "/LandingPage/subscribtion" },
    { label: "Contact Support", href: "/LandingPage/contact" },
    { label: "Learn More", href: "/LandingPage/learn-more" },
    { label: "Developer API", href: "/LandingPage/api" },
    { label: "Developer Docs", href: "/LandingPage/developers" },
    { label: "Privacy Policy", href: "/LandingPage/privacy" },
    { label: "Terms & Conditions", href: "/LandingPage/terms" },
  ];

  return (
    <>
      {/* Pinned Fixed Header with Constant Height */}
      <header
        className={`fixed top-0 left-0 right-0 w-full z-100 h-15 lg:h-13 transition-colors duration-200 bg-background border-b border-border`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group inline-flex items-center gap-2 focus:outline-none">
            <span className="font-extrabold tracking-tight text-xl sm:text-2xl text-foreground transition-opacity group-hover:opacity-90">
              NEX<span className="text-violet-500">IS</span>
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {desktopNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? "text-violet-500 font-semibold"
                      : "text-muted-foreground hover:text-violet-500"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth-page/login">
                <button className="text-sm font-semibold cursor-pointer text-muted-foreground hover:text-white px-5 py-2 transition-all rounded-full bg-secondary hover:bg-violet-700">
                  Sign In
                </button>
              </Link>

              <Link href="/auth-page/register">
                <button className="rounded-full cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 text-sm font-semibold transition-all active:scale-95 shadow-sm hover:shadow-violet-500/20">
                  Register
                </button>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 text-foreground hover:bg-violet-900/20 hover:text-violet-500 rounded-xl transition-colors focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer div to push page content down */}
      <div className="h-14" />

      {/* Mobile Backdrop Overlay */}
      <div
        onClick={closeMobileMenu}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer Navigation Sidebar */}
      <aside
        aria-label="Mobile Navigation"
        className={`fixed right-0 top-0 h-full w-full max-w-full bg-background shadow-2xl z-500 transform transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col justify-between overflow-y-auto">
          {/* Sidebar Top Section */}
          <div>
            {/* Header row with Title & Close Icon */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
              <span className="text-foreground font-bold tracking-tight text-xl">
                NEX<span className="text-violet-500">IS</span>
              </span>
              <button
                onClick={closeMobileMenu}
                aria-label="Close Navigation Menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 text-foreground hover:bg-violet-900/20 hover:text-violet-500 rounded-xl transition-colors focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4">
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center px-0 py-0 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/0 text-violet-500 font-semibold"
                        : "text-muted-foreground hover:text-violet-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer & Actions */}
          <div className="pt-6 border-t border-border space-y-3">
            <Link href="/auth-page/login" className="w-full block">
              <button className="w-full py-3 border border-border text-foreground font-semibold rounded-full text-sm hover:bg-violet-700 hover:text-white hover:border-violet-700 transition-all">
                Sign In
              </button>
            </Link>

            <Link href="/auth-page/register" className="w-full block">
              <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 font-semibold text-sm rounded-full transition-all active:scale-95 shadow-md hover:shadow-violet-500/25">
                Register Now
              </button>
            </Link>

            <p className="text-center text-[11px] text-muted-foreground mt-2 px-2">
              By joining, you agree to our Terms of Service and Privacy Policy[cite: 1].
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}