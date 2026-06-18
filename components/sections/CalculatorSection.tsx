"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import {
  calculateCompoundGrowth, calculateMilestones, calculateScenarios,
  calculateHeatmap, getInvestorProfile,
  formatCurrency, formatLargeNumber, type FireInputs,
} from "@/lib/fireCalculations";
import { Calendar, TrendingUp, Banknote, Target, User, CheckCircle } from "lucide-react";

const DEFAULT_INPUTS: FireInputs = {
  initialCapital: 50000,
  monthlyContribution: 2000,
  annualReturnRate: 8,
  inflationRate: 3,
  taxRate: 0.19,
  monthlyExpenses: 6000,
  simulationYears: 35,
};

const MONTHLY_INCOME_DEFAULT = 8000;

const EMERALD = "#10B981";
const SLATE = "#94A3B8";
const AMBER = "#F59E0B";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1F2937] border border-[#374151]/50 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-[#94A3B8] mb-2">Rok {label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">{formatLargeNumber(p.value)}</p>
      ))}
    </div>
  );
};

const MONTHS = ["S","L","M","K","M","C","L","S","W","P","L","G"];
const HEATMAP_COLORS = ["#1F2937","#064E3B","#065F46","#047857","#059669","#10B981","#34D399"];

function getHeatColor(growth: number, max: number): string {
  const idx = Math.min(HEATMAP_COLORS.length - 1, Math.floor((growth / max) * (HEATMAP_COLORS.length - 1)));
  return HEATMAP_COLORS[Math.max(0, idx)];
}

