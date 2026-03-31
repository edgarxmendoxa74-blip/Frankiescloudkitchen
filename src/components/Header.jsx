import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

const Header = () => {
    const { cartCount, setIsCartOpen, categories, activeCategory, setActiveCategory } = useCart();
    const [storeSettings, setStoreSettings] = useState({
        open_time: '10:00',
        close_time: '22:00',
        manual_status: 'auto',
        logo_url: '/frankies-logo.jpg',
        store_name: "Frankie's Cloud Kitchen"
    });
    const location = useLocation();

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('store_settings').select('*').limit(1).single();
            if (data) {
                // Ensure correct brand name and logo fallback
                const correctName = data.store_name && data.store_name.includes("Oester") ? "Frankie's Cloud Kitchen" : data.store_name;
                const correctLogo = data.logo_url || '/frankies-logo.jpg';
                setStoreSettings({ ...data, store_name: correctName || "Frankie's Cloud Kitchen", logo_url: correctLogo });
            }
        };
        fetchSettings();
    }, []);

    const isStoreOpen = () => {
        if (storeSettings.manual_status === 'open') return true;
        if (storeSettings.manual_status === 'closed') return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [openH, openM] = (storeSettings.open_time || '10:00').split(':').map(Number);
        const [closeH, closeM] = (storeSettings.close_time || '01:00').split(':').map(Number);

        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        if (closeMinutes < openMinutes) {
            return currentTime >= openMinutes || currentTime < closeMinutes;
        }
        return currentTime >= openMinutes && currentTime < closeMinutes;
    };

    const isOpen = isStoreOpen();
    const isAdminPage = location.pathname.startsWith('/admin');

    if (isAdminPage) return null;

    return (
        <>
            <header className="app-header" style={{
                top: 0,
                padding: '12px 0',
                background: '#FFFFFF',
                borderBottom: '1px solid var(--border)',
                zIndex: 1100
            }}>
                <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        {storeSettings.logo_url ? (
                            <img src={storeSettings.logo_url} alt={storeSettings.store_name || "Frankie's Logo"} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
                        ) : (
                            <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Lexend, sans-serif' }}>
                                {storeSettings.store_name || "Frankie's Cloud Kitchen"}
                            </span>
                        )}
                    </Link>

                    {/* Navigation */}
                    <nav className="header-nav-container">
                        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>

                            className="btn-accent cart-btn-header"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={18} />
                            <span>Cart ({cartCount})</span>
                        </button>
                    </nav>

                </div>

                {/* Categories Row (Merged in Header) */}
                {location.pathname === '/' && categories.length > 0 && (
                    <div className="category-nav-wrapper" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: 'transparent', padding: '5px 0' }}>
                        <div className="container">
                            <div className="category-slider" style={{ padding: '8px 0' }}>
                                {categories.map(cat => (
                                    <div
                                        key={cat.id}
                                        className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        style={{
                                            border: '1px solid var(--border)',
                                            background: activeCategory === cat.id ? 'var(--primary)' : 'white',
                                            color: activeCategory === cat.id ? '#fff' : 'var(--text)',
                                            padding: '6px 16px',
                                            borderRadius: 'var(--radius)',
                                            fontWeight: 600,
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </header>

            <style>{`
                .header-nav-container { display: flex; align-items: center; gap: 30px; }
                .nav-link { position: relative; font-size: 0.95rem; text-decoration: none; color: var(--text); font-weight: 600; }
                .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -5px; left: 0; background-color: var(--primary); transition: width 0.3s; }
                .nav-link:hover::after { width: 100%; }
                .nav-link.active { color: var(--primary) !important; }
                .nav-link.active::after { width: 100%; }

                .cart-btn-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: var(--radius);
                    box-shadow: none;
                    border: 1px solid var(--accent);
                    background: transparent;
                    color: var(--accent);
                    cursor: pointer;
                    font-weight: 700;
                    transition: all 0.3s;
                }
                .cart-btn-header:hover {
                    background: var(--accent);
                    color: white;
                }

                .category-slider {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    scroll-behavior: smooth;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    padding: 5px 0;
                }
                .category-slider::-webkit-scrollbar {
                    display: none;
                }
                .category-item {
                    flex: 0 0 auto;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                }
                .category-item:hover {
                    background: rgba(255, 0, 144, 0.05) !important;
                    transform: translateY(-1px);
                }
                .category-item.active {
                    box-shadow: 0 4px 15px rgba(255, 0, 144, 0.25);
                }

                @media (max-width: 640px) {
                    .header-nav-container { gap: 15px !important; }
                    .nav-link { font-size: 0.8rem !important; }
                    .cart-btn-header { 
                        padding: 6px 10px !important; 
                        font-size: 0.75rem !important; 
                        gap: 4px !important;
                    }
                    .cart-btn-header svg {
                        width: 14px;
                        height: 14px;
                    }
                }
            `}</style>
        </>
    );
};

export default Header;
