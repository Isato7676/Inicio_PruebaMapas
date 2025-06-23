function QuestionPanel({ question, hint, current, total }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        zIndex: 1000,
        maxWidth: '90%',
        textAlign: 'center'
      }}
    >
      <h2 style={{ margin: '4px 0' }}>Pregunta {current} / {total}</h2>
      <p style={{ margin: '4px 0' }}><strong>{question}</strong></p>
      {hint && <p style={{ margin: '4px 0', fontStyle: 'italic' }}>Pista: {hint}</p>}
    </div>
  );
}

export default QuestionPanel;
