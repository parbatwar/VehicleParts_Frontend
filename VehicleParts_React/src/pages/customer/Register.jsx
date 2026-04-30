import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        brand: '',
        model: '',
        year: '',
        plateNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) return "FIRST NAME IS REQUIRED";
        if (!formData.lastName.trim()) return "LAST NAME IS REQUIRED";
        if (!formData.email.trim()) return "EMAIL ADDRESS IS REQUIRED";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return "INVALID EMAIL FORMAT";
        if (!formData.phone.trim()) return "PHONE NUMBER IS REQUIRED";
        if (formData.phone.length < 10) return "PHONE NUMBER MUST BE AT LEAST 10 DIGITS";
        if (!formData.brand.trim()) return "VEHICLE BRAND IS REQUIRED";
        if (!formData.model.trim()) return "VEHICLE MODEL IS REQUIRED";
        if (!formData.year) return "VEHICLE YEAR IS REQUIRED";
        const year = parseInt(formData.year);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) return `VEHICLE YEAR MUST BE BETWEEN 1900 AND ${currentYear + 1}`;
        if (!formData.plateNumber.trim()) return "PLATE NUMBER IS REQUIRED";
        if (!formData.password) return "PASSWORD IS REQUIRED";
        if (formData.password.length < 6) return "PASSWORD MUST BE AT LEAST 6 CHARACTERS";
        if (formData.password !== formData.confirmPassword) return "PASSWORDS DO NOT MATCH";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                year: parseInt(formData.year, 10),
                plateNumber: formData.plateNumber.trim().toUpperCase(),
                password: formData.password,
            };

            const response = await api.post('/customer/self-register', payload);
            
            if (response.data) {
                alert("REGISTRATION SUCCESSFUL! PLEASE LOG IN.");
                navigate('/');
            }
            
        } catch (err) {
            // SHOW THE ACTUAL ERROR MESSAGE
            let errorMessage = 'REGISTRATION FAILED. PLEASE TRY AGAIN';
            
            if (err.response) {
                // Server responded with an error
                const status = err.response.status;
                const serverMessage = err.response.data?.message || err.response.data?.error;
                
                // Show specific error based on status
                switch (status) {
                    case 400:
                        errorMessage = serverMessage || 'BAD REQUEST: PLEASE CHECK YOUR INPUTS';
                        break;
                    case 401:
                        errorMessage = 'UNAUTHORIZED: LOGIN REQUIRED';
                        break;
                    case 403:
                        errorMessage = 'FORBIDDEN: REGISTRATION DISABLED';
                        break;
                    case 404:
                        errorMessage = 'API ENDPOINT NOT FOUND. PLEASE CONTACT ADMIN';
                        break;
                    case 409:
                        errorMessage = serverMessage || 'EMAIL OR PHONE NUMBER ALREADY EXISTS';
                        break;
                    case 422:
                        errorMessage = serverMessage || 'VALIDATION ERROR: PLEASE CHECK ALL FIELDS';
                        break;
                    case 500:
                        errorMessage = 'SERVER ERROR. PLEASE TRY AGAIN LATER';
                        break;
                    default:
                        errorMessage = `ERROR ${status}: ${serverMessage || 'REGISTRATION FAILED'}`;
                }
            } else if (err.request) {
                // Request was made but no response
                errorMessage = 'CANNOT CONNECT TO SERVER. CHECK IF BACKEND IS RUNNING';
            } else if (err.message) {
                // Other errors
                errorMessage = `ERROR: ${err.message}`;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <img 
                            src="/GearUpCropped.png" 
                            alt="GearUp Logo" 
                            className="register-logo"
                        />
                        <p className="register-subtitle">join the gearup network</p>
                        <div className="register-divider"></div>
                    </div>

                    {error && (
                        <div className="register-error">
                            <span>{error}</span>
                            <button onClick={() => setError('')} className="register-error-close">×</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-form-grid">
                            <div className="register-input-group">
                                <label className="register-label">FIRST NAME</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                            
                            <div className="register-input-group">
                                <label className="register-label">LAST NAME</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-grid">
                            <div className="register-input-group">
                                <label className="register-label">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                            
                            <div className="register-input-group">
                                <label className="register-label">PHONE NUMBER</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-section-divider">
                            <span className="register-section-title">VEHICLE INFORMATION</span>
                        </div>

                        <div className="register-form-grid">
                            <div className="register-input-group">
                                <label className="register-label">VEHICLE BRAND</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                            
                            <div className="register-input-group">
                                <label className="register-label">VEHICLE MODEL</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-grid">
                            <div className="register-input-group">
                                <label className="register-label">VEHICLE YEAR</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                            
                            <div className="register-input-group">
                                <label className="register-label">PLATE NUMBER</label>
                                <input
                                    type="text"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-section-divider">
                            <span className="register-section-title">SECURITY CREDENTIALS</span>
                        </div>

                        <div className="register-form-grid">
                            <div className="register-input-group">
                                <label className="register-label">PASSWORD</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                            
                            <div className="register-input-group">
                                <label className="register-label">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="register-input"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`register-btn ${loading ? 'register-btn-loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'REGISTERING...' : 'REGISTER'}
                        </button>
                    </form>

                    <div className="register-login-container">
                        <Link to="/" className="register-login-link">
                            ALREADY HAVE AN ACCOUNT? → LOGIN
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;