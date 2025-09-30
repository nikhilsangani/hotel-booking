// app/api/hotels/route.js - UPDATED
import { query } from '@/lib/database.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    
    let sqlQuery = 'SELECT * FROM hotels WHERE 1=1';
    const params = {};
    
    if (city) {
      sqlQuery += ' AND (city LIKE @city OR name LIKE @city)';
      params.city = `%${city}%`;
    }
    
    if (minPrice) {
      sqlQuery += ' AND price_per_night >= @minPrice';
      params.minPrice = parseFloat(minPrice);
    }
    
    if (maxPrice) {
      sqlQuery += ' AND price_per_night <= @maxPrice';
      params.maxPrice = parseFloat(maxPrice);
    }
    
    if (rating) {
      sqlQuery += ' AND rating >= @rating';
      params.rating = parseFloat(rating);
    }
    
    sqlQuery += ' ORDER BY rating DESC, price_per_night ASC';
    
    const hotels = await query(sqlQuery, params);
    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}