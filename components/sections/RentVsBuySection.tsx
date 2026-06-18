"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Slider } from "@/components/ui/slider";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { calculateRentVsBuy, formatLargeNumber } from "@/lib/fireCalculations";
import { Home, TrendingUp } from "lucide-react";

export function RentVsBuySection() {
  const [inputs, setInputs] = useState({
    propertyPrice: 600000,
    downPayment: 120000,
    mortgageRate: 7,
    mortgageYears: 25,
    monthlyRent: 2500,
    rentIncreaseRate: 3,
    investmentReturn: 8,
    propertyAppreciation: 4,
    years: 25,
  });

  const set = (k: string, v: number) => setInputs(prev => ({ ...prev, [k]: v }));
  const result = useMemo(() => calculateRentVsBuy(inputs), [inputs]);

  const crossoverYear = result.data.find((d, i) =>
    i > 0 && ((result.data[i-1].buyWealth < result.data[i-1].rentWealth) !== (d.buyWealth < d.rentWealth))
  )?.year;

  const sliders = [
    { label: "Cena nieruchomości", key: "propertyPrice", value: inputs.propertyPrice, min: 100000, max: 2000000, step: 10000, fmt: formatLargeNumber },
    { label: "Wkład własny", key: "downPayment", value: inputs.downPayment, min: 10000, max: 500000, step: 5000, fmt: formatLargeNumber },
    { label: "Oprocentowanie kredytu", key: "mortgageRate", value: inputs.mortgageRate, min: 1, max: 15, step: 0.1, fmt: (v:number)=>v.toFixed(1)+"%" },
    { label: "Okres kredytu", key: "mortgageYears", value: inputs.mortgageYears, min: 5, max: 35, step: 1, fmt: (v:number)=>v+" lat" },
    { label: "Miesięczny czynsz (wynajem)", key: "monthlyRent", value: inputs.monthlyRent, min: 500, max: 10000, step: 100, fmt: formatLargeNumber },
    { label: "Wzrost czynszów rocznie", key: "rentIncreaseRate", value: inputs.rentIncreaseRate, min: 0, max: 10, step: 0.5, fmt: (v:number)=>v.toFixed(1)+"%" },
    { label: "Zwrot z inwestycji (wynajem)", key: "investmentReturn", value: inputs.investmentReturn, min: 1, max: 15, step: 0.5, fmt: (v:number)=>v.toFixed(1)+"%" },
    { label: "Wzrost wartości nieruchomości", key: "propertyAppreciation", value: inputs.propertyAppreciation, min: 0, max: 10, step: 0.5, fmt: (v:number)=>v.toFixed(1)+"%" },
  ];

  return (
    <section id="wynajem-vs-kupno" className="py-24 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">Porównywarka</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">Wynajem czy kupno?<br/><span className="text-[#10B981]">Odpowiedź w liczbach.</span></h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Porówna majątek właściciela mieszkania z najemcą, który inwestuje różnicę.</p>
        </motion.div>

        {/* Winner banner */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className={`rounded-2xl border p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 ${result.buyWins ? "border-[#10B981]/40 bg-[#10B981]/5" : "border-amber-500/40 bg-amber-500/5"}`}>
          <div className="flex items-center gap-4">
            {result.buyWins ? <Home className="w-8 h-8 text-[#10B981]"/> : <TrendingUp className="w-8 h-8 text-amber-400"/>}
            <div>
              <p className="text-lg font-bold text-[#F9FAFB]">{result.buyWins ? "Kupno wygrywa" : "Wynajem + inwestowanie wygrywa"} po {inputs.years} latach</p>
              <p className="text-[#94A3B8] text-sm">{crossoverYear ? `Punkt przecięcia: rok ${crossoverYear}` : "Brak punktu przecięcia w tym horyzoncie"}</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-[#94A3B8] text-xs">Majątek — kupno</p>
              <AnimatedCounter value={result.finalBuyWealth} formatter={formatLargeNumber} className={`text-xl font-bold ${result.buyWins?"text-[#10B981]":"text-[#F9FAFB]"}`}/>
            </div>
            <div>
              <p className="text-[#94A3B8] text-xs">Majątek — wynajem</p>
              <AnimatedCounter value={result.finalRentWealth} formatter={formatLargeNumber} className={`text-xl font-bold ${!result.buyWins?"text-amber-400":"text-[#F9FAFB]"}`}/>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-8">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#374151]/50 bg-[#0B0F19] p-6 space-y-5">
            <h3 className="text-[#F9FAFB] font-semibold">Parametry</h3>
            {sliders.map(s => (
              <div key={s.key}>
                <div className="flex justify-between mb-2">
                  <label className="text-[#94A3B8] text-sm">{s.label}</label>
                  <span className="text-[#10B981] font-semibold text-sm">{s.fmt(s.value)}</span>
                </div>
                <Slider value={s.value} min={s.min} max={s.max} step={s.step} onValueChange={v => set(s.key, v as number)}/>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#374151]/50 bg-[#0B0F19] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#F9FAFB] font-semibold">Porównanie majątku w czasie</h3>
              <div className="flex gap-4 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-[#10B981] rounded inline-block"/>Kupno</span>
                <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-amber-400 rounded inline-block"/>Wynajem+inwest.</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={result.data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gBuy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gRent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4}/>
                <XAxis dataKey="year" stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>`${v}r`}/>
                <YAxis stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"k":v} width={60}/>
                <Tooltip formatter={(v:number)=>formatLargeNumber(v)} contentStyle={{ background:"#1F2937", border:"1px solid #374151", borderRadius:12 }} itemStyle={{ color:"#F9FAFB" }}/>
                {crossoverYear && <ReferenceLine x={crossoverYear} stroke="#94A3B8" strokeDasharray="4 4" label={{ value:"Przecięcie", fill:"#94A3B8", fontSize:10, position:"top" }}/>}
                <Area type="monotone" dataKey="buyWealth" stroke="#10B981" strokeWidth={2} fill="url(#gBuy)" dot={false} name="Kupno"/>
                <Area type="monotone" dataKey="rentWealth" stroke="#F59E0B" strokeWidth={2} fill="url(#gRent)" dot={false} name="Wynajem"/>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
