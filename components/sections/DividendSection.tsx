"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { calculateDividend, formatCurrency, formatLargeNumber } from "@/lib/fireCalculations";
import { Coins, TrendingUp, PieChart } from "lucide-react";

export function DividendSection() {
  const [targetMonthly, setTargetMonthly] = useState(5000);
  const [dividendYield, setDividendYield] = useState(4);
  const [taxRate] = useState(0.19);

  const result = useMemo(() => calculateDividend({ targetMonthlyIncome: targetMonthly, dividendYield, taxRate }), [targetMonthly, dividendYield, taxRate]);

  const etfExamples = [
    { name: "VHYL (Vanguard High Div)", yield: 3.5 },
    { name: "ISPA (iShares EM Div)", yield: 5.2 },
    { name: "TDIV (VanEck Div Leaders)", yield: 4.8 },
  ];

  return (
    <section id="dywidendy" className="py-24 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">Kalkulator</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">Ile kapitału potrzebujesz<br/><span className="text-[#10B981]">by żyć z dywidend?</span></h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Oblicz wymagany portfel dywidendowy na podstawie docelowego dochodu miesięcznego.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-6 space-y-7">
            <h3 className="text-[#F9FAFB] font-semibold text-lg">Parametry</h3>

            <div>
              <div className="flex justify-between mb-3">
                <label className="text-[#94A3B8] text-sm">Docelowy miesięczny dochód netto</label>
                <span className="text-[#10B981] font-semibold text-sm">{formatCurrency(targetMonthly)}</span>
              </div>
              <Slider value={targetMonthly} min={500} max={30000} step={500} onValueChange={v => setTargetMonthly(v as number)} />
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="text-[#94A3B8] text-sm">Stopa dywidendy ETF/akcji</label>
                <span className="text-[#10B981] font-semibold text-sm">{dividendYield.toFixed(1)}%</span>
              </div>
              <Slider value={dividendYield} min={0.5} max={12} step={0.1} onValueChange={v => setDividendYield(v as number)} />
            </div>

            <div className="pt-4 border-t border-[#374151]/40">
              <p className="text-[#94A3B8] text-xs mb-3">Przykładowe ETF-y dywidendowe:</p>
              <div className="space-y-2">
                {etfExamples.map(e => (
                  <button key={e.name} onClick={() => setDividendYield(e.yield)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-[#111827] hover:bg-[#0B0F19] border border-[#374151]/40 hover:border-[#10B981]/30 transition-all text-sm">
                    <span className="text-[#94A3B8]">{e.name}</span>
                    <span className="text-[#10B981] font-semibold">{e.yield}%</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            <div className="rounded-2xl border border-[#10B981]/40 bg-[#10B981]/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-6 h-6 text-[#10B981]" />
                <p className="text-[#94A3B8] text-sm">Wymagany kapitał dywidendowy</p>
              </div>
              <AnimatedCounter value={result.requiredCapital} formatter={formatLargeNumber} className="text-4xl font-bold text-[#10B981]" />
              <p className="text-[#94A3B8] text-xs mt-2">przy stopie dywidendy {dividendYield.toFixed(1)}% i podatku Belki 19%</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-5">
                <TrendingUp className="w-5 h-5 text-[#94A3B8] mb-2" />
                <p className="text-[#94A3B8] text-xs mb-1">Roczna dywidenda brutto</p>
                <AnimatedCounter value={result.grossAnnualIncome} formatter={formatLargeNumber} className="text-xl font-bold text-[#F9FAFB]" />
              </div>
              <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-5">
                <PieChart className="w-5 h-5 text-[#94A3B8] mb-2" />
                <p className="text-[#94A3B8] text-xs mb-1">Miesięcznie netto</p>
                <AnimatedCounter value={result.netMonthlyIncome} formatter={formatCurrency} className="text-xl font-bold text-[#10B981]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-5">
              <p className="text-[#94A3B8] text-sm mb-3">Jak to osiągnąć?</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Kupując ETF po 100 zł/szt.", value: Math.round(result.requiredCapital / 100) + " szt." },
                  { label: "Inwestując 3 000 zł/mies.", value: Math.round(result.requiredCapital / 3000 / 12) + " lat" },
                  { label: "Inwestując 5 000 zł/mies.", value: Math.round(result.requiredCapital / 5000 / 12) + " lat" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-[#94A3B8]">{row.label}</span>
                    <span className="text-[#F9FAFB] font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
