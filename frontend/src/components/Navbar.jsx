import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '12px 24px',
      backgroundColor: '#1e293b', color: 'white'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        📈 StockAI
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#94a3b8' }}>
          Hello, {user?.username}
        </span>
        <button
          onClick={logout}
          style={{
            padding: '6px 16px', backgroundColor: '#ef4444',
            color: 'white', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontWeight: '500'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}