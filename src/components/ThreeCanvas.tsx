'use client'

import { useEffect, useRef } from 'react'

// Desktop: tight cluster on right half, clear of the text block (which ends ~58% width)
const D_NODES = [
  { label: '',           rx: 0.75, ry: 0.50, hub: true  },
  { label: 'STRATEGY',   rx: 0.66, ry: 0.27 },
  { label: 'LLMs',       rx: 0.83, ry: 0.23 },
  { label: 'AUTOMATION', rx: 0.90, ry: 0.50 },
  { label: 'DATA',       rx: 0.83, ry: 0.76 },
  { label: 'GOVERNANCE', rx: 0.67, ry: 0.76 },
  { label: 'ROI',        rx: 0.63, ry: 0.52 },
]

// Mobile: no labels, pushed to bottom-right so text stays readable
const M_NODES = [
  { label: '', rx: 0.74, ry: 0.68, hub: true  },
  { label: '', rx: 0.56, ry: 0.55 },
  { label: '', rx: 0.82, ry: 0.52 },
  { label: '', rx: 0.92, ry: 0.68 },
  { label: '', rx: 0.83, ry: 0.84 },
  { label: '', rx: 0.60, ry: 0.87 },
  { label: '', rx: 0.48, ry: 0.72 },
]

const EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,2],[2,3],[3,4],[4,5],[5,6],[1,6],
]

const STARS = Array.from({ length: 90 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 0.7 + 0.2,
  a: Math.random() * 0.3 + 0.05,
}))

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, dpr = 1, animId: number, tick = 0
    let mx = 0.5, my = 0.5

    const pulses = EDGES.map((_, i) => ({
      ei: i,
      t: i / EDGES.length,
      speed: 0.0028 + (i % 3) * 0.0008,
    })).filter((_, i) => i < 7)

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const mobile = W < 768
      const nodes  = mobile ? M_NODES : D_NODES
      const alpha  = mobile ? 0.55 : 1   // dimmer on mobile — decorative only
      const nr = mobile ? 3   : 4.5
      const hr = mobile ? 5   : 7.5
      const fs = 11

      // Stars
      for (const s of STARS) {
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${s.a * 0.5 * alpha})`
        ctx.fill()
      }

      // Node screen positions with subtle parallax
      const pts = nodes.map(n => ({
        x: n.rx * W + (mx - 0.5) * 14,
        y: n.ry * H + (my - 0.5) * 10,
      }))

      // Edges
      for (const [a, b] of EDGES) {
        ctx.beginPath()
        ctx.moveTo(pts[a].x, pts[a].y)
        ctx.lineTo(pts[b].x, pts[b].y)
        ctx.strokeStyle = `rgba(201,168,76,${0.11 * alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Pulses
      for (const p of pulses) {
        const [ai, bi] = EDGES[p.ei]
        const pa = pts[ai], pb = pts[bi]
        const px = pa.x + (pb.x - pa.x) * p.t
        const py = pa.y + (pb.y - pa.y) * p.t
        const ts = Math.max(0, p.t - 0.16)
        const tx = pa.x + (pb.x - pa.x) * ts
        const ty = pa.y + (pb.y - pa.y) * ts

        const g = ctx.createLinearGradient(tx, ty, px, py)
        g.addColorStop(0, 'rgba(201,168,76,0)')
        g.addColorStop(1, `rgba(201,168,76,${0.8 * alpha})`)
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py)
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke()

        ctx.beginPath()
        ctx.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${alpha})`
        ctx.fill()

        p.t += p.speed
        if (p.t > 1) p.t = 0
      }

      // Nodes + labels
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const { x, y } = pts[i]
        const r = n.hub ? hr : nr

        if (n.hub) {
          const pulse = 0.5 + 0.5 * Math.sin(tick * 1.8)
          const grd = ctx.createRadialGradient(x, y, r, x, y, r * 5)
          grd.addColorStop(0, `rgba(201,168,76,${0.2 * pulse * alpha})`)
          grd.addColorStop(1, 'rgba(201,168,76,0)')
          ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${alpha})`
        ctx.fill()

        if (n.label && !mobile) {
          ctx.font = `600 ${fs}px Syne, sans-serif`
          ctx.fillStyle = `rgba(240,237,232,0.72)`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          // Place label above for top nodes, below for bottom nodes, left for ROI
          const below = n.ry > 0.6
          const leftSide = n.rx < 0.66
          const lx = leftSide ? x - r - 6 : x
          const ly = below ? y + r + fs + 3 : y - r - fs * 0.7
          ctx.textAlign = leftSide ? 'right' : 'center'
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
