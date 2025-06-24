import { createFileRoute } from '@tanstack/react-router'
import MainWeather from '../components/MainWeather';

export const Route = createFileRoute('/ha')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = new URLSearchParams(window.location.search);
  const lon = params.get("lon");
  const lat = params.get("lat");

  if (!lon || !lat) {
    return <div>Error: Longitude and Latitude are required.</div>;
  }
  
  return <MainWeather
    lon={parseFloat(lon)}
    lat={parseFloat(lat)}
  />
}
