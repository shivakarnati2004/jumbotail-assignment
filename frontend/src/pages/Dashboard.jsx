import { useEffect, useState } from 'react';
import { getStats, getOrders } from '../api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getStats(), getOrders()])
            .then(([s, o]) => {
                setStats(s.data);
                setOrders(o.data.slice(0, 6));
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="animate-in"><p style={{ color: 'var(--text-muted)' }}>Loading dashboard…</p></div>;

    const statCards = [
        { label: 'Total Orders', value: stats?.total_orders || 0, color: 'green', icon: '🧾', sub: `${stats?.pending_orders || 0} pending` },
        { label: 'Total Revenue', value: `₹${Number(stats?.total_revenue || 0).toLocaleString('en-IN')}`, color: 'orange', icon: '💰', sub: 'All time earnings' },
        { label: 'Customers', value: stats?.total_customers || 0, color: 'blue', icon: '🏪', sub: 'Kirana stores' },
        { label: 'Sellers', value: stats?.total_sellers || 0, color: 'purple', icon: '🏭', sub: 'Active suppliers' },
        { label: 'Products', value: stats?.total_products || 0, color: 'rose', icon: '📦', sub: 'In catalogue' },
        { label: 'Warehouses', value: stats?.total_warehouses || 0, color: 'cyan', icon: '🏬', sub: 'Across India' },
    ];

    const statusBadge = (status) => {
        const map = { delivered: 'badge-success', shipped: 'badge-info', processing: 'badge-warning', pending: 'badge-purple' };
        return <span className={`badge ${map[status] || 'badge-purple'}`}>{status}</span>;
    };

    return (
        <div className="animate-in">
            {/* Hero Banner */}
            <div className="hero-banner">
                <img src="/images/hero-kirana.png" alt="Kirana Store" />
                <div className="hero-banner-content">
                    <h2>Happiness. Prosperity. Delivered.</h2>
                    <p>India's leading B2B Marketplace and New Retail Platform connecting Kirana stores with brands and staples producers.</p>
                    <div className="hero-banner-tag">Jai Jawan, Jai Kisan, Jai Dukaan</div>
                </div>
            </div>

            <div className="stats-grid">
                {statCards.map((c) => (
                    <div key={c.label} className={`stat-card ${c.color}`}>
                        <div className="stat-card-header">
                            <span className="stat-card-label">{c.label}</span>
                            <div className={`stat-card-icon ${c.color}`}>{c.icon}</div>
                        </div>
                        <div className="stat-card-value">{c.value}</div>
                        <div className="stat-card-subtitle">{c.sub}</div>
                    </div>
                ))}
            </div>

            <div className="table-wrapper">
                <div className="table-header">
                    <h3>Recent Orders</h3>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Warehouse</th>
                                <th>Delivery</th>
                                <th>Shipping</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id}>
                                    <td style={{ fontWeight: 700, color: 'var(--jt-primary)' }}>#{String(o.id).padStart(4, '0')}</td>
                                    <td style={{ fontWeight: 500 }}>{o.customer_name}</td>
                                    <td>{o.product_name}</td>
                                    <td>{o.warehouse_name || '—'}</td>
                                    <td><span className={`badge ${o.delivery_speed === 'express' ? 'badge-warning' : 'badge-info'}`}>{o.delivery_speed}</span></td>
                                    <td>₹{Number(o.shipping_charge || 0).toLocaleString('en-IN')}</td>
                                    <td style={{ fontWeight: 600 }}>₹{Number(o.total_amount || 0).toLocaleString('en-IN')}</td>
                                    <td>{statusBadge(o.status)}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan="8" className="empty-state">No orders yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
