"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0B0F19]">
        <div className="hero-glow-bg absolute inset-0" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-[20vh]">
        {/* Badge */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-8">
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#374151]/50 bg-[#1F2937]/60 text-[#94A3B8] text-sm font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
            Symulator FIRE · Procent Składany · Reguła 4%
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0)}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#F9FAFB] leading-[1.1] tracking-tight mb-6"
        >
          Zaprojektuj swoją
          <br />
          <span className="text-[#10B981]">wolność finansową.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.15)}
          className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Oblicz, kiedy Twoje pieniądze zaczną pracować zamiast Ciebie.
          <br className="hidden md:block" />
          Symulator FIRE oparty na matematyce procentu składanego i regule&nbsp;4%.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={() => scrollTo("kalkulator")}
            className="group flex items-center gap-2 px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] text-base"
          >
            Oblicz swoją datę wolności
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo("edukacja")}
            className="px-8 py-4 border border-[#374151]/70 hover:border-[#10B981]/60 text-[#94A3B8] hover:text-[#10B981] font-semibold rounded-xl transition-all duration-300 bg-transparent text-base"
          >
            Jak to działa?
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.p {...fadeUp(0.5)} className="text-sm text-[#94A3B8]/60 tracking-wide">
          Bezpłatnie&nbsp;•&nbsp;Bez rejestracji&nbsp;•&nbsp;Wyniki w czasie rzeczywistym
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#94A3B8]/40 tracking-widest uppercase">Przewiń</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-[#10B981]/40 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
