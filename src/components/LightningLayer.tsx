import { useEffect, useState } from 'react';

type Flash = {
	id: number;
	opacity: number;
	duration: number;
	color: string;
};

export function LightningLayer() {
	const [flash, setFlash] = useState<Flash | null>(null);
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	useEffect(() => {
		if (prefersReduced) return;
		let id = 0;
		let timeout: number;

		const scheduleNext = () => {
			timeout = window.setTimeout(
				() => {
					runFlashSequence();
					scheduleNext();
				},
				Math.random() * 8000 + 4000,
			); // wait 4–12s
		};

		const runFlashSequence = () => {
			const flickers = Math.floor(Math.random() * 2) + 2; // 2–3 flickers
			let totalDelay = 0;

			for (let i = 0; i < flickers; i++) {
				const opacity = 0.7 + Math.random() * 0.3; // 0.7–1.0
				const duration = 40 + Math.random() * 60; // 40–100ms
				const color = `rgba(${220 + Math.random() * 35},${220 + Math.random() * 35},255,1)`; // somethingish-white

				setTimeout(() => {
					const flashId = id++;
					setFlash({ id: flashId, opacity, duration, color });
					setTimeout(() => {
						setFlash(null);
					}, duration);
				}, totalDelay);

				totalDelay += duration + 40 + Math.random() * 40; // random gap
			}

			// afterglow
			setTimeout(() => {
				const flashId = id++;
				setFlash({ id: flashId, opacity: 0.15, duration: 300, color: 'rgba(200,220,255,1)' });
				setTimeout(() => setFlash(null), 300);
			}, totalDelay);
		};

		scheduleNext();
		return () => clearTimeout(timeout);
	}, [prefersReduced]);

	if (!flash) return null;

	return (
		<div
			key={flash.id}
			className="fixed inset-0 pointer-events-none transition-opacity -z-40"
			style={{
				background: flash.color,
				opacity: flash.opacity,
				transition: `opacity ${flash.duration}ms linear`,
			}}
		/>
	);
}
