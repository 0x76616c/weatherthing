import {
  Sun,
  Cloud,
  CloudFog,
  CloudRain,
  Snowflake,
  CloudLightning,
} from 'lucide-react'

export const WeatherType = {
  Clear: 'clear',
  Cloudy: 'cloudy',
  Fog: 'fog',
  Rain: 'rain',
  Snow: 'snow',
  Thunder: 'thunder',
} as const;

export type WeatherType = typeof WeatherType[keyof typeof WeatherType];

export const weatherCodeMap: Record<number, WeatherType> = {
  // clear & cloudy
  0: WeatherType.Clear,
  1: WeatherType.Clear,
  2: WeatherType.Cloudy,
  3: WeatherType.Cloudy,

  // fog
  45: WeatherType.Fog,
  48: WeatherType.Fog,

  // rain (includes drizzle + freezing rain + rain showers)
  51: WeatherType.Rain,
  53: WeatherType.Rain,
  55: WeatherType.Rain,
  56: WeatherType.Rain,
  57: WeatherType.Rain,
  61: WeatherType.Rain,
  63: WeatherType.Rain,
  65: WeatherType.Rain,
  66: WeatherType.Rain,
  67: WeatherType.Rain,
  80: WeatherType.Rain,
  81: WeatherType.Rain,
  82: WeatherType.Rain,

  // snow (includes snow grains & snow showers)
  71: WeatherType.Snow,
  73: WeatherType.Snow,
  75: WeatherType.Snow,
  77: WeatherType.Snow,
  85: WeatherType.Snow,
  86: WeatherType.Snow,

  // thunder
  95: WeatherType.Thunder,
  96: WeatherType.Thunder,
  99: WeatherType.Thunder,
}

export const weatherIconMap: Record<WeatherType, React.ComponentType<{ className?: string }>> = {
  [WeatherType.Clear]: Sun,
  [WeatherType.Cloudy]: Cloud,
  [WeatherType.Fog]: CloudFog,
  [WeatherType.Rain]: CloudRain,
  [WeatherType.Snow]: Snowflake,
  [WeatherType.Thunder]: CloudLightning,
}

export type RainIntensity = 'none' | 'light' | 'moderate' | 'heavy'

export function getRainIntensity(code: number): RainIntensity {
  if ([51, 53, 56, 61, 80].includes(code)) return 'light'
  if ([55, 63, 81].includes(code)) return 'moderate'
  if ([65, 67, 82, 95, 96, 99].includes(code)) return 'heavy'
  return 'none'
}

export type CurrentWeather = {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
};

export function isThunder(code: number) {
  return [95, 96, 99].includes(code)
}

export function isCloudy(code: number) {
  return [2, 3].includes(code) // overcast or cloudy
}

export function isFog(code: number) {
  return [45, 48].includes(code) // fog
}

type SnowIntensity = 'none' | 'light' | 'moderate' | 'heavy'

export function getSnowIntensity(code: number): SnowIntensity {
  if ([71, 73, 77].includes(code)) return 'light'
  if ([75, 85].includes(code)) return 'moderate'
  if ([86].includes(code)) return 'heavy'
  return 'none'
}
