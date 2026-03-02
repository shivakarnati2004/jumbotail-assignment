/**
 * Order Repository — CRUD operations for the orders table.
 */
const pool = require('../db/pool');

class OrderRepository {
    async findAll() {
        const { rows } = await pool.query(
            `SELECT o.*,
              c.name AS customer_name,
              s.name AS seller_name,
              p.name AS product_name,
              w.name AS warehouse_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       JOIN sellers s ON o.seller_id = s.id
       JOIN products p ON o.product_id = p.id
       LEFT JOIN warehouses w ON o.warehouse_id = w.id
       ORDER BY o.created_at DESC`
        );
        return rows;
    }

    async findById(id) {
        const { rows } = await pool.query(
            `SELECT o.*,
              c.name AS customer_name,
              s.name AS seller_name,
              p.name AS product_name,
              w.name AS warehouse_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       JOIN sellers s ON o.seller_id = s.id
       JOIN products p ON o.product_id = p.id
       LEFT JOIN warehouses w ON o.warehouse_id = w.id
       WHERE o.id = $1`,
            [id]
        );
        return rows[0] || null;
    }

    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO orders (customer_id, seller_id, product_id, warehouse_id, quantity,
       delivery_speed, transport_mode, distance_km, shipping_charge, total_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [data.customer_id, data.seller_id, data.product_id, data.warehouse_id, data.quantity || 1,
            data.delivery_speed || 'standard', data.transport_mode, data.distance_km, data.shipping_charge,
            data.total_amount, data.status || 'pending']
        );
        return rows[0];
    }

    async update(id, data) {
        const { rows } = await pool.query(
            `UPDATE orders SET status=$1, delivery_date=$2, updated_at=CURRENT_TIMESTAMP
       WHERE id=$3 RETURNING *`,
            [data.status, data.delivery_date, id]
        );
        return rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
        return result.rowCount > 0;
    }

    /** Dashboard stats */
    async getStats() {
        const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'shipped') AS shipped_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'delivered') AS delivered_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders) AS total_revenue,
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM sellers) AS total_sellers,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM warehouses) AS total_warehouses
    `);
        return rows[0];
    }
}

module.exports = new OrderRepository();
