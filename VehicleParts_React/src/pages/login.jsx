import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <img 
              src="/GearUpCropped.png" 
              alt="GearUp Logo" 
              style={styles.logo}
            />
            <div style={styles.divider}></div>
          </div>

          {error && (
            <div style={styles.error}>
              <span>{error}</span>
              <button onClick={() => setError('')} style={styles.errorClose}>×</button>
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input
                type="password"
                name="password"

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
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }} 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'START ENGINE'}
            </button>
          </form>

          <div style={styles.registerContainer}>
            <Link to="/customer/register" style={styles.registerLink} className="register-link">
              REGISTER AS CUSTOMER →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .login-btn {
          transition: all 0.2s ease !important;
          position: relative;
          overflow: hidden;
        }
        
        .login-btn:hover:not(:disabled) {
          background-color: #e68a00 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 5px 20px rgba(243, 156, 18, 0.3) !important;
        }
        
        .login-btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }
        
        .register-link {
          transition: all 0.2s ease !important;
        }
        
        .register-link:hover {
          color: #fff !important;
          gap: 8px !important;
        }
        
        input:-webkit-autofill {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset !important;
        }
        
        input:focus {
          border-color: #f39c12 !important;
          outline: none;
          background-color: #0a0a0a !important;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .login-card-animate {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  container: {
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#111111',
    border: '1px solid #222222',
    borderRadius: '8px',
    padding: '48px 40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    animation: 'slideUp 0.4s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    width: '200px',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #222222, transparent)',
    marginTop: '24px',
  },
  error: {
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    borderRadius: '4px',
    color: '#ff6b6b',
    fontSize: '12px',
    padding: '12px 16px',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    letterSpacing: '0.5px',
  },
  errorClose: {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '20px',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '10px',
    color: '#888888',
    letterSpacing: '1.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 14px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#f39c12',
    color: '#000000',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '2px',
    marginTop: '12px',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
  },
  registerContainer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #1a1a1a',
    textAlign: 'center',
  },
  registerLink: {
    color: '#f39c12',
    fontSize: '11px',
    textDecoration: 'none',
    letterSpacing: '1.5px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
};

export default Login;