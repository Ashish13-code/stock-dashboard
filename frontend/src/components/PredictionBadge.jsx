export default function PredictionBadge({ prediction, lastPrice, isModelTrained }) {
  const change = lastPrice ? ((prediction - lastPrice) / lastPrice * 100).toFixed(2) : 0;
  const isPositive = change >= 0;

  return (
    <div style={{
      border: '2px solid #f59e0b', borderRadius: '12px',
      padding: '20px', backgroundColor: '#fffbeb', marginBottom: '16px'
    }}>
      <h3 style={{ margin: '0 0 8px', color: '#92400e', fontSize: '14px' }}>
        LSTM Prediction — Next Day
      </h3>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>
        ${prediction?.toFixed(2)}
      </div>
      <div style={{
        marginTop: '8px', fontSize: '16px', fontWeight: '600',
        color: isPositive ? '#16a34a' : '#dc2626'
      }}>
        {isPositive ? '▲' : '▼'} {Math.abs(change)}% from last price
      </div>
      {!isModelTrained && (
        <div style={{
          marginTop: '12px', fontSize: '12px',
          color: '#92400e', backgroundColor: '#fef3c7',
          padding: '8px', borderRadius: '6px'
        }}>
          ⚠ Using dummy model. Run train_lstm.py for real predictions.
        </div>
      )}
    </div>
  );
}