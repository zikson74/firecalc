"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Czy symulator uwzględnia inflację?",
    a: "Tak. Symulator pokazuje zarówno wartość nominalną (bez korekty), jak i realną siłę nabywczą Twojego portfela po uwzględnieniu inflacji. Możesz dostosować stopę inflacji suwakiem — domyślnie wynosi 3%.",
  },
  {
    q: "Czym jest reguła 4%?",
    a: "Reguła 4% (Safe Withdrawal Rate) pochodzi z badania Trinity Study. Mówi, że portfel inwestycyjny wytrzyma wypłaty równe 4% jego wartości rocznie przez co najmniej 30 lat. Cel FIRE to zgromadzić 25-krotność rocznych wydatków.",
  },
  {
    q: "Czy wyniki uwzględniają podatek od zysków?",
    a: "Tak — kalkulator domyślnie nalicza podatek Belki wynoszący 19% od zysku kapitałowego. Widoczne jest to w wartości zysków netto w wynikach symulacji.",
  },
  {
    q: "Jaką stopę zwrotu przyjąć?",
    a: "Historyczna średnioroczna stopa zwrotu globalnego rynku akcji (np. indeks MSCI World) wynosi ok. 7–10% nominalnie. Dla zdywersyfikowanego portfela ETF realistyczne założenie to 7–8% rocznie. Domyślna wartość w symulatorze to 8%.",
  },
  {
    q: "Czy to pewna prognoza mojej przyszłości finansowej?",
    a: "Nie. FireCalc.pl to narzędzie edukacyjne i symulacyjne. Wyniki opierają się na stałej stopie zwrotu, co jest uproszczeniem — rynki są zmienne. Nie stanowi to porady inwestycyjnej. Zawsze konsultuj decyzje finansowe z licencjonowanym doradcą.",
  },
  {
    q: "Czy moje dane są zapisywane?",
    a: "Nie. Kalkulator działa w 100% po stronie Twojej przeglądarki (client-side). Żadne dane nie są wysyłane na serwer ani zapisywane — Twoje liczby zostają wyłącznie na Twoim urządzeniu.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-[#0B0F19]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
            Często zadawane <span className="text-[#10B981]">pytania</span>
          </h2>
          <p className="text-[#94A3B8] text-lg">
            Odpowiedzi na najczęstsze wątpliwości dotyczące symulacji FIRE i inwestowania.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={i}
                className="rounded-xl border border-[#374151]/50 bg-[#111827] px-6 data-[state=open]:border-[#10B981]/30"
              >
                <AccordionTrigger className="text-[#F9FAFB] font-medium text-left hover:no-underline hover:text-[#10B981] transition-colors py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#94A3B8] text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
