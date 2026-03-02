/**
 * Cache Service
 * Wrapper around node-cache for API response caching.
 */
const NodeCache = require('node-cache');

// TTL = 300 seconds (5 min), check period = 60 seconds
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const cacheService = {
    /**
     * Get a cached value by key
     * @param {string} key
     * @returns {any|undefined}
     */
    get(key) {
        return cache.get(key);
    },

    /**
     * Set a value in the cache
     * @param {string} key
     * @param {any} value
     * @param {number} [ttl] - optional TTL override in seconds
     */
    set(key, value, ttl) {
        if (ttl) {
            cache.set(key, value, ttl);
        } else {
            cache.set(key, value);
        }
    },

    /**
     * Delete a cached value
     * @param {string} key
     */
    del(key) {
        cache.del(key);
    },

    /**
     * Flush the entire cache
     */
    flush() {
        cache.flushAll();
    },

    /**
     * Get cache statistics
     */
    getStats() {
        return cache.getStats();
    },
};

module.exports = cacheService;
