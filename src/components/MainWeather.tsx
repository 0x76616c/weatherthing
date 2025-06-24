/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getTimeTheme, gradientThemes, type TimeTheme } from '../types/TimeType';
import {
	getRainIntensity,
	getSnowIntensity,
	isFog,
	isThunder,
	weatherCodeMap,
	weatherIconMap,
	type CurrentWeather,
} from '../types/WeatherType';
import { BackgroundCanvas } from './BackgroundCanvas';
import { LightningLayer } from './LightningLayer';
import { SnowCanvas } from './SnowCanvas';
import { StarsCanvas } from './StarsCanvas';
import { CozyWidget } from './CozyWidget';

type Props = {
	lat: number;
	lon: number;
	customCode?: number;
};

export default function MainWeather(props: Props) {
	const [weather, setWeather] = useState<CurrentWeather>();
	const [timeTheme, setTimeTheme] = useState<TimeTheme>('night');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`https://api.open-meteo.com/v1/forecast?latitude=${props.lat}&longitude=${props.lon}&current_weather=true`)
			.then((res) => res.json())
			.then((data) => {
				console.log('Weather data:', data);
				setWeather(data.current_weather);

				if (typeof props.customCode === 'number') {
					data.current_weather.weathercode = props.customCode;
				}

				const localHour = new Date().getHours();
				setTimeTheme(getTimeTheme(localHour));
				setLoading(false);
			})
			.catch((error) => {
				console.error('Weather fetch error:', error);
				setLoading(false);
			});
	}, [props.lat, props.lon, props.customCode]);

	const bgTheme = loading ? gradientThemes.night : gradientThemes[timeTheme];

	const rainIntensity = weather ? getRainIntensity(weather.weathercode) : 'none';

	const showLightning = weather ? isThunder(weather.weathercode) : false;

	const showFog = weather ? isFog(weather.weathercode) : false;

	const snowIntensity = weather ? getSnowIntensity(weather.weathercode) : 'none';

	const windSpeed = weather ? weather.windspeed : 0;

	const windDeg = weather ? weather.winddirection : 0;

	// shoutout chatgpt 4o 🔥
	const windVector = {
		x: Math.cos((windDeg * Math.PI) / 180),
		y: Math.sin((windDeg * Math.PI) / 180),
	};

	return (
		<>
			<div
				className={`
          fixed inset-0 -z-50
          bg-gradient-to-br
          ${bgTheme}
          bg-[length:300%_300%]
          animate-gradient-xy
          pointer-events-none
        `}
			/>

			{rainIntensity === 'heavy' && (
				<div className="fixed inset-0 -z-40 bg-black/40 transition-opacity duration-500 pointer-events-none" />
			)}

			{snowIntensity !== 'none' && <SnowCanvas snowIntensity={snowIntensity} wind={windVector} windSpeed={windSpeed} />}

			{showFog && (
				<div className="fixed inset-0 -z-45 backdrop-blur-[2px] bg-white/5 transition-opacity duration-700 pointer-events-none" />
			)}

			{showLightning && <LightningLayer />}

			{timeTheme === 'night' && !showFog && !showLightning && snowIntensity === 'none' && <StarsCanvas />}

			<BackgroundCanvas rainIntensity={rainIntensity} wind={windVector} windSpeed={windSpeed} />

			<CozyWidget weather={weather ?? undefined} />
		</>
	);
}
