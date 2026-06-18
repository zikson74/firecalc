"use client";

import { motion } from "framer-motion";
import { Percent, Clock, ShieldCheck, TrendingUp } from "lucide-react";

const concepts = [
  {
    icon: Percent,
    title: "Procent składany",
    description:
      "Einstein nazwał go ósmym cudem świata. Twoje zyski generują kolejne zyski — efekt kuli śnieżnej, który z czasem staje się lawiną kapitału.",
    keyword: "kalkulator procent składany",
  },
  {
    icon: Clock,
    title: "Siła czasu",
    description:
      "Czas inwestowania ma większe znaczenie niż kwota startowa. Każdy rok zwłoki to setki tysięcy złotych mniej na koncie w przyszłości.",
    keyword: "kalkulator wolności finansowej",
  },
  {
    icon: ShieldCheck,
    title: "Reguła 4% (SWR)",
    description:
      "Badania pokazują, że portfel inwestycyjny wytrzymuje wypłaty na poziomie 4% rocznie przez co najmniej 30 lat. Twój cel: zgromadzić 25× rocznych wydatków.",
    keyword: "reguła 4 procent FIRE",
  },
  {
    icon: TrendingUp,
    title: "Ruch FIRE",
    description:
      "Financial Independence, Retire Early. Rosnąca globalna społeczność ludzi, którzy wybierają świadome oszczędzanie i inwestowanie zamiast konsumpcjonizmu.",
    keyword: "niezależność finansowa Polska",
  },
];

export function EducationSection() {
  return (
    <section id="edukacja" className="py-24 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">
            Matematyka za wykresem
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
            Jak działa <span className="text-[#10B981]">wolność finansowa?</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Cztery filary, na których opiera się symulator FIRE i matematyka procentu składanego.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {concepts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-6 hover:border-[#10B981]/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.07)] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-5 group-hover:bg-[#10B981]/20 transition-colors">
                <c.icon className="w-5 h-5 text-[#10B981]" />
              </div>
              <h3 className="text-[#F9FAFB] font-semibold text-lg mb-3">{c.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{c.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Formula showcase */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-2xl border border-[#374151]/50 bg-[#0B0F19] p-8 text-center"
        >
          <p className="text-[#94A3B8] text-sm mb-3">Formuła symulatora (kapitalizacja miesięczna)</p>
          <p className="text-[#F9FAFB] font-mono text-lg md:text-xl font-medium">
            FV = K₀ × (1+r)ⁿ + S × [(1+r)ⁿ - 1] / r
          </p>
          <p className="text-[#94A3B8] text-xs mt-3">
            gdzie r = miesięczna stopa zwrotu, n = liczba miesięcy, K₀ = kapitał startowy, S = miesięczna składka
          </p>
        </motion.div>
      </div>
    </section>
  );
}
