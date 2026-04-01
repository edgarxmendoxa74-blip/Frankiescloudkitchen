import React, { useState } from 'react';
import { X, MessageSquare, Copy, CreditCard, Utensils, ShoppingBag as BagIcon, Truck } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

const CheckoutModal = () => {
    const {
        cart,
        cartTotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        clearCart,
        paymentSettings, // I'll need to pass these or fetch them
        orderTypes // Same here
    } = useCart();

    const [orderType, setOrderType] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        phone: '',
        address: '',
        village: '',
        delivery_mode: 'Store Delivery',
        landmark: ''
    });

    // We might need to fetch paymentSettings and orderTypes here if they aren't in CartContext
    // For now let's assume we fetch them here to be self-contained
    const [localPaymentSettings, setLocalPaymentSettings] = useState([]);
    const [localOrderTypes, setLocalOrderTypes] = useState([
        { id: 'dine-in', name: 'Dine-in' },
        { id: 'pickup', name: 'Take Out' },
        { id: 'delivery', name: 'Delivery' }
    ]);

    React.useEffect(() => {
        if (isCheckoutOpen) {
            const fetchData = async () => {
                const [payRes, typeRes] = await Promise.all([
                    supabase.from('payment_settings').select('*').eq('is_active', true),
                    supabase.from('order_types').select('*')
                ]);
                
                if (payRes.data) setLocalPaymentSettings(payRes.data);
                
                const FIXED_TYPES = [
                    { id: 'dine-in', name: 'Dine-in', defaultActive: true },
                    { id: 'pickup', name: 'Take Out', defaultActive: true },
                    { id: 'delivery', name: 'Delivery', defaultActive: true }
                ];
                
                const dbTypes = typeRes.data || [];
                const mergedTypes = FIXED_TYPES.map(ft => {
                    const existing = dbTypes.find(t => t.name.toLowerCase() === ft.name.toLowerCase());
                    return existing ? { ...ft, is_active: existing.is_active } : { ...ft, is_active: ft.defaultActive };
                }).filter(t => t.is_active); // Only keep the ones that are active
                
                setLocalOrderTypes(mergedTypes);
            };
            fetchData();
        }
    }, [isCheckoutOpen]);

    const handlePlaceOrder = async () => {
        if (!orderType) {
            alert('Please select an order type (Dine-in, Pickup, or Delivery).');
            return;
        }

        const { name, phone, table_number, address, pickup_time } = customerDetails;
        if (orderType === 'dine-in' && (!name || !table_number)) { alert('Please provide your Name and Table Number.'); return; }
        if (orderType === 'pickup' && (!name || !phone || !pickup_time)) { alert('Please provide Name, Phone Number, and Pickup Time.'); return; }
        if (orderType === 'delivery' && (!name || !phone || !address)) { alert('Please provide Name, Phone Number, and Delivery Address.'); return; }

        if (!paymentMethod) { alert('Please select a payment method.'); return; }

        setIsPlacingOrder(true);
        try {
            const itemDetails = cart.map(item => {
                let d = `${item.name} (x${item.quantity})`;
                if (item.selectedVariation) d += ` - ${item.selectedVariation.name}`;
                if (item.selectedFlavors && item.selectedFlavors.length > 0) d += ` [${item.selectedFlavors.join(', ')}]`;
                if (item.selectedAddons && item.selectedAddons.length > 0) d += ` + ${item.selectedAddons.map(a => a.name).join(', ')}`;
                return d;
            });

            const methodObj = localPaymentSettings.find(m => m.id === paymentMethod);
            const paymentMethodName = methodObj ? methodObj.name : paymentMethod;

            const orderDetailsStr = itemDetails.join('\n');
            const message = `
Hello! I'd like to place an order:

Order Type: ${orderType.toUpperCase()}
Payment Method: ${paymentMethodName}

Customer Details:
Name: ${customerDetails.name}
Phone: ${customerDetails.phone}
Address: ${customerDetails.address} ${customerDetails.village ? `(Village: ${customerDetails.village})` : ''}
Delivery Mode: ${customerDetails.delivery_mode}
Landmark: ${customerDetails.landmark}

Item Details:
${orderDetailsStr}

TOTAL AMOUNT: ₱${cartTotal}

${!paymentMethodName.toLowerCase().includes('cash') && !paymentMethodName.toLowerCase().includes('cod') ? '*I will send the payment screenshot shortly.*' : ''}

Thank you!`.trim();

            try {
                await navigator.clipboard.writeText(message);
                alert("✅ Order details copied to clipboard!\n\nYou will now be redirected to our Facebook Page. Please paste the details in our messages to confirm your order.");
            } catch (err) {
                console.warn("Clipboard copy failed.", err);
                alert("You will now be redirected to our Facebook Page to send your order.");
            }

            const newOrder = {
                order_type: orderType,
                payment_method: paymentMethodName,
                customer_details: customerDetails,
                items: itemDetails,
                total_amount: cartTotal,
                status: 'Pending'
            };

            const { error } = await supabase.from('orders').insert([newOrder]);
            if (error) throw error;

            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([...existingOrders, { ...newOrder, id: Date.now(), timestamp: new Date().toISOString() }]));

            const fbPageUrl = `https://www.facebook.com/frankies.cloudkitchen`;
            window.location.href = fbPageUrl;

            clearCart();
            setIsCheckoutOpen(false);
        } catch (error) {
            console.error('Error saving order:', error);
            alert('There was an error saving your order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (!isCheckoutOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
            <div style={{ background: 'white', maxWidth: '500px', width: '100%', borderRadius: '24px', padding: '30px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                <button onClick={() => setIsCheckoutOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
                <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', color: 'var(--primary)', fontFamily: 'Lexend, sans-serif' }}>Complete Your Order</h2>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ fontWeight: 700, fontSize: '1rem', display: 'block', marginBottom: '15px' }}>Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                        {localPaymentSettings.map(method => {
                            const isSelected = paymentMethod === method.id;
                            let icon = '💵';
                            const lowerName = method.name.toLowerCase();
                            if (lowerName.includes('gcash') || lowerName.includes('maya')) icon = '🔵';
                            if (lowerName.includes('qr') || lowerName.includes('ph')) icon = '🔳';
                            
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    style={{
                                        padding: '15px', borderRadius: '15px', border: '2px solid',
                                        borderColor: isSelected ? 'var(--primary)' : '#e2e8f0',
                                        background: isSelected ? '#fff1f2' : 'white',
                                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>{method.name}</div>
                                </button>
                            );
                        })}
                    </div>

                    {(() => {
                        if (!paymentMethod) return null;
                        const method = localPaymentSettings.find(m => m.id === paymentMethod);
                        if (!method) return null;
                        
                        const lowerName = method.name.toLowerCase();
                        const isCash = (lowerName.includes('cash') && !lowerName.includes('gcash')) || lowerName.includes('cod');
                        
                        return (
                            <>
                                {!isCash && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '5px', marginBottom: '15px' }}>
                                        ℹ️ After placing your order, please send a screenshot of your payment via Messenger.
                                    </p>
                                )}
                                
                                {!isCash && (method.account_number || method.qr_url) && (
                                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Send {method.name} Payment</h4>
                                            {method.qr_url && (
                                                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'inline-block', marginBottom: '20px' }}>
                                                    <img src={method.qr_url} style={{ width: '180px', height: '180px', borderRadius: '10px', objectFit: 'contain' }} alt="QR Code" />
                                                </div>
                                            )}
                                            {method.account_number && !method.name.toLowerCase().includes('qr') && (
                                                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Account Number</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
                                                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{method.account_number}</div>
                                                        <button
                                                            onClick={() => { navigator.clipboard.writeText(method.account_number); alert('Copied!'); }}
                                                            style={{ border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.8rem' }}
                                                        >
                                                            <Copy size={14} /> Copy
                                                        </button>
                                                    </div>
                                                    {method.account_name && <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{method.account_name}</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ fontWeight: 700, fontSize: '1rem', display: 'block', marginBottom: '15px' }}>How would you like to receive your order?</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                        {localOrderTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setOrderType(type.id)}
                                style={{
                                    padding: '15px', borderRadius: '15px', border: '2px solid',
                                    borderColor: orderType === type.id ? 'var(--primary)' : '#e2e8f0',
                                    background: orderType === type.id ? '#fff1f2' : 'white',
                                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '8px', color: orderType === type.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                                    {type.id === 'dine-in' && <Utensils size={24} style={{ margin: '0 auto' }} />}
                                    {type.id === 'pickup' && <BagIcon size={24} style={{ margin: '0 auto' }} />}
                                    {type.id === 'delivery' && <Truck size={24} style={{ margin: '0 auto' }} />}
                                    {!['dine-in', 'pickup', 'delivery'].includes(type.id) && <MessageSquare size={24} style={{ margin: '0 auto' }} />}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: orderType === type.id ? 'var(--primary)' : 'var(--text-muted)' }}>{type.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {orderType && (
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
                                <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })} style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="Your Name" />
                            </div>

                            {(orderType === 'delivery' || orderType === 'pickup') && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Phone Number</label>
                                    <input type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0' }} placeholder="09XX XXX XXXX" />
                                </div>
                            )}

                            {orderType === 'pickup' && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Pickup Time / Estimated Arrival</label>
                                    <input type="text" value={customerDetails.pickup_time || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, pickup_time: e.target.value })} style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0' }} placeholder="e.g. 5:30 PM, In 30 mins" />
                                </div>
                            )}

                            {orderType === 'dine-in' && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Table Number</label>
                                    <input type="text" value={customerDetails.table_number || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, table_number: e.target.value })} style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0' }} placeholder="e.g. Table 4" />
                                </div>
                            )}

                            {orderType === 'delivery' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Address (Please include Village)</label>
                                        <textarea value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '80px' }} placeholder="House Number, Street, Village/Subdivision" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Mode of Delivery</label>
                                        <select 
                                            value={customerDetails.delivery_mode} 
                                            onChange={(e) => setCustomerDetails({ ...customerDetails, delivery_mode: e.target.value })} 
                                            style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                                        >
                                            <option value="Store Delivery">Store Delivery</option>
                                            <option value="Lalamove/Grab">Lalamove/Grab (Booked by Customer)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Landmark / Instructions</label>
                                        <textarea
                                            value={customerDetails.landmark}
                                            onChange={(e) => setCustomerDetails({ ...customerDetails, landmark: e.target.value })}
                                            placeholder="e.g. Near blue gate, white house..."
                                            style={{ padding: '15px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '80px' }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Amount:</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>₱{cartTotal}</span>
                    </div>
                    <button
                        onClick={() => {
                            const methodObj = localPaymentSettings.find(m => m.id === paymentMethod);
                            const paymentMethodName = methodObj ? methodObj.name : paymentMethod || 'Not Selected';

                            const itemDetails = cart.map(item => {
                                let d = `${item.name} (x${item.quantity})`;
                                if (item.selectedVariation) d += ` - ${item.selectedVariation.name}`;
                                if (item.selectedFlavors && item.selectedFlavors.length > 0) d += ` [${item.selectedFlavors.join(', ')}]`;
                                if (item.selectedAddons && item.selectedAddons.length > 0) d += ` + ${item.selectedAddons.map(a => a.name).join(', ')}`;
                                return d;
                            });

                            const message = `
Hello! I'd like to place an order:

Order Type: ${(orderType || 'Not Selected').toUpperCase()}
Payment Method: ${paymentMethodName}

Customer Details:
Name: ${customerDetails.name}
Phone: ${customerDetails.phone}
Address: ${customerDetails.address} ${customerDetails.village ? `(Village: ${customerDetails.village})` : ''}
Delivery Mode: ${customerDetails.delivery_mode}
Landmark: ${customerDetails.landmark}

Item Details:
${itemDetails.join('\n')}

TOTAL AMOUNT: ₱${cartTotal}
`.trim();
                            navigator.clipboard.writeText(message);
                            alert('Order details manually copied!');
                        }}
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#e2e8f0', color: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, transition: 'background 0.2s' }}
                    >
                        <Copy size={16} /> Copy Order Details
                    </button>
                </div>

                <button
                    className={`btn-accent ${isPlacingOrder ? 'btn-loading' : ''}`}
                    onClick={handlePlaceOrder}
                    style={{ width: '100%', padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(255, 180, 0, 0.2)' }}
                >
                    <MessageSquare size={24} /> {isPlacingOrder ? 'Sending Order...' : 'Confirm & Message Store'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutModal;