export function CalculatorSection() {
  const [inputs, setInputs] = useState<FireInputs>(DEFAULT_INPUTS);
  const [monthlyIncome, setMonthlyIncome] = useState(MONTHLY_INCOME_DEFAULT);
  const [activeTab, setActiveTab] = useState<"growth"|"breakdown"|"scenarios"|"heatmap">("growth");

  const result = useMemo(() => calculateCompoundGrowth(inputs), [inputs]);
  const milestones = useMemo(() => calculateMilestones(inputs, result), [inputs, result]);
  const scenarios = useMemo(() => calculateScenarios(inputs), [inputs]);
  const heatmap = useMemo(() => calculateHeatmap(inputs), [inputs]);
  const profile = useMemo(() => getInvestorProfile(inputs, monthlyIncome), [inputs, monthlyIncome]);

  const maxGrowth = useMemo(() => Math.max(...heatmap.map(h => h.growth)), [heatmap]);

  const pieData = useMemo(() => {
    const final = result.yearlyData[result.yearlyData.length - 1];
    const tax = final.totalGains * inputs.taxRate;
    return [
      { name: "Wpłaty własne", value: Math.round(final.totalContributions), color: SLATE },
      { name: "Zyski netto", value: Math.round(final.totalGains * (1 - inputs.taxRate)), color: EMERALD },
      { name: "Podatek Belki", value: Math.round(tax), color: "#374151" },
    ];
  }, [result, inputs.taxRate]);

  const set = (key: keyof FireInputs, value: number) =>
    setInputs(prev => ({ ...prev, [key]: value }));

  const sliders = [
    { label: "Kapitał początkowy", key: "initialCapital" as const, value: inputs.initialCapital, min: 0, max: 500000, step: 5000, format: formatLargeNumber },
    { label: "Miesięczna składka", key: "monthlyContribution" as const, value: inputs.monthlyContribution, min: 100, max: 20000, step: 100, format: formatCurrency },
    { label: "Roczna stopa zwrotu", key: "annualReturnRate" as const, value: inputs.annualReturnRate, min: 1, max: 20, step: 0.5, format: (v: number) => v.toFixed(1) + "%" },
    { label: "Inflacja roczna", key: "inflationRate" as const, value: inputs.inflationRate, min: 0, max: 10, step: 0.5, format: (v: number) => v.toFixed(1) + "%" },
    { label: "Miesięczne wydatki (FIRE)", key: "monthlyExpenses" as const, value: inputs.monthlyExpenses, min: 1000, max: 30000, step: 500, format: formatCurrency },
    { label: "Horyzont symulacji", key: "simulationYears" as const, value: inputs.simulationYears, min: 5, max: 50, step: 1, format: (v: number) => v + " lat" },
  ];

  const tabs = [
    { id: "growth", label: "Wzrost" },
    { id: "breakdown", label: "Breakdown" },
    { id: "scenarios", label: "Scenariusze" },
    { id: "heatmap", label: "Mapa ciepła" },
  ] as const;

  const heatmapYears = [...new Set(heatmap.map(h => h.year))];

  return (
    <section id="kalkulator" className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">Twój symulator <span className="text-[#10B981]">FIRE</span></h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Przesuń suwaki i obserwuj, jak zmienia się Twoja droga do wolności finansowej.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: "Twoja data wolności", raw: 0, isDate: true, highlight: !!result.fireDate },
            { icon: Banknote, label: "Miesięczna renta", raw: result.monthlyPassiveIncome, formatter: formatLargeNumber },
            { icon: Target, label: "Cel kapitałowy", raw: result.targetCapital, formatter: formatLargeNumber },
            { icon: TrendingUp, label: "Portfel końcowy", raw: result.finalNominalValue, formatter: formatLargeNumber },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl border p-5 ${stat.highlight ? "border-[#10B981]/40 bg-[#10B981]/5 shadow-[0_0_30px_rgba(16,185,129,0.08)]" : "border-[#374151]/50 bg-[#1F2937]"}`}>
              <stat.icon className={`w-5 h-5 mb-3 ${stat.highlight ? "text-[#10B981]" : "text-[#94A3B8]"}`} />
              <p className="text-[#94A3B8] text-xs mb-1">{stat.label}</p>
              {stat.isDate
                ? <p className="text-2xl font-bold text-[#10B981]">{result.fireDate ?? "Poza zakresem"}</p>
                : <AnimatedCounter value={stat.raw} formatter={stat.formatter!} className={`text-2xl font-bold ${stat.highlight ? "text-[#10B981]" : "text-[#F9FAFB]"}`} />}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start mb-10">
          {/* Sliders */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6 space-y-6">
            <h3 className="text-[#F9FAFB] font-semibold text-lg">Parametry symulacji</h3>
            {sliders.map(s => (
              <div key={s.key}>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[#94A3B8] text-sm">{s.label}</label>
                  <span className="text-[#10B981] font-semibold text-sm">{s.format(s.value)}</span>
                </div>
                <Slider value={s.value} min={s.min} max={s.max} step={s.step} onValueChange={v => set(s.key, v as number)} />
              </div>
            ))}
            {/* Monthly income for profile */}
            <div className="pt-2 border-t border-[#374151]/40">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[#94A3B8] text-sm">Twój miesięczny dochód</label>
                <span className="text-[#10B981] font-semibold text-sm">{formatCurrency(monthlyIncome)}</span>
              </div>
              <Slider value={monthlyIncome} min={2000} max={50000} step={500} onValueChange={v => setMonthlyIncome(v as number)} />
            </div>
          </motion.div>

          {/* Charts with tabs */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-[#10B981] text-white" : "bg-[#1F2937] text-[#94A3B8] hover:text-[#F9FAFB]"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Growth chart */}
            {activeTab === "growth" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#F9FAFB] font-semibold">Wzrost portfela</h3>
                  <div className="flex gap-4 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-[#10B981] rounded inline-block"/>Nominalna</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-[#94A3B8] opacity-60 rounded inline-block"/>Realna</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={result.yearlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gNom" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={EMERALD} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={EMERALD} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={SLATE} stopOpacity={0.12}/>
                        <stop offset="95%" stopColor={SLATE} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4}/>
                    <XAxis dataKey="year" stroke="#374151" tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={v => `${v}r`}/>
                    <YAxis stroke="#374151" tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"k" : v} width={55}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    {result.fireYear && <ReferenceLine x={result.fireYear} stroke={EMERALD} strokeDasharray="4 4" strokeOpacity={0.7} label={{ value:"FIRE 🎯", fill:EMERALD, fontSize:11, position:"top" }}/>}
                    <Area type="monotone" dataKey="nominalValue" stroke={EMERALD} strokeWidth={2} fill="url(#gNom)" dot={false} isAnimationActive animationDuration={400}/>
                    <Area type="monotone" dataKey="realValue" stroke={SLATE} strokeWidth={1.5} strokeOpacity={0.6} fill="url(#gReal)" dot={false} isAnimationActive animationDuration={400}/>
                  </AreaChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Breakdown pie */}
            {activeTab === "breakdown" && (
              <>
                <h3 className="text-[#F9FAFB] font-semibold mb-4">Skład portfela po {inputs.simulationYears} latach</h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={600}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent"/>)}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatLargeNumber(v)} contentStyle={{ background:"#1F2937", border:"1px solid #374151", borderRadius:12 }} itemStyle={{ color:"#F9FAFB" }} labelStyle={{ color:"#94A3B8" }}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4 min-w-[200px]">
                    {pieData.map(d => (
                      <div key={d.name} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }}/>
                        <div>
                          <p className="text-[#94A3B8] text-xs">{d.name}</p>
                          <p className="text-[#F9FAFB] font-bold">{formatLargeNumber(d.value)}</p>
                          <p className="text-[#10B981] text-xs">{((d.value / result.finalNominalValue) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Scenarios */}
            {activeTab === "scenarios" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#F9FAFB] font-semibold">Scenariusze stopy zwrotu</h3>
                  <div className="flex gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-red-400 rounded inline-block"/>5%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-[#10B981] rounded inline-block"/>{inputs.annualReturnRate}%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-amber-400 rounded inline-block"/>12%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scenarios} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4}/>
                    <XAxis dataKey="year" stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>`${v}r`}/>
                    <YAxis stroke="#374151" tick={{ fill:"#94A3B8", fontSize:11 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"k":v} width={55}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Line type="monotone" dataKey="pessimistic" stroke="#F87171" strokeWidth={2} dot={false} name="Pesymistyczny (5%)"/>
                    <Line type="monotone" dataKey="base" stroke={EMERALD} strokeWidth={2.5} dot={false} name={`Bazowy (${inputs.annualReturnRate}%)`}/>
                    <Line type="monotone" dataKey="optimistic" stroke={AMBER} strokeWidth={2} dot={false} name="Optymistyczny (12%)"/>
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Heatmap */}
            {activeTab === "heatmap" && (
              <>
                <h3 className="text-[#F9FAFB] font-semibold mb-4">Mapa wzrostu miesięcznego</h3>
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    <div className="flex gap-1 mb-1 ml-8">
                      {MONTHS.map((m, i) => <span key={i} className="w-6 text-center text-[10px] text-[#94A3B8] shrink-0">{m}</span>)}
                    </div>
                    {heatmapYears.slice(0, 25).map(y => (
                      <div key={y} className="flex items-center gap-1 mb-1">
                        <span className="w-7 text-[10px] text-[#94A3B8] text-right shrink-0">{y}r</span>
                        {heatmap.filter(h => h.year === y).map(h => (
                          <div key={h.month} className="w-6 h-5 rounded-sm shrink-0 transition-colors"
                            style={{ background: getHeatColor(h.growth, maxGrowth) }}
                            title={`Rok ${h.year}, mies. ${h.month}: +${h.growth.toFixed(3)}%`}/>
                        ))}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-3 ml-8">
                      <span className="text-[10px] text-[#94A3B8]">Mniej</span>
                      {HEATMAP_COLORS.map((c, i) => <span key={i} className="w-4 h-4 rounded-sm" style={{ background: c }}/>)}
                      <span className="text-[10px] text-[#94A3B8]">Więcej</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Milestones timeline */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6 mb-8">
          <h3 className="text-[#F9FAFB] font-semibold text-lg mb-6">Kamienie milowe Twojej drogi do wolności</h3>
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-[#374151]/50 hidden md:block"/>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {milestones.slice(0, 6).map((m, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-3 border-2 ${m.isFireYear ? "bg-[#10B981] border-[#10B981]" : "bg-[#1F2937] border-[#374151]"}`}>
                    {m.isFireYear ? <span className="text-base">🎯</span> : <span className="text-[#94A3B8] text-xs font-bold">{m.year}r</span>}
                  </div>
                  <p className={`text-sm font-bold mb-1 ${m.isFireYear ? "text-[#10B981]" : "text-[#F9FAFB]"}`}>{m.date}</p>
                  <p className="text-[#10B981] text-xs font-semibold">{formatLargeNumber(m.value)}</p>
                  {m.isFireYear && <span className="mt-1 text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">FIRE!</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Investor profile */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6" style={{ borderColor: profile.color + "40", background: profile.color + "08" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: profile.color + "20" }}>
                <User className="w-7 h-7" style={{ color: profile.color }}/>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs mb-1">Twój profil inwestora</p>
                <p className="text-xl font-bold" style={{ color: profile.color }}>{profile.type}</p>
                <p className="text-[#94A3B8] text-xs">Stopa oszczędności: {profile.savingsRate.toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#94A3B8] text-sm mb-3">{profile.description}</p>
              <div className="flex flex-col gap-2">
                {profile.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: profile.color }}/>
                    <p className="text-[#F9FAFB] text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
