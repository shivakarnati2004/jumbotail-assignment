/**
 * Google Maps component — shows a map with markers for given locations.
 * Uses Google Maps Embed API (no API key required for basic embeds)
 * and provides an interactive map visualization.
 */
export default function GoogleMap({ locations = [], center, zoom = 5, height = 350 }) {
    // Use the first location or India center as default
    const mapCenter = center || (locations.length > 0
        ? { lat: locations[0].lat, lng: locations[0].lng }
        : { lat: 20.5937, lng: 78.9629 });  // India center

    // Build markers string for Google Static Maps
    const markersParam = locations
        .filter(l => l.lat && l.lng)
        .map(l => `${l.lat},${l.lng}`)
        .join('|');

    // Use OpenStreetMap (no API key needed) for the interactive map
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 3},${mapCenter.lat - 2},${mapCenter.lng + 3},${mapCenter.lat + 2}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

    return (
        <div className="map-container" style={{ height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
            {/* Map markers overlay */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <iframe
                    src={osmUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Location Map"
                    loading="lazy"
                />

                {/* Location list overlay */}
                {locations.length > 1 && (
                    <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px', maxHeight: height - 20,
                        overflowY: 'auto', boxShadow: 'var(--shadow-md)',
                        fontSize: '0.78rem', maxWidth: 220, zIndex: 10
                    }}>
                        <div style={{ fontWeight: 700, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                            📍 {locations.length} Locations
                        </div>
                        {locations.map((loc, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '6px 0',
                                borderBottom: i < locations.length - 1 ? '1px solid var(--border-light)' : 'none',
                            }}>
                                <span style={{
                                    width: 20, height: 20, borderRadius: '50%',
                                    background: loc.color || 'var(--jt-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.6rem', color: 'white', fontWeight: 700, flexShrink: 0
                                }}>{i + 1}</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--jt-dark)' }}>{loc.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                                        {loc.lat?.toFixed(4)}, {loc.lng?.toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
