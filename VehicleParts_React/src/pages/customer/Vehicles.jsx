// FILE: src/pages/customer/Vehicles.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import './Vehicles.css'; 

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        plateNumber: ''
    });

    // Fetch vehicles on load
    const fetchVehicles = async () => {
        try {
            const response = await api.get('/Customer/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Handle Add or Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure year is sent as an integer
            const payload = { ...formData, year: parseInt(formData.year) };

            if (editingId) {
                await api.put(`/Customer/vehicles/${editingId}`, payload);
                setMessage('✅ Vehicle updated successfully!');
            } else {
                await api.post('/Customer/vehicles', payload);
                setMessage('✅ Vehicle added successfully!');
            }

            // Reset form and refresh list
            setFormData({ brand: '', model: '', year: '', plateNumber: '' });
            setEditingId(null);
            fetchVehicles();
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
        }
    };

    // Populate form for editing
    const handleEdit = (vehicle) => {
        setFormData({
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            plateNumber: vehicle.plateNumber
        });
        setEditingId(vehicle.id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
    };

    // Delete a vehicle
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
        
        try {
            await api.delete(`/Customer/vehicles/${id}`);
            setMessage('🗑️ Vehicle removed successfully!');
            fetchVehicles();
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="vehicles-page">
            <CustomerNavbar />
            <div className="container mt-4">
                <h2>Manage My Vehicles</h2>
                {message && <div className="alert alert-info">{message}</div>}

                <div className="row mt-4">
                    {/* ADD / EDIT FORM */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm p-4">
                            <h3>{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label>Brand (Make)</label>
                                    <input type="text" className="form-control" placeholder="e.g., Kia" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Model</label>
                                    <input type="text" className="form-control" placeholder="e.g., Sonet" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Manufacture Year</label>
                                    <input type="number" className="form-control" placeholder="e.g., 2022" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
                                </div>
                                <div className="form-group mb-4">
                                    <label>License Plate</label>
                                    <input type="text" className="form-control" placeholder="e.g., BA 1 PA 1234" value={formData.plateNumber} onChange={(e) => setFormData({...formData, plateNumber: e.target.value})} required />
                                </div>
                                <button type="submit" className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-primary'}`}>
                                    {editingId ? 'Update Vehicle' : 'Add Vehicle'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-light w-100 mt-2" onClick={() => { setEditingId(null); setFormData({ brand: '', model: '', year: '', plateNumber: '' }); }}>
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* VEHICLE LIST */}
                    <div className="col-md-8">
                        <div className="card shadow-sm p-4 h-100">
                            <h3>My Garage</h3>
                            {vehicles.length === 0 ? (
                                <p className="text-muted">You haven't added any vehicles yet. Add one to book an appointment!</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Brand</th>
                                                <th>Model</th>
                                                <th>Year</th>
                                                <th>Plate No.</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vehicles.map(v => (
                                                <tr key={v.id}>
                                                    <td><strong>{v.brand}</strong></td>
                                                    <td>{v.model}</td>
                                                    <td>{v.year}</td>
                                                    <td><span className="badge bg-secondary">{v.plateNumber}</span></td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(v)}>Edit</button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vehicles;