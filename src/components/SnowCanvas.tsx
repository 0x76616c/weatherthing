import { useEffect, useRef } from 'react'

type SnowIntensity = 'none' | 'light' | 'moderate' | 'heavy'

interface SnowCanvasProps {
  snowIntensity?: SnowIntensity
  wind?: { x: number, y: number }
  windSpeed?: number
}

export function SnowCanvas({
  snowIntensity = 'none',
  wind = { x: 0, y: 0 },
  windSpeed = 0,
}: SnowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const flakeCount = {
      none: 0,
      light: 60,
      moderate: 120,
      heavy: 250,
    }[snowIntensity]

    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 1,
      speedY: Math.random() * 0.5 + 0.3,
      drift: Math.random() * 0.5 - 0.25,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      for (const flake of flakes) {
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fill()

        flake.y += flake.speedY
        const windDrift = wind.x * windSpeed * 0.05
        flake.x += flake.drift + windDrift

        if (flake.y > height) flake.y = -flake.radius
        if (flake.x < 0) flake.x = width
        if (flake.x > width) flake.x = 0
      }

      requestAnimationFrame(draw)
    }

    draw()

    return () => window.removeEventListener('resize', resize)
  }, [snowIntensity, wind.x, wind.y, windSpeed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none"
    />
  )
}
