/**
 * Unit Tests — Shipping Charge Calculation Logic
 * Tests the shipping charge formulas without DB dependencies.
 */
const { calculateDistance, getTransportMode } = require('../src/services/distanceService');

// Replicate the shipping charge calculation logic for unit testing
const STANDARD_COURIER_CHARGE = 10;
const EXPRESS_EXTRA_PER_KG = 1.2;

function calculateShippingCharge(distanceKm, weightKg, deliverySpeed) {
    const { mode, ratePerKmPerKg } = getTransportMode(distanceKm);
    const baseShippingCharge = distanceKm * ratePerKmPerKg * weightKg;
    let expressCharge = 0;
    if (deliverySpeed === 'express') {
        expressCharge = EXPRESS_EXTRA_PER_KG * weightKg;
    }
    const total = Math.round((STANDARD_COURIER_CHARGE + baseShippingCharge + expressCharge) * 100) / 100;
    return { total, mode, baseShippingCharge: Math.round(baseShippingCharge * 100) / 100, expressCharge };
}

describe('Shipping Charge Calculation', () => {
    test('Standard delivery, Mini Van (<100km), light product (0.5kg)', () => {
        const result = calculateShippingCharge(50, 0.5, 'standard');
        // base = 50 * 3 * 0.5 = 75, total = 10 + 75 = 85
        expect(result.total).toBe(85);
        expect(result.mode).toBe('Mini Van');
    });

    test('Express delivery, Mini Van (<100km), light product (0.5kg)', () => {
        const result = calculateShippingCharge(50, 0.5, 'express');
        // base = 75, express = 1.2 * 0.5 = 0.6, total = 10 + 75 + 0.6 = 85.6
        expect(result.total).toBe(85.6);
        expect(result.expressCharge).toBe(0.6);
    });

    test('Standard delivery, Truck (100-500km), heavy product (10kg)', () => {
        const result = calculateShippingCharge(200, 10, 'standard');
        // base = 200 * 2 * 10 = 4000, total = 10 + 4000 = 4010
        expect(result.total).toBe(4010);
        expect(result.mode).toBe('Truck');
    });

    test('Express delivery, Truck (100-500km), heavy product (25kg)', () => {
        const result = calculateShippingCharge(300, 25, 'express');
        // base = 300 * 2 * 25 = 15000, express = 1.2 * 25 = 30, total = 10 + 15000 + 30 = 15040
        expect(result.total).toBe(15040);
        expect(result.mode).toBe('Truck');
    });

    test('Standard delivery, Aeroplane (500+km), medium product (5kg)', () => {
        const result = calculateShippingCharge(800, 5, 'standard');
        // base = 800 * 1 * 5 = 4000, total = 10 + 4000 = 4010
        expect(result.total).toBe(4010);
        expect(result.mode).toBe('Aeroplane');
    });

    test('Express delivery, Aeroplane (500+km), medium product (5kg)', () => {
        const result = calculateShippingCharge(800, 5, 'express');
        // base = 4000, express = 1.2 * 5 = 6, total = 10 + 4000 + 6 = 4016
        expect(result.total).toBe(4016);
    });

    test('Zero distance should only have courier charge', () => {
        const result = calculateShippingCharge(0, 1, 'standard');
        // base = 0, total = 10
        expect(result.total).toBe(10);
    });

    test('Very heavy product (50kg) long distance', () => {
        const result = calculateShippingCharge(1000, 50, 'express');
        // base = 1000 * 1 * 50 = 50000, express = 1.2 * 50 = 60, total = 10 + 50000 + 60 = 50070
        expect(result.total).toBe(50070);
    });
});

describe('Real-world Shipping Scenarios', () => {
    test('Maggi 500g: Bengaluru warehouse to Bengaluru customer (short)', () => {
        const dist = calculateDistance(12.8399, 77.6770, 12.9716, 77.5946);
        const result = calculateShippingCharge(dist, 0.5, 'standard');
        expect(result.mode).toBe('Mini Van');
        expect(result.total).toBeGreaterThan(10);
        expect(result.total).toBeLessThan(100);
    });

    test('Rice 10Kg: Delhi warehouse to Mumbai customer (long distance)', () => {
        const dist = calculateDistance(28.3588, 76.9346, 19.0760, 72.8777);
        const result = calculateShippingCharge(dist, 10, 'standard');
        expect(result.mode).toBe('Aeroplane');
        expect(result.total).toBeGreaterThan(10000);
    });

    test('Sugar 25Kg: Pune warehouse to Hyderabad customer (medium distance)', () => {
        const dist = calculateDistance(18.7606, 73.8553, 17.3850, 78.4867);
        const result = calculateShippingCharge(dist, 25, 'express');
        expect(result.mode).toBe('Aeroplane');
        expect(result.total).toBeGreaterThan(10000);
    });
});
