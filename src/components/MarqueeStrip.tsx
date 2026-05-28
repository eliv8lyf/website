const ITEMS = [
  'AI Strategy',
  'Machine Learning',
  'Process Automation',
  'Data Intelligence',
  'Enterprise AI',
  'AI Training & Upskilling',
  'LLM Integration',
  'Regulatory AI Compliance',
]

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div className="border-t border-b border-white/[0.07] overflow-hidden bg-off-black py-[18px]">
      <div className="flex gap-16 w-max animate-marquee">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-5 text-muted text-[0.78rem] tracking-[0.12em] uppercase whitespace-nowrap font-medium"
          >
            <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
