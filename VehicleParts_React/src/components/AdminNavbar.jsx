import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = localStorage.getItem('fullName');
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      {/* Left Side: Logo */}
      <div style={styles.brandContainer}>
        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/GearUp.png" 
            alt="GearUp Logo" 
            style={styles.logo} 
          />
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <div style={styles.links}>
        {['DASHBOARD', 'VENDORS', 'STAFF'].map((item) => {
          const path = `/admin/${item.toLowerCase()}`;
          return (
            <Link 
              key={item}
              to={path} 
              style={{
                ...styles.link, 
                ...(isActive(path) ? styles.activeLink : {})
              }}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* Right Side: User Profile & Logout */}
      <div style={styles.right}>
        <div style={styles.userInfo}>
          <span style={styles.welcome}>ADMIN</span>
          <span style={styles.name}>{fullName || 'User'}</span>
        </div>
        
        <div style={styles.divider}></div>

        <button 
          onClick={handleLogout} 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...styles.logout,
            ...(isHovered ? styles.logoutHover : {})
          }}
        >
          EXIT
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 15, 15, 0.9)', // Translucent Dark
    backdropFilter: 'blur(10px)', // Glass effect
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0 60px',
    height: '75px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif",
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '150px',
    width: 'auto',
    // filter: 'brightness(1.1)',
  },
  links: {
    display: 'flex',
    gap: '45px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)', // Perfectly centered
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '11px',
    letterSpacing: '1px',
    fontWeight: 700,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '8px 0',
  },
  activeLink: {
    color: '#fff',
    borderBottom: '2px solid #f39c12',
    textShadow: '0 0 15px rgba(243, 156, 18, 0.4)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: '10px',
  },
  welcome: {
    color: '#555',
    fontSize: '8px',
    fontWeight: 800,
    letterSpacing: '1.5px',
    marginBottom: '2px',
  },
  name: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  divider: {
    width: '1px',
    height: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logout: {
    backgroundColor: 'transparent',
    color: '#ff4d4d',
    border: '1px solid rgba(255, 77, 77, 0.3)',
    padding: '10px 22px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '10px',
    letterSpacing: '2px',
    fontWeight: 700,
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  logoutHover: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    borderColor: '#ff4d4d',
    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)',
  }
};

export default AdminNavbar;