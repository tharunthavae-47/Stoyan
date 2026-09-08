"use client"

import { Check, Search } from "lucide-react"
import { TiltCard } from "./tilt-card"
import { AnimatedCounter } from "./animated-counter"

export function HeroMatchingCard() {
  return (
    <div className="relative animate-fade-up [animation-delay:200ms]">
      <div className="stoyan-float absolute -inset-5 rounded-[36px] bg-blue-500/10 blur-2xl" />
      <TiltCard max={9}>
        <div className="relative rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_25px_80px_rgba(15,23,42,0.10)] sm:p-7">
          <div className="flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">jobmatch24 MATCHING</p>
              <h2 className="mt-1 text-xl font-black">Passende Kandidaten</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Search className="h-5 w-5" />
            </div>
          </div>

          <div
            className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            style={{ transform: "translateZ(55px)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
                TT
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black">Tharun Thava</p>
                <p className="text-sm text-slate-500">Prozesstechniker</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-blue-600">
                  <AnimatedCounter value={94} suffix="%" />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Diagnose", "Service", "Mechanik"].map((skill) => (
                <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-white p-4"
            style={{ transform: "translateZ(35px)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
                ST
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black">Stoyan Tanovski</p>
                <p className="text-sm text-slate-500">Automobil-Fachmann</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-blue-600">
                  <AnimatedCounter value={88} suffix="%" />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match</p>
              </div>
            </div>
          </div>

          <div
            className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 text-white"
            style={{ transform: "translateZ(65px)" }}
          >
            <div>
              <p className="text-sm font-bold">Intelligentes Matching</p>
              <p className="mt-1 text-xs text-slate-400">Anforderungen automatisch vergleichen</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
              <Check className="h-4 w-4" />
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
