export interface FireInputs {
  initialCapital: number;
  monthlyContribution: number;
  annualReturnRate: number;
  inflationRate: number;
  taxRate: number;
  monthlyExpenses: number;
  simulationYears: number;
}

export interface YearlySnapshot {
  year: number;
  nominalValue: number;
  realValue: number;
  totalContributions: number;
  totalGains: number;
}

export interface FireResult {
  yearlyData: YearlySnapshot[];
  fireYear: number | null;
  fireDate: string | null;
  targetCapital: number;
  finalNominalValue: number;
  finalRealValue: number;
  monthlyPassiveIncome: number;
  netGains: number;
}

export interface Milestone {
  year: number;
  date: string;
  value: number;
  label: string;
  isFireYear: boolean;
}

export interface ScenarioPoint {
  year: number;
  pessimistic: number;
  base: number;
  optimistic: number;
}

export interface InvestorProfile {
  type: "Aggressive Saver" | "Balanced Investor" | "Conservative Saver";
  savingsRate: number;
  description: string;
  color: string;
  tips: string[];
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " zł";
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(".", ",") + " mld zł";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(".", ",") + " mln zł";
  if (value >= 1_000) return Math.round(value / 1_000) + " tys. zł";
  return formatCurrency(value);
}

// ─── Core engine ──────────────────────────────────────────────────────────────

export function calculateRealReturnRate(nominalRate: number, inflationRate: number): number {
  return (1 + nominalRate / 100) / (1 + inflationRate / 100) - 1;
}

export function calculateAfterTaxValue(grossGains: number, taxRate: number): number {
  return grossGains * (1 - taxRate);
}

export function calculateCompoundGrowth(inputs: FireInputs): FireResult {
  const { initialCapital, monthlyContribution, annualReturnRate, inflationRate, taxRate, monthlyExpenses, simulationYears } = inputs;
  const targetCapital = monthlyExpenses * 12 * 25;
  const monthlyRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
  const yearlyData: YearlySnapshot[] = [];
  let currentValue = initialCapital;
  let totalContributions = initialCapital;
  let fireYear: number | null = null;
  const currentYear = new Date().getFullYear();

  for (let year = 1; year <= simulationYears; year++) {
    for (let month = 0; month < 12; month++) {
      currentValue = (currentValue + monthlyContribution) * (1 + monthlyRate);
      totalContributions += monthlyContribution;
    }
    const totalGains = currentValue - totalContributions;
    const realValue = currentValue / Math.pow(1 + inflationRate / 100, year);
    yearlyData.push({ year, nominalValue: currentValue, realValue, totalContributions, totalGains });
    if (fireYear === null && currentValue >= targetCapital) fireYear = year;
  }

  const final = yearlyData[yearlyData.length - 1];
  const netGains = calculateAfterTaxValue(final.totalGains, taxRate);

  return {
    yearlyData,
    fireYear,
    fireDate: fireYear ? String(currentYear + fireYear) : null,
    targetCapital,
    finalNominalValue: final.nominalValue,
    finalRealValue: final.realValue,
    monthlyPassiveIncome: (final.nominalValue * 0.04) / 12,
    netGains,
  };
}

// ─── Milestones ───────────────────────────────────────────────────────────────

export function calculateMilestones(inputs: FireInputs, result: FireResult): Milestone[] {
  const currentYear = new Date().getFullYear();
  const checkpoints = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].filter(y => y <= inputs.simulationYears);
  const milestones: Milestone[] = [];

  for (const y of checkpoints) {
    const snap = result.yearlyData.find(d => d.year === y);
    if (!snap) continue;
    milestones.push({
      year: y,
      date: String(currentYear + y),
      value: snap.nominalValue,
      label: `Rok ${y}`,
      isFireYear: result.fireYear === y,
    });
  }

  if (result.fireYear && !checkpoints.includes(result.fireYear)) {
    const snap = result.yearlyData.find(d => d.year === result.fireYear);
    if (snap) {
      milestones.push({
        year: result.fireYear,
        date: result.fireDate!,
        value: snap.nominalValue,
        label: "FIRE 🎯",
        isFireYear: true,
      });
      milestones.sort((a, b) => a.year - b.year);
    }
  }

  return milestones;
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export function calculateScenarios(inputs: FireInputs): ScenarioPoint[] {
  const run = (rate: number) => calculateCompoundGrowth({ ...inputs, annualReturnRate: rate }).yearlyData;
  const pessimistic = run(5);
  const base = run(inputs.annualReturnRate);
  const optimistic = run(12);

  return base.map((b, i) => ({
    year: b.year,
    pessimistic: pessimistic[i].nominalValue,
    base: b.nominalValue,
    optimistic: optimistic[i].nominalValue,
  }));
}

