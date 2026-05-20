import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        profilePictureUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/Customer/profile');
                const actualData = response.data.data ? response.data.data : response.data;
                setProfile(actualData);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // NEW: Handle File Upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Sends multipart/form-data to your backend endpoint
            const response = await api.post('/Customer/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const newUrl = response.data.data ? response.data.data : response.data.url;
            setProfile({ ...profile, profilePictureUrl: newUrl });
            alert("Profile picture updated successfully!");
        } catch (err) {
            console.error("File upload failed", err);
            alert("Failed to upload profile picture.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Construct image URL (ensure this matches where your backend serves files)
    const backendBaseUrl = 'http://localhost:5000'; // Replace with your backend URL
    const avatarSrc = profile.profilePictureUrl 
        ? `${backendBaseUrl}${profile.profilePictureUrl}` 
        : 'https://via.placeholder.com/150/111111/f39c12?text=Upload';

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="profile-page">
            <CustomerNavbar />
            <div className="profile-container">
                <h2>MY PROFILE</h2>
                
                <div className="profile-card">
                    {/* Picture Section */}
                    <div className="profile-avatar-section">
                        <img 
                            src={avatarSrc} 
                            alt="Profile Avatar" 
                            className="profile-avatar" 
                            onClick={triggerFileInput} 
                            title="Click to upload new picture"
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange} 
                        />
                        <p className="avatar-hint">Click image to update</p>
                    </div>

                    <form className="profile-form">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" value={profile.firstName} className="form-control" disabled />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={profile.email} className="form-control" disabled />
                        </div>
                        {/* Add other fields as necessary */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;