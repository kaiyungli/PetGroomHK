// API route for fetching shops with filters
import { sql } from '@vercel/postgres';

export default async function handler(request) {
  const { search, district, price_min, price_max, rating, opening_hours, sort, limit = 20, offset = 0 } = request.query;

  try {
    let query = 'SELECT * FROM shops WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR name_cn ILIKE $${paramIndex} OR district ILIKE $${paramIndex} OR district_cn ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (district && district !== '全港') {
      query += ` AND (district = $${paramIndex} OR district_cn = $${paramIndex})`;
      params.push(district);
      paramIndex++;
    }

    if (price_min) {
      query += ` AND price_min >= $${paramIndex}`;
      params.push(parseInt(price_min));
      paramIndex++;
    }

    if (price_max) {
      query += ` AND price_max <= $${paramIndex}`;
      params.push(parseInt(price_max));
      paramIndex++;
    }

    if (rating) {
      query += ` AND rating >= $${paramIndex}`;
      params.push(parseFloat(rating));
      paramIndex++;
    }

    if (opening_hours === '24h') {
      query += ` AND is_24hours = TRUE`;
    } else if (opening_hours === 'open_today') {
      query += ` AND is_24hours = FALSE`;
    }

    // Sorting
    switch (sort) {
      case 'rating_desc':
        query += ' ORDER BY rating DESC';
        break;
      case 'rating_asc':
        query += ' ORDER BY rating ASC';
        break;
      case 'price_asc':
        query += ' ORDER BY price_min ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price_min DESC';
        break;
      case 'reviews_desc':
        query += ' ORDER BY review_count DESC';
        break;
      default:
        query += ' ORDER BY rating DESC';
    }

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await sql.query(query, params);

    return new Response(JSON.stringify({ shops: rows, count: rows.length }), {
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
