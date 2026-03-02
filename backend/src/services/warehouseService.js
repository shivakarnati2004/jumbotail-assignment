/**
 * Warehouse Service
 * Finds the nearest warehouse to a seller's location.
 */
const warehouseRepository = require('../repositories/warehouseRepository');
const sellerRepository = require('../repositories/sellerRepository');
const productRepository = require('../repositories/productRepository');
const { calculateDistance } = require('./distanceService');
const cacheService = require('./cacheService');

class WarehouseService {
    /**
     * Find the nearest warehouse to the seller of a given product.
     *
     * @param {number} sellerId - The seller's ID
     * @param {number} productId - The product's ID (used to verify ownership)
     * @returns {Object} { warehouse, distance }
     * @throws {Error} If seller, product, or warehouses are not found
     */
    async findNearestWarehouse(sellerId, productId) {
        // Check cache first
        const cacheKey = `nearest_wh_${sellerId}_${productId}`;
        const cached = cacheService.get(cacheKey);
        if (cached) return cached;

        // Validate seller exists
        const seller = await sellerRepository.findById(sellerId);
        if (!seller) {
            const error = new Error(`Seller with ID ${sellerId} not found`);
            error.status = 404;
            throw error;
        }

        // Validate product exists and belongs to seller
        const product = await productRepository.findById(productId);
        if (!product) {
            const error = new Error(`Product with ID ${productId} not found`);
            error.status = 404;
            throw error;
        }
        if (product.seller_id !== sellerId) {
            const error = new Error(`Product ${productId} does not belong to seller ${sellerId}`);
            error.status = 400;
            throw error;
        }

        // Get all active warehouses
        const warehouses = await warehouseRepository.findAllActive();
        if (warehouses.length === 0) {
            const error = new Error('No active warehouses available');
            error.status = 404;
            throw error;
        }

        // Find the nearest warehouse by Haversine distance
        let nearestWarehouse = null;
        let minDistance = Infinity;

        for (const warehouse of warehouses) {
            const distance = calculateDistance(
                seller.lat, seller.lng,
                warehouse.lat, warehouse.lng
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestWarehouse = warehouse;
            }
        }

        const result = {
            warehouseId: nearestWarehouse.id,
            warehouseName: nearestWarehouse.name,
            warehouseLocation: {
                lat: nearestWarehouse.lat,
                long: nearestWarehouse.lng,
            },
            distanceFromSeller: minDistance,
        };

        // Cache the result
        cacheService.set(cacheKey, result);

        return result;
    }
}

module.exports = new WarehouseService();