// ─── Heatmap (monthly growth grid) ───────────────────────────────────────────

export function calculateHeatmap(inputs: FireInputs): { year: number; month: number; growth: number }[] {
  const monthlyRate = Math.pow(1 + inputs.annualReturnRate / 100, 1 / 12) - 1;
  const cells: { year: number; month: number; growth: number }[] = [];
  let value = inputs.initialCapital;
  const years = Math.min(inputs.simulationYears, 30);

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      const prev = value;
      value = (value + inputs.monthlyContribution) * (1 + monthlyRate);
      const growth = prev > 0 ? ((value - prev - inputs.monthlyContribution) / prev) * 100 : 0;
      cells.push({ year: y, month: m, growth });
    }
  }
  return cells;
}

// ─── Investor profile ─────────────────────────────────────────────────────────

export function getInvestorProfile(inputs: FireInputs, monthlyIncome: number): InvestorProfile {
  const savingsRate = monthlyIncome > 0 ? (inputs.monthlyContribution / monthlyIncome) * 100 : 0;
  const yearsToFire = inputs.simulationYears;

  if (savingsRate >= 40 || (inputs.annualReturnRate >= 10 && yearsToFire <= 20)) {
    return {
      type: "Aggressive Saver",
      savingsRate,
      description: "Oszczędzasz agresywnie i celowo. Jesteś na ścieżce wczesnej wolności finansowej.",
      color: "#10B981",
      tips: ["Rozważ konto IKE/IKZE dla ulgi podatkowej", "Dywersyfikuj globalnie (ETF MSCI World)", "Utrzymaj dyscyplinę w czasie korekt rynkowych"],
    };
  }
  if (savingsRate >= 20) {
    return {
      type: "Balanced Investor",
      savingsRate,
      description: "Dobry balans między konsumpcją a inwestowaniem. Wolność finansowa w zasięgu.",
      color: "#F59E0B",
      tips: ["Zwiększ składkę o 5% przy każdej podwyżce", "Zautomatyzuj przelewy na konto inwestycyjne", "Sprawdź czy kwalifikujesz się do IKZE"],
    };
  }
  return {
    type: "Conservative Saver",
    savingsRate,
    description: "Inwestujesz ostrożnie. Zwiększenie składki o kilka % drastycznie przyspieszy Twój cel.",
    color: "#94A3B8",
    tips: ["Zacznij od 1000 zł/mies. i zwiększaj stopniowo", "Zerowy budżet pomaga znaleźć ukryte oszczędności", "Każde 500 zł więcej = kilka lat mniej do FIRE"],
  };
}

// ─── Dividend calculator ──────────────────────────────────────────────────────

export interface DividendInputs {
  targetMonthlyIncome: number;
  dividendYield: number;
  taxRate: number;
}

export interface DividendResult {
  requiredCapital: number;
  requiredShares?: number;
  sharePrice?: number;
  grossAnnualIncome: number;
  netMonthlyIncome: number;
}

export function calculateDividend(inputs: DividendInputs): DividendResult {
  const grossAnnualTarget = (inputs.targetMonthlyIncome * 12) / (1 - inputs.taxRate);
  const requiredCapital = (grossAnnualTarget / inputs.dividendYield) * 100;
  const netMonthlyIncome = (requiredCapital * inputs.dividendYield / 100) * (1 - inputs.taxRate) / 12;
  return { requiredCapital, grossAnnualIncome: grossAnnualTarget, netMonthlyIncome };
}

// ─── Inflation calculator ─────────────────────────────────────────────────────

