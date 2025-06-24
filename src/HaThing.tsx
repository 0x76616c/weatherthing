/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
	hass: any;
	config: any;
};

export default function HaThing({ hass }: Props) {
	const lon = hass.states!['zone.home']!.attributes!.longitude;
	const lat = hass.states!['zone.home']!.attributes!.latitude;

	return (
		<iframe
			src={`http://10.0.5.192:5173/ha?lat=${lat}&lon=${lon}`}
			style={{
				border: 'none',
				width: '100%',
				height: '100%',
				minHeight: '400px',
			}}
		></iframe>
	);
}
