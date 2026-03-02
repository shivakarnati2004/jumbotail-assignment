import { useEffect, useState } from 'react';
import { getSellers, createSeller, updateSeller, deleteSeller } from '../api';
import Modal from '../components/Modal';

const empty = { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', lat: '', lng: '', gst_number: '', rating: 0 };

export default function Sellers() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); getSellers().then(r => setItems(r.data)).catch(() => { }).finally(() => setLoading(false)); };
    useEffect(load, []);

    const openAdd = () => { setForm(empty); setModal('add'); };
    const openEdit = (s) => { setForm({ ...s }); setModal(s); };
    const close = () => setModal(null);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        setSaving(true);
        try {
            if (modal === 'add') await createSeller(form);
            else await updateSeller(modal.id, form);
            close(); load();
        } catch (e) { alert(e.message); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this seller?')) return;
        try { await deleteSeller(id); load(); } catch (e) { alert(e.message); }
    };

    const stars = (r) => '⭐'.repeat(Math.round(Number(r) || 0));

    return (
        <div className="animate-in">
            <div className="page-header"><h1>Sellers</h1><p>Manage product suppliers</p></div>

            <div className="table-wrapper">
                <div className="table-header">
                    <h3>All Sellers ({items.length})</h3>
                    <button className="btn btn-primary" onClick={openAdd}>+ Add Seller</button>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>City</th><th>State</th><th>Rating</th><th>GST</th><th>Location</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan="9"><div className="loading-skeleton" style={{ height: 40, margin: 8 }}></div></td></tr>
                                : items.length === 0 ? <tr><td colSpan="9" className="empty-state">No sellers</td></tr>
                                    : items.map(s => (
                                        <tr key={s.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--jt-primary)' }}>#{s.id}</td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</td>
                                            <td>{s.phone || '—'}</td>
                                            <td>{s.city || '—'}</td>
                                            <td>{s.state || '—'}</td>
                                            <td>{stars(s.rating)} <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{Number(s.rating).toFixed(1)}</span></td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{s.gst_number || '—'}</td>
                                            <td style={{ fontSize: '0.78rem' }}>{Number(s.lat).toFixed(4)}, {Number(s.lng).toFixed(4)}</td>
                                            <td><div className="action-btns">
                                                <button className="btn btn-sm btn-ghost" onClick={() => openEdit(s)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Del</button>
                                            </div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Seller' : 'Edit Seller'} onClose={close} onSave={handleSave} saving={saving}>
                    <div className="form-row">
                        <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                        <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Email</label><input className="form-control" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                        <div className="form-group"><label>GST Number</label><input className="form-control" value={form.gst_number} onChange={e => set('gst_number', e.target.value)} /></div>
                    </div>
                    <div className="form-group"><label>Address</label><input className="form-control" value={form.address} onChange={e => set('address', e.target.value)} /></div>
                    <div className="form-row">
                        <div className="form-group"><label>City</label><input className="form-control" value={form.city} onChange={e => set('city', e.target.value)} /></div>
                        <div className="form-group"><label>State</label><input className="form-control" value={form.state} onChange={e => set('state', e.target.value)} /></div>
                        <div className="form-group"><label>Pincode</label><input className="form-control" value={form.pincode} onChange={e => set('pincode', e.target.value)} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Latitude</label><input className="form-control" type="number" step="0.0001" value={form.lat} onChange={e => set('lat', e.target.value)} /></div>
                        <div className="form-group"><label>Longitude</label><input className="form-control" type="number" step="0.0001" value={form.lng} onChange={e => set('lng', e.target.value)} /></div>
                        <div className="form-group"><label>Rating</label><input className="form-control" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} /></div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