export function calculateInflation(amount: number, inflationRate: number, years: number) {
  const futureValue = amount * Math.pow(1 + inflationRate / 100, years);
  const realValueNow = amount / Math.pow(1 + inflationRate / 100, years);
  const purchasingPowerLoss = ((futureValue - amount) / futureValue) * 100;
  const data = Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    realValue: amount / Math.pow(1 + inflationRate / 100, i),
    nominal: amount,
  }));
  return { futureValue, realValueNow, purchasingPowerLoss, data };
}

// ─── Rent vs Buy ──────────────────────────────────────────────────────────────

export interface RentVsBuyInputs {
  propertyPrice: number;
  downPayment: number;
  mortgageRate: number;
  mortgageYears: number;
  monthlyRent: number;
  rentIncreaseRate: number;
  investmentReturn: number;
  propertyAppreciation: number;
  years: number;
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs) {
  const loanAmount = inputs.propertyPrice - inputs.downPayment;
  const monthlyMortgageRate = inputs.mortgageRate / 100 / 12;
  const n = inputs.mortgageYears * 12;
  const monthlyMortgage = loanAmount * (monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, n)) / (Math.pow(1 + monthlyMortgageRate, n) - 1);

  const data: { year: number; buyWealth: number; rentWealth: number }[] = [];
  let buyPropertyValue = inputs.propertyPrice;
  let buyLoanBalance = loanAmount;
  let rentInvestmentPortfolio = inputs.downPayment;
  let currentRent = inputs.monthlyRent;

  for (let y = 1; y <= inputs.years; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = buyLoanBalance * monthlyMortgageRate;
      const principal = Math.min(monthlyMortgage - interest, buyLoanBalance);
      buyLoanBalance = Math.max(0, buyLoanBalance - principal);
      buyPropertyValue *= 1 + inputs.propertyAppreciation / 100 / 12;

      const rentSavings = Math.max(0, monthlyMortgage - currentRent);
      rentInvestmentPortfolio = (rentInvestmentPortfolio + rentSavings) * (1 + inputs.investmentReturn / 100 / 12);
    }
    currentRent *= 1 + inputs.rentIncreaseRate / 100;
    const buyWealth = buyPropertyValue - buyLoanBalance;
    const rentWealth = rentInvestmentPortfolio;
    data.push({ year: y, buyWealth, rentWealth });
  }

  const final = data[data.length - 1];
  return { data, buyWins: final.buyWealth > final.rentWealth, finalBuyWealth: final.buyWealth, finalRentWealth: final.rentWealth };
}

// ─── IKZE/IKE calculator ──────────────────────────────────────────────────────

export function calculateIKZE(annualContribution: number, taxRate: number, years: number, returnRate: number) {
  const annualTaxSaving = annualContribution * taxRate;
  const monthlyContrib = annualContribution / 12;
  const monthlyRate = Math.pow(1 + returnRate / 100, 1 / 12) - 1;

  let ikzeValue = 0;
  let regularValue = 0;
  const data: { year: number; ikze: number; regular: number; saved: number }[] = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      ikzeValue = (ikzeValue + monthlyContrib) * (1 + monthlyRate);
      regularValue = (regularValue + monthlyContrib) * (1 + monthlyRate);
    }
    const totalTaxSaved = annualTaxSaving * y;
    data.push({ year: y, ikze: ikzeValue, regular: regularValue, saved: totalTaxSaved });
  }

  const ikzeAfterTax = ikzeValue * (1 - 0.1); // ryczałt 10% przy wypłacie IKZE
  const regularAfterTax = regularValue - (regularValue - annualContribution * years) * 0.19;
  return { data, ikzeAfterTax, regularAfterTax, totalTaxSaved: annualTaxSaving * years, advantage: ikzeAfterTax - regularAfterTax };
}

// ─── Opportunity cost ─────────────────────────────────────────────────────────

export function calculateOpportunityCost(monthlyExpense: number, years: number, returnRate: number) {
  const monthlyRate = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
  let value = 0;
  const data: { year: number; value: number; spent: number }[] = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = (value + monthlyExpense) * (1 + monthlyRate);
    }
    data.push({ year: y, value, spent: monthlyExpense * 12 * y });
  }

  return { finalValue: value, totalSpent: monthlyExpense * 12 * years, data };
}
