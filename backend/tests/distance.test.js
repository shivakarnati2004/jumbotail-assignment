/**
 * Unit Tests — Distance Service
 * Tests the Haversine distance calculation and transport mode selection.
 */
const { calculateDistance, getTransportMode } = require('../src/services/distanceService');

describe('Distance Service', () => {
    describe('calculateDistance (Haversine)', () => {
        test('should return 0 for the same coordinates', () => {
            expect(calculateDistance(12.9716, 77.5946, 12.9716, 77.5946)).toBe(0);
        });

        test('should calculate Bengaluru to Mumbai distance (~840 km)', () => {
            const dist = calculateDistance(12.9716, 77.5946, 19.0760, 72.8777);
            expect(dist).toBeGreaterThan(800);
            expect(dist).toBeLessThan(900);
        });

        test('should calculate Delhi to Chennai distance (~1750 km)', () => {
            const dist = calculateDistance(28.6139, 77.2090, 13.0827, 80.2707);
            expect(dist).toBeGreaterThan(1700);
            expect(dist).toBeLessThan(1850);
        });

        test('should calculate short distance (~50 km range)', () => {
            // Bengaluru city center to Electronic City (~18 km)
            const dist = calculateDistance(12.9716, 77.5946, 12.8399, 77.6770);
            expect(dist).toBeGreaterThan(10);
            expect(dist).toBeLessThan(25);
        });

        test('should handle large distance (Kolkata to Ahmedabad ~1600 km)', () => {
            const dist = calculateDistance(22.5726, 88.3639, 22.9727, 72.3790);
            expect(dist).toBeGreaterThan(1500);
            expect(dist).toBeLessThan(1700);
        });
    });

    describe('getTransportMode', () => {
        test('should return Aeroplane for 500+ km', () => {
            const result = getTransportMode(500);
            expect(result.mode).toBe('Aeroplane');
            expect(result.ratePerKmPerKg).toBe(1);
        });

        test('should return Aeroplane for 1000 km', () => {
            expect(getTransportMode(1000).mode).toBe('Aeroplane');
        });

        test('should return Truck for 100-499 km', () => {
            const result = getTransportMode(250);
            expect(result.mode).toBe('Truck');
            expect(result.ratePerKmPerKg).toBe(2);
        });

        test('should return Truck for exactly 100 km', () => {
            expect(getTransportMode(100).mode).toBe('Truck');
        });

        test('should return Mini Van for 0-99 km', () => {
            const result = getTransportMode(50);
            expect(result.mode).toBe('Mini Van');
            expect(result.ratePerKmPerKg).toBe(3);
        });

        test('should return Mini Van for 0 km', () => {
            expect(getTransportMode(0).mode).toBe('Mini Van');
        });
    });
});
