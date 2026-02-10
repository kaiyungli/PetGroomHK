// API route for user favorites sync (using device_id as user identifier)
import { getUserFavorites, updateUserFavorites } from '../../lib/db';

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
      // Get user favorites
      const favorites = await getUserFavorites(device_id);

      return new Response(JSON.stringify({ favorites }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (method === 'PUT' || method === 'POST') {
      // Update user favorites
      const body = await request.json();
      const { favorites } = body;

      await updateUserFavorites(device_id, favorites);

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
