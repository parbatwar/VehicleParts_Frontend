import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './CustomerProfile.css';

function CustomerProfile() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.get('/customer');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    try {
      await api.post('/customer', { fullName, phone, email, licensePlate });
      setStatusMsg('Customer profile registered successfully.');
      setFullName(''); setPhone(''); setEmail(''); setLicensePlate('');
      loadCustomers();
    } catch (err) {
      setStatusMsg('Failed to commit profile parameters.');
    }
  };

  return (
    <div className="customer-profile-page">
      <button className="profile-back-btn" onClick={() => navigate('/staff/dashboard')}>&larr; Dashboard</button>
      
      {statusMsg && <div className="status-banner">{statusMsg}</div>}

      <div className="profile-layout-grid">
        <div className="profile-card">
          <h4 className="profile-card-title">Customer Intake Form</h4>
          <form onSubmit={handleCreateProfile}>
            <div className="profile-form-group">
              <label className="profile-label">Full Name *</label>
              <input className="profile-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="profile-form-group">
              <label className="profile-label">Phone Contact Terminal *</label>
              <input className="profile-input" type="text" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="profile-form-group">
              <label className="profile-label">Email Address</label>
              <input className="profile-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="profile-form-group">
              <label className="profile-label">Vehicle License Plate</label>
              <input className="profile-input" type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} placeholder="Ba Ppa 1234" />
            </div>
            <button className="profile-submit-btn" type="submit">COMMIT ACCOUNT PROFILE</button>
          </form>
        </div>

        <div className="profile-card">
          <h4 className="profile-card-title">Registered Account Registries</h4>
          <table className="profile-matrix-table">
            <thead>
              <tr>
                <th className="profile-th">Identity Mapping</th>
                <th className="profile-th">Contact No</th>
                <th className="profile-th">License Mark</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td className="profile-td"><strong>{c.fullName}</strong><br/><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.email || 'No Email'}</span></td>
                  <td className="profile-td">{c.phone}</td>
                  <td className="profile-td"><span className="license-badge">{c.licensePlate || 'NONE'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;