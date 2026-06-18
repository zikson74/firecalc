"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  ASSETS, generateComparativeData, calcTotalReturn, calcCAGR,
  type TimeRange,
} from "@/lib/historicalData";

const TIME_RANGES: TimeRange[] = ["1Y", "5Y", "10Y", "20Y", "30Y", "50Y", "MAX"];

const DEFAULT_SELECTED = ["sp500", "nasdaq", "msci", "gold", "bitcoin"];

export function HistoricalSection() {
  const [range, setRange] = useState<TimeRange>("20Y");
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(x => x !== id) : prev
        : [...prev, id]
    );
  };

  const chartData = useMemo(() => generateComparativeData(selected, range), [selected, range]);

  const stats = useMemo(() =>
    selected.map(id => {
      const asset = ASSETS.find(a => a.id === id)!;
      return {
        ...asset,
        totalReturn: calcTotalReturn(id, range),
        cagr: calcCAGR(id, range),
      };
    }).sort((a, b) => b.totalReturn - a.totalReturn),
    [selected, range]
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const sorted = [...payload].sort((a, b) => b.value - a.value);
    return (
      <div className="bg-[#1F2937] border border-[#374151]/50 rounded-xl p-3 shadow-xl text-xs max-w-[200px]">
        <p className="text-[#94A3B8] mb-2 font-medium">{label}</p>
        {sorted.map((p: any) => (
          <div key={p.dataKey} className="flex justify-between gap-3 mb-0.5">
            <span style={{ color: p.color }}>{ASSETS.find(a => a.id === p.dataKey)?.shortName}</span>
            <span className="text-[#F9FAFB] font-semibold">{p.value?.toFixed(0)}x</span>
          </div>
        ))}
      </div>
    );
  };

  const formatYAxis = (v: number) => {
    if (v >= 10000) return `${(v / 1000).toFixed(0)}k`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return `${v}`;
  };

  return (
    <section id="indeksy" className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">Dane historyczne</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
            Jak rosły największe<br /><span className="text-[#10B981]">indeksy i aktywa?</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Porównaj historyczne stopy zwrotu S&P 500, Nasdaq, złota, Bitcoina i innych — od 1 roku do 100 lat wstecz. Wartość 100 zł na starcie.
          </p>
        </motion.div>

        {/* Time range selector */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {TIME_RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                range === r ? "bg-[#10B981] text-white" : "bg-[#1F2937] text-[#94A3B8] hover:text-[#F9FAFB] border border-[#374151]/50"
              }`}>
              {r}
            </button>
          ))}
        </div>

        {/* Asset selector chips */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {ASSETS.map(a => (
            <button key={a.id} onClick={() => toggle(a.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selected.includes(a.id)
                  ? "border-transparent text-white"
                  : "border-[#374151]/50 text-[#94A3B8] hover:text-[#F9FAFB] bg-[#1F2937]"
              }`}
              style={selected.includes(a.id) ? { background: a.color + "30", borderColor: a.color + "60", color: a.color } : {}}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: selected.includes(a.id) ? a.color : "#374151" }} />
              {a.shortName}
            </button>
          ))}
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[#374151]/50 bg-[#111827] p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#94A3B8] text-sm">Wzrost 100 zł — skala logarytmiczna</p>
            <p className="text-[#94A3B8] text-xs">{chartData[0]?.year} – {chartData[chartData.length - 1]?.year}</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4} />
              <XAxis dataKey="year" stroke="#374151" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis stroke="#374151" tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={formatYAxis} width={55} />
              <Tooltip content={<CustomTooltip />} />
              {selected.map(id => {
                const asset = ASSETS.find(a => a.id === id)!;
                return (
                  <Line key={id} type="monotone" dataKey={id} stroke={asset.color}
                    strokeWidth={2} dot={false} name={asset.shortName}
                    isAnimationActive animationDuration={500} connectNulls />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-[#374151]/50 bg-[#111827] p-4 hover:border-[#374151] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                <p className="text-[#F9FAFB] text-sm font-semibold truncate">{s.name}</p>
                {i === 0 && <span className="ml-auto text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded-full shrink-0">🏆 #1</span>}
              </div>
              <p className="text-[#94A3B8] text-[11px] mb-3">{s.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[#94A3B8] text-[10px]">Zwrot {range}</p>
                  <p className={`text-base font-bold ${s.totalReturn >= 0 ? "text-[#10B981]" : "text-red-400"}`}>
                    {s.totalReturn >= 0 ? "+" : ""}{s.totalReturn.toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-[#94A3B8] text-[10px]">CAGR rocznie</p>
                  <p className={`text-base font-bold ${s.cagr >= 0 ? "text-[#F9FAFB]" : "text-red-400"}`}>
                    {s.cagr >= 0 ? "+" : ""}{s.cagr.toFixed(1)}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[#94A3B8]/40 text-xs mt-6">
          * Dane oparte na historycznych średnich stopach zwrotu. Przeszłe wyniki nie gwarantują przyszłych rezultatów.
        </p>
      </div>
    </section>
  );
}
