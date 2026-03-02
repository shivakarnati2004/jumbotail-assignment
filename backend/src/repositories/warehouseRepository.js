/**
 * Warehouse Repository — CRUD operations for the warehouses table.
 */
const pool = require('../db/pool');

class WarehouseRepository {
    async findAll() {
        const { rows } = await pool.query('SELECT * FROM warehouses ORDER BY id ASC');
        return rows;
    }

    async findById(id) {
        const { rows } = await pool.query('SELECT * FROM warehouses WHERE id = $1', [id]);
        return rows[0] || null;
    }

    async findAllActive() {
        const { rows } = await pool.query(
            'SELECT * FROM warehouses WHERE is_active = TRUE ORDER BY id ASC'
        );
        return rows;
    }

    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO warehouses (name, address, city, state, pincode, lat, lng, capacity)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [data.name, data.address, data.city, data.state, data.pincode, data.lat, data.lng, data.capacity || 10000]
        );
        return rows[0];
    }

    async update(id, data) {
        const { rows } = await pool.query(
            `UPDATE warehouses SET name=$1, address=$2, city=$3, state=$4, pincode=$5,
       lat=$6, lng=$7, capacity=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
            [data.name, data.address, data.city, data.state, data.pincode, data.lat, data.lng, data.capacity, id]
        );
        return rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM warehouses WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}

module.exports = new WarehouseRepository();
