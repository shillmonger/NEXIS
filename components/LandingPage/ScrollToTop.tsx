"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeAndScrollProps {
  children?: React.ReactNode;
}

export default function ThemeAndScroll({ children }: ThemeAndScrollProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      setShowScrollTop(scrollTop > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {children}

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
              fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50          
              bg-background/80 dark:bg-card/80 backdrop-blur-md text-foreground border border-border
              w-12 h-12 rounded-full
              flex items-center justify-center
              shadow-lg shadow-violet-950/10 dark:shadow-black/40
              hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 hover:border-violet-500 hover:scale-110
              active:scale-95
              transition-all duration-300 cursor-pointer
            "
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Theme Toggle Button */}
      {mounted && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 flex items-center justify-center w-12 h-12 rounded-2xl
          bg-gradient-to-tr from-violet-900 via-violet-700 to-violet-500 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 
          hover:shadow-xl hover:shadow-violet-500/40 cursor-pointer focus:outline-none ring-1 ring-white/20"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </motion.div>
        </motion.button>
      )}
    </>
  );
}