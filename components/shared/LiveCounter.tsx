"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatLargeNumber } from "@/lib/fireCalculations";

const SEED = 847_320_000_000;
const PER_SECOND = 12_500_000;

export function LiveCounter() {
  const [value, setValue] = useState(SEED);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => v + PER_SECOND);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Symulacji przeprowadzonych", value: "184 291", suffix: "" },
    { label: "Łączna wartość symulacji", value: formatLargeNumber(value), suffix: "" },
    { label: "Użytkowników w tym tygodniu", value: "3 847", suffix: "" },
  ];

  return (
    <section className="py-14 bg-[#111827] border-y border-[#374151]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <p className="text-3xl md:text-4xl font-bold text-[#10B981] tabular-nums mb-1">{s.value}{s.suffix}</p>
              <p className="text-[#94A3B8] text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
