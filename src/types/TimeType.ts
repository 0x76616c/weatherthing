export type TimeTheme = 'dawn' | 'day' | 'dusk' | 'night';

export function getTimeTheme(hour: number): TimeTheme {
	if (hour >= 5 && hour < 8) return 'dawn';
	if (hour >= 8 && hour < 18) return 'day';
	if (hour >= 18 && hour < 21) return 'dusk';
	return 'night';
}

export const gradientThemes: Record<TimeTheme, string> = {
	dawn: 'from-[#301c1c] via-[#4a2e2e] to-[#2c1a1a]', // dark warm red/orange
	day: 'from-[#1d3340] via-[#2c4a5a] to-[#1a2e38]', // deep blue/teal
	dusk: 'from-[#321a2d] via-[#402444] to-[#1c1020]', // moody purple
	night: 'from-[#0f0f1a] via-[#12121f] to-[#1a1a2b]', // nearly black
};
