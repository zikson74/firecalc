"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { calculateInflation, formatCurrency, formatLargeNumber } from "@/lib/fireCalculations";
import { TrendingDown, AlertTriangle } from "lucide-react";

export function InflationSection() {
  const [amount, setAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(20);

  const result = useMemo(() => calculateInflation(amount, inflationRate, years), [amount, inflationRate, years]);

  return (
    <section id="inflacja" className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">Kalkulator</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">Ile będzie warte<br/><span className="text-[#10B981]">Twoje 10 000 zł za 20 lat?</span></h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Inflacja jest cichym złodziejem oszczędności. Sprawdź, ile realnie straci Twoje "bezpieczne" konto.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="space-y-6">
            <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6 space-y-6">
              <h3 className="text-[#F9FAFB] font-semibold">Parametry</h3>
              {[
                { label: "Kwota oszczędności", value: amount, min: 1000, max: 1000000, step: 1000, set: setAmount, format: formatLargeNumber },
                { label: "Roczna inflacja", value: inflationRate, min: 0.5, max: 15, step: 0.5, set: setInflationRate, format: (v: number) => v.toFixed(1) + "%" },
                { label: "Horyzont czasowy", value: years, min: 1, max: 40, step: 1, set: setYears, format: (v: number) => v + " lat" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-3">
                    <label className="text-[#94A3B8] text-sm">{s.label}</label>
                    <span className="text-[#10B981] font-semibold text-sm">{s.format(s.value)}</span>
                  </div>
                  <Slider value={s.value} min={s.min} max={s.max} step={s.step} onValueChange={v => s.set(v as number)} />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm font-medium">Utrata siły nabywczej</p>
              </div>
              <AnimatedCounter value={result.purchasingPowerLoss} formatter={v => v.toFixed(1) + "%"} className="text-3xl font-bold text-red-400" />
              <p className="text-[#94A3B8] text-xs mt-1">Twoje pieniądze będą warte o tyle mniej</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-5">
                <p className="text-[#94A3B8] text-xs mb-1">Kwota nominalna (bez zmian)</p>
                <AnimatedCounter value={amount} formatter={formatLargeNumber} className="text-2xl font-bold text-[#F9FAFB]" />
              </div>
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <TrendingDown className="w-4 h-4 text-red-400 mb-1" />
                <p className="text-[#94A3B8] text-xs mb-1">Realna wartość za {years} lat</p>
                <AnimatedCounter value={result.realValueNow} formatter={formatLargeNumber} className="text-2xl font-bold text-red-400" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6">
              <h3 className="text-[#F9FAFB] font-semibold mb-4">Erozja siły nabywczej w czasie</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gNominal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gRealInfl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F87171" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4}/>
                  <XAxis dataKey="year" stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>`${v}r`}/>
                  <YAxis stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"k":v} width={55}/>
                  <Tooltip formatter={(v: number) => formatLargeNumber(v)} contentStyle={{ background:"#1F2937", border:"1px solid #374151", borderRadius:12 }} itemStyle={{ color:"#F9FAFB" }}/>
                  <Area type="monotone" dataKey="nominal" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="url(#gNominal)" dot={false} name="Nominalna"/>
                  <Area type="monotone" dataKey="realValue" stroke="#F87171" strokeWidth={2} fill="url(#gRealInfl)" dot={false} name="Realna siła nabywcza"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
