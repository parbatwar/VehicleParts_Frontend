import React from 'react';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../../components/CustomerNavbar';
import './dashboard.css';

const CustomerDashboard = () => {
    return (
        <div className="dashboard-page">
            <CustomerNavbar />
            <div className="dashboard-container">
                {/* Hero Section */}
                <div className="dashboard-hero">
                    <h2>WELCOME TO GEARUP</h2>
                    <p className="hero-subtitle">Your central hub for vehicle management, servicing, and premium parts.</p>
                    <div className="header-divider"></div>
                </div>

                {/* Navigation Grid */}
                <div className="dashboard-grid">
                    <Link to="/customer/interactions" className="dashboard-card">
                        <div className="card-icon">Tools</div>
                        <h3>Service Center</h3>
                        <p>Book maintenance appointments, request specialized out-of-stock parts, and submit your reviews.</p>
                    </Link>

                    <Link to="/customer/history" className="dashboard-card">
                        <div className="card-icon">Records</div>
                        <h3>My History</h3>
                        <p>Access your complete timeline of past service appointments, part requests, and purchase invoices.</p>
                    </Link>

                    <Link to="/customer/vehicles" className="dashboard-card">
                        <div className="card-icon">Garage</div>
                        <h3>My Vehicles</h3>
                        <p>Register new cars, update details, and manage the vehicles associated with your account.</p>
                    </Link>

                    <Link to="/customer/profile" className="dashboard-card">
                        <div className="card-icon">Account</div>
                        <h3>My Profile</h3>
                        <p>Update your personal information, manage security settings, and customize your account.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;