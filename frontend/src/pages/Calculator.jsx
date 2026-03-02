import { useEffect, useState } from 'react';
import { getSellers, getCustomers, getProducts, calculateShipping, createOrder } from '../api';
import GoogleMap from '../components/GoogleMap';

const transportModes = [
    { value: 'auto', icon: '🔄', name: 'Auto', range: 'Based on distance', rate: 'Auto-detected' },
    { value: 'Mini Van', icon: '🚐', name: 'Mini Van', range: '0 – 100 km', rate: '₹3/km/kg' },
    { value: 'Truck', icon: '🚛', name: 'Truck', range: '100 – 500 km', rate: '₹2/km/kg' },
    { value: 'Aeroplane', icon: '✈️', name: 'Aeroplane', range: '500+ km', rate: '₹1/km/kg' },
];

export default function Calculator() {
    const [sellers, setSellers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [form, setForm] = useState({ sellerId: '', customerId: '', deliverySpeed: 'standard', productId: '', transportMode: 'auto' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [savedOrder, setSavedOrder] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        Promise.all([getSellers(), getCustomers(), getProducts()])
            .then(([s, c, p]) => { setSellers(s.data); setCustomers(c.data); setAllProducts(p.data); })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (form.sellerId) {
            setProducts(allProducts.filter(p => p.seller_id === parseInt(form.sellerId)));
            setForm(f => ({ ...f, productId: '' }));
        } else {
            setProducts([]);
        }
    }, [form.sellerId, allProducts]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // Get selected entities for map
    const selectedSeller = sellers.find(s => s.id === parseInt(form.sellerId));
    const selectedCustomer = customers.find(c => c.id === parseInt(form.customerId));

    const mapLocations = [];
    if (selectedSeller) mapLocations.push({ name: selectedSeller.name, lat: parseFloat(selectedSeller.lat), lng: parseFloat(selectedSeller.lng), color: '#f5841f' });
    if (selectedCustomer) mapLocations.push({ name: selectedCustomer.name, lat: parseFloat(selectedCustomer.lat), lng: parseFloat(selectedCustomer.lng), color: '#2d8e3c' });

    const handleCalculate = async () => {
        setError('');
        if (!form.sellerId || !form.customerId) {
            setError('Please select both a seller and a customer.');
            return;
        }
        setLoading(true);
        try {
            const body = {
                sellerId: parseInt(form.sellerId),
                customerId: parseInt(form.customerId),
                deliverySpeed: form.deliverySpeed,
            };
            if (form.productId) body.productId = parseInt(form.productId);
            if (form.transportMode !== 'auto') body.transportMode = form.transportMode;
            const res = await calculateShipping(body);
            setResult(res.data);
            setSavedOrder(null); // reset saved state for new calculation
        } catch (e) {
            setError(e.message);
            setResult(null);
        }
        setLoading(false);
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>Shipping Calculator</h1>
                <p>Calculate shipping charges between sellers and Kirana store customers</p>
            </div>

            {/* Map showing seller and customer locations */}
            {mapLocations.length > 0 && (
                <div className="map-section">
                    <div className="map-section-header">
                        <h3>📍 Route Map</h3>
                    </div>
                    <GoogleMap
                        locations={mapLocations}
                        center={mapLocations[0]}
                        zoom={6}
                        height={280}
                    />
                </div>
            )}

            <div className="calculator-container">
                <div className="calculator-form">
                    <h3 style={{ marginBottom: 24, fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: 'var(--jt-dark)' }}>📐 Enter Shipping Details</h3>

                    <div className="form-group">
                        <label>Seller</label>
                        <select className="form-control" value={form.sellerId} onChange={e => set('sellerId', e.target.value)}>
                            <option value="">Select a seller…</option>
                            {sellers.map(s => <option key={s.id} value={s.id}>{s.name} — {s.city}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product (optional — for weight-based pricing)</label>
                        <select className="form-control" value={form.productId} onChange={e => set('productId', e.target.value)} disabled={!form.sellerId}>
                            <option value="">Default (1 kg)</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.weight_kg}kg — ₹{p.price}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Customer (Kirana Store)</label>
                        <select className="form-control" value={form.customerId} onChange={e => set('customerId', e.target.value)}>
                            <option value="">Select a customer…</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.city}</option>)}
                        </select>
                    </div>

                    {/* Transport Mode Selection */}
                    <div className="form-group">
                        <label>Transport Mode</label>
                        <div className="transport-cards">
                            {transportModes.map(t => (
                                <div
                                    key={t.value}
                                    className={`transport-card ${form.transportMode === t.value ? 'active' : ''}`}
                                    onClick={() => set('transportMode', t.value)}
                                >
                                    <div className="transport-card-icon">{t.icon}</div>
                                    <div className="transport-card-name">{t.name}</div>
                                    <div className="transport-card-range">{t.range}</div>
                                    <div className="transport-card-rate">{t.rate}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Speed */}
                    <div className="form-group">
                        <label>Delivery Speed</label>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {['standard', 'express'].map(speed => (
                                <label key={speed} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                                    border: `2px solid ${form.deliverySpeed === speed ? (speed === 'standard' ? 'var(--jt-primary)' : 'var(--jt-orange)') : 'var(--border-light)'}`,
                                    background: form.deliverySpeed === speed ? (speed === 'standard' ? '#ecfdf5' : '#fff7ed') : 'var(--bg-input)',
                                    cursor: 'pointer', transition: 'all 0.15s ease', textTransform: 'none', letterSpacing: 0, fontSize: '0.88rem'
                                }}>
                                    <input type="radio" name="speed" value={speed} checked={form.deliverySpeed === speed}
                                        onChange={() => set('deliverySpeed', speed)} style={{ accentColor: speed === 'standard' ? 'var(--jt-primary)' : 'var(--jt-orange)' }} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--jt-dark)', textTransform: 'capitalize' }}>{speed === 'standard' ? '📦 Standard' : '⚡ Express'}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                            {speed === 'standard' ? '₹10 courier + shipping' : '₹10 courier + ₹1.2/kg extra + shipping'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {error && <div style={{ color: '#e11d48', fontSize: '0.85rem', marginBottom: 16, padding: '10px 14px', background: '#fff1f2', borderRadius: 'var(--radius-sm)', border: '1px solid #fecdd3' }}>⚠️ {error}</div>}

                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.9rem' }}
                        onClick={handleCalculate} disabled={loading}>
                        {loading ? 'Calculating…' : '🚀 Calculate Shipping Charge'}
                    </button>
                </div>

                <div className="calculator-result">
                    {!result ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🚚</div>
                            <h3>Ready to calculate</h3>
                            <p>Select a seller and customer, then hit calculate to see the shipping breakdown.</p>
                        </div>
                    ) : (
                        <>
                            <div className="result-total">
                                <div className="result-total-label">Total Shipping Charge</div>
                                <div className="result-total-value">₹{result.shippingCharge?.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="result-breakdown">
                                <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Breakdown</h4>
                                <div className="result-row">
                                    <span className="result-row-label">📍 Distance</span>
                                    <span className="result-row-value">{result.breakdown?.distanceKm} km</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-row-label">🚛 Transport Mode</span>
                                    <span className="result-row-value"><span className="badge badge-info">{result.breakdown?.transportMode}</span></span>
                                </div>
                                <div className="result-row">
                                    <span className="result-row-label">⚖️ Weight</span>
                                    <span className="result-row-value">{result.breakdown?.weightKg} kg</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-row-label">💰 Rate</span>
                                    <span className="result-row-value">₹{result.breakdown?.ratePerKmPerKg}/km/kg</span>
                                </div>
                                <div className="result-row" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                                    <span className="result-row-label">📬 Courier Charge</span>
                                    <span className="result-row-value">₹{result.breakdown?.courierCharge}</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-row-label">📦 Base Shipping</span>
                                    <span className="result-row-value">₹{result.breakdown?.baseShippingCharge?.toLocaleString('en-IN')}</span>
                                </div>
                                {result.breakdown?.expressCharge > 0 && (
                                    <div className="result-row">
                                        <span className="result-row-label">⚡ Express Surcharge</span>
                                        <span className="result-row-value" style={{ color: 'var(--jt-orange)' }}>₹{result.breakdown?.expressCharge}</span>
                                    </div>
                                )}
                                <div className="result-row" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                                    <span className="result-row-label">🏬 Nearest Warehouse</span>
                                    <span className="result-row-value">{result.nearestWarehouse?.warehouseName || result.warehouse?.name || '—'}</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-row-label">🏭 Seller</span>
                                    <span className="result-row-value">{result.seller?.name || '—'}</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-row-label">🏪 Customer</span>
                                    <span className="result-row-value">{result.customer?.name || '—'}</span>
                                </div>
                            </div>

                            {/* Save & Proceed Section */}
                            <div style={{
                                marginTop: 24, padding: '20px 0 0',
                                borderTop: '2px solid var(--border-light)',
                            }}>
                                {savedOrder ? (
                                    <div style={{
                                        textAlign: 'center', padding: '16px',
                                        background: '#ecfdf5', borderRadius: 'var(--radius-md)',
                                        border: '1px solid #a7f3d0',
                                    }}>
                                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                                        <div style={{ fontWeight: 700, color: '#059669', fontSize: '1rem', marginBottom: 4 }}>
                                            Order Saved Successfully!
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                            Order <strong>#{String(savedOrder.id).padStart(4, '0')}</strong> created with status <span className="badge badge-purple">pending</span>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                            Total: ₹{Number(savedOrder.total_amount || 0).toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => { setResult(null); setSavedOrder(null); setQuantity(1); }}>
                                                🔄 New Calculation
                                            </button>
                                            <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/orders'}>
                                                📋 View Orders
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: 14 }}>
                                            <label style={{
                                                display: 'block', fontSize: '0.72rem', fontWeight: 700,
                                                color: 'var(--text-muted)', textTransform: 'uppercase',
                                                letterSpacing: '0.06em', marginBottom: 6,
                                            }}>Quantity</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }}
                                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    style={{ width: 70, textAlign: 'center', padding: '8px' }}
                                                    value={quantity}
                                                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                    min="1"
                                                />
                                                <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }}
                                                    onClick={() => setQuantity(q => q + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 16px', background: '#fafbfd', borderRadius: 'var(--radius-sm)',
                                            marginBottom: 14, border: '1px solid var(--border-light)',
                                        }}>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Estimated Total Amount</span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--jt-dark)' }}>
                                                ₹{((result.shippingCharge || 0) + (result.breakdown?.productPrice || 0) * quantity).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                width: '100%', justifyContent: 'center', padding: '14px',
                                                fontSize: '0.92rem',
                                                background: 'linear-gradient(135deg, var(--jt-primary), var(--jt-orange))',
                                            }}
                                            disabled={saving}
                                            onClick={async () => {
                                                setSaving(true);
                                                try {
                                                    const orderData = {
                                                        customer_id: parseInt(form.customerId),
                                                        seller_id: parseInt(form.sellerId),
                                                        product_id: form.productId ? parseInt(form.productId) : null,
                                                        warehouse_id: result.nearestWarehouse?.warehouseId || result.warehouse?.id || null,
                                                        quantity,
                                                        delivery_speed: form.deliverySpeed,
                                                        transport_mode: result.breakdown?.transportMode,
                                                        distance_km: result.breakdown?.distanceKm,
                                                        shipping_charge: result.shippingCharge,
                                                        total_amount: (result.shippingCharge || 0) + (result.breakdown?.productPrice || 0) * quantity,
                                                        status: 'pending',
                                                    };
                                                    const res = await createOrder(orderData);
                                                    setSavedOrder(res.data);
                                                } catch (e) {
                                                    alert('Failed to save order: ' + e.message);
                                                }
                                                setSaving(false);
                                            }}
                                        >
                                            {saving ? '⏳ Saving Order…' : '💾 Save & Proceed to Order'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
