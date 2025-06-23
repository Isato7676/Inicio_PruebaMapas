function GameHeader({ levelData }) {
  return (
    <div className="game-header">
      <h2>{levelData.title}</h2>
      <p>Progreso y puntos aparecerán aquí</p>
    </div>
  );
}
export default GameHeader;
