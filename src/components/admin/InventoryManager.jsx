
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, AlertTriangle, Package } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { inputStyle } from './Shared';

const InventoryManager = ({ showMessage }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('inventory').select('*').order('item_name');
        if (error) {
            if (error.code === 'PGRST116' || error.message.includes('not found')) {
                // Table doesn't exist yet, we'll show instruction or handle it
                setItems([]);
            } else {
                console.error(error);
                showMessage('Error loading inventory');
            }
        } else if (data) {
            setItems(data);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const itemData = {
            item_name: formData.get('item_name'),
            category: formData.get('category'),
            quantity: Number(formData.get('quantity')),
            unit: formData.get('unit'),
            min_stock: Number(formData.get('min_stock')),
            updated_at: new Date().toISOString()
        };

        try {
            let result;
            if (editingItem.id === 'new') {
                result = await supabase.from('inventory').insert([itemData]).select().single();
            } else {
                result = await supabase.from('inventory').update(itemData).eq('id', editingItem.id).select().single();
            }

            if (result.error) throw result.error;
            
            fetchInventory();
            setEditingItem(null);
            showMessage('Inventory updated!');
        } catch (err) {
            console.error(err);
            showMessage(`Error saving: ${err.message}`);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this item from inventory?')) return;
        const { error } = await supabase.from('inventory').delete().eq('id', id);
        if (error) showMessage('Error deleting item');
        else fetchInventory();
    };

    const filteredItems = items.filter(i => 
        i.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading inventory...</div>;

    // Handle case where table is missing
    if (!loading && items.length === 0 && !editingItem) {
         // This might mean table is empty or missing. 
         // We'll allow adding the first item which might trigger table error if it doesn't exist.
    }

    return (
        <div className="admin-card" style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            {!editingItem ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Package size={28} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Stock Inventory</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                             <input 
                                type="text" 
                                placeholder="Search inventory..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                style={{ ...inputStyle, width: '250px' }} 
                            />
                            <button onClick={() => setEditingItem({ id: 'new', unit: 'pcs', quantity: 0, min_stock: 5 })} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}>
                                <Plus size={18} /> Add Stock
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '10px' }}>Item Name</th>
                                    <th style={{ padding: '10px' }}>Category</th>
                                    <th style={{ padding: '10px' }}>Current Stock</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(item => {
                                    const isLow = item.quantity <= item.min_stock;
                                    return (
                                        <tr key={item.id} style={{ background: isLow ? '#fff1f2' : '#f8fafc', transition: 'all 0.2s' }}>
                                            <td style={{ padding: '15px', fontWeight: 600, borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>{item.item_name}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ padding: '4px 10px', background: '#e2e8f0', borderRadius: '20px', fontSize: '0.8rem' }}>{item.category || 'General'}</span>
                                            </td>
                                            <td style={{ padding: '15px', fontWeight: 700 }}>{item.quantity} {item.unit}</td>
                                            <td style={{ padding: '15px' }}>
                                                {isLow ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                                                        <AlertTriangle size={16} /> LOW STOCK
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>IN STOCK</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '15px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={18} /></button>
                                                    <button onClick={() => deleteItem(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredItems.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No items found in inventory.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h3 style={{ margin: 0 }}>{editingItem.id === 'new' ? 'Add New Stock' : 'Edit Stock Item'}</h3>
                        <button onClick={() => setEditingItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
                    </div>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Item Name</label>
                                <input name="item_name" defaultValue={editingItem.item_name} placeholder="e.g. Chicken Wings, Rice, Sugar..." required style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
                                <input name="category" defaultValue={editingItem.category} placeholder="e.g. Raw Meat, Dry Goods, Beverages" style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity</label>
                                    <input name="quantity" type="number" step="0.01" defaultValue={editingItem.quantity} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Unit</label>
                                    <select name="unit" defaultValue={editingItem.unit} style={inputStyle}>
                                        <option value="pcs">Pieces (pcs)</option>
                                        <option value="kg">Kilograms (kg)</option>
                                        <option value="g">Grams (g)</option>
                                        <option value="liters">Liters (L)</option>
                                        <option value="ml">Milliliters (ml)</option>
                                        <option value="packs">Packs</option>
                                        <option value="boxes">Boxes</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Minimum Stock Alert Level</label>
                                <input name="min_stock" type="number" defaultValue={editingItem.min_stock} required style={inputStyle} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>We'll highlight the row in red when stock falls below this number.</span>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', marginTop: '10px', fontSize: '1rem' }}>
                                {editingItem.id === 'new' ? 'Add to Inventory' : 'Update Item'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default InventoryManager;
