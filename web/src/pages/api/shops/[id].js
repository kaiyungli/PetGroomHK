// API route for fetching single shop details and reviews
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(request) {
  const { id } = request.query;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Shop ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const shopResult = await pool.query('SELECT * FROM shops WHERE id = $1', [id]);
    
    if (shopResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Shop not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reviewsResult = await pool.query(
      'SELECT * FROM reviews WHERE shop_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    return new Response(JSON.stringify({ 
      shop: shopResult.rows[0], 
      reviews: reviewsResult.rows 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
