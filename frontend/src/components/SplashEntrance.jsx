import { useState, useEffect } from 'react';

export default function SplashEntrance({ onEnter }) {
    const [phase, setPhase] = useState(0); // 0=loading, 1=logo, 2=text, 3=cta
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 400),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const handleEnter = () => {
        setExiting(true);
        setTimeout(onEnter, 800);
    };

    return (
        <div className={`splash-entrance ${exiting ? 'splash-exit' : ''}`}>
            {/* Animated background with parallax layers */}
            <div className="splash-bg">
                <div className="splash-bg-layer splash-bg-1"></div>
                <div className="splash-bg-layer splash-bg-2"></div>
                <div className="splash-bg-overlay"></div>
            </div>

            {/* Floating particles */}
            <div className="splash-particles">
                {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="splash-particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${6 + Math.random() * 8}s`,
                        width: `${3 + Math.random() * 6}px`,
                        height: `${3 + Math.random() * 6}px`,
                        opacity: 0.2 + Math.random() * 0.3,
                    }}></div>
                ))}
            </div>

            {/* Content */}
            <div className="splash-content">
                {/* Logo */}
                <div className={`splash-logo ${phase >= 1 ? 'splash-visible' : ''}`}>
                    <img src="/jumbotail-logo.svg" alt="Jumbotail" className="splash-logo-img" />
                </div>

                {/* Brand name */}
                <h1 className={`splash-title ${phase >= 1 ? 'splash-visible' : ''}`}>
                    Jumbotail
                </h1>

                {/* Tagline */}
                <p className={`splash-subtitle ${phase >= 2 ? 'splash-visible' : ''}`}>
                    India's leading B2B Marketplace and New Retail Platform
                    <br />for food and grocery
                </p>

                {/* Motto */}
                <div className={`splash-motto ${phase >= 2 ? 'splash-visible' : ''}`}>
                    Jai Jawan, Jai Kisan, Jai Dukaan
                </div>

                {/* Features */}
                <div className={`splash-features ${phase >= 3 ? 'splash-visible' : ''}`}>
                    <div className="splash-feature">
                        <span className="splash-feature-icon">🏪</span>
                        <span>250K+ Kirana Stores</span>
                    </div>
                    <div className="splash-feature-divider"></div>
                    <div className="splash-feature">
                        <span className="splash-feature-icon">🏙️</span>
                        <span>50+ Cities</span>
                    </div>
                    <div className="splash-feature-divider"></div>
                    <div className="splash-feature">
                        <span className="splash-feature-icon">📦</span>
                        <span>Next Day Delivery</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    className={`splash-cta ${phase >= 3 ? 'splash-visible' : ''}`}
                    onClick={handleEnter}
                >
                    <span>Enter Dashboard</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Footer tagline */}
                <div className={`splash-footer ${phase >= 3 ? 'splash-visible' : ''}`}>
                    Happiness. Prosperity. Delivered.
                </div>
            </div>
        </div>
    );
}
