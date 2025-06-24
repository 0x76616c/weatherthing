import { useRef, useEffect } from "react"
interface BackgroundCanvasProps {
  rainIntensity?: 'none' | 'light' | 'moderate' | 'heavy'
  wind?: { x: number, y: number }
  windSpeed?: number
}
export function BackgroundCanvas({
  rainIntensity = 'none', 
  wind = { x: 0, y: 0 },
  windSpeed = 0, 
}: BackgroundCanvasProps) {
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

    // drop count/speed per intensity
    const dropCount = {
      none: 0,
      light: 80,
      moderate: 200,
      heavy: 400,
    }[rainIntensity]

    const dropSpeed = {
      none: 0,
      light: 2,
      moderate: 4,
      heavy: 6,
    }[rainIntensity]

    // generate drops
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * dropSpeed + 1,
    }))

    const draw = () => {
      const windPush = wind.x * windSpeed * 0.07
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(173,216,230,0.2)'
      ctx.lineWidth = 1

      for (const drop of drops) {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed
        drop.x += windPush

        if (drop.y > height) {
          drop.y = -drop.length
          drop.x = Math.random() * width
        }
      }

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [rainIntensity, wind.x, wind.y, windSpeed]) // re-run if intensity changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none"
    />
  )
}
