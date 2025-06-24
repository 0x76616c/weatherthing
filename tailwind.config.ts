import { type Config } from 'tailwindcss';

const config: Config = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			animation: {
				'gradient-xy': 'gradient-xy 30s ease infinite',
			},
			keyframes: {
				'gradient-xy': {
					'0%, 100%': { backgroundPosition: '0% 0%' },
					'50%': { backgroundPosition: '100% 100%' },
				},
			},
		},
	},
	plugins: [],
};

export default config;
