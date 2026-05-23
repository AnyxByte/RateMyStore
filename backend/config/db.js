import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is missing from your .env file!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const initDB = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(400) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'User', 'StoreOwner')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      address VARCHAR(400) NOT NULL,
      owner_id INT UNIQUE,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      store_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
      UNIQUE(user_id, store_id)
    );
  `;

  try {
    await pool.query(createTablesQuery);
    console.log("NeonDB Tables verified and ready .");
  } catch (err) {
    console.error("Error initializing NeonDB tables:", err);
    process.exit(1);
  }
};

export const query = (text, params) => pool.query(text, params);
