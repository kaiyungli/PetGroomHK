// API route for fetching single shop details and reviews
import { sql } from '@vercel/postgres';

export default async function handler(request) {
  const { id } = request.query;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Shop ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch shop details
    const shopResult = await sql`
      SELECT * FROM shops WHERE id = ${id}
    `;

    if (shopResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Shop not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const shop = shopResult.rows[0];

    // Fetch reviews for this shop
    const reviewsResult = await sql`
      SELECT * FROM reviews WHERE shop_id = ${id} ORDER BY created_at DESC LIMIT 10
    `;

    return new Response(JSON.stringify({ shop, reviews: reviewsResult.rows }), {
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
