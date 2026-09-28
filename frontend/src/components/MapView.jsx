import { createContext, useContext } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
export const hasMaps = !!KEY;

const MapsContext = createContext({ isLoaded: false });

const Loader = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({ id: 'rantau-gmaps', googleMapsApiKey: KEY });
  return <MapsContext.Provider value={{ isLoaded: isLoaded && !loadError, loadError }}>{children}</MapsContext.Provider>;
};

export const MapsProvider = ({ children }) => (hasMaps ? <Loader>{children}</Loader> : children);

export const useMaps = () => useContext(MapsContext);

export async function geocode(address) {
  if (!hasMaps || !window.google?.maps?.Geocoder) return null;
  try {
    const { results } = await new window.google.maps.Geocoder().geocode({ address, region: 'fr' });
    const loc = results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat(), lng: loc.lng() } : null;
  } catch {
    return null;
  }
}

const OPTIONS = { disableDefaultUI: true, zoomControl: true, clickableIcons: false };

export const MapView = ({ center, markers = [], zoom = 13, className = 'h-64 sm:h-80', testId = 'map-view' }) => {
  const { isLoaded, loadError } = useMaps();
  if (!hasMaps) return null;
  if (loadError) return <p data-testid="map-error" className="text-sm text-ink-muted">Map couldn't load — check the Google Maps API key.</p>;
  if (!isLoaded) return <div className={`skeleton rounded-xl ${className}`} data-testid="map-loading" />;
  return (
    <div data-testid={testId} className={`overflow-hidden rounded-xl ring-1 ring-line ${className}`}>
      <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={zoom} options={OPTIONS}>
        {markers.map((m, i) => <MarkerF key={`${m.lat}-${m.lng}-${i}`} position={{ lat: m.lat, lng: m.lng }} title={m.title} />)}
      </GoogleMap>
    </div>
  );
};
