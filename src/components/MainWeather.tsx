/* eslint-disable @typescript-eslint/no-explicit-any */
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
	const {
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
	} = useWeather({
		lat: props.lat,
		lon: props.lon,
		customCode: props.customCode,
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

			<CozyWidget weather={weather ?? undefined} />
		</>
	);
}
