import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const AdminNotifications = () => {
  const [lowStock, setLowStock] = useState([]);
  const [pendingCredits, setPendingCredits] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const stockRes = await axios.get('/admin/notifications/low-stock');
      setLowStock(stockRes.data);
      const creditRes = await axios.get('/admin/notifications/pending-credits');
      setPendingCredits(creditRes.data);
    } catch (err) {
      alert('Failed to fetch notifications');
    }
  };

  return (
    <div>
      <h3>Admin Notifications</h3>
      <div>
        <h4>Low Stock Alerts</h4>
        {lowStock.length === 0 ? <p>No low stock items.</p> : (
          <ul>
            {lowStock.map(item => (
              <li key={item.partId}>{item.partName} (Stock: {item.stock})</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h4>Pending Credit Reminders</h4>
        {pendingCredits.length === 0 ? <p>No pending credits over 1 month.</p> : (
          <ul>
            {pendingCredits.map(cust => (
              <li key={cust.customerId}>{cust.name} ({cust.email}) - Unpaid for {cust.months} months</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
