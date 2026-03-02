/**
 * Product Repository — CRUD operations for the products table.
 */
const pool = require('../db/pool');

class ProductRepository {
    async findAll() {
        const { rows } = await pool.query(
            `SELECT p.*, s.name AS seller_name
       FROM products p
       JOIN sellers s ON p.seller_id = s.id
       ORDER BY p.id ASC`
        );
        return rows;
    }

    async findById(id) {
        const { rows } = await pool.query(
            `SELECT p.*, s.name AS seller_name
       FROM products p
       JOIN sellers s ON p.seller_id = s.id
       WHERE p.id = $1`,
            [id]
        );
        return rows[0] || null;
    }

    async findBySellerId(sellerId) {
        const { rows } = await pool.query(
            'SELECT * FROM products WHERE seller_id = $1 ORDER BY id ASC',
            [sellerId]
        );
        return rows;
    }

    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO products (seller_id, name, description, category, price, weight_kg,
       dimension_l_cm, dimension_w_cm, dimension_h_cm, sku, stock_qty, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [data.seller_id, data.name, data.description, data.category, data.price, data.weight_kg,
            data.dimension_l_cm, data.dimension_w_cm, data.dimension_h_cm, data.sku, data.stock_qty, data.image_url]
        );
        return rows[0];
    }

    async update(id, data) {
        const { rows } = await pool.query(
            `UPDATE products SET seller_id=$1, name=$2, description=$3, category=$4, price=$5,
       weight_kg=$6, dimension_l_cm=$7, dimension_w_cm=$8, dimension_h_cm=$9, sku=$10,
       stock_qty=$11, image_url=$12, updated_at=CURRENT_TIMESTAMP
       WHERE id=$13 RETURNING *`,
            [data.seller_id, data.name, data.description, data.category, data.price, data.weight_kg,
            data.dimension_l_cm, data.dimension_w_cm, data.dimension_h_cm, data.sku, data.stock_qty, data.image_url, id]
        );
        return rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}

module.exports = new ProductRepository();
