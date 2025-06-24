import { Sun, Cloud, CloudFog, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

export const WeatherType = {
	Clear: 'clear',
	Cloudy: 'cloudy',
	Fog: 'fog',
	Rain: 'rain',
	Snow: 'snow',
	Thunder: 'thunder',
} as const;

export type WeatherType = (typeof WeatherType)[keyof typeof WeatherType];

export type Intensity = 'none' | 'light' | 'moderate' | 'heavy';

export type CurrentWeather = {
	time: string;
	interval: number;
	temperature: number;
	windspeed: number;
	winddirection: number;
	is_day: number;
	weathercode: number;
};

export type WeatherIcon = React.ComponentType<{ className?: string }>;

// Weather code mappings with better organization
export const weatherCodeMap: Record<number, WeatherType> = {
	// clear sky
	0: WeatherType.Clear,
	1: WeatherType.Clear,

	// cloudy
	2: WeatherType.Cloudy,
	3: WeatherType.Cloudy,

	// fog
	45: WeatherType.Fog,
	48: WeatherType.Fog,

	// rain (drizzle, freezing rain, rain showers)
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

	// snow (snow grains, snow showers)
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
} as const;

export const weatherIconMap: Record<WeatherType, WeatherIcon> = {
	[WeatherType.Clear]: Sun,
	[WeatherType.Cloudy]: Cloud,
	[WeatherType.Fog]: CloudFog,
	[WeatherType.Rain]: CloudRain,
	[WeatherType.Snow]: Snowflake,
	[WeatherType.Thunder]: CloudLightning,
} as const;

// Weather condition checkers
export const isThunder = (code: number): boolean => {
	return [95, 96, 99].includes(code);
};

export const isCloudy = (code: number): boolean => {
	return [2, 3].includes(code);
};

export const isFog = (code: number): boolean => {
	return [45, 48].includes(code);
};

// Intensity getters with proper type safety
export const getRainIntensity = (code: number): Intensity => {
	if ([51, 53, 56, 61, 80, 66].includes(code)) return 'light';
	if ([55, 63, 81].includes(code)) return 'moderate';
	if ([65, 67, 82, 95, 96, 99].includes(code)) return 'heavy';
	return 'none';
};

export const getSnowIntensity = (code: number): Intensity => {
	if ([71, 73, 77].includes(code)) return 'light';
	if ([75, 85].includes(code)) return 'moderate';
	if ([86].includes(code)) return 'heavy';
	return 'none';
};

// Helper function to get weather type from code
export const getWeatherType = (code: number): WeatherType => {
	return weatherCodeMap[code] ?? WeatherType.Clear;
};

// Helper function to get weather icon from code
export const getWeatherIcon = (code: number): WeatherIcon => {
	const weatherType = getWeatherType(code);
	return weatherIconMap[weatherType];
};
