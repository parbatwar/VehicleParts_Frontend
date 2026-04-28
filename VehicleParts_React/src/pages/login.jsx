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

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName);

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
      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 1px;
        }
        input:focus {
          border-bottom: 1px solid #f39c12 !important;
        }
      `}</style>
      <div style={styles.card}>
        <header style={styles.header}>
          {/* REPLACED EMOJI WITH LOGO BOX TO MATCH THEME */}
          <div style={styles.logoBox}>VP</div>
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
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'IGNITING...' : 'START ENGINE'}
          </button>
        </form>
      </div>

      <style>{`
        .login-btn:hover {
            background-color: #e68a00 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
        }
        .login-btn:active {
            transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(/login_background.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative',
  },
  card: {
    backgroundColor: 'rgba(10, 10, 10, 0.25)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    padding: '48px 40px',
    borderRadius: '12px',
    border: '1px solid rgba(243, 156, 18, 0.3)',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 0 30px rgba(243, 156, 18, 0.3), 0 0 60px rgba(255, 77, 0, 0.2), 0 0 100px rgba(255, 77, 0, 0.1), inset 0 0 30px rgba(243, 156, 18, 0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoBox: {
    display: 'inline-block',
    backgroundColor: '#f39c12',
    color: '#000',
    fontSize: '18px',
    fontWeight: '900',
    padding: '6px 10px',
    borderRadius: '2px',
    marginBottom: '15px',
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
  inputGroup: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '14px 0',
    marginBottom: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(243, 156, 18, 0.5)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    caretColor: '#f39c12',
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