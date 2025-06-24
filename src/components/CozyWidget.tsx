import { useEffect, useState } from 'react';
import { weatherCodeMap, weatherIconMap, type CurrentWeather } from '../types/WeatherType';

export function CozyWidget({ weather }: { weather?: CurrentWeather }) {
	const Icon = weather ? weatherIconMap[weatherCodeMap[weather.weathercode]] : null;

	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

	return (
		<div className="absolute inset-0 flex items-center justify-center text-white select-none">
			<div className="flex flex-col items-center text-center gap-2 bg-black/40 p-6 rounded-xl backdrop-blur-sm shadow-lg">
				<div className="text-5xl font-mono">{timeString}</div>
				<div className="text-sm opacity-80">{dateString}</div>
				{weather && (
					<div className="flex items-center gap-2 text-lg mt-2">
						{Icon && <Icon className="size-6" />}
						<span>
							{weather.temperature}°C — {weatherCodeMap[weather.weathercode]}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
