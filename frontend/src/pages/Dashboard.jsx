import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import StockChart from '../components/StockChart';
import IndicatorPanel from '../components/IndicatorPanel';
import PredictionBadge from '../components/PredictionBadge';
import Watchlist from '../components/Watchlist';

export default function Dashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchStock = async (t) => {
    setLoading(true);
    setError('');
    setStockData(null);
    try {
      const res = await axiosInstance.get(`/stocks/${t}`);
      setStockData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStock(ticker); }, [ticker]);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 1) { setSearchResults([]); return; }
    try {
      const res = await axiosInstance.get(`/stocks/search/${q}`);
      setSearchResults(res.data);
    } catch {
      setSearchResults([]);
    }
  };

  const selectTicker = (t) => {
    setTicker(t);
    setSearchQuery('');
    setSearchResults([]);
  };

  const lastPrice = stockData?.prices?.[stockData.prices.length - 1];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Navbar />
      <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>

        {/* Left Sidebar — Watchlist */}
        <div style={{ width: '240px', flexShrink: 0 }}>
          <Watchlist onTickerSelect={selectTicker} />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search ticker (e.g. AAPL, TSLA)..."
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '1px solid #e2e8f0', fontSize: '15px',
                boxSizing: 'border-box', backgroundColor: 'white'
              }}
            />
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: 'white', border: '1px solid #e2e8f0',
                borderRadius: '10px', zIndex: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}>
                {searchResults.map((r) => (
                  <div
                    key={r.ticker}
                    onClick={() => selectTicker(r.ticker)}
                    style={{
                      padding: '10px 16px', cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex', justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{r.ticker}</span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>{r.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px',
              borderRadius: '8px', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{
              textAlign: 'center', padding: '60px',
              color: '#64748b', fontSize: '16px'
            }}>
              Fetching {ticker} data...
            </div>
          )}

          {stockData && !loading && (
            <>
              <PredictionBadge
                prediction={stockData.prediction}
                lastPrice={lastPrice}
                isModelTrained={stockData.is_model_trained}
              />
              <StockChart ticker={ticker} data={stockData} />
              <IndicatorPanel
                rsi={stockData.rsi}
                macd={stockData.macd}
                macdSignal={stockData.macd_signal}
                dates={stockData.dates}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}