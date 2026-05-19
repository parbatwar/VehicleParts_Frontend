import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import './Notifications.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notification');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
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
  };

  const sendCreditReminders = async () => {
    setSending(true);
    try {
      await api.post('/notification/send-credit-reminders');
      alert('Credit reminder emails sent to all overdue customers.');
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to send reminders:', err);
      alert('Failed to send reminders');
    } finally {
      setSending(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const lowStockCount = notifications.filter(n => n.type === 'LowStock').length;
  const creditCount = notifications.filter(n => n.type === 'CreditReminder').length;

  return (
    <div className="notifications-page">
      <AdminNavbar />

      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h1 className="notifications-title">Notifications</h1>
            <p className="notifications-subtitle">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
          <div className="notifications-actions">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-btn">
                Mark All Read
              </button>
            )}
            <button onClick={sendCreditReminders} className="reminder-btn" disabled={sending}>
              {sending ? 'Sending...' : 'Send Credit Reminders'}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="notif-loading">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon">🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map(notif => (
              <div key={notif.id} className={`notif-item ${!notif.isRead ? 'unread' : ''}`}>
                <div className="notif-icon">
                  {notif.type === 'LowStock' ? '⚠️' : '💳'}
                </div>
                <div className="notif-content">
                  <div className="notif-type">
                    <span className={`type-badge ${notif.type === 'LowStock' ? 'type-lowstock' : 'type-credit'}`}>
                      {notif.type === 'LowStock' ? 'Low Stock' : 'Credit Reminder'}
                    </span>
                    {!notif.isRead && <span className="unread-dot" />}
                  </div>
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-date">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif.id)} className="notif-read-btn">
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;