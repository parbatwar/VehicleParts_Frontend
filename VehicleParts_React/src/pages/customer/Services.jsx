import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import './Services.css';

const Services = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('appointment');

    const [apptData, setApptData] = useState({ vehicleId: '', date: '', notes: '' });
    const [partData, setPartData] = useState({ partName: '', description: '' });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get('/Customer/vehicles');
                setVehicles(response.data);
                if (response.data.length > 0) {
                    setApptData(prev => ({ ...prev, vehicleId: response.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch vehicles", err);
                setError("Failed to load your vehicles. Please add a vehicle first.");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.post('/CustomerInteraction/appointments', apptData);
            setMessage("Appointment booked successfully!");
            setApptData({ ...apptData, date: '', notes: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to book appointment.");
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRequestPart = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.post('/CustomerInteraction/part-requests', partData);
            setMessage("Part requested successfully!");
            setPartData({ partName: '', description: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to request part.");
            setTimeout(() => setError(''), 3000);
        }
    };

    // Get current date and time for min attribute
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="services-page">
            <CustomerNavbar />
            
            <div className="services-container">
                <div className="services-grid">
                    
                    {/* Left Panel - Static Poster */}
                    <div className="services-poster">
                        <div className="poster-card">
                            <div className="poster-header">
                                <div className="poster-accent"></div>
                                <span className="poster-badge">GearUp Service Center</span>
                                <h2 className="poster-title">Expert Care for Your Vehicle</h2>
                                <p className="poster-text">
                                    From routine maintenance to complex repairs, our certified technicians 
                                    ensure your vehicle performs at its best.
                                </p>
                            </div>
                            
                            <div className="poster-stats-grid">
                                <div className="poster-stat">
                                    <div className="stat-value">50+</div>
                                    <div className="stat-label">Expert Technicians</div>
                                </div>
                                <div className="poster-stat">
                                    <div className="stat-value">4.9</div>
                                    <div className="stat-label">Customer Rating</div>
                                </div>
                                <div className="poster-stat">
                                    <div className="stat-value">10k+</div>
                                    <div className="stat-label">Vehicles Serviced</div>
                                </div>
                            </div>
                            
                            <div className="poster-features">
                                <div className="poster-feature">
                                    <div className="feature-dot"></div>
                                    <span>24/7 Customer Support</span>
                                </div>
                                <div className="poster-feature">
                                    <div className="feature-dot"></div>
                                    <span>Genuine OEM Parts</span>
                                </div>
                                <div className="poster-feature">
                                    <div className="feature-dot"></div>
                                    <span>60-Day Service Warranty</span>
                                </div>
                                <div className="poster-feature">
                                    <div className="feature-dot"></div>
                                    <span>Free Vehicle Inspection</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="services-form-panel">
                        {/* Tabs */}
                        <div className="form-tabs">
                            <button 
                                className={`form-tab ${activeTab === 'appointment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('appointment')}
                            >
                                Book Appointment
                            </button>
                            <button 
                                className={`form-tab ${activeTab === 'parts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('parts')}
                            >
                                Request Parts
                            </button>
                        </div>

                        {/* Messages */}
                        {message && (
                            <div className="form-message success">
                                {message}
                                <button onClick={() => setMessage('')} className="message-close">×</button>
                            </div>
                        )}
                        {error && (
                            <div className="form-message error">
                                {error}
                                <button onClick={() => setError('')} className="message-close">×</button>
                            </div>
                        )}

                        {/* Appointment Form */}
                        {activeTab === 'appointment' && (
                            <form onSubmit={handleBookAppointment} className="service-form">
                                <div className="form-row-2col">
                                    <div className="form-field">
                                        <label className="form-label">SELECT VEHICLE</label>
                                        <div className="select-wrapper">
                                            <select 
                                                value={apptData.vehicleId} 
                                                onChange={(e) => setApptData({ ...apptData, vehicleId: e.target.value })} 
                                                required
                                                disabled={loading || vehicles.length === 0}
                                            >
                                                <option value="" disabled>Choose vehicle</option>
                                                {vehicles.map(v => (
                                                    <option key={v.id} value={v.id}>{v.year} {v.brand} {v.model}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {vehicles.length === 0 && !loading && (
                                            <div className="field-hint">No vehicles found. Please add a vehicle first.</div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">PREFERRED DATE & TIME</label>
                                        <div className="date-wrapper">
                                            <input 
                                                type="datetime-local" 
                                                className="date-input"
                                                value={apptData.date} 
                                                onChange={(e) => setApptData({ ...apptData, date: e.target.value })} 
                                                min={getCurrentDateTime()}
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label className="form-label">SERVICE NOTES</label>
                                    <textarea 
                                        className="form-textarea"
                                        placeholder="Describe the issue or service needed..."
                                        value={apptData.notes} 
                                        onChange={(e) => setApptData({ ...apptData, notes: e.target.value })} 
                                    />
                                </div>

                                <button type="submit" className="submit-button">
                                    Confirm Appointment
                                </button>

                                <div className="form-footer">
                                    <div className="footer-info">
                                        <span className="footer-dot"></span>
                                        Confirmation sent to your email
                                    </div>
                                    <div className="footer-info">
                                        <span className="footer-dot"></span>
                                        Free cancellation within 2 hours
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Parts Request Form */}
                        {activeTab === 'parts' && (
                            <form onSubmit={handleRequestPart} className="service-form">
                                <div className="form-field">
                                    <label className="form-label">PART NAME</label>
                                    <input 
                                        type="text" 
                                        className="form-input"
                                        placeholder="e.g., Ceramic Brake Pads"
                                        value={partData.partName} 
                                        onChange={(e) => setPartData({ ...partData, partName: e.target.value })} 
                                        required 
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="form-label">VEHICLE & DETAILS</label>
                                    <textarea 
                                        className="form-textarea"
                                        placeholder="Vehicle model, year, or any specific requirements..."
                                        value={partData.description} 
                                        onChange={(e) => setPartData({ ...partData, description: e.target.value })} 
                                        required 
                                    />
                                </div>

                                <button type="submit" className="submit-button">
                                    Submit Request
                                </button>

                                <div className="form-footer">
                                    <div className="footer-info">
                                        <span className="footer-dot"></span>
                                        Response within 2 hours
                                    </div>
                                    <div className="footer-info">
                                        <span className="footer-dot"></span>
                                        Free delivery on orders above Rs. 5000
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;