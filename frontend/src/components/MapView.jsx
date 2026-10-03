import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix Leaflet's default marker icons not loading under webpack/CRA bundling.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Maps are powered by Leaflet + OpenStreetMap — no API key or billing required.
export const hasMaps = true;

// Pass-through so existing <MapsProvider> usage in App.js keeps working (Leaflet needs no provider).
export const MapsProvider = ({ children }) => children;

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Free geocoding via OpenStreetMap Nominatim (no key). Returns { lat, lng } or null.
export async function geocode(address) {
  if (!address) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fr&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data?.[0];
    return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
  } catch {
    return null;
  }
}

export const MapView = ({ center, markers = [], zoom = 13, className = 'h-64 sm:h-80', testId = 'map-view' }) => {
  if (!center || center.lat == null || center.lng == null) return null;
  return (
    <div data-testid={testId} className={`rantau-map overflow-hidden rounded-xl ring-1 ring-line ${className}`}>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={OSM_URL} attribution={OSM_ATTRIBUTION} />
        {markers.map((m, i) => (
          <Marker key={`${m.lat}-${m.lng}-${i}`} position={[m.lat, m.lng]}>
            {m.title && <Popup>{m.title}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
