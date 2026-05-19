import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import './Vehicles.css';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        plateNumber: ''
    });

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const response = await api.get('/Customer/vehicles');
            setVehicles(response.data);
        } catch (err) {
            console.error("Error fetching vehicles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        
        try {
            const payload = { ...formData, year: parseInt(formData.year) };

            if (editingId) {
                await api.put(`/Customer/vehicles/${editingId}`, payload);
                setMessage('Vehicle updated successfully!');
            } else {
                await api.post('/Customer/vehicles', payload);
                setMessage('Vehicle added successfully!');
            }

            setFormData({ brand: '', model: '', year: '', plateNumber: '' });
            setEditingId(null);
            setShowForm(false);
            fetchVehicles();
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (vehicle) => {
        setFormData({
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            plateNumber: vehicle.plateNumber
        });
        setEditingId(vehicle.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/Customer/vehicles/${id}`);
            setMessage('Vehicle removed successfully!');
            fetchVehicles();
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ brand: '', model: '', year: '', plateNumber: '' });
        setEditingId(null);
        setShowForm(false);
        setMessage('');
        setError('');
    };

    return (
        <div className="vehicles-page">
            <CustomerNavbar />
            
            <div className="vehicles-container">
                <div className="vehicles-header">
                    <div>
                        <h1 className="vehicles-title">MY VEHICLES</h1>
                        <p className="vehicles-subtitle">manage your registered vehicles</p>
                    </div>
                    {!showForm && (
                        <button className="add-vehicle-btn" onClick={() => setShowForm(true)}>
                            <Plus size={16} /> ADD VEHICLE
                        </button>
                    )}
                </div>

                {message && (
                    <div className="success-message">
                        <span>{message}</span>
                        <button onClick={() => setMessage('')}>×</button>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingId ? 'EDIT VEHICLE' : 'ADD VEHICLE'}</h3>
                                <button className="modal-close" onClick={resetForm}>×</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label className="input-label">BRAND</label>
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">MODEL</label>
                                        <input
                                            type="text"
                                            value={formData.model}
                                            onChange={(e) => setFormData({...formData, model: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">YEAR</label>
                                        <input
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) => setFormData({...formData, year: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">PLATE NUMBER</label>
                                        <input
                                            type="text"
                                            value={formData.plateNumber}
                                            onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={resetForm}>CANCEL</button>
                                    <button type="submit" className="btn-submit">
                                        {editingId ? 'UPDATE VEHICLE' : 'ADD VEHICLE'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Vehicles List */}
                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="loader-text">LOADING VEHICLES...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="empty-state">
                        <p>No vehicles found.</p>
                    </div>
                ) : (
                    <div className="vehicles-list">
                        {vehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className="vehicle-item">
                                <div className="vehicle-info">
                                    <span className="vehicle-number">{index + 1}.</span>
                                    <div className="vehicle-details">
                                        <span className="vehicle-name">{vehicle.brand} {vehicle.model}</span>
                                        <span className="vehicle-year">{vehicle.year}</span>
                                        <span className="vehicle-plate">{vehicle.plateNumber}</span>
                                    </div>
                                </div>
                                <div className="vehicle-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(vehicle)}>
                                        <Pencil size={14} /> EDIT
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(vehicle.id)}>
                                        <Trash2 size={14} /> DELETE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vehicles;