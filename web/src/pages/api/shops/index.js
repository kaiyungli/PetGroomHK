// API route for fetching shops with filters
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(request) {
  const { search, district, price_min, price_max, rating, opening_hours, sort, limit = 20, offset = 0 } = request.query;

  try {
    const { rows: shops } = await pool.query(`
      SELECT * FROM shops WHERE 1=1
      ${search ? `AND (name ILIKE $1 OR name_cn ILIKE $1 OR district ILIKE $1)` : ''}
      ${district && district !== '全港' ? `AND (district = $${search ? 2 : 1} OR district_cn = $${search ? 2 : 1})` : ''}
      ${price_min ? `AND price_min >= $${search ? (district ? 3 : 2) : (district ? 2 : 1)}` : ''}
      ${price_max ? `AND price_max <= $${search ? (district ? 4 : 3) : (district ? 3 : 2)}` : ''}
      ${rating ? `AND rating >= $${search ? (district ? (price_min ? 5 : 4) : (price_min ? 4 : 3)) : (district ? (price_min ? 4 : 3) : (price_min ? 3 : 2))}` : ''}
      ${openingHours === '24h' ? 'AND is_24hours = TRUE' : ''}
      ${openingHours === 'open_today' ? 'AND is_24hours = FALSE' : ''}
      ORDER BY ${sort === 'rating_asc' ? 'rating ASC' : sort === 'price_asc' ? 'price_min ASC' : sort === 'price_desc' ? 'price_min DESC' : sort === 'reviews_desc' ? 'review_count DESC' : 'rating DESC'}
      LIMIT $${search ? (district ? (price_min ? (price_max ? 6 : 5) : 4) : (price_min ? (price_max ? 5 : 4) : 3)) : (district ? (price_min ? (price_max ? 5 : 4) : 3) : (price_min ? (price_max ? 4 : 3) : 2))} OFFSET $${search ? (district ? (price_min ? (price_max ? 7 : 6) : 5) : (price_min ? (price_max ? 6 : 5) : 4)) : (district ? (price_min ? (price_max ? 6 : 5) : 4) : (price_min ? (price_max ? 5 : 4) : 3))}
    `, [
      `%${search}%`,
      district,
      parseInt(price_min),
      parseInt(price_max),
      parseFloat(rating)
    ].filter(Boolean));

    return new Response(JSON.stringify({ shops, count: shops.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
