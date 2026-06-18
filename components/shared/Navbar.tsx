"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Kalkulator FIRE", href: "#kalkulator" },
  { label: "Dywidendy", href: "#dywidendy" },
  { label: "Inflacja", href: "#inflacja" },
  { label: "Wynajem vs Kupno", href: "#wynajem-vs-kupno" },
  { label: "IKZE", href: "#ikze" },
  { label: "Indeksy", href: "#indeksy" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_LINKS.forEach(l => {
      const el = document.getElementById(l.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#374151]/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 flex items-center justify-center group-hover:bg-[#10B981]/25 transition-colors">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <span className="font-bold text-[#F9FAFB]">FireCalc<span className="text-[#10B981]">.pl</span></span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  activeSection === l.href.slice(1)
                    ? "text-[#10B981] bg-[#10B981]/10"
                    : "text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#1F2937]"
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => scrollTo("#kalkulator")}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold rounded-xl transition-all hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]">
              Oblicz FIRE →
            </button>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F9FAFB]" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#374151]/40 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <button key={l.href} onClick={() => scrollTo(l.href)}
                  className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    activeSection === l.href.slice(1)
                      ? "text-[#10B981] bg-[#10B981]/10"
                      : "text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#1F2937]"
                  }`}>
                  {l.label}
                </button>
              ))}
              <button onClick={() => scrollTo("#kalkulator")}
                className="mt-2 px-4 py-3 bg-[#10B981] text-white text-sm font-semibold rounded-xl text-center">
                Oblicz swoją datę wolności →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
