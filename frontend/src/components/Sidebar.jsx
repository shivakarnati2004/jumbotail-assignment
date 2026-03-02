import { NavLink } from 'react-router-dom';

const navItems = [
    { section: 'Overview' },
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/calculator', label: 'Shipping Calculator', icon: '🚚' },
    { section: 'Management' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/customers', label: 'Customers', icon: '🏪' },
    { path: '/sellers', label: 'Sellers', icon: '🏭' },
    { path: '/warehouses', label: 'Warehouses', icon: '🏬' },
    { path: '/orders', label: 'Orders', icon: '🧾' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img
                    src="/jumbotail-logo.svg"
                    alt="Jumbotail"
                    style={{ width: 38, height: 38, flexShrink: 0 }}
                />
                <div className="sidebar-brand-text">
                    <h2>Jumbotail</h2>
                    <span>B2B Marketplace</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item, i) =>
                    item.section ? (
                        <div key={i} className="sidebar-section-label">{item.section}</div>
                    ) : (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    )
                )}
            </nav>
            <div style={{
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
            }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>
                    Jumbotail Technologies Pvt. Ltd.
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
                    © 2026 All rights reserved
                </div>
            </div>
        </aside>
    );
}
