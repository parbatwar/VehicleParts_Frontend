import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });

    // Fetch profile on load
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

    // Handle form submit directly in the component
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

    if (!profile) return <div className="profile-wrapper">Loading Profile...</div>;

    return (
        <div className="profile-wrapper">
            <h2 className="profile-title">My Profile</h2>
            
            <div className="balance-card">
                <div className="balance-label">Available Credit Balance</div>
                <div className="balance-value">${profile.creditBalance?.toFixed(2)}</div>
            </div>

            {isEditing ? (
                <form className="profile-form" onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-input" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-input" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div className="btn-container">
                        <button type="submit" className="btn btn-success">Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div>
                    <div className="info-group"><strong>Name:</strong> {profile.firstName} {profile.lastName}</div>
                    <div className="info-group"><strong>Email:</strong> {profile.email}</div>
                    <div className="info-group"><strong>Phone:</strong> {profile.phone || 'Not provided'}</div>
                    <div className="btn-container">
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;