export interface AssetConfig {
  id: string;
  name: string;
  shortName: string;
  color: string;
  startYear: number;
  annualReturn: number;
  volatility: number;
  description: string;
}

export const ASSETS: AssetConfig[] = [
  { id: "sp500",    name: "S&P 500",          shortName: "S&P 500",    color: "#10B981", startYear: 1928, annualReturn: 10.2, volatility: 18, description: "500 największych spółek USA" },
  { id: "nasdaq",   name: "Nasdaq 100",        shortName: "Nasdaq",     color: "#60A5FA", startYear: 1985, annualReturn: 14.8, volatility: 25, description: "100 największych spółek technologicznych" },
  { id: "msci",     name: "MSCI ACWI",         shortName: "MSCI ACWI",  color: "#F59E0B", startYear: 1988, annualReturn: 8.3,  volatility: 16, description: "Globalny rynek akcji — 23 kraje rozwinięte + 24 wschodzące" },
  { id: "msciworld",name: "MSCI World",        shortName: "MSCI World", color: "#A78BFA", startYear: 1970, annualReturn: 9.1,  volatility: 15, description: "Rynki rozwinięte — 23 kraje" },
  { id: "emerging", name: "MSCI Emerging",     shortName: "Emerging",   color: "#FB923C", startYear: 1988, annualReturn: 8.8,  volatility: 24, description: "Rynki wschodzące — Chiny, Indie, Brazylia i inne" },
  { id: "europe",   name: "MSCI Europe",       shortName: "Europa",     color: "#34D399", startYear: 1970, annualReturn: 7.4,  volatility: 17, description: "Europejski rynek akcji" },
  { id: "gold",     name: "Złoto (Gold)",      shortName: "Złoto",      color: "#FCD34D", startYear: 1970, annualReturn: 7.9,  volatility: 20, description: "Uncja złota (XAU/USD)" },
  { id: "bitcoin",  name: "Bitcoin (BTC)",     shortName: "Bitcoin",    color: "#F97316", startYear: 2010, annualReturn: 62,   volatility: 85, description: "Pierwsza kryptowaluta" },
  { id: "realestate",name:"Nieruchomości (REIT)",shortName: "REIT",     color: "#E879F9", startYear: 1972, annualReturn: 9.5,  volatility: 19, description: "Indeks funduszy nieruchomości REIT USA" },
  { id: "bonds",    name: "Obligacje 10Y USA", shortName: "Obligacje",  color: "#94A3B8", startYear: 1928, annualReturn: 4.8,  volatility: 8,  description: "10-letnie obligacje skarbowe USA" },
  { id: "vhyl",     name: "VHYL (Dywidendowy)",shortName: "VHYL",       color: "#6EE7B7", startYear: 2013, annualReturn: 7.2,  volatility: 15, description: "Vanguard FTSE All-World High Dividend Yield" },
];

export type TimeRange = "1Y" | "5Y" | "10Y" | "20Y" | "30Y" | "50Y" | "MAX";

const TIME_RANGE_YEARS: Record<TimeRange, number> = {
  "1Y": 1, "5Y": 5, "10Y": 10, "20Y": 20, "30Y": 30, "50Y": 50, "MAX": 100,
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateHistoricalData(assetId: string, range: TimeRange): { year: number; value: number }[] {
  const asset = ASSETS.find(a => a.id === assetId);
  if (!asset) return [];

  const currentYear = new Date().getFullYear();
  const years = TIME_RANGE_YEARS[range];
  const startYear = Math.max(asset.startYear, currentYear - years);
  const totalYears = currentYear - startYear;

  if (totalYears <= 0) return [];

  const rng = seededRandom(assetId.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  const data: { year: number; value: number }[] = [];
  let value = 100;

  // Special crash/boom years for realism
  const events: Record<string, Record<number, number>> = {
    sp500:    { 1929:-44, 1930:-28, 1931:-47, 1937:-35, 1974:-26, 1987:-22, 2000:-10, 2001:-13, 2002:-23, 2008:-38, 2020:-18, 2022:-19 },
    nasdaq:   { 2000:-39, 2001:-33, 2002:-38, 2008:-42, 2022:-33 },
    bitcoin:  { 2011:-73, 2014:-58, 2018:-73, 2022:-65 },
    gold:     { 1975:-24, 1981:-32, 1997:-21, 2013:-28 },
    bonds:    { 2022:-18 },
    emerging: { 1998:-25, 2008:-53, 2015:-15, 2022:-20 },
  };

  for (let y = startYear; y <= currentYear; y++) {
    const assetEvents = events[assetId] || {};
    const eventReturn = assetEvents[y];
    let annualReturn: number;

    if (eventReturn !== undefined) {
      annualReturn = eventReturn / 100;
    } else {
      const noise = (rng() - 0.5) * 2 * (asset.volatility / 100);
      annualReturn = asset.annualReturn / 100 + noise;
    }

    value *= 1 + annualReturn;
    data.push({ year: y, value: Math.max(0.1, value) });
  }

  return data;
}

export function generateComparativeData(assetIds: string[], range: TimeRange) {
  const datasets = assetIds.map(id => ({
    id,
    data: generateHistoricalData(id, range),
  }));

  // Find common start year
  const startYears = datasets.map(d => d.data[0]?.year ?? 9999);
  const commonStart = Math.max(...startYears);

  // Normalize all to 100 at common start
  const normalized = datasets.map(d => {
    const filtered = d.data.filter(p => p.year >= commonStart);
    const base = filtered[0]?.value ?? 1;
    return {
      id: d.id,
      data: filtered.map(p => ({ year: p.year, value: (p.value / base) * 100 })),
    };
  });

  // Merge into year-keyed objects
  const yearMap: Record<number, Record<string, number>> = {};
  for (const d of normalized) {
    for (const p of d.data) {
      if (!yearMap[p.year]) yearMap[p.year] = { year: p.year };
      yearMap[p.year][d.id] = Math.round(p.value * 10) / 10;
    }
  }

  return Object.values(yearMap).sort((a, b) => a.year - b.year);
}

export function calcTotalReturn(assetId: string, range: TimeRange): number {
  const data = generateHistoricalData(assetId, range);
  if (data.length < 2) return 0;
  return ((data[data.length - 1].value / data[0].value) - 1) * 100;
}

export function calcCAGR(assetId: string, range: TimeRange): number {
  const data = generateHistoricalData(assetId, range);
  if (data.length < 2) return 0;
  const years = data[data.length - 1].year - data[0].year;
  if (years <= 0) return 0;
  return (Math.pow(data[data.length - 1].value / data[0].value, 1 / years) - 1) * 100;
}
