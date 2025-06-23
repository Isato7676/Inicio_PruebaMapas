function StartScreen({ onStart }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>GeoMark</h1>
      <p>Bienvenido al juego de geolocalización educativa.</p>
      <button
        onClick={onStart}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Iniciar partida
      </button>
    </div>
  );
}

export default StartScreen;
