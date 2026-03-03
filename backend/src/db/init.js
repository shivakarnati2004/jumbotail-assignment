/**
 * Database Initialization Script
 * Creates the jumbotail_shipping database (local only), then runs schema.sql and seed.sql.
 * When DATABASE_URL is set (Render), skips database creation since the DB is pre-provisioned.
 */
require('dotenv').config();
const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function getConnectionConfig(dbOverride) {
    if (process.env.DATABASE_URL) {
        return {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        };
    }
    return {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: dbOverride || process.env.DB_NAME || 'jumbotail_shipping',
    };
}

async function run() {
    // Step 1: Create database (skip on Render — DB is pre-provisioned)
    if (!process.env.DATABASE_URL) {
        const adminClient = new Client(getConnectionConfig('postgres'));
        try {
            await adminClient.connect();
            console.log('✅ Connected to PostgreSQL');

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
    } else {
        console.log('ℹ️  DATABASE_URL detected — skipping database creation');
    }

    // Step 2: Connect to our database and run schema + seed
    const pool = new Pool(getConnectionConfig());
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
