"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Slider } from "@/components/ui/slider";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { calculateOpportunityCost, formatLargeNumber, formatCurrency } from "@/lib/fireCalculations";
import { Coffee, Smartphone, Car, Utensils } from "lucide-react";

const PRESETS = [
  { label: "Kawa w kawiarni", icon: Coffee, cost: 15, perDay: true, desc: "5 kaw tygodniowo" },
  { label: "Streaming & subskrypcje", icon: Smartphone, cost: 150, perDay: false, desc: "Netflix + Spotify + inne" },
  { label: "Lunch na mieście", icon: Utensils, cost: 400, perDay: false, desc: "5× w tygodniu" },
  { label: "Leasing auta", icon: Car, cost: 2000, perDay: false, desc: "Zamiast tańszego auta" },
];

export function OpportunityCostSection() {
  const [monthlyExpense, setMonthlyExpense] = useState(500);
  const [years, setYears] = useState(20);
  const [returnRate] = useState(8);

  const result = useMemo(() => calculateOpportunityCost(monthlyExpense, years, returnRate), [monthlyExpense, years, returnRate]);

  const chartData = [
    { name: "Wydane", value: result.totalSpent, color: "#374151" },
    { name: "Utracone zyski", value: result.finalValue - result.totalSpent, color: "#F87171" },
    { name: "Łączny koszt", value: result.finalValue, color: "#10B981" },
  ];

  return (
    <section id="koszt-alternatywny" className="py-24 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">Kalkulator</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">Ile kosztuje Cię<br/><span className="text-[#10B981]">ta jedna przyjemność?</span></h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Prawdziwy koszt wydatku to nie tylko cena — to też utracone zyski z inwestycji przez całe dekady.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            <div className="rounded-2xl border border-[#374151]/50 bg-[#0B0F19] p-6 space-y-5">
              <h3 className="text-[#F9FAFB] font-semibold">Parametry</h3>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[#94A3B8] text-sm">Miesięczny wydatek</label>
                  <span className="text-[#10B981] font-semibold text-sm">{formatCurrency(monthlyExpense)}</span>
                </div>
                <Slider value={monthlyExpense} min={50} max={5000} step={50} onValueChange={v => setMonthlyExpense(v as number)}/>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[#94A3B8] text-sm">Horyzont czasowy</label>
                  <span className="text-[#10B981] font-semibold text-sm">{years} lat</span>
                </div>
                <Slider value={years} min={5} max={40} step={1} onValueChange={v => setYears(v as number)}/>
              </div>
            </div>

            <div>
              <p className="text-[#94A3B8] text-xs mb-2 px-1">Szybkie presety:</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => setMonthlyExpense(p.perDay ? p.cost * 4 : p.cost)}
                    className="p-3 rounded-xl border border-[#374151]/50 bg-[#0B0F19] hover:border-[#10B981]/30 text-left transition-all">
                    <p.icon className="w-4 h-4 text-[#10B981] mb-1"/>
                    <p className="text-[#F9FAFB] text-xs font-medium">{p.label}</p>
                    <p className="text-[#94A3B8] text-[10px]">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#374151]/50 bg-[#0B0F19] p-4 text-center">
                <p className="text-[#94A3B8] text-xs mb-1">Wydasz łącznie</p>
                <AnimatedCounter value={result.totalSpent} formatter={formatLargeNumber} className="text-xl font-bold text-[#F9FAFB]"/>
              </div>
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-center">
                <p className="text-[#94A3B8] text-xs mb-1">Utracone zyski</p>
                <AnimatedCounter value={result.finalValue - result.totalSpent} formatter={formatLargeNumber} className="text-xl font-bold text-red-400"/>
              </div>
              <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-4 text-center">
                <p className="text-[#94A3B8] text-xs mb-1">Prawdziwy koszt</p>
                <AnimatedCounter value={result.finalValue} formatter={formatLargeNumber} className="text-xl font-bold text-[#10B981]"/>
              </div>
            </div>

            <div className="rounded-2xl border border-[#374151]/50 bg-[#0B0F19] p-6">
              <h3 className="text-[#F9FAFB] font-semibold mb-4">Rozkład prawdziwego kosztu</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4}/>
                  <XAxis dataKey="name" stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }}/>
                  <YAxis stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"k":v} width={55}/>
                  <Tooltip formatter={(v:number)=>formatLargeNumber(v)} contentStyle={{ background:"#1F2937", border:"1px solid #374151", borderRadius:12 }} itemStyle={{ color:"#F9FAFB" }}/>
                  <Bar dataKey="value" radius={[6,6,0,0]}>
                    {chartData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
