/**
 * Shipping Service
 * Calculates shipping charges based on warehouse-to-customer distance,
 * product weight, transport mode, and delivery speed.
 *
 * Pricing Rules:
 * ──────────────────────────────────────────────
 * Transport Mode  │ Distance     │ Rate
 * ──────────────────────────────────────────────
 * Aeroplane       │ 500Km+       │ 1 Rs/km/kg
 * Truck           │ 100–500Km    │ 2 Rs/km/kg
 * Mini Van        │ 0–100Km      │ 3 Rs/km/kg
 * ──────────────────────────────────────────────
 *
 * Delivery Speeds:
 * ──────────────────────────────────────────────
 * Standard │ Rs 10 courier + shipping charge
 * Express  │ Rs 10 courier + Rs 1.2/kg extra + shipping charge
 * ──────────────────────────────────────────────
 */
const warehouseRepository = require('../repositories/warehouseRepository');
const customerRepository = require('../repositories/customerRepository');
const productRepository = require('../repositories/productRepository');
const { calculateDistance, getTransportMode } = require('./distanceService');
const cacheService = require('./cacheService');

const STANDARD_COURIER_CHARGE = 10; // Rs
const EXPRESS_EXTRA_PER_KG = 1.2;   // Rs per kg

class ShippingService {
    /**
     * Calculate shipping charge from a warehouse to a customer.
     *
     * @param {number} warehouseId
     * @param {number} customerId
     * @param {string} deliverySpeed - 'standard' or 'express'
     * @param {number} [productId] - optional, used to get product weight
     * @returns {Object} Detailed shipping charge breakdown
     */
    async calculateShippingCharge(warehouseId, customerId, deliverySpeed = 'standard', productId = null) {
        // Validate delivery speed
        const speed = deliverySpeed.toLowerCase();
        if (!['standard', 'express'].includes(speed)) {
            const error = new Error(`Invalid delivery speed: "${deliverySpeed}". Must be "standard" or "express".`);
            error.status = 400;
            throw error;
        }

        // Check cache
        const cacheKey = `ship_${warehouseId}_${customerId}_${speed}_${productId}`;
        const cached = cacheService.get(cacheKey);
        if (cached) return cached;

        // Validate warehouse
        const warehouse = await warehouseRepository.findById(warehouseId);
        if (!warehouse) {
            const error = new Error(`Warehouse with ID ${warehouseId} not found`);
            error.status = 404;
            throw error;
        }

        // Validate customer
        const customer = await customerRepository.findById(customerId);
        if (!customer) {
            const error = new Error(`Customer with ID ${customerId} not found`);
            error.status = 404;
            throw error;
        }

        // Get product weight (default 1 kg if no product specified)
        let weightKg = 1;
        let product = null;
        if (productId) {
            product = await productRepository.findById(productId);
            if (product) {
                weightKg = parseFloat(product.weight_kg);
            }
        }

        // Calculate distance
        const distanceKm = calculateDistance(
            warehouse.lat, warehouse.lng,
            customer.lat, customer.lng
        );

        // Determine transport mode and rate
        const { mode, ratePerKmPerKg } = getTransportMode(distanceKm);

        // Calculate base shipping charge
        const baseShippingCharge = distanceKm * ratePerKmPerKg * weightKg;

        // Delivery speed charges
        let expressCharge = 0;
        if (speed === 'express') {
            expressCharge = EXPRESS_EXTRA_PER_KG * weightKg;
        }

        // Total shipping charge
        const totalShippingCharge = Math.round(
            (STANDARD_COURIER_CHARGE + baseShippingCharge + expressCharge) * 100
        ) / 100;

        const result = {
            shippingCharge: totalShippingCharge,
            breakdown: {
                courierCharge: STANDARD_COURIER_CHARGE,
                baseShippingCharge: Math.round(baseShippingCharge * 100) / 100,
                expressCharge: Math.round(expressCharge * 100) / 100,
                distanceKm,
                transportMode: mode,
                ratePerKmPerKg,
                weightKg,
                deliverySpeed: speed,
            },
            warehouse: {
                id: warehouse.id,
                name: warehouse.name,
                location: { lat: warehouse.lat, long: warehouse.lng },
            },
            customer: {
                id: customer.id,
                name: customer.name,
                location: { lat: customer.lat, long: customer.lng },
            },
        };

        // Cache
        cacheService.set(cacheKey, result);

        return result;
    }

    /**
     * Calculate shipping charge for a seller → customer flow.
     * Combines nearest warehouse lookup + shipping charge calculation.
     *
     * @param {number} sellerId
     * @param {number} customerId
     * @param {string} deliverySpeed
     * @param {number} [productId]
     * @returns {Object}
     */
    async calculateSellerToCustomerCharge(sellerId, customerId, deliverySpeed = 'standard', productId = null) {
        const sellerRepository = require('../repositories/sellerRepository');

        // Validate seller
        const seller = await sellerRepository.findById(sellerId);
        if (!seller) {
            const error = new Error(`Seller with ID ${sellerId} not found`);
            error.status = 404;
            throw error;
        }

        // Validate customer
        const customer = await customerRepository.findById(customerId);
        if (!customer) {
            const error = new Error(`Customer with ID ${customerId} not found`);
            error.status = 404;
            throw error;
        }

        // Get all active warehouses and find nearest to seller
        const warehouses = await warehouseRepository.findAllActive();
        if (warehouses.length === 0) {
            const error = new Error('No active warehouses available');
            error.status = 404;
            throw error;
        }

        let nearestWarehouse = null;
        let minDistance = Infinity;
        for (const wh of warehouses) {
            const dist = calculateDistance(seller.lat, seller.lng, wh.lat, wh.lng);
            if (dist < minDistance) {
                minDistance = dist;
                nearestWarehouse = wh;
            }
        }

        // Calculate shipping charge from nearest warehouse to customer
        const shippingResult = await this.calculateShippingCharge(
            nearestWarehouse.id,
            customerId,
            deliverySpeed,
            productId
        );

        return {
            shippingCharge: shippingResult.shippingCharge,
            nearestWarehouse: {
                warehouseId: nearestWarehouse.id,
                warehouseName: nearestWarehouse.name,
                warehouseLocation: {
                    lat: nearestWarehouse.lat,
                    long: nearestWarehouse.lng,
                },
            },
            breakdown: shippingResult.breakdown,
            seller: {
                id: seller.id,
                name: seller.name,
                location: { lat: seller.lat, long: seller.lng },
            },
            customer: shippingResult.customer,
        };
    }
}

module.exports = new ShippingService();
