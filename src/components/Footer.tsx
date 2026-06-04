import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-off-black border-t border-white/[0.07] px-12 py-12 flex flex-wrap items-center justify-between gap-6">
      <div className="font-syne font-extrabold text-[1.1rem] text-cream">
        ELIV<span className="text-gold">8</span> LYF{' '}
        <span className="text-muted font-normal text-[0.7rem] ml-2 tracking-widest">FZE</span>
      </div>
      <div className="text-muted text-[0.78rem]">© 2025 ELIV8 LYF FZE. All rights reserved.</div>
      <div className="text-muted text-[0.75rem] tracking-widest">
        Incorporated in the UAE · AI Consulting
      </div>
    </footer>
  )
}
