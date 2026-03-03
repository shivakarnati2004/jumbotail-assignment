/**
 * API service — centralizes all backend HTTP calls.
 */
const API_BASE = '/api/v1';

async function request(url, options = {}) {
    const res = await fetch(`${API_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Request failed');
    return data;
}

// Dashboard
export const getStats = () => request('/dashboard/stats');

// Customers
export const getCustomers = () => request('/customers');
export const createCustomer = (body) => request('/customers', { method: 'POST', body: JSON.stringify(body) });
export const updateCustomer = (id, body) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteCustomer = (id) => request(`/customers/${id}`, { method: 'DELETE' });

// Sellers
export const getSellers = () => request('/sellers');
export const createSeller = (body) => request('/sellers', { method: 'POST', body: JSON.stringify(body) });
export const updateSeller = (id, body) => request(`/sellers/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteSeller = (id) => request(`/sellers/${id}`, { method: 'DELETE' });

// Products
export const getProducts = () => request('/products');
export const createProduct = (body) => request('/products', { method: 'POST', body: JSON.stringify(body) });
export const updateProduct = (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });

// Warehouses
export const getWarehouses = () => request('/warehouses');
export const createWarehouse = (body) => request('/warehouses', { method: 'POST', body: JSON.stringify(body) });
export const updateWarehouse = (id, body) => request(`/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteWarehouse = (id) => request(`/warehouses/${id}`, { method: 'DELETE' });

// Orders
export const getOrders = () => request('/orders');
export const createOrder = (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) });
export const updateOrder = (id, body) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteOrder = (id) => request(`/orders/${id}`, { method: 'DELETE' });

// Shipping
export const getNearestWarehouse = (sellerId, productId) =>
    request(`/warehouse/nearest?sellerId=${sellerId}&productId=${productId}`);
export const getShippingCharge = (warehouseId, customerId, deliverySpeed, productId) =>
    request(`/shipping-charge?warehouseId=${warehouseId}&customerId=${customerId}&deliverySpeed=${deliverySpeed}${productId ? `&productId=${productId}` : ''}`);
export const calculateShipping = (body) =>
    request('/shipping-charge/calculate', { method: 'POST', body: JSON.stringify(body) });

// AI (Gemini)
export const aiChat = (message, history = []) =>
    request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) });
export const aiAnalyzeShipment = (shippingResult) =>
    request('/ai/analyze-shipment', { method: 'POST', body: JSON.stringify({ shippingResult }) });
