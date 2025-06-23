import { Circle } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

function AnimatedCircle({ realPosition, userPosition, onAnimationEnd }) {
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    if (!realPosition || !userPosition) return;

    const distance = realPosition.distanceTo(userPosition); // en metros

    const step = distance / 50; // divide la animación en 50 pasos
    let currentRadius = 0;

    const interval = setInterval(() => {
      currentRadius += step;
      if (currentRadius >= distance) {
        setRadius(distance);
        clearInterval(interval);
        if (onAnimationEnd) onAnimationEnd();
      } else {
        setRadius(currentRadius);
      }
    }, 30); // actualiza cada 30ms para animar

    return () => clearInterval(interval);
  }, [realPosition, userPosition, onAnimationEnd]);

  if (!realPosition) return null;

  return (
    <Circle
      center={realPosition}
      radius={radius}
      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
    />
  );
}
