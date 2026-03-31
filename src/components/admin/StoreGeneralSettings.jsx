import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Clock, FileText, Plus, X, ImageIcon } from 'lucide-react';
import { inputStyle } from './Shared';

const StoreGeneralSettings = ({ storeSettings, setStoreSettings, showMessage }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const getValidId = async (currentId) => {
        if (isUUID(currentId)) return currentId;
        // Try to fetch real ID from DB if current is invalid
        const { data } = await supabase.from('store_settings').select('id').limit(1).single();
        return data?.id || null;
    };

    const handleResetToDefaults = async () => {
        if (!window.confirm("This will overwrite current store settings with Frankie's Kitchen defaults. Continue?")) return;

        const defaults = {
            store_name: "Frankie's Cloud Kitchen",
            address: 'Calamba, Laguna',
            contact: '09563713967',
            open_time: '10:00',
            close_time: '22:00',
            manual_status: 'auto',
            banner_images: [],
            logo_url: ''
        };

        setIsProcessing(true);
        const targetId = await getValidId(storeSettings.id);

        const payload = targetId ? { id: targetId, ...defaults } : defaults;
        const { data, error } = await supabase.from('store_settings').upsert(payload).select().single();
        setIsProcessing(false);

        if (error) {
            showMessage(`Error resetting: ${error.message}`);
            return;
        }
        setStoreSettings(data);
        showMessage("Settings reset to Frankie's defaults!");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = {
            store_name: formData.get('storeName') || storeSettings.store_name || "Frankie's Cloud Kitchen",
            address: formData.get('address'),
            contact: formData.get('contact'),
            operating_hours: formData.get('operatingHours'),
            open_time: storeSettings.open_time,
            close_time: storeSettings.close_time,
            manual_status: storeSettings.manual_status,
            logo_url: storeSettings.logo_url
        };

        setIsProcessing(true);
        const targetId = await getValidId(storeSettings.id);

        const payload = targetId ? { id: targetId, ...updateData } : updateData;
        const { data, error } = await supabase.from('store_settings').upsert(payload).select().single();
        setIsProcessing(false);

        if (error) {
            console.error(error);
            showMessage(`Error saving: ${error.message}`);
            return;
        }
        setStoreSettings(data);
        showMessage('General settings saved!');
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1200; // Slightly larger for banners
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            const targetId = await getValidId(storeSettings.id);
            if (targetId) {
                await supabase.from('store_settings').update({ logo_url: '' }).eq('id', targetId);
            }
            setStoreSettings({ ...storeSettings, logo_url: '' });
            showMessage('Logo cleared.');
            return;
        }

        setIsProcessing(true);
        try {
            const logoData = await compressImage(file);
            const targetId = await getValidId(storeSettings.id);
            let error;
            if (targetId) {
                const res = await supabase.from('store_settings').update({ logo_url: logoData }).eq('id', targetId);
                error = res.error;
            } else {
                const res = await supabase.from('store_settings').upsert({ logo_url: logoData }).select().single();
                error = res.error;
                if (res.data) setStoreSettings(res.data);
            }
            if (error) throw error;
            if (targetId) setStoreSettings({ ...storeSettings, logo_url: logoData });
            showMessage('Logo updated!');
        } catch (error) {
            console.error(error);
            showMessage(`Error saving logo: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsProcessing(true);
            try {
                const compressedData = await compressImage(file);
                const newBanners = [...(storeSettings.banner_images || []), compressedData];
                const targetId = await getValidId(storeSettings.id);
                let error;
                if (targetId) {
                    const res = await supabase.from('store_settings').update({ banner_images: newBanners }).eq('id', targetId);
                    error = res.error;
                } else {
                    const res = await supabase.from('store_settings').upsert({ banner_images: newBanners }).select().single();
                    error = res.error;
                    if (res.data) setStoreSettings(res.data);
                }
                if (error) throw error;
                if (targetId) setStoreSettings({ ...storeSettings, banner_images: newBanners });
                showMessage('Banner uploaded!');
            } catch (error) {
                console.error(error);
                showMessage(`Error saving banner: ${error.message}`);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const removeBanner = async (index) => {
        const newBanners = (storeSettings.banner_images || []).filter((_, i) => i !== index);
        const targetId = await getValidId(storeSettings.id);

        if (!targetId) {
            setStoreSettings({ ...storeSettings, banner_images: newBanners });
            return;
        }
        const { error } = await supabase.from('store_settings').update({ banner_images: newBanners }).eq('id', targetId);
        if (error) {
            console.error(error);
            showMessage(`Error removing: ${error.message}`);
            return;
        }
        setStoreSettings({ ...storeSettings, banner_images: newBanners });
        showMessage('Banner removed.');
    };


    return (
        <div className="admin-card" style={{ background: 'white', padding: '30px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Store Settings</h2>
                <button
                    type="button"
                    onClick={handleResetToDefaults}
                    style={{
                        background: '#f1f5f9',
                        color: '#64748b',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                    Reset to Frankie's Defaults
                </button>
            </div>

            <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ImageIcon size={20} /> Store Logo
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={storeSettings.logo_url || '/frankies-logo.jpg'}
                                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                    alt="Store Logo"
                                />
                                {storeSettings.logo_url && (
                                    <button
                                        type="button"
                                        onClick={() => handleLogoUpload({ target: { files: [] } })}
                                        style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#64748b' }}>Upload your store logo. Recommended size: 512x512px.</p>
                                <label style={{
                                    display: 'inline-block',
                                    padding: '8px 16px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}>
                                    Change Logo
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={20} /> Store Information
                        </h3>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div><label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Address</label><input name="address" defaultValue={storeSettings.address} style={inputStyle} /></div>
                             <div><label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Contact Number</label><input name="contact" defaultValue={storeSettings.contact} style={inputStyle} /></div>
                             <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Operating Hours</label>
                                <input name="operatingHours" defaultValue={storeSettings.operating_hours || "Open daily from:\n5:00 AM - 12:00 AM"} style={inputStyle} placeholder="e.g. Open daily from: 5:00 AM - 12:00 AM" />
                             </div>
                        </div>
                    </div>



                    <div style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ImageIcon size={20} /> Hero Slideshow Banners
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {(storeSettings.banner_images || []).map((url, i) => (
                                <div key={i} style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow)' }}>
                                    <img src={url} style={{ width: '100%', height: '140px', objectFit: 'cover' }} alt={`Banner ${i}`} />
                                    <button
                                        type="button"
                                        onClick={() => removeBanner(i)}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(239, 68, 68, 0.9)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <X size={18} />
                                    </button>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 10px', fontSize: '0.7rem', textAlign: 'center' }}>
                                        Banner {i + 1}
                                    </div>
                                </div>
                            ))}
                            <label style={{
                                height: '140px',
                                border: '3px dashed var(--primary)',
                                borderRadius: '16px',
                                background: '#fff5f5',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.3s',
                                fontWeight: 700
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = 'var(--primary-dark)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            >
                                <Plus size={32} />
                                <span style={{ fontSize: '0.9rem' }}>Add New Banner</span>
                                <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isProcessing}
                    className={`btn-primary ${isProcessing ? 'btn-loading' : ''}`}
                    style={{ marginTop: '40px', width: '100%', padding: '15px' }}
                >
                    {isProcessing ? 'Saving All Settings...' : 'Save All Settings'}
                </button>
            </form>
        </div>
    );
};

export default StoreGeneralSettings;
