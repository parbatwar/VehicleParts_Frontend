import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { MapPin, Mail, Phone, Clock, Package, Wrench, ClipboardList } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <CustomerNavbar />
            <div className="about-container">

                {/* Header */}
                <div className="about-header">
                    <h2>About GearUp</h2>
                    <p className="about-headline">Your trusted partner for genuine parts &amp; professional servicing</p>
                    <p className="about-subtitle">
                        We make vehicle maintenance transparent, accessible, and hassle-free for every car owner in the valley.
                    </p>
                </div>

                {/* Mission */}
                <section className="mission-card">
                    <p>
                        GearUp was built with one goal — to eliminate the guesswork from vehicle care. 
                        We source genuine parts directly from trusted manufacturers, pair them with certified mechanics, 
                        and give you a clear digital record of everything your vehicle has ever needed. 
                        No surprises. No middlemen. Just reliable service.
                    </p>
                </section>

                {/* Features */}
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><Package size={20} strokeWidth={1.6} /></div>
                        <h3>Genuine Parts</h3>
                        <p>
                            Every part in our inventory is sourced directly from trusted manufacturers. 
                            Don't see what you need? Request it from your dashboard and we'll sort it out.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><Wrench size={20} strokeWidth={1.6} /></div>
                        <h3>Expert Servicing</h3>
                        <p>
                            Book appointments seamlessly through our platform. Our certified mechanics handle 
                            everything from routine checkups to complex repairs.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><ClipboardList size={20} strokeWidth={1.6} /></div>
                        <h3>Transparent History</h3>
                        <p>
                            A detailed digital record of all your past purchases, part requests, and service 
                            appointments — always at your fingertips.
                        </p>
                    </div>
                </div>

                {/* Contact */}
                <section className="contact-card">
                    <div className="contact-card-header">
                        <h3>Visit Us</h3>
                    </div>
                    <div className="contact-grid">
                        <div className="contact-item">
                            <div className="contact-item-icon"><MapPin size={16} strokeWidth={1.6} /></div>
                            <div className="contact-item-text">
                                <span className="contact-item-label">Address</span>
                                <span className="contact-item-value">Patan, Lalitpur</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-item-icon"><Mail size={16} strokeWidth={1.6} /></div>
                            <div className="contact-item-text">
                                <span className="contact-item-label">Email</span>
                                <span className="contact-item-value">support@gearup-parts.com</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-item-icon"><Phone size={16} strokeWidth={1.6} /></div>
                            <div className="contact-item-text">
                                <span className="contact-item-label">Phone</span>
                                <span className="contact-item-value">+977 9811223344</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-item-icon"><Clock size={16} strokeWidth={1.6} /></div>
                            <div className="contact-item-text">
                                <span className="contact-item-label">Working Hours</span>
                                <span className="contact-item-value">Mon – Sat, 8:00 AM – 6:00 PM</span>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;