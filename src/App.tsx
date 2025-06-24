import { getRainIntensity, weatherCodeMap } from './types/WeatherType';
import { WeatherWidget } from './components/WeatherWidget';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { LightningLayer } from './components/LightningLayer';
import { SnowCanvas } from './components/SnowCanvas';
import { StarsCanvas } from './components/StarsCanvas';
import { CozyWidget } from './components/CozyWidget';
import WeatherAudio from './components/WeatherAudio';
import { useWeather } from './hooks/weather';

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

	// TODO: use loading property
	const {
		weather,
		timeTheme,
		bgTheme,
		Icon,
		rainIntensity,
		showLightning,
		showFog,
		snowIntensity,
		windSpeed,
		windVector,
	} = useWeather({
		lat: location.lat, // or props.lat
		lon: location.lon, // or props.lon
		customCode: customWeatherCode, // or props.customCode
	});

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
