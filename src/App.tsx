/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import './App.css';
import { getTimeTheme, gradientThemes, type TimeTheme } from './types/TimeType';
import {
	getRainIntensity,
	getSnowIntensity,
	isFog,
	isThunder,
	weatherCodeMap,
	weatherIconMap,
	type CurrentWeather,
} from './types/WeatherType';
import { WeatherWidget } from './components/WeatherWidget';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { LightningLayer } from './components/LightningLayer';
import { SnowCanvas } from './components/SnowCanvas';
import { StarsCanvas } from './components/StarsCanvas';
import { CozyWidget } from './components/CozyWidget';
import WeatherAudio from './components/WeatherAudio';

function App() {
	const params = new URLSearchParams(window.location.search);
	const cozyMode = params.get('cozy');
	const userLat = params.get('lat');
	const userLon = params.get('lon');
	const customWeatherCode = params.get('customCode') ? parseInt(params.get('customCode') ?? '0', 10) : undefined;

	const location = {
		lat: userLat ?? '21',
		lon: userLon ?? '37',
	};
	console.log('Location:', location);
	const [weather, setWeather] = useState<CurrentWeather>();
	const [timeTheme, setTimeTheme] = useState<TimeTheme>('night');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`,
		)
			.then((res) => res.json())
			.then((data) => {
				setWeather(data.current_weather);

				if (typeof customWeatherCode === 'number') {
					data.current_weather.weathercode = customWeatherCode;
				}

				const localHour = new Date().getHours();
				setTimeTheme(getTimeTheme(localHour));
				setLoading(false);
			})
			.catch((error) => {
				console.error('Weather fetch error:', error);
				setLoading(false);
			});
	}, [customWeatherCode, location.lat, location.lon]);

	const bgTheme = loading ? gradientThemes.night : gradientThemes[timeTheme];

	const Icon = weather ? weatherIconMap[weatherCodeMap[weather.weathercode]] : null;

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

			{cozyMode ? (
				<CozyWidget weather={weather ?? undefined} />
			) : (
				<div className="relative w-screen h-screen flex items-center justify-center text-white">
					<div className="p-4 max-w-md">
						<pre className="text-xs bg-black/30 rounded p-2">{JSON.stringify(weather, null, 2)}</pre>
						<p className="mt-2">Weather type: {weather ? weatherCodeMap[weather.weathercode] : 'Loading...'}</p>
						<p className="mt-2">Rain Intensity: {weather ? getRainIntensity(weather.weathercode) : 'Loading...'}</p>
					</div>
					<WeatherWidget weather={weather ?? null} Icon={Icon ?? undefined} />
					<WeatherAudio type="inside" />
				</div>
			)}
		</>
	);
}

export default App;
