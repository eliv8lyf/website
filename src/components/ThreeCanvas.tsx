'use client'

import { useEffect, useRef } from 'react'

const GOLD = '#c9a84c'
const GOLD_GLOW = 'rgba(201,168,76,'

// Organic positioning — not a polygon. All rx > 0.60 to stay right of text block.
const D_NODES = [
  { label: '',           rx: 0.74, ry: 0.50, hub: true,  size: 8  },
  { label: 'STRATEGY',   rx: 0.64, ry: 0.27, hub: false, size: 4  },
  { label: 'LLMs',       rx: 0.83, ry: 0.20, hub: false, size: 4  },
  { label: 'AUTOMATION', rx: 0.93, ry: 0.44, hub: false, size: 4  },
  { label: 'DATA',       rx: 0.87, ry: 0.73, hub: false, size: 4  },
  { label: 'GOVERNANCE', rx: 0.68, ry: 0.76, hub: false, size: 3.5},
  { label: 'ROI',        rx: 0.62, ry: 0.54, hub: false, size: 3.5},
]

const M_NODES = [
  { label: '', rx: 0.72, ry: 0.70, hub: true,  size: 6   },
  { label: '', rx: 0.55, ry: 0.57, hub: false, size: 3   },
  { label: '', rx: 0.83, ry: 0.53, hub: false, size: 3   },
  { label: '', rx: 0.91, ry: 0.70, hub: false, size: 3   },
  { label: '', rx: 0.82, ry: 0.86, hub: false, size: 2.5 },
  { label: '', rx: 0.60, ry: 0.88, hub: false, size: 2.5 },
  { label: '', rx: 0.50, ry: 0.72, hub: false, size: 2.5 },
]

const EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,2],[2,3],[3,4],[4,5],[5,6],[1,6],
]

// Dot grid — relative positions sampled once
const GRID_DOTS = (() => {
  const d: { gx: number; gy: number }[] = []
  for (let gx = 0.55; gx <= 1.0; gx += 0.04)
    for (let gy = 0.05; gy <= 0.97; gy += 0.05)
      d.push({ gx, gy })
  return d
})()

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, dpr = 1, animId: number, tick = 0
    let mx = 0.5, my = 0.5

    // One pulse per edge (staggered start)
    const pulses = EDGES.map((_, i) => ({
      ei: i, t: i / EDGES.length,
      speed: 0.0025 + (i % 4) * 0.0007,
    }))

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const mobile = W < 768
      const nodes = mobile ? M_NODES : D_NODES

      // --- Dot grid (desktop only) ---
      if (!mobile) {
        for (const { gx, gy } of GRID_DOTS) {
          ctx.beginPath()
          ctx.arc(gx * W, gy * H, 0.7, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(201,168,76,0.07)'
          ctx.fill()
        }
      }

      // Node screen positions + subtle parallax
      const pts = nodes.map(n => ({
        x: n.rx * W + (mx - 0.5) * 12,
        y: n.ry * H + (my - 0.5) *  8,
      }))

      // --- Edges (with glow) ---
      ctx.shadowColor = GOLD_GLOW + '0.4)'
      ctx.shadowBlur = 6
      for (const [a, b] of EDGES) {
        const pa = pts[a], pb = pts[b]
        const g = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y)
        g.addColorStop(0, GOLD_GLOW + '0.25)')
        g.addColorStop(0.5, GOLD_GLOW + '0.18)')
        g.addColorStop(1, GOLD_GLOW + '0.25)')
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = g; ctx.lineWidth = 0.8; ctx.stroke()
      }
      ctx.shadowBlur = 0

      // --- Pulse signals ---
      for (const p of pulses) {
        const [ai, bi] = EDGES[p.ei]
        const pa = pts[ai], pb = pts[bi]
        const px = pa.x + (pb.x - pa.x) * p.t
        const py = pa.y + (pb.y - pa.y) * p.t
        const ts = Math.max(0, p.t - 0.14)
        const tx = pa.x + (pb.x - pa.x) * ts
        const ty = pa.y + (pb.y - pa.y) * ts

        const g2 = ctx.createLinearGradient(tx, ty, px, py)
        g2.addColorStop(0, GOLD_GLOW + '0)')
        g2.addColorStop(1, GOLD_GLOW + '0.9)')
        ctx.shadowColor = GOLD; ctx.shadowBlur = 8
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py)
        ctx.strokeStyle = g2; ctx.lineWidth = 1.5; ctx.stroke()

        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = GOLD; ctx.fill()
        ctx.shadowBlur = 0

        p.t += p.speed; if (p.t > 1) p.t = 0
      }

      // --- Nodes ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]; const { x, y } = pts[i]

        if (n.hub) {
          // Outer breathing ring
          const pulse = 0.5 + 0.5 * Math.sin(tick * 1.6)
          const outerR = n.size * (6 + pulse * 2)
          const grd = ctx.createRadialGradient(x, y, n.size, x, y, outerR)
          grd.addColorStop(0, GOLD_GLOW + (0.22 * pulse) + ')')
          grd.addColorStop(1, GOLD_GLOW + '0)')
          ctx.beginPath(); ctx.arc(x, y, outerR, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()

          // Inner ring
          ctx.beginPath(); ctx.arc(x, y, n.size * 2.2, 0, Math.PI * 2)
          ctx.strokeStyle = GOLD_GLOW + (0.25 * pulse) + ')'
          ctx.lineWidth = 0.8; ctx.stroke()
        }

        // Glow halo
        ctx.shadowColor = GOLD; ctx.shadowBlur = n.hub ? 18 : 10
        ctx.beginPath(); ctx.arc(x, y, n.size, 0, Math.PI * 2)
        ctx.fillStyle = GOLD; ctx.fill()
        ctx.shadowBlur = 0

        // Inner bright core
        ctx.beginPath(); ctx.arc(x, y, n.size * 0.45, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,245,200,0.9)'; ctx.fill()

        // Label (desktop only)
        if (n.label) {
          const below = n.ry > 0.62
          const rightEdge = n.rx > 0.88

          ctx.font = '600 10.5px Syne, sans-serif'
          const lw = ctx.measureText(n.label).width
          const lx = rightEdge ? x - n.size - 8 : x
          const ly = below ? y + n.size + 16 : y - n.size - 10
          const align = rightEdge ? 'right' : 'center'

          // Label background pill
          const pad = { x: 6, y: 3 }
          const bx = align === 'right' ? lx - lw : lx - lw / 2
          ctx.fillStyle = 'rgba(5,6,8,0.65)'
          ctx.fillRect(bx - pad.x, ly - 9 - pad.y, lw + pad.x * 2, 14 + pad.y * 2)

          ctx.fillStyle = 'rgba(240,237,232,0.82)'
          ctx.textAlign = align; ctx.textBaseline = 'middle'
          ctx.fillText(n.label, lx, ly)
        }
      }

      tick += 0.016
    }

    function loop() { animId = requestAnimationFrame(loop); draw() }

    const onMouse = (e: MouseEvent) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight }
    const onTouch = (e: TouchEvent) => { mx = e.touches[0].clientX / window.innerWidth; my = e.touches[0].clientY / window.innerHeight }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMouse)
    document.addEventListener('touchmove', onTouch, { passive: true })
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouse)
      document.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
}
