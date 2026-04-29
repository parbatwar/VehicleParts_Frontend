import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Vehicles.css';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({ brand: '', model: '', year: '', plateNumber: '' });

    // Fetch API
    const loadVehicles = async () => {
        try {
            const response = await api.get('/Customer/vehicles');
            setVehicles(response.data);
        } catch (err) {
            console.error("Failed to load vehicles", err);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    // Add API
    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await api.post('/Customer/vehicles', formData);
            setFormData({ brand: '', model: '', year: '', plateNumber: '' }); // clear form
            loadVehicles(); // refresh the list
        } catch (err) {
            console.error("Add vehicle error", err);
            alert("Failed to add vehicle.");
        }
    };

    // Delete API
    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to remove this vehicle?")) {
            try {
                await api.delete(`/Customer/vehicles/${id}`);
                loadVehicles(); // refresh the list
            } catch (err) {
                console.error("Delete vehicle error", err);
                alert("Failed to delete vehicle.");
            }
        }
    };

    return (
        <div className="vehicles-wrapper">
            <h2 className="vehicles-title">My Garage</h2>
            
            <div className="add-vehicle-card">
                <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
                    <input type="text" className="vehicle-input" placeholder="Brand (e.g. Honda)" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
                    <input type="text" className="vehicle-input" placeholder="Model (e.g. Civic)" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
                    <input type="number" className="vehicle-input" placeholder="Year (e.g. 2021)" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
                    <input type="text" className="vehicle-input" placeholder="Plate Number" value={formData.plateNumber} onChange={(e) => setFormData({...formData, plateNumber: e.target.value})} required />
                    <button type="submit" className="btn-add">Add Vehicle</button>
                </form>
            </div>

            <div className="vehicle-grid">
                {vehicles.map(v => (
                    <div className="vehicle-card" key={v.id}>
                        <h3>{v.year} {v.brand} {v.model}</h3>
                        <p><strong>Plate:</strong> {v.plateNumber}</p>
                        <button className="btn-danger" onClick={() => handleDelete(v.id)}>Remove Vehicle</button>
                    </div>
                ))}
                {vehicles.length === 0 && <p>You have no vehicles registered yet.</p>}
            </div>
        </div>
    );
};

export default Vehicles;