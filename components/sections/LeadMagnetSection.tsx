"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, FileText, CheckCircle, Loader2 } from "lucide-react";

type State = "idle" | "loading" | "success";

export function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }
    setError("");
    setState("loading");
    // Placeholder — integracja z Resend/Brevo w kroku 2
    console.log("Newsletter signup:", email);
    await new Promise((r) => setTimeout(r, 2000));
    setState("success");
  };

  return (
    <section id="raport" className="py-24 bg-[#111827]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-[#10B981]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
            Pobierz swój <span className="text-[#10B981]">Plan Wolności</span>
          </h2>
          <p className="text-[#94A3B8] text-lg mb-10">
            Spersonalizowany raport PDF z Twoją symulacją FIRE — daty, wykresy i kroki milowe.
            Wyślemy go prosto na Twoją skrzynkę.
          </p>

          <div className="rounded-2xl border border-[#374151]/50 bg-[#1F2937] p-8">
            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 flex flex-col items-center gap-4"
                >
                  <CheckCircle className="w-14 h-14 text-[#10B981]" />
                  <p className="text-[#F9FAFB] font-semibold text-xl">Raport w drodze!</p>
                  <p className="text-[#94A3B8]">
                    Sprawdź skrzynkę <span className="text-[#10B981]">{email}</span> za chwilę.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj@email.pl"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#374151]/60 focus:border-[#10B981]/60 focus:outline-none focus:ring-1 focus:ring-[#10B981]/40 text-[#F9FAFB] placeholder-[#94A3B8]/50 text-sm transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap text-sm"
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generuję raport…
                      </>
                    ) : (
                      "Wyślij mi raport PDF"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-red-400 text-sm mt-3 text-left">{error}</p>
            )}

            {state !== "success" && (
              <p className="text-[#94A3B8]/50 text-xs mt-4">
                Bez spamu. Możesz się wypisać w każdej chwili.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
