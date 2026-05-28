'use client'

import { useEffect, useRef } from 'react'

// Each blob: base center, oscillation amplitude, radius (fraction of shortest screen edge), color, opacity, drift speed
const BLOBS = [
  { cx: 0.76, cy: 0.48, ax: 0.06, ay: 0.08, r: 0.58, rgb: '26,107,90',   alpha: 0.52, speed: 0.00032, phase: 0.0 },
  { cx: 0.84, cy: 0.32, ax: 0.08, ay: 0.06, r: 0.40, rgb: '201,168,76',  alpha: 0.28, speed: 0.00050, phase: 2.1 },
  { cx: 0.68, cy: 0.74, ax: 0.05, ay: 0.07, r: 0.34, rgb: '13,79,60',    alpha: 0.42, speed: 0.00042, phase: 1.3 },
  { cx: 0.91, cy: 0.58, ax: 0.04, ay: 0.09, r: 0.26, rgb: '170,130,50',  alpha: 0.22, speed: 0.00038, phase: 3.6 },
]

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, dpr = 1, animId: number, tick = 0

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw() {
      // Solid background
      ctx.fillStyle = '#050608'
      ctx.fillRect(0, 0, W, H)

      // Additive blending — blobs mix like light
      ctx.globalCompositeOperation = 'screen'

      const base = Math.min(W, H)

      for (const b of BLOBS) {
        const x = (b.cx + Math.sin(tick * b.speed * 1000 + b.phase) * b.ax) * W
        const y = (b.cy + Math.cos(tick * b.speed * 800  + b.phase) * b.ay) * H
        const r = b.r * base

        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0,   `rgba(${b.rgb},${b.alpha})`)
        g.addColorStop(0.4, `rgba(${b.rgb},${b.alpha * 0.5})`)
        g.addColorStop(1,   `rgba(${b.rgb},0)`)

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      tick += 0.016
    }

    function loop() { animId = requestAnimationFrame(loop); draw() }

    resize()
    window.addEventListener('resize', resize)
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
}
