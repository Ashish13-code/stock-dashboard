import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '14px',
    boxSizing: 'border-box', marginBottom: '16px'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f1f5f9'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '40px',
        borderRadius: '16px', width: '100%', maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ margin: '0 0 24px', color: '#1e293b', textAlign: 'center' }}>
          Create Account
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2', color: '#dc2626',
            padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <label style={{ fontSize: '14px', color: '#374151' }}>Username</label>
        <input name="username" value={form.username} onChange={handleChange}
          placeholder="johndoe" style={inputStyle} />

        <label style={{ fontSize: '14px', color: '#374151' }}>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="you@example.com" style={inputStyle} />

        <label style={{ fontSize: '14px', color: '#374151' }}>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange}
          placeholder="••••••••" style={inputStyle} />

        <label style={{ fontSize: '14px', color: '#374151' }}>Confirm Password</label>
        <input name="confirmPassword" type="password" value={form.confirmPassword}
          onChange={handleChange} placeholder="••••••••" style={inputStyle} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            backgroundColor: loading ? '#93c5fd' : '#3b82f6',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}