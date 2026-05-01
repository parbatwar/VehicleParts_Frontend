import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './AdminNavbar.css';

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

  const navItems = [
    { label: 'DASHBOARD', path: '/admin/dashboard' },
    { label: 'VENDORS', path: '/admin/vendors' },
    { label: 'STAFF', path: '/admin/staff' },
    { label: 'PARTS', path: '/admin/parts' },
    { label: 'PURCHASE', path: '/admin/purchase-invoices' },
  ];

  return (
    <nav className="admin-nav">
      {/* Left Side: Logo */}
      <div className="brand-container">
        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/GearUp.png" 
            alt="GearUp Logo" 
            className="nav-logo"
          />
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <div className="nav-links">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path} 
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right Side: User Profile & Logout */}
      <div className="nav-right">
        <div className="user-info">
          <span className="user-welcome">ADMIN</span>
          <span className="user-name">{fullName || 'User'}</span>
        </div>
        
        <div className="nav-divider"></div>

        <button 
          onClick={handleLogout} 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`logout-btn ${isHovered ? 'logout-hover' : ''}`}
        >
          EXIT
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;