import { Wind } from 'lucide-react'
import * as motion from 'motion/react-client'
import { useState } from 'react'
import type { CurrentWeather } from '../types/WeatherType'

export function WeatherWidget({ weather, Icon }: { weather: CurrentWeather | null, Icon?: React.ElementType }) {
  const [hovered, setHovered] = useState(false)

  if (!weather) {
    return <></>
  }

  return (
    <motion.div
      id="weather"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="absolute top-2 left-2 opacity-50 flex flex-col gap-1 text-white w-max select-none"
      animate={{ opacity: hovered ? 0.8 : 0.5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="text-sm"
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: hovered ? 1 : 0, 
          height: hovered ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className='flex items-center gap-1'>
          <Wind className='size-4'/> 
          {weather?.windspeed} km/h ({weather?.winddirection}°)
        </div>
      </motion.div>

      <div className="flex gap-1 items-center">
        {Icon && <Icon className="size-6" />}
        <span>{weather?.temperature}°C</span>
      </div>
    </motion.div>
  )
}
