import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import { User, Mail, Phone, Edit2, Save, X, Shield, CreditCard } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/customer/profile');
            const data = response.data.data ?? response.data;
            setProfile(data);
            setEditForm({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || ''
            });
        } catch (err) {
            setErrorMessage('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setErrorMessage('');
        try {
            await api.put('/customer/profile', editForm);
            setProfile({ ...profile, ...editForm });
            setEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || ''
        });
        setEditing(false);
        setErrorMessage('');
    };

    const getInitials = () => {
        const f = profile?.firstName?.charAt(0) || '';
        const l = profile?.lastName?.charAt(0) || '';
        return `${f}${l}`.toUpperCase() || '?';
    };

    if (loading) return (
        <div className="profile-page">
            <CustomerNavbar />
            <div className="loader-container">
                <div className="loader" />
                <p>LOADING PROFILE...</p>
            </div>
        </div>
    );

    return (
        <div className="profile-page">
            <CustomerNavbar />
            <div className="profile-container">

                {/* Header */}
                <div className="profile-header">
                    <h2>MY PROFILE</h2>
                    <p className="profile-subtitle">Manage your personal information</p>
                    <div className="header-divider" />
                </div>

                {successMessage && <div className="success-message">✓ {successMessage}</div>}
                {errorMessage && <div className="error-message">✗ {errorMessage}</div>}

                <div className="profile-layout">

                    {/* Left — Avatar Card */}
                    <div className="avatar-card">
                        <div className="avatar-circle">
                            <span className="avatar-initials">{getInitials()}</span>
                        </div>
                        <h3 className="avatar-name">
                            {profile?.firstName} {profile?.lastName}
                        </h3>
                        <p className="avatar-email">{profile?.email}</p>
{/* 
                        <div className="avatar-stats">
                            <div className="stat-item">
                                <Shield size={14} />
                                <span>Customer</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <CreditCard size={14} />
                                <span>Rs. {profile?.creditBalance?.toFixed(2) || '0.00'} credit</span>
                            </div>
                        </div> */}

                        {!editing && (
                            <button className="edit-btn-full" onClick={() => setEditing(true)}>
                                <Edit2 size={14} /> Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Right — Info / Edit Card */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h4>{editing ? 'Edit Profile' : 'Personal Information'}</h4>
                            {editing && (
                                <button className="cancel-icon-btn" onClick={handleCancel}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {!editing ? (
                            <div className="info-list">
                                <div className="info-row">
                                    <div className="info-label">
                                        <User size={15} /> First Name
                                    </div>
                                    <div className="info-value">{profile?.firstName || '—'}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">
                                        <User size={15} /> Last Name
                                    </div>
                                    <div className="info-value">{profile?.lastName || '—'}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">
                                        <Mail size={15} /> Email
                                    </div>
                                    <div className="info-value">{profile?.email || '—'}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">
                                        <Phone size={15} /> Phone
                                    </div>
                                    <div className="info-value">
                                        {profile?.phone || <span style={{ color: '#555' }}>Not provided</span>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="edit-form">
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.firstName}
                                            onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.lastName}
                                            onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="form-note">
                                    Email cannot be changed. Contact admin if needed.
                                </div>

                                <div className="form-actions">
                                    <button
                                        className="save-btn"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        <Save size={15} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button className="cancel-action-btn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;