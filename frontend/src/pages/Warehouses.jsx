import { useEffect, useState } from 'react';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../api';
import Modal from '../components/Modal';
import GoogleMap from '../components/GoogleMap';

const empty = { name: '', address: '', city: '', state: '', pincode: '', lat: '', lng: '', capacity: 10000 };

export default function Warehouses() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); getWarehouses().then(r => setItems(r.data)).catch(() => { }).finally(() => setLoading(false)); };
    useEffect(load, []);

    const openAdd = () => { setForm(empty); setModal('add'); };
    const openEdit = (w) => { setForm({ ...w }); setModal(w); };
    const close = () => setModal(null);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        setSaving(true);
        try {
            if (modal === 'add') await createWarehouse(form);
            else await updateWarehouse(modal.id, form);
            close(); load();
        } catch (e) { alert(e.message); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this warehouse?')) return;
        try { await deleteWarehouse(id); load(); } catch (e) { alert(e.message); }
    };

    const mapLocations = items.map(w => ({
        name: w.name,
        lat: parseFloat(w.lat),
        lng: parseFloat(w.lng),
        color: '#2d8e3c',
    }));

    return (
        <div className="animate-in">
            <div className="page-header"><h1>Warehouses</h1><p>Manage warehouse locations across India</p></div>

            {/* Map of all warehouses */}
            {mapLocations.length > 0 && (
                <div className="map-section">
                    <div className="map-section-header">
                        <h3>📍 Warehouse Locations Across India</h3>
                    </div>
                    <GoogleMap locations={mapLocations} height={320} />
                </div>
            )}

            <div className="table-wrapper">
                <div className="table-header">
                    <h3>All Warehouses ({items.length})</h3>
                    <button className="btn btn-primary" onClick={openAdd}>+ Add Warehouse</button>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>ID</th><th>Name</th><th>City</th><th>State</th><th>Pincode</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan="9"><div className="loading-skeleton" style={{ height: 40, margin: 8 }}></div></td></tr>
                                : items.length === 0 ? <tr><td colSpan="9" className="empty-state">No warehouses</td></tr>
                                    : items.map(w => (
                                        <tr key={w.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--jt-primary)' }}>#{w.id}</td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{w.name}</td>
                                            <td>{w.city || '—'}</td>
                                            <td>{w.state || '—'}</td>
                                            <td>{w.pincode || '—'}</td>
                                            <td>{Number(w.capacity).toLocaleString()}</td>
                                            <td style={{ fontSize: '0.78rem' }}>{Number(w.lat).toFixed(4)}, {Number(w.lng).toFixed(4)}</td>
                                            <td><span className={`badge ${w.is_active ? 'badge-success' : 'badge-danger'}`}>{w.is_active ? 'Active' : 'Inactive'}</span></td>
                                            <td><div className="action-btns">
                                                <button className="btn btn-sm btn-ghost" onClick={() => openEdit(w)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(w.id)}>Del</button>
                                            </div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Warehouse' : 'Edit Warehouse'} onClose={close} onSave={handleSave} saving={saving}>
                    <div className="form-row">
                        <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. BLR_Warehouse" /></div>
                        <div className="form-group"><label>Capacity</label><input className="form-control" type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} /></div>
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
