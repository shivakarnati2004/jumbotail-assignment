/**
 * Customer Repository — CRUD operations for the customers table.
 */
const pool = require('../db/pool');

class CustomerRepository {
    /** Get all customers */
    async findAll() {
        const { rows } = await pool.query(
            'SELECT * FROM customers ORDER BY id ASC'
        );
        return rows;
    }

    /** Get customer by ID */
    async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );
        return rows[0] || null;
    }

    /** Create a new customer */
    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO customers (name, phone, email, address, city, state, pincode, lat, lng, gst_number)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [data.name, data.phone, data.email, data.address, data.city, data.state, data.pincode, data.lat, data.lng, data.gst_number]
        );
        return rows[0];
    }

    /** Update a customer */
    async update(id, data) {
        const { rows } = await pool.query(
            `UPDATE customers SET name=$1, phone=$2, email=$3, address=$4, city=$5, state=$6,
       pincode=$7, lat=$8, lng=$9, gst_number=$10, updated_at=CURRENT_TIMESTAMP
       WHERE id=$11 RETURNING *`,
            [data.name, data.phone, data.email, data.address, data.city, data.state, data.pincode, data.lat, data.lng, data.gst_number, id]
        );
        return rows[0] || null;
    }

    /** Delete a customer */
    async delete(id) {
        const result = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}

module.exports = new CustomerRepository();
