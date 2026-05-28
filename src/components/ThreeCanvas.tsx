'use client'

import { useEffect, useRef } from 'react'

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animId: number

    async function init() {
      const THREE = await import('three')
      const canvas = canvasRef.current
      if (!canvas) return

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.8, 1),
        new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, opacity: 0.18, transparent: true })
      )
      ico.position.set(3.5, 0, -1)
      scene.add(ico)

      const ico2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.2, 1),
        new THREE.MeshBasicMaterial({ color: 0x1a6b5a, wireframe: true, opacity: 0.12, transparent: true })
      )
      ico2.position.set(3.5, 0, -1)
      scene.add(ico2)

      const positions = new Float32Array(280 * 3)
      for (let i = 0; i < 280 * 3; i++) positions[i] = (Math.random() - 0.5) * 18
      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particles = new THREE.Points(
        particleGeo,
        new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.025, transparent: true, opacity: 0.5 })
      )
      scene.add(particles)

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.008, 8, 80),
        new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.1 })
      )
      torus.position.set(3.5, 0, -1)
      torus.rotation.x = Math.PI / 4
      scene.add(torus)

      let mouseX = 0, mouseY = 0
      const onMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4
      }
      document.addEventListener('mousemove', onMouse)

      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      let t = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.006
        ico.rotation.x = t * 0.3 + mouseY * 0.5
        ico.rotation.y = t * 0.5 + mouseX * 0.5
        ico2.rotation.x = -t * 0.4 + mouseY * 0.3
        ico2.rotation.y = -t * 0.3 + mouseX * 0.3
        torus.rotation.z = t * 0.2
        torus.rotation.y = mouseX * 0.3
        particles.rotation.y = t * 0.04
        particles.rotation.x = t * 0.02
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        document.removeEventListener('mousemove', onMouse)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        renderer.dispose()
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
