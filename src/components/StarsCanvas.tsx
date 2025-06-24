import { useEffect, useRef, useState } from 'react'

export function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visibleStars, setVisibleStars] = useState(140)

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
      initStars()
    }
    window.addEventListener('resize', resize)

    let stars: {
      x: number
      y: number
      radius: number
      baseAlpha: number
      twinkle: boolean
      satellite: boolean
      vx: number
    }[] = []

    const initStars = () => {
      stars = Array.from({ length: 140 }, () => {
        const satellite = Math.random() < 0.015
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.5,
          baseAlpha: Math.random() * 0.7 + 0.3,
          twinkle: Math.random() < 0.1,
          satellite,
          vx: satellite ? (Math.random() * 0.2 + 0.05) : 0,
        }
      })
    }

    initStars()

    const fading = true
    const fadeTimer = setInterval(() => {
      setVisibleStars(prev => {
        if (prev > 14) return prev - 2
        clearInterval(fadeTimer)
        return prev
      })
    }, 1000)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      stars.forEach((star, i) => {
        if (i >= visibleStars && !star.twinkle && !star.satellite) return

        let alpha = star.baseAlpha

        if (star.twinkle) {
          alpha *= 0.8 + Math.sin(Date.now() * 0.002 + star.x) * 0.2
        }

        if (star.satellite) {
          star.x += star.vx
          if (star.x > width + 50) star.x = -50
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      clearInterval(fadeTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none"
    />
  )
}
