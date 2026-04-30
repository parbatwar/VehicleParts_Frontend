import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/Customer/profile');
                setProfile(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phone: response.data.phone
                });
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/Customer/profile', formData);
            setProfile(response.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile.");
        }
    };

    if (!profile) return (
        <>
            <CustomerNavbar />
            <div className="profile-wrapper">
                <div className="loader-container">
                    <div className="loader"></div>
                    <p className="loader-text">LOADING PROFILE...</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <CustomerNavbar />
            <div className="profile-wrapper">
                <div className="profile-container">
                    <div className="profile-header">
                        <h2 className="profile-title">MY PROFILE</h2>
                        <p className="profile-subtitle">manage your account information</p>
                        <div className="header-divider"></div>
                    </div>

                    <div className="balance-card">
                        <div className="balance-label">AVAILABLE CREDIT BALANCE</div>
                        <div className="balance-value">${profile.creditBalance?.toFixed(2)}</div>
                    </div>

                    {isEditing ? (
                        <form className="profile-form" onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>FIRST NAME</label>
                                <input type="text" className="form-input" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>LAST NAME</label>
                                <input type="text" className="form-input" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>PHONE NUMBER</label>
                                <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                            </div>
                            <div className="btn-container">
                                <button type="submit" className="btn btn-success">SAVE CHANGES</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>CANCEL</button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="info-card">
                                <div className="info-group">
                                    <span className="info-label">FULL NAME</span>
                                    <span className="info-value">{profile.firstName} {profile.lastName}</span>
                                </div>
                                <div className="info-group">
                                    <span className="info-label">EMAIL ADDRESS</span>
                                    <span className="info-value">{profile.email}</span>
                                </div>
                                <div className="info-group">
                                    <span className="info-label">PHONE NUMBER</span>
                                    <span className="info-value">{profile.phone || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="btn-container">
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>EDIT PROFILE</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;