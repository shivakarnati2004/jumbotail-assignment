/**
 * Seller Repository — CRUD operations for the sellers table.
 */
const pool = require('../db/pool');

class SellerRepository {
    async findAll() {
        const { rows } = await pool.query('SELECT * FROM sellers ORDER BY id ASC');
        return rows;
    }

    async findById(id) {
        const { rows } = await pool.query('SELECT * FROM sellers WHERE id = $1', [id]);
        return rows[0] || null;
    }

    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO sellers (name, phone, email, address, city, state, pincode, lat, lng, gst_number, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [data.name, data.phone, data.email, data.address, data.city, data.state, data.pincode, data.lat, data.lng, data.gst_number, data.rating || 0]
        );
        return rows[0];
    }

    async update(id, data) {
        const { rows } = await pool.query(
            `UPDATE sellers SET name=$1, phone=$2, email=$3, address=$4, city=$5, state=$6,
       pincode=$7, lat=$8, lng=$9, gst_number=$10, rating=$11, updated_at=CURRENT_TIMESTAMP
       WHERE id=$12 RETURNING *`,
            [data.name, data.phone, data.email, data.address, data.city, data.state, data.pincode, data.lat, data.lng, data.gst_number, data.rating || 0, id]
        );
        return rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM sellers WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}

module.exports = new SellerRepository();
