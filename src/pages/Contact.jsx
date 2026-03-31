import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Contact = () => {
    const [storeSettings, setStoreSettings] = useState({
        store_name: "Frankie's Cloud Kitchen",
        address: 'Calamba, Laguna',
        contact: '09563713967',
        open_time: '10:00',
        close_time: '22:00',
        logo_url: '/frankies-logo.jpg'
    });

    useEffect(() => {
        const fetchStoreSettings = async () => {
            const { data } = await supabase.from('store_settings').select('*').limit(1).single();
            if (data) setStoreSettings(data);
        };
        fetchStoreSettings();
    }, []);

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    return (
        <div className="page-wrapper">

            <main className="container" style={{ padding: '80px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '15px' }}>Visit Us</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ background: 'var(--bg)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent)' }}>
                            <MapPin size={28} />
                        </div>
                        <h3 style={{ marginBottom: '12px' }}>Our Location</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {storeSettings.address}
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ background: 'var(--bg)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent)' }}>
                            <Phone size={28} />
                        </div>
                        <h3 style={{ marginBottom: '12px' }}>Contact</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {storeSettings.contact}
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ background: 'var(--bg)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent)' }}>
                            <Clock size={28} />
                        </div>
                        <h3 style={{ marginBottom: '12px' }}>Hours</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {storeSettings.operating_hours || `Open daily from: \n ${formatTime(storeSettings.open_time)} - ${formatTime(storeSettings.close_time)}`}
                        </p>
                    </div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <a 
                        href="https://m.me/frankies.cloudkitchen" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-accent" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 40px', borderRadius: '15px', textDecoration: 'none', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    >
                        <Facebook size={26} /> Message us on Messenger
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Contact;
