import { useState } from 'react';

export default function Modal({ title, onClose, children, onSave, saving }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal animate-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="btn btn-icon btn-ghost" onClick={onClose} style={{ fontSize: '1.2rem' }}>✕</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={onSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
