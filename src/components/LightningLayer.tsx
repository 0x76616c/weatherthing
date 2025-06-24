import { useEffect, useState } from 'react'

type Flash = {
  id: number
  opacity: number
  duration: number
}

export function LightningLayer() {
  const [flash, setFlash] = useState<Flash | null>(null)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) return
    let id = 0
    let timeout: number

    const scheduleNext = () => {
      timeout = window.setTimeout(() => {
        runFlashSequence()
        scheduleNext()
      }, Math.random() * 8000 + 4000) // wait 4–12s
    }

    const runFlashSequence = () => {
      const sequence = [
        { opacity: 0.8, duration: 120 },
        ...(Math.random() > 0.5
          ? [{ opacity: 0.4, duration: 80 }, { opacity: 0.3, duration: 60 }]
          : []),
      ]

      let totalDelay = 0

      sequence.forEach(({ opacity, duration }) => {
        setTimeout(() => {
          const flashId = id++
          setFlash({ id: flashId, opacity, duration })
          setTimeout(() => {
            setFlash(null)
          }, duration)
        }, totalDelay)

        totalDelay += duration + 80 // padding between flickers
      })
    }

    scheduleNext()
    return () => clearTimeout(timeout)
  }, [prefersReduced])

  if (!flash) return null

  return (
    <div
      key={flash.id}
      className="fixed inset-0 bg-white pointer-events-none transition-opacity -z-40"
      style={{
        opacity: flash.opacity,
        transitionDuration: `${flash.duration}ms`,
      }}
    />
  )
}
