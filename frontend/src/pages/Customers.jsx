import { useEffect, useState } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api';
import Modal from '../components/Modal';

const empty = { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', lat: '', lng: '', gst_number: '' };

export default function Customers() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); getCustomers().then(r => setItems(r.data)).catch(() => { }).finally(() => setLoading(false)); };
    useEffect(load, []);

    const openAdd = () => { setForm(empty); setModal('add'); };
    const openEdit = (c) => { setForm({ ...c }); setModal(c); };
    const close = () => setModal(null);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        setSaving(true);
        try {
            if (modal === 'add') await createCustomer(form);
            else await updateCustomer(modal.id, form);
            close(); load();
        } catch (e) { alert(e.message); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this customer?')) return;
        try { await deleteCustomer(id); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>Customers</h1>
                <p>Manage Kirana store customers</p>
            </div>

            <div className="table-wrapper">
                <div className="table-header">
                    <h3>All Customers ({items.length})</h3>
                    <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>State</th><th>GST</th><th>Location</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="9"><div className="loading-skeleton" style={{ height: 40, margin: 8 }}></div></td></tr>
                                : items.length === 0 ? <tr><td colSpan="9" className="empty-state">No customers</td></tr>
                                    : items.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--jt-primary)' }}>#{c.id}</td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</td>
                                            <td>{c.phone}</td>
                                            <td>{c.email || '—'}</td>
                                            <td>{c.city || '—'}</td>
                                            <td>{c.state || '—'}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{c.gst_number || '—'}</td>
                                            <td style={{ fontSize: '0.78rem' }}>{Number(c.lat).toFixed(4)}, {Number(c.lng).toFixed(4)}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}>Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Del</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Customer' : 'Edit Customer'} onClose={close} onSave={handleSave} saving={saving}>
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
                    </div>
                </Modal>
            )}
        </div>
    );
}
