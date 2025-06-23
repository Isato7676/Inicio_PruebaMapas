import { useState } from 'react';
import GameHeader from './GameHeader';
import QuestionPanel from './QuestionPanel';
import MapArea from './MapArea';
import InfoPanel from './InfoPanel';
import ResultPanel from './ResultPanel';

function GameScreen({ levelData }) {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <div className="game-screen">
      {!gameStarted ? (
        <div className="level-start">
          <h2>Comenzando nivel: {levelData.title}</h2>
          <p>Preguntas: {levelData.totalQuestions}</p>
          <p>Puntos necesarios: {levelData.minPoints}</p>
          <button onClick={handleStart}>Iniciar nivel</button>
        </div>
      ) : (
        <>
          <GameHeader levelData={levelData} />
          <QuestionPanel />
          <MapArea />
          <InfoPanel />
          <ResultPanel />
        </>
      )}
    </div>
  );
}

export default GameScreen;
