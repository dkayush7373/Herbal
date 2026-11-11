"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { CartBadge } from "@/components/cart/cart-badge";
import { Sun, Moon, Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#rail", label: "Collection" },
  { href: "#ingredients", label: "Botanicals" },
  { href: "#how-to-use", label: "Ritual" },
  { href: "#quiz", label: "Oil Quiz" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Accessible Skip Link to #main */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-forest focus:text-cream dark:focus:bg-gold dark:focus:text-charcoal focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Sticky Header with Backdrop Blur */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border/40 transition-colors">
        {/* Thin Gold Scroll-Progress Bar (off under Reduced Motion) */}
        {!shouldReduceMotion && (
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
            className="h-[2px] bg-gold w-full absolute top-0 left-0 z-50 pointer-events-none"
          />
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Wordmark with Gold Dot */}
          <Link
            href="/"
            className="flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-1 py-0.5"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-forest dark:text-cream">
              AKATSUKI
            </span>
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-forest dark:hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Theme Toggle & Cart Badge & Mobile Menu Drawer */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle (guarded with mounted flag to avoid hydration mismatch) */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                className="p-2 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-gold" />
                ) : (
                  <Moon className="w-4 h-4 text-forest" />
                )}
              </button>
            )}

            {/* Cart Badge */}
            <CartBadge />

            {/* Mobile Navigation Drawer (Drawer only, no Sheet per §2) */}
            <div className="md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open mobile navigation menu"
                    className="h-9 w-9 rounded-full"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-6 bg-background border-border">
                  <DrawerHeader className="text-left border-b border-border/40 pb-3">
                    <DrawerTitle className="font-serif text-xl text-forest dark:text-cream flex items-center gap-2">
                      <span>AKATSUKI</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col space-y-4 py-6">
                    {NAV_LINKS.map((link) => (
                      <DrawerClose asChild key={link.href}>
                        <a
                          href={link.href}
                          className="font-serif text-lg font-medium text-foreground hover:text-forest dark:hover:text-gold py-1"
                        >
                          {link.label}
                        </a>
                      </DrawerClose>
                    ))}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
