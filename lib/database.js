// lib/database.js
import sql from 'mssql';

const dbConfig = {
  server: process.env.DB_SERVER || 'DESKTOP-T5MN2V5',
  database: process.env.DB_NAME || 'hotel_booking',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'sw',
  options: {
    encrypt: process.env.NODE_ENV === 'production',
    trustServerCertificate: true
  }
};

let pool;

export async function getConnection() {
  if (!pool) {
    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
  }
  return pool;
}

export async function query(sqlQuery, params = {}) {
  const pool = await getConnection();
  const request = pool.request();
  
  // Add parameters to the request
  Object.keys(params).forEach(key => {
    request.input(key, params[key]);
  });
  
  const result = await request.query(sqlQuery);
  return result.recordset;
}