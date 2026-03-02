import { useEffect, useState } from 'react';
import { getOrders, deleteOrder, updateOrder } from '../api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => { setLoading(true); getOrders().then(r => setOrders(r.data)).catch(() => { }).finally(() => setLoading(false)); };
    useEffect(load, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this order?')) return;
        try { await deleteOrder(id); load(); } catch (e) { alert(e.message); }
    };

    const handleStatusChange = async (id, status) => {
        try { await updateOrder(id, { status }); load(); } catch (e) { alert(e.message); }
    };

    const statusBadge = (st) => {
        const map = { delivered: 'badge-success', shipped: 'badge-info', processing: 'badge-warning', pending: 'badge-purple' };
        return <span className={`badge ${map[st] || 'badge-purple'}`}>{st}</span>;
    };

    return (
        <div className="animate-in">
            <div className="page-header"><h1>Orders</h1><p>View and manage all orders</p></div>

            <div className="table-wrapper">
                <div className="table-header">
                    <h3>All Orders ({orders.length})</h3>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th><th>Customer</th><th>Product</th><th>Seller</th><th>Warehouse</th><th>Qty</th>
                                <th>Delivery</th><th>Transport</th><th>Distance</th><th>Shipping</th><th>Total</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="13"><div className="loading-skeleton" style={{ height: 40, margin: 8 }}></div></td></tr>
                                : orders.length === 0 ? <tr><td colSpan="13" className="empty-state">No orders yet</td></tr>
                                    : orders.map(o => (
                                        <tr key={o.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--jt-primary)' }}>#{String(o.id).padStart(4, '0')}</td>
                                            <td>{o.customer_name}</td>
                                            <td>{o.product_name}</td>
                                            <td>{o.seller_name}</td>
                                            <td>{o.warehouse_name || '—'}</td>
                                            <td>{o.quantity}</td>
                                            <td><span className={`badge ${o.delivery_speed === 'express' ? 'badge-warning' : 'badge-info'}`}>{o.delivery_speed}</span></td>
                                            <td>{o.transport_mode || '—'}</td>
                                            <td>{o.distance_km ? `${o.distance_km} km` : '—'}</td>
                                            <td>₹{Number(o.shipping_charge || 0).toLocaleString('en-IN')}</td>
                                            <td style={{ fontWeight: 600 }}>₹{Number(o.total_amount || 0).toLocaleString('en-IN')}</td>
                                            <td>
                                                <select className="form-control" style={{ padding: '4px 8px', fontSize: '0.75rem', minWidth: 100 }}
                                                    value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>Del</button>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
