import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <CustomerNavbar />
            <div className="about-container">
                <div className="about-header">
                    <h2>ABOUT GEARUP</h2>
                    <p className="about-subtitle">Your trusted partner for genuine vehicle parts and professional servicing.</p>
                    <div className="header-divider"></div>
                </div>

                <div className="about-content">
                    {/* Mission Section */}
                    <section className="about-card mission-card">
                        <h3> Our Mission</h3>
                        <p>
                            We are dedicated to providing high-quality, genuine vehicle parts along with top-tier mechanic services. 
                            Our goal is to make vehicle maintenance transparent, accessible, and hassle-free for all car owners.
                        </p>
                    </section>

                    {/* Features Layout */}
                    <div className="features-grid">
                        <div className="about-card">
                            <h3>🔧 Genuine Parts</h3>
                            <p>We source our inventory directly from trusted manufacturers to ensure reliability and performance. If it's not in stock, just request it via your dashboard!</p>
                        </div>
                        
                        <div className="about-card">
                            <h3> Expert Servicing</h3>
                            <p>Book appointments seamlessly through our platform. Our certified mechanics handle everything from routine checkups to complex automotive repairs.</p>
                        </div>

                        <div className="about-card">
                            <h3> Transparent History</h3>
                            <p>Keep track of everything effortlessly. We maintain a detailed digital record of all your past purchases, part requests, and service appointments.</p>
                        </div>
                    </div>

                    {/* Contact/Location Section */}
                    <section className="about-card contact-card">
                        <h3> Visit Us</h3>
                        <div className="contact-info">
                            <p><strong>Address:</strong> Patan, Lalitpur</p>
                            <p><strong>Email:</strong> support@gearup-parts.com</p>
                            <p><strong>Phone:</strong> +977 9811223344</p>
                            <p><strong>Working Hours:</strong> Mon - Sat (8:00 AM - 6:00 PM)</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;