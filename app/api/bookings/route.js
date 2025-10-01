// app/api/bookings/route.js
import { query } from '@/lib/database.js';
import { NextResponse } from 'next/server';

// GET - Fetch all bookings (with optional user_id filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    debugger
    
    let sqlQuery = `
      SELECT 
        b.*,
        h.name as hotel_name,
        h.city as hotel_city,
        h.image_url as hotel_image,
        r.room_type,
        r.price as room_price
      FROM bookings b
      INNER JOIN hotels h ON b.hotel_id = h.id
      INNER JOIN rooms r ON b.room_id = r.id
    `;
    
    const params = {};
    
    if (userId) {
      sqlQuery += ' WHERE b.user_id = @user_id';
      params.user_id = parseInt(userId);
    }
    
    sqlQuery += ' ORDER BY b.created_at DESC';
    
    const bookings = await query(sqlQuery, params);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['user_id', 'hotel_id', 'room_id', 'check_in', 'check_out', 'guests', 'total_amount'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check room availability
    const roomCheck = await query(
      'SELECT available_rooms FROM rooms WHERE id = @room_id AND hotel_id = @hotel_id',
      { 
        room_id: parseInt(bookingData.room_id),
        hotel_id: parseInt(bookingData.hotel_id)
      }
    );

    if (roomCheck.length === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    if (roomCheck[0].available_rooms < 1) {
      return NextResponse.json(
        { error: 'Room is no longer available' },
        { status: 400 }
      );
    }

    // Insert booking
    const insertQuery = `
      INSERT INTO bookings (
        user_id, hotel_id, room_id, check_in, check_out, 
        guests, total_amount, status
      ) 
      OUTPUT INSERTED.*
      VALUES (
        @user_id, @hotel_id, @room_id, @check_in, @check_out,
        @guests, @total_amount, @status
      )
    `;

    const params = {
      user_id: parseInt(bookingData.user_id),
      hotel_id: parseInt(bookingData.hotel_id),
      room_id: parseInt(bookingData.room_id),
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      guests: parseInt(bookingData.guests),
      total_amount: parseFloat(bookingData.total_amount),
      status: bookingData.status || 'confirmed'
    };

    const result = await query(insertQuery, params);
    
    if (result.length > 0) {
      // Update room availability
      await query(
        'UPDATE rooms SET available_rooms = available_rooms - 1 WHERE id = @room_id',
        { room_id: parseInt(bookingData.room_id) }
      );

      return NextResponse.json({
        success: true,
        booking: result[0],
        message: 'Booking created successfully'
      });
    } else {
      throw new Error('Failed to create booking');
    }

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}