import { useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

function CircleOverlay({ realPosition, markerPosition, shouldAnimate }) {
  const map = useMap();
  const [circleSize, setCircleSize] = useState(0);
  const [renderCircle, setRenderCircle] = useState(false);
  const requestRef = useRef();
  const startTimeRef = useRef();

  // Función para calcular distancia en km entre 2 puntos lat/lng
  const getDistanceInKm = (latlng1, latlng2) => {
    const R = 6371; // Radio Tierra en km
    const dLat = ((latlng2.lat - latlng1.lat) * Math.PI) / 180;
    const dLon = ((latlng2.lng - latlng1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((latlng1.lat * Math.PI) / 180) *
        Math.cos((latlng2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Devuelve color sólido según distancia en km
  const getColorByDistance = (km) => {
    if (km <= 500) return '#4A90E2'; // Azul claro
    if (km <= 1000) return '#7ED321'; // Verde claro
    if (km <= 5000) return '#F8E71C'; // Amarillo
    if (km <= 10000) return '#F5A623'; // Naranja
    return '#D0021B'; // Rojo oscuro
  };

  // Devuelve fondo translúcido según distancia
  const getBackgroundColorByDistance = (km) => {
    if (km <= 500) return 'rgba(74, 144, 226, 0.3)'; // Azul translúcido
    if (km <= 1000) return 'rgba(126, 211, 33, 0.3)'; // Verde translúcido
    if (km <= 5000) return 'rgba(248, 231, 28, 0.3)'; // Amarillo translúcido
    if (km <= 10000) return 'rgba(245, 166, 35, 0.3)'; // Naranja translúcido
    return 'rgba(208, 2, 27, 0.3)'; // Rojo translúcido
  };

  const distanceKm =
    markerPosition && realPosition
      ? getDistanceInKm(realPosition, markerPosition)
      : 0;

  useEffect(() => {
    if (!map || !realPosition || !markerPosition || !shouldAnimate) {
      setRenderCircle(false);
      setCircleSize(0);
      return;
    }

    const pCenter = map.latLngToContainerPoint(realPosition);
    const pMarker = map.latLngToContainerPoint(markerPosition);
    const maxRadius = pCenter.distanceTo(pMarker);

    if (isNaN(pCenter.x) || isNaN(pCenter.y) || isNaN(maxRadius)) {
      setRenderCircle(false);
      return;
    }

    setRenderCircle(true);
    setCircleSize(0);
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const duration = 1200;
      const progress = Math.min(elapsed / duration, 1);
      setCircleSize(maxRadius * progress);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
      setRenderCircle(false);
      setCircleSize(0);
    };
  }, [map, realPosition, markerPosition, shouldAnimate]);

  if (!renderCircle || circleSize === 0) return null;

  const pCenter = map.latLngToContainerPoint(realPosition);
  const color = getColorByDistance(distanceKm);
  const backgroundColor = getBackgroundColorByDistance(distanceKm);

  const style = {
    position: 'absolute',
    left: `${pCenter.x - circleSize}px`,
    top: `${pCenter.y - circleSize}px`,
    width: `${circleSize * 2}px`,
    height: `${circleSize * 2}px`,
    borderRadius: '50%',
    border: `3px solid ${color}`,
    backgroundColor,
    pointerEvents: 'none',
    zIndex: 9999,
  };

  return ReactDOM.createPortal(<div style={style} />, map.getContainer());
}

export default CircleOverlay;
