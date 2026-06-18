import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { LiveCounter } from "@/components/shared/LiveCounter";
import { EducationSection } from "@/components/sections/EducationSection";
import { HistoricalSection } from "@/components/sections/HistoricalSection";
import { TrendingWidget } from "@/components/shared/TrendingWidget";
import { DividendSection } from "@/components/sections/DividendSection";
import { InflationSection } from "@/components/sections/InflationSection";
import { RentVsBuySection } from "@/components/sections/RentVsBuySection";
import { IKZESection } from "@/components/sections/IKZESection";
import { OpportunityCostSection } from "@/components/sections/OpportunityCostSection";
import { AffiliateSection } from "@/components/sections/AffiliateSection";
import { LeadMagnetSection } from "@/components/sections/LeadMagnetSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterSection } from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full">
        <HeroSection />
        <LiveCounter />
        <CalculatorSection />
        <EducationSection />
        <HistoricalSection />
        <TrendingWidget />
        <DividendSection />
        <InflationSection />
        <RentVsBuySection />
        <IKZESection />
        <OpportunityCostSection />
        <AffiliateSection />
        <LeadMagnetSection />
        <FaqSection />
        <FooterSection />
      </main>
    </>
  );
}
