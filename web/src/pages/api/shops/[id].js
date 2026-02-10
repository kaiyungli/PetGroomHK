// API route for fetching single shop details and reviews
import { getShopById } from '../../lib/db';

export default async function handler(request) {
  const { id } = request.query;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Shop ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const shop = await getShopById(id);

    if (!shop) {
      return new Response(JSON.stringify({ error: 'Shop not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ shop, reviews: shop.reviews || [] }), {
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
