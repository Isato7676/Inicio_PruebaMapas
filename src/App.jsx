import { useState } from 'react';
import MapArea from './components/MapArea';
import QuestionPanel from './components/QuestionPanel';
import StartScreen from './components/StartScreen';
import L from 'leaflet';

function App() {
  const [started, setStarted] = useState(false);
  const [isMapActive, setIsMapActive] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [realPosition, setRealPosition] = useState(null);  // posición real
  const [isAnimating, setIsAnimating] = useState(false);

  const questionData = {
    question: '¿Dónde está la Torre Eiffel?',
    hint: 'Está en una ciudad europea famosa por el arte y el vino.',
    current: 1,
    total: 5
  };

  const handleMarkerPlaced = (position) => {
    setMarkerPosition(position);
  };

  const handleConfirm = () => {
    if (!markerPosition) return;
    setIsMapActive(false);
    setConfirmed(true);
    setIsAnimating(true);

    // ✅ Define directamente como L.LatLng
    const torreEiffel = L.latLng(48.8584, 2.2945);
    setRealPosition(torreEiffel);

    console.log('Respuesta confirmada. Mostrando posición real...');
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    console.log('Animación terminada');
  };

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div>
      <QuestionPanel
        question={questionData.question}
        hint={questionData.hint}
        current={questionData.current}
        total={questionData.total}
      />

      <MapArea
        isMapActive={!isAnimating && isMapActive}
        markerPosition={markerPosition}
        realPosition={realPosition}
        onMarkerPlaced={handleMarkerPlaced}
        isAnimating={isAnimating}
        onAnimationEnd={handleAnimationEnd}
      />

      <button
        onClick={handleConfirm}
        disabled={!markerPosition || confirmed}
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: markerPosition && !confirmed ? 'pointer' : 'not-allowed',
          opacity: markerPosition && !confirmed ? 1 : 0.5,
          zIndex: 1000
        }}
      >
        Confirmar respuesta
      </button>
    </div>
  );
}

export default App;
