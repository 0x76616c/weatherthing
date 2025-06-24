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

type UseWeatherParams = {
	lat: number | string;
	lon: number | string;
	customCode?: number;
};

export function useWeather({ lat, lon, customCode }: UseWeatherParams) {
	const [weather, setWeather] = useState<CurrentWeather>();
	const [timeTheme, setTimeTheme] = useState<TimeTheme>('night');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
			.then((res) => res.json())
			.then((data) => {
				setWeather(data.current_weather);

				if (typeof customCode === 'number') {
					data.current_weather.weathercode = customCode;
				}

				const localHour = new Date().getHours();
				setTimeTheme(getTimeTheme(localHour));
				setLoading(false);
			})
			.catch((error) => {
				console.error('Weather fetch error:', error);
				setLoading(false);
			});
	}, [lat, lon, customCode]);

	const bgTheme = loading ? gradientThemes.night : gradientThemes[timeTheme];

	const Icon = weather ? weatherIconMap[weatherCodeMap[weather.weathercode]] : null;

	const rainIntensity = weather ? getRainIntensity(weather.weathercode) : 'none';

	const showLightning = weather ? isThunder(weather.weathercode) : false;

	const showFog = weather ? isFog(weather.weathercode) : false;

	const snowIntensity = weather ? getSnowIntensity(weather.weathercode) : 'none';

	const windSpeed = weather ? weather.windspeed : 0;

	const windDeg = weather ? weather.winddirection : 0;

	const windVector = {
		x: Math.cos((windDeg * Math.PI) / 180),
		y: Math.sin((windDeg * Math.PI) / 180),
	};

	return {
		weather,
		timeTheme,
		loading,
		bgTheme,
		Icon,
		rainIntensity,
		showLightning,
		showFog,
		snowIntensity,
		windSpeed,
		windDeg,
		windVector,
	};
}
