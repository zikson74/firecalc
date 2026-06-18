"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

const STOCK_MOCK = [
  { symbol: "MSFT", name: "Microsoft", price: 415.23, change: 1.24, sector: "Tech" },
  { symbol: "AAPL", name: "Apple", price: 189.87, change: -0.43, sector: "Tech" },
  { symbol: "NVDA", name: "NVIDIA", price: 875.40, change: 3.12, sector: "AI/Tech" },
  { symbol: "AMZN", name: "Amazon", price: 183.92, change: 0.78, sector: "E-commerce" },
  { symbol: "GOOGL", name: "Alphabet", price: 163.55, change: 0.32, sector: "Tech" },
  { symbol: "META", name: "Meta", price: 505.18, change: 1.87, sector: "Social" },
];

const ETF_MOCK = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", price: 524.13, change: 0.65, ter: "0.09%" },
  { symbol: "QQQ", name: "Invesco Nasdaq 100", price: 449.82, change: 1.02, ter: "0.20%" },
  { symbol: "VWCE", name: "Vanguard FTSE All-World", price: 112.45, change: 0.44, ter: "0.22%" },
  { symbol: "IWDA", name: "iShares MSCI World", price: 89.72, change: 0.38, ter: "0.20%" },
  { symbol: "VHYL", name: "Vanguard High Dividend", price: 64.18, change: 0.21, ter: "0.29%" },
];

export function TrendingWidget() {
  const [crypto, setCrypto] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"crypto" | "stocks" | "etf">("crypto");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCrypto = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
        { next: { revalidate: 300 } }
      );
      if (!res.ok) throw new Error("API error");
      const data: CryptoAsset[] = await res.json();
      setCrypto(data);
      setLastUpdated(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCrypto(); }, []);

  const formatPrice = (p: number) =>
    p >= 1000 ? `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

  const formatMcap = (v: number) =>
    v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T`
    : v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B`
    : `$${(v / 1e6).toFixed(0)}M`;

  return (
    <section id="trending" className="py-20 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[#10B981] text-sm font-medium tracking-widest uppercase block mb-2">Rynek na żywo</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB]">Trendujące <span className="text-[#10B981]">aktywa</span></h2>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-[#94A3B8]/50 text-xs">
                  Aktualizacja: {lastUpdated.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              <button onClick={fetchCrypto} disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F2937] border border-[#374151]/50 text-[#94A3B8] hover:text-[#F9FAFB] text-xs transition-all disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Odśwież
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["crypto", "stocks", "etf"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === t ? "bg-[#10B981] text-white" : "bg-[#1F2937] text-[#94A3B8] hover:text-[#F9FAFB] border border-[#374151]/50"
                }`}>
                {t === "crypto" ? "🪙 Krypto" : t === "stocks" ? "📈 Akcje" : "🧺 ETF"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Crypto tab */}
        {activeTab === "crypto" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-[#374151]/50 bg-[#1F2937] p-4 animate-pulse h-[110px]"/>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-8 text-center">
                <p className="text-[#94A3B8] mb-3">Nie udało się pobrać danych (CoinGecko rate limit)</p>
                <button onClick={fetchCrypto} className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-sm font-semibold">Spróbuj ponownie</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {crypto.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="rounded-xl border border-[#374151]/50 bg-[#1F2937] p-4 hover:border-[#374151] hover:bg-[#252f3f] transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={c.image} alt={c.name} className="w-6 h-6 rounded-full" />
                      <div className="min-w-0">
                        <p className="text-[#F9FAFB] text-sm font-semibold truncate">{c.symbol.toUpperCase()}</p>
                        <p className="text-[#94A3B8] text-[10px] truncate">{c.name}</p>
                      </div>
                    </div>
                    <p className="text-[#F9FAFB] font-bold text-sm mb-1">{formatPrice(c.current_price)}</p>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${c.price_change_percentage_24h >= 0 ? "text-[#10B981]" : "text-red-400"}`}>
                        {c.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                        {c.price_change_percentage_24h >= 0 ? "+" : ""}{c.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                      <p className="text-[#94A3B8] text-[10px]">{formatMcap(c.market_cap)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Stocks tab */}
        {activeTab === "stocks" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-[#374151]/50 text-[#94A3B8] text-xs font-medium">
                <span>Spółka</span><span className="text-right">Cena (USD)</span><span className="text-right">24h</span><span className="text-right">Sektor</span>
              </div>
              {STOCK_MOCK.map((s, i) => (
                <motion.div key={s.symbol} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="grid grid-cols-4 gap-4 px-5 py-3.5 border-b border-[#374151]/30 last:border-0 hover:bg-[#252f3f] transition-colors">
                  <div>
                    <p className="text-[#F9FAFB] text-sm font-bold">{s.symbol}</p>
                    <p className="text-[#94A3B8] text-xs">{s.name}</p>
                  </div>
                  <p className="text-[#F9FAFB] font-semibold text-sm text-right self-center">${s.price.toFixed(2)}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${s.change >= 0 ? "text-[#10B981]" : "text-red-400"}`}>
                    {s.change >= 0 ? <TrendingUp className="w-3.5 h-3.5"/> : <TrendingDown className="w-3.5 h-3.5"/>}
                    {s.change >= 0 ? "+" : ""}{s.change}%
                  </div>
                  <p className="text-[#94A3B8] text-xs text-right self-center">{s.sector}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-[#94A3B8]/40 text-xs mt-3 text-center">* Ceny akcji są orientacyjne — dane demo</p>
          </motion.div>
        )}

        {/* ETF tab */}
        {activeTab === "etf" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-[#374151]/50 text-[#94A3B8] text-xs font-medium">
                <span>ETF</span><span className="text-right">Cena (USD)</span><span className="text-right">24h</span><span className="text-right">TER</span>
              </div>
              {ETF_MOCK.map((e, i) => (
                <motion.div key={e.symbol} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="grid grid-cols-4 gap-4 px-5 py-3.5 border-b border-[#374151]/30 last:border-0 hover:bg-[#252f3f] transition-colors">
                  <div>
                    <p className="text-[#F9FAFB] text-sm font-bold">{e.symbol}</p>
                    <p className="text-[#94A3B8] text-xs">{e.name}</p>
                  </div>
                  <p className="text-[#F9FAFB] font-semibold text-sm text-right self-center">${e.price.toFixed(2)}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${e.change >= 0 ? "text-[#10B981]" : "text-red-400"}`}>
                    {e.change >= 0 ? <TrendingUp className="w-3.5 h-3.5"/> : <TrendingDown className="w-3.5 h-3.5"/>}
                    +{e.change}%
                  </div>
                  <p className="text-[#10B981] text-xs font-medium text-right self-center">{e.ter}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-[#94A3B8]/40 text-xs mt-3 text-center">* Ceny ETF są orientacyjne — dane demo. TER = Total Expense Ratio (roczny koszt funduszu)</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
