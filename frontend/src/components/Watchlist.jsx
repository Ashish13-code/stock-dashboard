import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function Watchlist({ onTickerSelect }) {
  const [items, setItems] = useState([]);
  const [newTicker, setNewTicker] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWatchlist = async () => {
    try {
      const res = await axiosInstance.get('/watchlist/');
      setItems(res.data);
    } catch {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  const addTicker = async () => {
    if (!newTicker.trim()) return;
    try {
      await axiosInstance.post('/watchlist/', { ticker: newTicker.toUpperCase() });
      setNewTicker('');
      fetchWatchlist();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add ticker');
    }
  };

  const removeTicker = async (ticker) => {
    try {
      await axiosInstance.delete(`/watchlist/${ticker}`);
      fetchWatchlist();
    } catch {
      setError('Failed to remove ticker');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '12px',
      padding: '16px', height: '100%'
    }}>
      <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>My Watchlist</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTicker()}
          placeholder="Add ticker..."
          style={{
            flex: 1, padding: '8px', borderRadius: '6px',
            border: '1px solid #e2e8f0', fontSize: '14px'
          }}
        />
        <button
          onClick={addTicker}
          style={{
            padding: '8px 12px', backgroundColor: '#3b82f6',
            color: 'white', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontWeight: '500'
          }}
        >
          Add
        </button>
      </div>

      {error && (
        <div style={{
          color: '#dc2626', fontSize: '12px',
          marginBottom: '8px', padding: '6px',
          backgroundColor: '#fef2f2', borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
          No tickers yet. Add one above.
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '10px',
            borderRadius: '8px', marginBottom: '8px',
            backgroundColor: '#f8fafc', cursor: 'pointer',
            border: '1px solid #e2e8f0'
          }}>
            <div onClick={() => onTickerSelect(item.ticker)}>
              <div style={{ fontWeight: '600', color: '#1e293b' }}>{item.ticker}</div>
              {item.latest_prediction && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Pred: ${item.latest_prediction.toFixed(2)}
                </div>
              )}
            </div>
            <button
              onClick={() => removeTicker(item.ticker)}
              style={{
                background: 'none', border: 'none',
                color: '#ef4444', cursor: 'pointer',
                fontSize: '16px', padding: '4px'
              }}
            >
              ×
            </button>
          </div>
        ))
      )}
    </div>
  );
}