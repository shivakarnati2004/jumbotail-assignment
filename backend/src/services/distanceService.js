/**
 * Distance Service
 * Calculates the distance between two geographic coordinates
 * using the Haversine formula.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate the great-circle distance between two points on Earth
 * using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers (rounded to 2 decimal places)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS_KM * c;

    return Math.round(distance * 100) / 100;
}

/**
 * Determine transport mode based on distance.
 * - Aeroplane: 500Km+  → 1 Rs per km per kg
 * - Truck:     100Km+  → 2 Rs per km per kg
 * - Mini Van:  0-100Km → 3 Rs per km per kg
 *
 * @param {number} distanceKm
 * @returns {{ mode: string, ratePerKmPerKg: number }}
 */
function getTransportMode(distanceKm) {
    if (distanceKm >= 500) {
        return { mode: 'Aeroplane', ratePerKmPerKg: 1 };
    } else if (distanceKm >= 100) {
        return { mode: 'Truck', ratePerKmPerKg: 2 };
    } else {
        return { mode: 'Mini Van', ratePerKmPerKg: 3 };
    }
}

module.exports = { calculateDistance, getTransportMode, toRadians };
