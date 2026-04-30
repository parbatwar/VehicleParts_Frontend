import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './CustomerNavbar.css';

function CustomerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('fullName');
    setFullName(name || 'Customer');

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'HOME', path: '/customer/dashboard' },
    { label: 'SERVICES', path: '/customer/Interactions' },
    { label: 'VIEW HISTORY', path: '/customer/history' },
    { label: 'ABOUT US', path: '/customer/about' },
  ];

  return (
    <nav className="customer-nav">
      {/* Left: Logo */}
      <div className="brand-container">
        <Link to="/customer/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/GearUp.png" alt="GearUp Logo" className="nav-logo" />
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <div className="nav-links-container">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path} 
            className={`nav-link-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right: Profile Dropdown */}
      <div className="navbar-right-section" ref={dropdownRef}>
        <div 
          className="profile-trigger" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="user-name-text">{fullName.toUpperCase()}</span>
          <span className="dropdown-arrow" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button 
              className="dropdown-item" 
              onClick={() => { navigate('/customer/Profile'); setDropdownOpen(false); }}
            >
              VIEW PROFILE
            </button>
            <button 
              className="dropdown-item logout-item" 
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default CustomerNavbar;