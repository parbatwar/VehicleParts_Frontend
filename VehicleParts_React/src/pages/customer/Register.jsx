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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);
        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                brand: formData.brand,
                model: formData.model,
                year: parseInt(formData.year, 10),
                plateNumber: formData.plateNumber,
                password: formData.password,
            };

            const candidateEndpoints = [
                '/auth/customer/register',
                '/auth/register/customer',
                '/auth/register',
            ];

            let lastError = null;
            for (const endpoint of candidateEndpoints) {
                try {
                    await api.post(endpoint, payload);
                    lastError = null;
                    break;
                } catch (endpointErr) {
                    lastError = endpointErr;
                    const status = endpointErr?.response?.status;
                    if (status === 401 || status === 403) {
                        break;
                    }
                    if (status !== 404 && status !== 405) {
                        break;
                    }
                }
            }

            if (lastError) {
                throw lastError;
            }
            
            alert("Registration successful! Please log in.");
            navigate('/');
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Registration endpoint is protected on backend. Ask backend to allow anonymous customer signup.');
                return;
            }
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Create an Account</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="firstName" className="form-control" placeholder="First Name" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" name="lastName" className="form-control" placeholder="Last Name" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" className="form-control" placeholder="Email Address" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" name="phone" className="form-control" placeholder="Phone Number" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" name="brand" className="form-control" placeholder="Vehicle Brand" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" name="model" className="form-control" placeholder="Vehicle Model" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="number" name="year" className="form-control" placeholder="Vehicle Year" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" name="plateNumber" className="form-control" placeholder="Plate Number" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" className="form-control" placeholder="Password" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" required onChange={handleChange} />
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div className="login-link">
                    Already have an account? <Link to="/">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;