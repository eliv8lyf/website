'use client'

import { useEffect, useRef } from 'react'

const NODES = [
  { label: '',           rx: 0.65, ry: 0.50, hub: true  },
  { label: 'STRATEGY',   rx: 0.53, ry: 0.24, hub: false },
  { label: 'LLMs',       rx: 0.80, ry: 0.21, hub: false },
  { label: 'AUTOMATION', rx: 0.90, ry: 0.49, hub: false },
  { label: 'DATA',       rx: 0.81, ry: 0.76, hub: false },
  { label: 'GOVERNANCE', rx: 0.58, ry: 0.80, hub: false },
  { label: 'ROI',        rx: 0.44, ry: 0.60, hub: false },
]

const EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,2],[2,3],[3,4],[4,5],[5,6],[1,6],
]

const PULSE_INIT = [
  { ei: 0, t: 0.0 }, { ei: 2, t: 0.3 }, { ei: 3, t: 0.6 },
  { ei: 4, t: 0.1 }, { ei: 7, t: 0.5 }, { ei: 10, t: 0.8 },
  { ei: 1, t: 0.4 },
]

// Stars (static relative positions)
const STARS = Array.from({ length: 100 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 0.8 + 0.2,
  a: Math.random() * 0.35 + 0.05,
}))

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0, dpr = 1
    let animId: number
    let tick = 0
    let mx = 0.5, my = 0.5

    const pulses = PULSE_INIT.map(p => ({ ...p, speed: 0.003 + Math.random() * 0.002 }))

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function pos(node: typeof NODES[0]) {
      const mobile = W < 768
      // On mobile compress network towards centre-right so it doesn't crowd the text
      const rx = mobile ? node.rx * 0.75 + 0.12 : node.rx
      const ry = mobile ? node.ry * 0.7 + 0.15 : node.ry
      return {
        x: rx * W + (mx - 0.5) * 18,
        y: ry * H + (my - 0.5) * 12,
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const mobile = W < 768
      const nr = mobile ? 3 : 4.5        // node radius
      const hr = mobile ? 5.5 : 7.5      // hub radius
      const fs = mobile ? 9 : 11         // font size

      // Stars
      for (const s of STARS) {
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${s.a * 0.5})`
        ctx.fill()
      }

      const pts = NODES.map(pos)

      // Edges
      for (const [a, b] of EDGES) {
        ctx.beginPath()
        ctx.moveTo(pts[a].x, pts[a].y)
        ctx.lineTo(pts[b].x, pts[b].y)
        ctx.strokeStyle = 'rgba(201,168,76,0.10)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Pulses
      for (const p of pulses) {
        const [ai, bi] = EDGES[p.ei]
        const pa = pts[ai], pb = pts[bi]
        const px = pa.x + (pb.x - pa.x) * p.t
        const py = pa.y + (pb.y - pa.y) * p.t
        const trail = Math.max(0, p.t - 0.18)
        const tx = pa.x + (pb.x - pa.x) * trail
        const ty = pa.y + (pb.y - pa.y) * trail

        const g = ctx.createLinearGradient(tx, ty, px, py)
        g.addColorStop(0, 'rgba(201,168,76,0)')
        g.addColorStop(1, 'rgba(201,168,76,0.75)')
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(px, py)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#c9a84c'
        ctx.fill()

        p.t += p.speed
        if (p.t > 1) p.t = 0
      }

      // Nodes
      for (let i = 0; i < NODES.length; i++) {
        const n = NODES[i]
        const { x, y } = pts[i]
        const r = n.hub ? hr : nr

        if (n.hub) {
          const pulse = 0.5 + 0.5 * Math.sin(tick * 1.8)
          const grd = ctx.createRadialGradient(x, y, r, x, y, r * 5)
          grd.addColorStop(0, `rgba(201,168,76,${0.18 * pulse})`)
          grd.addColorStop(1, 'rgba(201,168,76,0)')
          ctx.beginPath()
          ctx.arc(x, y, r * 5, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }

        // Node dot
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = '#c9a84c'
        ctx.fill()

        // Label
        if (n.label) {
          ctx.font = `600 ${fs}px Syne, sans-serif`
          ctx.fillStyle = 'rgba(240,237,232,0.75)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          // Position label: top nodes get label above, bottom nodes below, side nodes offset
          const isBottom = n.ry > 0.6
          const isRight  = n.rx > 0.85
          const lx = isRight ? x - r - 4 : x
          const ly = isBottom ? y + r + fs + 2 : y - r - fs * 0.6
          const align = isRight ? 'right' : 'center'
          ctx.textAlign = align
          ctx.fillText(n.label, lx, ly)
        }
      }

      tick += 0.016
    }

    function loop() {
      animId = requestAnimationFrame(loop)
      draw()
    }

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
