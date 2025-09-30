// app/api/hotels/[id]/route.js
import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get hotel details
    const hotel = await query(
      'SELECT * FROM hotels WHERE id = @id',
      { id: parseInt(id) }
    );
    
    if (hotel.length === 0) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }
    
    // Get available rooms for this hotel
    const rooms = await query(
      `SELECT * FROM rooms 
       WHERE hotel_id = @hotel_id 
       AND available_rooms > 0
       ORDER BY price ASC`,
      { hotel_id: parseInt(id) }
    );
    
    return NextResponse.json({
      hotel: hotel[0],
      rooms
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
}