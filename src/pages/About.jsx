import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Coffee, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const About = () => {
    const [storeSettings, setStoreSettings] = useState({
        store_name: "Frankie's Cloud Kitchen",
        logo_url: '/frankies-logo.jpg'
    });

    useEffect(() => {
        const fetchStoreSettings = async () => {
            const { data } = await supabase.from('store_settings').select('*').limit(1).single();
            if (data) setStoreSettings(data);
        };
        fetchStoreSettings();
    }, []);

    return (
        <div className="page-wrapper">

            <main className="container" style={{ padding: '80px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', color: 'var(--primary)' }}>Real Flavors, Modern Convenience</h2>
                        <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                            {storeSettings.store_name} (formerly Frankie's at Cool Creams) is dedicated to bringing high-quality, delicious comfort food to the heart of Calamba. As a delivery-focused cloud kitchen, we prioritize speed, flavor, and the joy of a good meal shared at home.
                        </p>
                        <p style={{ lineHeight: '1.8' }}>
                            From our signature crispy chicken fingers with BBQ sauce to our creamy, indulgent milkshakes and frappes, every item on our menu is crafted with care using fresh ingredients. We aim to be your go-to choice for satisfying meals and sweet treats.
                        </p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80" alt="Delicious Chicken" style={{ width: '100%', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }} />
                </div>

            </main>
        </div >
    );
};

export default About;
