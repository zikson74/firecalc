"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { calculateIKZE, formatLargeNumber } from "@/lib/fireCalculations";
import { ShieldCheck, Percent } from "lucide-react";

export function IKZESection() {
  const [annualContrib, setAnnualContrib] = useState(9388); // limit IKZE 2024
  const [taxRate, setTaxRate] = useState(0.12);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(8);

  const result = useMemo(() => calculateIKZE(annualContrib, taxRate, years, returnRate), [annualContrib, taxRate, years, returnRate]);

  const taxOptions = [
    { label: "PIT 12% (do 120 000 zł)", value: 0.12 },
    { label: "PIT 32% (powyżej 120 000 zł)", value: 0.32 },
  ];

  return (
    <section id="ikze" className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">Kalkulator IKZE / IKE</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">Ile zaoszczędzisz<br/><span className="text-[#10B981]">na podatku dzięki IKZE?</span></h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">IKZE to legalna ulga podatkowa — odliczasz wpłaty od podstawy PIT. Sprawdź ile zyskujesz.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="space-y-4">
            <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6 space-y-6">
              <h3 className="text-[#F9FAFB] font-semibold">Parametry</h3>

              <div>
                <p className="text-[#94A3B8] text-sm mb-2">Twój próg PIT</p>
                <div className="flex gap-2">
                  {taxOptions.map(o => (
                    <button key={o.label} onClick={() => setTaxRate(o.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${taxRate === o.value ? "bg-[#10B981] text-white" : "bg-[#1F2937] text-[#94A3B8] hover:text-[#F9FAFB]"}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "Roczna wpłata IKZE", value: annualContrib, min: 500, max: 9388, step: 100, set: setAnnualContrib, fmt: (v:number)=>Math.round(v)+" zł" },
                { label: "Stopa zwrotu roczna", value: returnRate, min: 1, max: 15, step: 0.5, set: setReturnRate, fmt: (v:number)=>v.toFixed(1)+"%" },
                { label: "Horyzont inwestycji", value: years, min: 5, max: 40, step: 1, set: setYears, fmt: (v:number)=>v+" lat" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#94A3B8] text-sm">{s.label}</label>
                    <span className="text-[#10B981] font-semibold text-sm">{s.fmt(s.value)}</span>
                  </div>
                  <Slider value={s.value} min={s.min} max={s.max} step={s.step} onValueChange={v => s.set(v as number)}/>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-5">
              <ShieldCheck className="w-5 h-5 text-[#10B981] mb-2"/>
              <p className="text-[#94A3B8] text-xs mb-1">Łączna oszczędność podatkowa</p>
              <AnimatedCounter value={result.totalTaxSaved} formatter={formatLargeNumber} className="text-3xl font-bold text-[#10B981]"/>
              <p className="text-[#94A3B8] text-xs mt-1">przez {years} lat przy PIT {(taxRate*100).toFixed(0)}%</p>
            </div>

            <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-5">
              <Percent className="w-5 h-5 text-[#94A3B8] mb-2"/>
              <p className="text-[#94A3B8] text-xs mb-1">Przewaga IKZE nad zwykłym kontem</p>
              <AnimatedCounter value={result.advantage} formatter={formatLargeNumber} className={`text-2xl font-bold ${result.advantage > 0 ? "text-[#10B981]" : "text-red-400"}`}/>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-5">
                <p className="text-[#94A3B8] text-xs mb-1">Portfel IKZE (po podatku 10%)</p>
                <AnimatedCounter value={result.ikzeAfterTax} formatter={formatLargeNumber} className="text-2xl font-bold text-[#10B981]"/>
              </div>
              <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-5">
                <p className="text-[#94A3B8] text-xs mb-1">Portfel zwykły (po Belce 19%)</p>
                <AnimatedCounter value={result.regularAfterTax} formatter={formatLargeNumber} className="text-2xl font-bold text-[#F9FAFB]"/>
              </div>
            </div>

            <div className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#F9FAFB] font-semibold">IKZE vs konto standardowe</h3>
                <div className="flex gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-[#10B981] rounded inline-block"/>IKZE</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-[#94A3B8] rounded inline-block"/>Standardowe</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={result.data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gIkze" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.12}/><stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4}/>
                  <XAxis dataKey="year" stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>`${v}r`}/>
                  <YAxis stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"k":v} width={55}/>
                  <Tooltip formatter={(v:number)=>formatLargeNumber(v)} contentStyle={{ background:"#1F2937", border:"1px solid #374151", borderRadius:12 }} itemStyle={{ color:"#F9FAFB" }}/>
                  <Area type="monotone" dataKey="ikze" stroke="#10B981" strokeWidth={2} fill="url(#gIkze)" dot={false} name="IKZE"/>
                  <Area type="monotone" dataKey="regular" stroke="#94A3B8" strokeWidth={1.5} strokeOpacity={0.7} fill="url(#gReg)" dot={false} name="Standardowe"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
