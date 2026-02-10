// Database connection utility for Vercel Postgres
import { sql } from '@vercel/postgres';

// Test connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Get all shops with optional filters
export async function getShops(filters = {}) {
  const { search, district, priceMin, priceMax, rating, openingHours, sort = 'rating_desc', limit = 20, offset = 0 } = filters;
  
  let query = 'SELECT * FROM shops WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (name ILIKE $${paramIndex} OR name_cn ILIKE $${paramIndex} OR district ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (district && district !== '全港') {
    query += ` AND (district = $${paramIndex} OR district_cn = $${paramIndex})`;
    params.push(district);
    paramIndex++;
  }

  if (priceMin) {
    query += ` AND price_min >= $${paramIndex}`;
    params.push(priceMin);
    paramIndex++;
  }

  if (priceMax) {
    query += ` AND price_max <= $${paramIndex}`;
    params.push(priceMax);
    paramIndex++;
  }

  if (rating) {
    query += ` AND rating >= $${paramIndex}`;
    params.push(rating);
    paramIndex++;
  }

  if (openingHours === '24h') {
    query += ` AND is_24hours = TRUE`;
  } else if (openingHours === 'open_today') {
    query += ` AND is_24hours = FALSE`;
  }

  switch (sort) {
    case 'rating_desc': query += ' ORDER BY rating DESC'; break;
    case 'rating_asc': query += ' ORDER BY rating ASC'; break;
    case 'price_asc': query += ' ORDER BY price_min ASC'; break;
    case 'price_desc': query += ' ORDER BY price_min DESC'; break;
    case 'reviews_desc': query += ' ORDER BY review_count DESC'; break;
    default: query += ' ORDER BY rating DESC';
  }

  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await sql.query(query, params);
  return result.rows;
}

// Get single shop with reviews
export async function getShopById(id) {
  const shopResult = await sql`SELECT * FROM shops WHERE id = ${id}`;
  
  if (shopResult.rows.length === 0) {
    return null;
  }

  const reviewsResult = await sql`
    SELECT * FROM reviews WHERE shop_id = ${id} ORDER BY created_at DESC LIMIT 10
  `;

  return {
    ...shopResult.rows[0],
    reviews: reviewsResult.rows,
  };
}

// Get user favorites
export async function getUserFavorites(deviceId) {
  const result = await sql`
    SELECT favorites FROM users WHERE device_id = ${deviceId}
  `;
  
  if (result.rows.length === 0) {
    return [];
  }
  
  return result.rows[0].favorites;
}

// Update user favorites
export async function updateUserFavorites(deviceId, favorites) {
  await sql`
    INSERT INTO users (device_id, favorites, updated_at)
    VALUES (${deviceId}, ${JSON.stringify(favorites)}, CURRENT_TIMESTAMP)
    ON CONFLICT (device_id)
    DO UPDATE SET favorites = ${JSON.stringify(favorites)}, updated_at = CURRENT_TIMESTAMP
  `;
  return true;
}

// Seed sample data (for development)
export async function seedSampleData() {
  // This would be used only for initial setup
  // In production, use Vercel Postgres CLI or migrations
  console.log('⚠️ Please run schema.sql manually in Vercel Postgres Console');
}
