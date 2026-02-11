// API route for user favorites sync (using device_id as user identifier)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(request) {
  const { device_id } = request.query;
  const method = request.method;

  if (!device_id) {
    return new Response(JSON.stringify({ error: 'Device ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (method === 'GET') {
      const result = await pool.query(
        'SELECT favorites FROM users WHERE device_id = $1',
        [device_id]
      );

      const favorites = result.rows.length > 0 ? result.rows[0].favorites || [] : [];

      return new Response(JSON.stringify({ favorites }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (method === 'PUT' || method === 'POST') {
      const body = await request.json();
      const { favorites } = body;

      await pool.query(
        `INSERT INTO users (device_id, favorites, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (device_id)
         DO UPDATE SET favorites = $2, updated_at = CURRENT_TIMESTAMP`,
        [device_id, JSON.stringify(favorites)]
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error with user data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
