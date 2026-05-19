import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, CreditCard, CheckCircle } from 'lucide-react'; 
import api from '../api/axios';
import './AdminNavbar.css';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = localStorage.getItem('fullName');
  const [isHovered, setIsHovered] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notification');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await api.patch(`/notification/${n.id}/read`);
    }
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

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
          <img src="/GearUp.png" alt="GearUp Logo" className="nav-logo" />
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

      {/* Right Side: Notifications & User Profile */}
      <div className="nav-right">
        {/* Notification Bell */}
        <div className="notification-container" ref={dropdownRef}>
            <button 
                className={`notification-bell ${showDropdown ? 'active' : ''}`}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="mark-all-btn">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-list">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">No notifications</div>
                ) : (
                  notifications.slice(0, 10).map(notif => (
                    <div 
                      key={notif.id} 
                      className={`dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                    <div className="dropdown-item-icon">
                        {notif.type === 'LowStock' ? <AlertTriangle size={16} /> : <CreditCard size={16} />}
                    </div>
                      <div className="dropdown-item-content">
                        <div className="dropdown-item-title">
                          {notif.type === 'LowStock' ? 'Low Stock Alert' : 'Credit Reminder'}
                        </div>
                        <div className="dropdown-item-message">{notif.message}</div>
                        <div className="dropdown-item-time">
                          {new Date(notif.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {!notif.isRead && <div className="unread-dot" />}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="dropdown-footer">
                  <Link to="/admin/notifications" onClick={() => setShowDropdown(false)}>
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

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