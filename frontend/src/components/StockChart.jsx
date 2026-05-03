import {
  ComposedChart, Line, Area, XAxis, YAxis,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';

export default function StockChart({ ticker, data }) {
  if (!data) {
    return (
      <div style={{
        height: '400px', backgroundColor: '#f1f5f9',
        borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#94a3b8', fontSize: '16px'
      }}>
        Loading chart...
      </div>
    );
  }

  const chartData = data.dates.map((date, i) => ({
    date: date.slice(5),
    price: parseFloat(data.prices[i]?.toFixed(2)),
  }));

  const lastPrice = data.prices[data.prices.length - 1];

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ margin: '0 0 16px', color: '#1e293b' }}>
        {ticker} — Price Chart
      </h2>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={20} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
          <Legend />
          <Area
            type="monotone" dataKey="price"
            fill="#eff6ff" stroke="none" name="Price Area"
          />
          <Line
            type="monotone" dataKey="price"
            stroke="#3b82f6" strokeWidth={2}
            dot={false} name="Close Price"
          />
          <ReferenceLine
            y={data.prediction}
            stroke="#f59e0b"
            strokeDasharray="8 4"
            label={{
              value: `LSTM: $${data.prediction?.toFixed(2)}`,
              fill: '#f59e0b', fontSize: 12, position: 'right'
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}