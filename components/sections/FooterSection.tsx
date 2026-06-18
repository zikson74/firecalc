import { TrendingUp } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-[#111827] border-t border-[#374151]/40">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Financial disclaimer */}
        <div className="rounded-xl border border-[#374151]/40 bg-[#0B0F19] p-5 mb-10 text-xs text-[#94A3B8]/70 leading-relaxed">
          <strong className="text-[#94A3B8]">⚠️ Informacja prawna:</strong> FireCalc.pl jest narzędziem
          edukacyjnym i symulacyjnym. Prezentowane wyniki nie stanowią porady inwestycyjnej, finansowej
          ani prawnej. Inwestowanie wiąże się z ryzykiem utraty kapitału. Wyniki historyczne nie
          gwarantują przyszłych zwrotów. Zawsze konsultuj decyzje finansowe z licencjonowanym doradcą
          inwestycyjnym. Linki do brokerów mogą być linkami partnerskimi.
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <span className="text-[#F9FAFB] font-bold">FireCalc<span className="text-[#10B981]">.pl</span></span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#94A3B8]">
            <a href="#kalkulator" className="hover:text-[#10B981] transition-colors">Kalkulator</a>
            <a href="#edukacja" className="hover:text-[#10B981] transition-colors">Jak to działa</a>
            <a href="#narzedzia" className="hover:text-[#10B981] transition-colors">Narzędzia</a>
            <a href="#faq" className="hover:text-[#10B981] transition-colors">FAQ</a>
            <a href="/polityka-prywatnosci" className="hover:text-[#10B981] transition-colors">Polityka prywatności</a>
          </nav>

          <p className="text-[#94A3B8]/50 text-sm">
            © {new Date().getFullYear()} FireCalc.pl
          </p>
        </div>
      </div>
    </footer>
  );
}
