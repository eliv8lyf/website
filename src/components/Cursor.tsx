'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ mx: -100, my: -100, rx: -100, ry: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
    }
    document.addEventListener('mousemove', onMove)

    const animate = () => {
      const { mx, my } = pos.current
      let { rx, ry } = pos.current
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px'
        cursorRef.current.style.top = my + 'px'
      }
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      pos.current.rx = rx
      pos.current.ry = ry
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px'
        ringRef.current.style.top = ry + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const grow = () => {
      if (cursorRef.current) { cursorRef.current.style.width = '14px'; cursorRef.current.style.height = '14px' }
      if (ringRef.current) { ringRef.current.style.width = '52px'; ringRef.current.style.height = '52px'; ringRef.current.style.opacity = '1' }
    }
    const shrink = () => {
      if (cursorRef.current) { cursorRef.current.style.width = '8px'; cursorRef.current.style.height = '8px' }
      if (ringRef.current) { ringRef.current.style.width = '36px'; ringRef.current.style.height = '36px'; ringRef.current.style.opacity = '0.6' }
    }
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-gold rounded-full pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%,-50%)', transition: 'width 0.3s, height 0.3s' }}
      />
      <div
        ref={ringRef}
        className="fixed w-9 h-9 border border-gold rounded-full pointer-events-none z-[9998] opacity-60"
        style={{ transform: 'translate(-50%,-50%)', transition: 'width 0.3s, height 0.3s, opacity 0.3s' }}
      />
    </>
  )
}
