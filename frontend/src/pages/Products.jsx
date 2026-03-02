import { useEffect, useState } from 'react';
import { getProducts, getSellers, createProduct, updateProduct, deleteProduct } from '../api';
import Modal from '../components/Modal';

const emptyProduct = { seller_id: '', name: '', description: '', category: '', price: '', weight_kg: '', dimension_l_cm: '', dimension_w_cm: '', dimension_h_cm: '', sku: '', stock_qty: '', image_url: '' };

export default function Products() {
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | {product}
    const [form, setForm] = useState(emptyProduct);
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        Promise.all([getProducts(), getSellers()])
            .then(([p, s]) => { setProducts(p.data); setSellers(s.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openAdd = () => { setForm(emptyProduct); setModal('add'); };
    const openEdit = (p) => { setForm({ ...p }); setModal(p); };
    const close = () => setModal(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (modal === 'add') await createProduct(form);
            else await updateProduct(modal.id, form);
            close();
            load();
        } catch (e) { alert(e.message); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try { await deleteProduct(id); load(); } catch (e) { alert(e.message); }
    };

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>Products</h1>
                <p>Manage your product catalogue</p>
            </div>

            <div className="table-wrapper">
                <div className="table-header">
                    <h3>All Products ({products.length})</h3>
                    <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Category</th><th>Seller</th><th>Price</th><th>Weight</th><th>SKU</th><th>Stock</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9"><div className="loading-skeleton" style={{ height: 40, margin: 8 }}></div></td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="9" className="empty-state">No products found</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--jt-primary)' }}>#{p.id}</td>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</td>
                                    <td><span className="badge badge-info">{p.category || '—'}</span></td>
                                    <td>{p.seller_name}</td>
                                    <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                                    <td>{p.weight_kg} kg</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{p.sku || '—'}</td>
                                    <td>{p.stock_qty}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="btn btn-sm btn-ghost" onClick={() => openEdit(p)}>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Del</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={close} onSave={handleSave} saving={saving}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Product name" />
                        </div>
                        <div className="form-group">
                            <label>Seller</label>
                            <select className="form-control" value={form.seller_id} onChange={(e) => set('seller_id', e.target.value)}>
                                <option value="">Select seller</option>
                                {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input className="form-control" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short description" />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <input className="form-control" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Snacks" />
                        </div>
                        <div className="form-group">
                            <label>SKU</label>
                            <input className="form-control" value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="e.g. NES-MAG-500" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input className="form-control" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Weight (Kg)</label>
                            <input className="form-control" type="number" step="0.001" value={form.weight_kg} onChange={(e) => set('weight_kg', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Stock Qty</label>
                            <input className="form-control" type="number" value={form.stock_qty} onChange={(e) => set('stock_qty', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Length (cm)</label>
                            <input className="form-control" type="number" value={form.dimension_l_cm} onChange={(e) => set('dimension_l_cm', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Width (cm)</label>
                            <input className="form-control" type="number" value={form.dimension_w_cm} onChange={(e) => set('dimension_w_cm', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Height (cm)</label>
                            <input className="form-control" type="number" value={form.dimension_h_cm} onChange={(e) => set('dimension_h_cm', e.target.value)} />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
