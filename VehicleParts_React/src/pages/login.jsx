import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', form);
      const { token, role, fullName } = data;

      // Persistence
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName);

      // Role-based Routing
      const routes = {
        Admin: '/admin/dashboard',
        Staff: '/staff/dashboard',
        Customer: '/customer/dashboard',
      };

      navigate(routes[role] || '/');
    } catch (err) {
      const message = err.response?.data?.message || 'CRITICAL SYSTEM ERROR: ACCESS DENIED';
      setError(message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div style={styles.icon}>⚙️</div>
          <h1 style={styles.title}>VEHICLE PARTS</h1>
          <p style={styles.subtitle}>garage access system</p>
        </header>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="EMAIL ADDRESS"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{
                ...styles.button, 
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            disabled={loading}
          >
            {loading ? 'IGNITING...' : 'START ENGINE'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    backgroundColor: '#141414',
    padding: '48px 40px',
    borderRadius: '4px',
    border: '1px solid #222',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
    filter: 'drop-shadow(0 0 10px rgba(243, 156, 18, 0.3))',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '11px',
    color: '#f39c12',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    width: '100%',
    padding: '14px 0',
    marginBottom: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #333',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#f39c12',
    color: '#000',
    border: 'none',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '2px',
    marginTop: '20px',
    textTransform: 'uppercase',
    transition: 'transform 0.1s active',
  },
  error: {
    color: '#ff4d4d',
    fontSize: '11px',
    textAlign: 'left',
    marginBottom: '24px',
    padding: '12px',
    backgroundColor: 'rgba(255, 77, 77, 0.05)',
    borderLeft: '3px solid #ff4d4d',
    letterSpacing: '1px',
    fontWeight: 500,
  }
};

export default Login;