"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

const affiliates = [
  {
    name: "XTB",
    category: "Dom Maklerski",
    description: "Brak prowizji na akcje i ETF-y do 100 000 EUR miesięcznie. Idealny do budowania portfela dywidendowego.",
    rating: 4.8,
    badge: "Polecany",
    href: "#",
    highlight: true,
  },
  {
    name: "IBKR",
    category: "Broker Globalny",
    description: "Interactive Brokers — dostęp do giełd na całym świecie, niskie prowizje i profesjonalne narzędzia.",
    rating: 4.7,
    badge: "Dla zaawansowanych",
    href: "#",
    highlight: false,
  },
  {
    name: "Finax",
    category: "Robo-Advisor",
    description: "Automatyczne, globalne portfele ETF z pasywnym podejściem. Idealne dla początkujących inwestorów.",
    rating: 4.5,
    badge: "Dla początkujących",
    href: "#",
    highlight: false,
  },
];

export function AffiliateSection() {
  return (
    <section id="narzedzia" className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase mb-4 block">
            Narzędzia do realizacji planu
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
            Gdzie zainwestować?
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Starannie dobrane platformy, które pomogą Ci zrealizować Twój plan FIRE.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {affiliates.map((a, i) => (
            <motion.a
              key={a.name}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group block rounded-2xl border p-6 transition-all duration-300 ${
                a.highlight
                  ? "border-[#10B981]/40 bg-[#10B981]/5 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]"
                  : "border-[#374151]/50 bg-[#1F2937] hover:border-[#374151] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full mb-2 inline-block ${
                    a.highlight
                      ? "bg-[#10B981]/20 text-[#10B981]"
                      : "bg-[#374151]/60 text-[#94A3B8]"
                  }`}>
                    {a.badge}
                  </span>
                  <h3 className="text-[#F9FAFB] font-bold text-xl">{a.name}</h3>
                  <p className="text-[#94A3B8] text-xs">{a.category}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#94A3B8]/40 group-hover:text-[#10B981] transition-colors mt-1" />
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">{a.description}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${j < Math.floor(a.rating) ? "text-[#10B981] fill-[#10B981]" : "text-[#374151]"}`}
                  />
                ))}
                <span className="text-[#94A3B8] text-xs ml-1">{a.rating}/5</span>
              </div>
            </motion.a>
          ))}
        </div>

        <p className="text-center text-[#94A3B8]/40 text-xs mt-8">
          * Linki partnerskie — otrzymujemy prowizję przy założeniu konta, bez dodatkowego kosztu dla Ciebie.
        </p>
      </div>
    </section>
  );
}
