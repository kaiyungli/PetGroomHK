// API route for user favorites sync (using device_id as user identifier)
import { sql } from '@vercel/postgres';

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
      const result = await sql`
        SELECT favorites, pets FROM users WHERE device_id = ${device_id}
      `;

      if (result.rows.length === 0) {
        // Create new user record
        await sql`
          INSERT INTO users (device_id, favorites, pets) VALUES (${device_id}, '[]', '[]')
        `;
        return new Response(JSON.stringify({ favorites: [], pets: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        favorites: result.rows[0].favorites,
        pets: result.rows[0].pets,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (method === 'PUT' || method === 'POST') {
      // Update user favorites
      const body = await request.json();
      const { favorites } = body;

      await sql`
        INSERT INTO users (device_id, favorites, pets, updated_at)
        VALUES (${device_id}, ${JSON.stringify(favorites)}, '[]', CURRENT_TIMESTAMP)
        ON CONFLICT (device_id)
        DO UPDATE SET favorites = ${JSON.stringify(favorites)}, updated_at = CURRENT_TIMESTAMP
      `;

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
