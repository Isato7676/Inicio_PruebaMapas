import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import CircleOverlay from './CircleOverlay';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

function ClickHandler({ onMarkerPlaced, isMapActive }) {
  useMapEvents({
    click(e) {
      if (isMapActive) {
        onMarkerPlaced(e.latlng);
      }
    },
  });
  return null;
}

function FitBounds({ positions, onZoomEnd }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) return;
    const bounds = L.latLngBounds(positions);
    map.flyToBounds(bounds, { padding: [50, 50], duration: 0.7 });

    const handler = () => {
      onZoomEnd();
      map.off('moveend', handler);
    };
    map.on('moveend', handler);

    return () => map.off('moveend', handler);
  }, [positions, map, onZoomEnd]);

  return null;
}

function MapArea({ isMapActive, markerPosition, realPosition, onMarkerPlaced }) {
  const [showLine, setShowLine] = useState(false);
  const [startCircleAnimation, setStartCircleAnimation] = useState(false);

  const positions = [];
  if (markerPosition) positions.push(markerPosition);
  if (realPosition) positions.push(realPosition);

  // Cuando cambian las posiciones, reseteamos animación y línea
  useEffect(() => {
    setShowLine(false);
    setStartCircleAnimation(false);
  }, [markerPosition, realPosition]);

  const handleZoomEnd = () => {
    setShowLine(true);
    setTimeout(() => {
      setStartCircleAnimation(true);
    }, 300); // espera breve para evitar problemas visuales
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={isMapActive}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ClickHandler onMarkerPlaced={onMarkerPlaced} isMapActive={isMapActive} />
        {markerPosition && <Marker position={markerPosition} />}
        {realPosition && <Marker position={realPosition} />}
        {positions.length > 1 && (
          <FitBounds positions={positions} onZoomEnd={handleZoomEnd} />
        )}
        {showLine && markerPosition && realPosition && (
          <Polyline positions={[markerPosition, realPosition]} color="blue" />
        )}
        {/* El círculo solo se muestra cuando empieza la animación */}
        {startCircleAnimation && realPosition && markerPosition && (
          <CircleOverlay
            realPosition={realPosition}
            markerPosition={markerPosition}
            shouldAnimate={startCircleAnimation}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapArea;
