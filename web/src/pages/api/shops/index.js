// API route for fetching shops with filters
import { getShops } from '../../lib/db';

export default async function handler(request) {
  const { search, district, price_min, price_max, rating, opening_hours, sort, limit = 20, offset = 0 } = request.query;

  try {
    const shops = await getShops({
      search,
      district,
      priceMin: price_min ? parseInt(price_min) : undefined,
      priceMax: price_max ? parseInt(price_max) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      openingHours: opening_hours,
      sort,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

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
