/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';

interface WeatherAudioProps {
	type: 'inside' | 'outside';
}

const soundGroups = {
	inside: ['/in1.opus'],
	outside: ['/out1.opus', '/out2.opus'],
	umbrella: ['/umbrella1.opus', '/umbrella2.opus'],
};

const combinations = {
	inside: [{ group: 'inside', volume: 1.0 }],
	outside: [
		{ group: 'outside', volume: 0.6 },
		{ group: 'umbrella', volume: 1.5 },
	],
};

function getRandomFromArray<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export default function WeatherAudio(props: WeatherAudioProps) {
	const [enabled, setEnabled] = useState(true);
	const [masterVolume, setMasterVolume] = useState(1.0);
	const audioContextRef = useRef<AudioContext | null>(null);
	const masterGainRef = useRef<GainNode | null>(null);
	const oscGainRef = useRef<GainNode | null>(null);
	const sourcesRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode }[]>([]);
	const oscIntervalRef = useRef<number | null>(null);

	// Helper to load and decode audio buffer
	const fetchAudioBuffer = async (ctx: AudioContext, url: string) => {
		const res = await fetch(url);
		const arrayBuffer = await res.arrayBuffer();
		return await ctx.decodeAudioData(arrayBuffer);
	};

	useEffect(() => {
		if (!enabled) {
			// Stop all sources and close context
			sourcesRef.current.forEach(({ source }) => {
				try {
					source.stop();
				} catch {}
			});
			sourcesRef.current = [];
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
			masterGainRef.current = null;
			oscGainRef.current = null;
			if (oscIntervalRef.current) {
				clearInterval(oscIntervalRef.current);
				oscIntervalRef.current = null;
			}
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
		audioContextRef.current = ctx;

		const masterGain = ctx.createGain();
		masterGain.gain.value = masterVolume;
		masterGainRef.current = masterGain;

		const oscGain = ctx.createGain();
		oscGain.gain.value = 1.0;
		oscGainRef.current = oscGain;

		// Chain: sources -> masterGain -> oscGain -> destination
		masterGain.connect(oscGain).connect(ctx.destination);

		let stopped = false;

		const playSounds = async () => {
			const combo = combinations[props.type];
			const buffers: { buffer: AudioBuffer; volume: number }[] = [];

			for (const { group, volume } of combo) {
				const files = soundGroups[group as keyof typeof soundGroups];
				const file = getRandomFromArray(files);
				const buffer = await fetchAudioBuffer(ctx, file);
				buffers.push({ buffer, volume });
			}

			if (stopped) return;

			buffers.forEach(({ buffer, volume }) => {
				const source = ctx.createBufferSource();
				source.buffer = buffer;
				source.loop = true;

				const gain = ctx.createGain();
				gain.gain.value = volume;

				source.connect(gain).connect(masterGain);

				source.start(0);

				sourcesRef.current.push({ source, gain });
			});
		};

		playSounds();

		// Oscillating gain logic
		let currentTarget = 1.0;
		// @ts-expect-error idk whys this here
		let lastValue = 1.0;
		const min = 0.85;
		const max = 1.1;
		const stepDuration = 2000 + Math.random() * 2000; // 2-4 seconds per oscillation

		function setNextTarget() {
			currentTarget = min + Math.random() * (max - min);
		}
		setNextTarget();

		oscIntervalRef.current = window.setInterval(() => {
			if (!oscGainRef.current) return;
			// Smoothly approach the target
			const now = ctx.currentTime;
			const gainNode = oscGainRef.current;
			gainNode.gain.cancelScheduledValues(now);
			gainNode.gain.setValueAtTime(gainNode.gain.value, now);
			gainNode.gain.linearRampToValueAtTime(currentTarget, now + stepDuration / 1000);

			lastValue = currentTarget;
			setNextTarget();
		}, stepDuration);

		return () => {
			stopped = true;
			sourcesRef.current.forEach(({ source }) => {
				try {
					source.stop();
				} catch {}
			});
			sourcesRef.current = [];
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
			masterGainRef.current = null;
			oscGainRef.current = null;
			if (oscIntervalRef.current) {
				clearInterval(oscIntervalRef.current);
				oscIntervalRef.current = null;
			}
		};
	}, [enabled, props.type]);

	// Update master gain value when masterVolume changes
	useEffect(() => {
		if (masterGainRef.current) {
			masterGainRef.current.gain.value = masterVolume;
		}
	}, [masterVolume]);

	return (
		<div>
			<button onClick={() => setEnabled((e) => !e)}>{enabled ? 'Mute' : 'Unmute'}</button>
			<div>
				<label>
					Master Volume:&nbsp;
					<input
						type="range"
						min={0}
						max={2}
						step={0.01}
						value={masterVolume}
						onChange={(e) => setMasterVolume(Number(e.target.value))}
					/>
					&nbsp;{masterVolume.toFixed(2)}
				</label>
			</div>
			{/* Optionally, add volume sliders here */}
		</div>
	);
}
