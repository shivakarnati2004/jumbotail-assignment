/**
 * Creates the jumbotail_shipping database if it doesn't exist,
 * then runs schema.sql and seed.sql.
 */
require('dotenv').config();
const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    // Step 1: Connect to default 'postgres' database to create our DB
    const adminClient = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: 'postgres',
    });

    try {
        await adminClient.connect();
        console.log('✅ Connected to PostgreSQL');

        // Create database if not exists
        const dbName = process.env.DB_NAME || 'jumbotail_shipping';
        try {
            await adminClient.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database "${dbName}" created`);
        } catch (e) {
            if (e.code === '42P04') {
                console.log(`ℹ️  Database "${dbName}" already exists`);
            } else {
                throw e;
            }
        }
    } finally {
        await adminClient.end();
    }

    // Step 2: Connect to our database and run schema + seed
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'jumbotail_shipping',
    });

    const client = await pool.connect();
    try {
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
        console.log('📋 Running schema.sql...');
        await client.query(schemaSQL);
        console.log('✅ Schema created');

        const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
        console.log('🌱 Running seed.sql...');
        await client.query(seedSQL);
        console.log('✅ Seed data inserted');

        console.log('🎉 Database ready!');
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
