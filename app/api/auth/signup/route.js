// app/api/auth/signup/route.js - UPDATED
import { query } from '@/lib/database.js';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = @email',
      { email }
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, phone)
      OUTPUT INSERTED.id, INSERTED.first_name, INSERTED.last_name, INSERTED.email, INSERTED.phone, INSERTED.created_at
      VALUES (@firstName, @lastName, @email, @password, @phone)
    `;

    const result = await query(insertQuery, {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: phone || null
    });

    if (result.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: result[0]
      });
    } else {
      throw new Error('Failed to create user');
    }

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}