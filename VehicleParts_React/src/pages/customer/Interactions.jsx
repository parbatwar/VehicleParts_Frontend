import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Interactions.css';

const Interactions = () => {
    const [vehicles, setVehicles] = useState([]);

    // Independent form states
    const [apptData, setApptData] = useState({ vehicleId: '', date: '', notes: '' });
    const [partData, setPartData] = useState({ partName: '', description: '' });
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    // Load vehicles for the dropdown directly inside component
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get('/Customer/vehicles');
                setVehicles(response.data);
                if(response.data.length > 0) {
                    setApptData(prev => ({...prev, vehicleId: response.data[0].id}));
                }
            } catch (err) {
                console.error("Failed to fetch vehicles for dropdown", err);
            }
        };
        fetchVehicles();
    }, []);

    // API Call: Book Appointment
    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/CustomerInteraction/appointments', apptData);
            alert("Appointment booked successfully!");
            setApptData({ ...apptData, date: '', notes: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to book appointment.");
        }
    };

    // API Call: Request Part
    const handleRequestPart = async (e) => {
        e.preventDefault();
        try {
            await api.post('/CustomerInteraction/part-requests', partData);
            alert("Part requested successfully!");
            setPartData({ partName: '', description: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to request part.");
        }
    };

    // API Call: Submit Review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/CustomerInteraction/reviews', reviewData);
            alert("Review submitted successfully! Thank you.");
            setReviewData({ rating: 5, comment: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to submit review.");
        }
    };

    return (
        <div className="interaction-dashboard">
            
            {/* Box 1: Book Appointment */}
            <div className="interaction-box">
                <h3>Book a Service Appointment</h3>
                <form onSubmit={handleBookAppointment}>
                    <select className="int-select" value={apptData.vehicleId} onChange={(e) => setApptData({...apptData, vehicleId: e.target.value})} required>
                        <option value="" disabled>Select a Vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.year} {v.brand} {v.model}</option>
                        ))}
                    </select>
                    <input type="datetime-local" className="int-input" value={apptData.date} onChange={(e) => setApptData({...apptData, date: e.target.value})} required />
                    <textarea className="int-textarea" placeholder="Describe the issue (e.g. Engine making noise)" value={apptData.notes} onChange={(e) => setApptData({...apptData, notes: e.target.value})} />
                    <button type="submit" className="btn-int btn-blue">Book Appointment</button>
                </form>
            </div>

            {/* Box 2: Request Part */}
            <div className="interaction-box">
                <h3>Request an Out-of-Stock Part</h3>
                <form onSubmit={handleRequestPart}>
                    <input type="text" className="int-input" placeholder="Part Name (e.g. Ceramic Brake Pads)" value={partData.partName} onChange={(e) => setPartData({...partData, partName: e.target.value})} required />
                    <textarea className="int-textarea" placeholder="Additional description or car details..." value={partData.description} onChange={(e) => setPartData({...partData, description: e.target.value})} required />
                    <button type="submit" className="btn-int btn-green">Submit Request</button>
                </form>
            </div>

            {/* Box 3: Submit Review */}
            <div className="interaction-box box-full-width">
                <h3>Leave a Review</h3>
                <form onSubmit={handleSubmitReview}>
                    <select className="int-select" value={reviewData.rating} onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})} required>
                        <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                        <option value="4">⭐⭐⭐⭐ - Good</option>
                        <option value="3">⭐⭐⭐ - Average</option>
                        <option value="2">⭐⭐ - Poor</option>
                        <option value="1">⭐ - Terrible</option>
                    </select>
                    <textarea className="int-textarea" placeholder="Tell us about your experience..." value={reviewData.comment} onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} required />
                    <button type="submit" className="btn-int btn-yellow">Post Review</button>
                </form>
            </div>

        </div>
    );
};

export default Interactions;