'use client'

import { useEffect, useState } from 'react'

const R = 36 // orbital radius as % of SVG viewBox

const NODES = [
  { num: '01', cat: 'INTELLIGENCE', title: 'AI Strategy',  sub: 'Roadmap & ROI',      angle: 240 },
  { num: '02', cat: 'MODELS',       title: 'LLMs',         sub: 'Tuning & APIs',       angle: 300 },
  { num: '03', cat: 'DEPLOYMENT',   title: 'Automation',   sub: 'Agents & workflows',  angle: 0   },
  { num: '04', cat: 'ANALYTICS',    title: 'Data',         sub: 'Pipelines & BI',      angle: 60  },
  { num: '05', cat: 'COMPLIANCE',   title: 'Governance',   sub: 'Risk & policy',       angle: 120 },
  { num: '06', cat: 'CAPABILITY',   title: 'Training',     sub: 'Team upskilling',     angle: 180 },
]

const d2r = (a: number) => (a * Math.PI) / 180

export default function ThreeCanvas() {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), 200); return () => clearTimeout(t) }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* ── DESKTOP (lg+): hub-and-spoke in right half ── */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center"
           style={{ left: '50%' }}>
        <div className="relative" style={{ width: 'min(460px, 80%)', aspectRatio: '1/1' }}>

          {/* SVG: dashed lines + travelling pulses */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {NODES.map((n, i) => {
              const x2 = 50 + R * Math.cos(d2r(n.angle))
              const y2 = 50 + R * Math.sin(d2r(n.angle))
              return (
                <g key={i}>
                  <line x1="50" y1="50" x2={x2} y2={y2}
                    stroke="rgba(201,168,76,0.20)" strokeWidth="0.35" strokeDasharray="1.8 2.2" />
                  <circle r="1" fill="#c9a84c" opacity="0.9">
                    <animateMotion
                      dur={`${2.0 + i * 0.3}s`}
                      begin={`${i * 0.4}s`}
                      repeatCount="indefinite"
                      path={`M50,50 L${x2},${y2}`}
                    />
                  </circle>
                </g>
              )
            })}
          </svg>

          {/* Hub */}
          <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
            <div className="relative w-[84px] h-[84px] rounded-full bg-[#060708] border border-gold/50 flex flex-col items-center justify-center z-10">
              <span className="font-syne font-extrabold text-cream text-[0.75rem] tracking-[0.14em]">ELIV8</span>
              <span className="text-gold text-[0.55rem] tracking-[0.2em] font-semibold mt-0.5">AI CORE</span>
              {/* breathing ring */}
              <span className="absolute inset-[-10px] rounded-full border border-gold/20 animate-pulse" />
            </div>
          </div>

          {/* Service cards */}
          {NODES.map((n, i) => {
            const cx = 50 + R * Math.cos(d2r(n.angle))
            const cy = 50 + R * Math.sin(d2r(n.angle))
            return (
              <div key={i} className="absolute pointer-events-auto"
                style={{
                  left: `${cx}%`, top: `${cy}%`,
                  transform: on
                    ? 'translate(-50%,-50%) scale(1)'
                    : 'translate(-50%,-50%) scale(0.75)',
                  opacity: on ? 1 : 0,
                  transition: `opacity 0.45s ease ${i * 65}ms, transform 0.45s ease ${i * 65}ms`,
                  width: 124,
                }}>
                <div className="bg-[#09090c]/90 border border-white/[0.09] px-3 py-2.5
                                hover:border-gold/40 hover:bg-[#0e0e12]/95 transition-all duration-300 cursor-default">
                  <div className="text-gold/50 text-[0.54rem] tracking-[0.18em] font-medium mb-1 uppercase">
                    {n.num} · {n.cat}
                  </div>
                  <div className="font-syne font-bold text-cream text-[0.78rem] leading-tight">{n.title}</div>
                  <div className="text-muted text-[0.62rem] mt-0.5">{n.sub}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── MOBILE (< lg): subtle atmospheric gradient only — no structural elements ── */}
      <div className="lg:hidden absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 55% at 80% 45%, rgba(26,107,90,0.18) 0%, transparent 65%), radial-gradient(ellipse 55% 40% at 90% 25%, rgba(201,168,76,0.09) 0%, transparent 55%)',
      }} />

    </div>
  )
}
