import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
  ComposedChart, Bar
} from 'recharts';

export default function IndicatorPanel({ rsi, macd, macdSignal, dates }) {
  if (!rsi || !macd) return null;

  const rsiData = dates.map((date, i) => ({
    date: date.slice(5),
    rsi: parseFloat(rsi[i]?.toFixed(2))
  }));

  const macdData = dates.map((date, i) => ({
    date: date.slice(5),
    macd: parseFloat(macd[i]?.toFixed(4)),
    signal: parseFloat(macdSignal[i]?.toFixed(4)),
    histogram: parseFloat((macd[i] - macdSignal[i])?.toFixed(4))
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* RSI Chart */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px', color: '#1e293b' }}>RSI (14)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={rsiData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={20} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 2"
              label={{ value: 'Overbought', fontSize: 10, fill: '#ef4444' }} />
            <ReferenceLine y={30} stroke="#16a34a" strokeDasharray="4 2"
              label={{ value: 'Oversold', fontSize: 10, fill: '#16a34a' }} />
            <Line type="monotone" dataKey="rsi" stroke="#8b5cf6"
              dot={false} strokeWidth={1.5} name="RSI" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MACD Chart */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px', color: '#1e293b' }}>MACD (12, 26, 9)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={macdData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={20} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="histogram" name="Histogram"
              fill="#10b981"
              label={false}
            />
            <Line type="monotone" dataKey="macd" stroke="#10b981"
              dot={false} strokeWidth={1.5} name="MACD" />
            <Line type="monotone" dataKey="signal" stroke="#ef4444"
              dot={false} strokeWidth={1.5} name="Signal" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}