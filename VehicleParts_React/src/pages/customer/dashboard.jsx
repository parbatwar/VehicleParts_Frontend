import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../../components/CustomerNavbar';
import { Calendar, History, Car, User, Star, Wrench, ShoppingBag, Settings } from 'lucide-react';
import './dashboard.css';

const CustomerDashboard = () => {
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('fullName');
        setFullName(name || 'Customer');
    }, []);

    const features = [
        {
            to: "/customer/interactions",
            icon: <Wrench size={28} />,
            title: "Service Center",
            description: "Book maintenance appointments, request specialized out-of-stock parts, and submit your reviews.",
            badge: "Book Now",
            color: "#f39c12"
        },
        {
            to: "/customer/history",
            icon: <History size={28} />,
            title: "My History",
            description: "Access your complete timeline of past service appointments, part requests, and purchase invoices.",
            badge: "View All",
            color: "#3498db"
        },
        {
            to: "/customer/vehicles",
            icon: <Car size={28} />,
            title: "My Vehicles",
            description: "Register new cars, update details, and manage the vehicles associated with your account.",
            badge: "Manage",
            color: "#2ecc71"
        },
        {
            to: "/customer/profile",
            icon: <User size={28} />,
            title: "My Profile",
            description: "Update your personal information, manage security settings, and customize your account.",
            badge: "Edit Profile",
            color: "#e74c3c"
        }
    ];

    // Get first name only for welcome message
    const firstName = fullName.split(' ')[0];

    return (
        <div className="dashboard-page">
            <CustomerNavbar />
            <div className="dashboard-container">
                {/* Hero Section */}
                <div className="dashboard-hero">
                    <div className="hero-badge">
                        <Star size={14} fill="#f39c12" color="#f39c12" />
                        <span>Welcome, {firstName}</span>
                    </div>
                    <div className="logo-container">
                        <img src="/GearUpCropped.png" alt="GearUp Logo" className="dashboard-logo" />
                    </div>
                    <p className="hero-subtitle">Your central hub for vehicle management, servicing, and premium parts</p>
                    <div className="header-divider"></div>
                </div>

                {/* Stats Overview */}
                <div className="stats-overview">
                    <div className="stat-item">
                        <div className="stat-icon"><Car size={18} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Vehicles</span>
                            <span className="stat-value">2</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon"><Calendar size={18} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Upcoming Services</span>
                            <span className="stat-value">1</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon"><ShoppingBag size={18} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Purchases</span>
                            <span className="stat-value">12</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon"><Star size={18} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Reviews Given</span>
                            <span className="stat-value">5</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Grid */}
                <div className="dashboard-grid">
                    {features.map((feature, index) => (
                        <Link 
                            key={index}
                            to={feature.to} 
                            className="dashboard-card"
                            style={{ '--card-accent': feature.color }}
                        >
                            <div className="card-glow"></div>
                            <div className="card-icon-wrapper" style={{ background: `rgba(${parseInt(feature.color.slice(1,3), 16)}, ${parseInt(feature.color.slice(3,5), 16)}, ${parseInt(feature.color.slice(5,7), 16)}, 0.1)` }}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                            <div className="card-footer">
                                <span className="card-badge">{feature.badge}</span>
                                <span className="card-arrow">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default CustomerDashboard;