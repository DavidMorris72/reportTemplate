import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/env';

// Force runtime to be nodejs to ensure proper server-side execution
export const runtime = 'nodejs';

/**
 * POST /api/verify-password
 * 
 * Authenticates users by validating their email and password against the database.
 * Supports 'USER', 'ADMIN', and 'SUPER_ADMIN' roles.
 * 
 * Security considerations:
 * - Password hashing with bcrypt
 * - JWT token generation for sessions
 * - Database-based user management
 * - Role-based authentication for access control
 * 
 * @param request - NextRequest containing the email and password to verify
 * @returns NextResponse with JWT token and user info if valid
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is null - database connection failed');
      console.error('Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_SET: !!process.env.DATABASE_URL,
        POSTGRES_PRISMA_URL_SET: !!process.env.POSTGRES_PRISMA_URL,
        POSTGRES_URL_SET: !!process.env.POSTGRES_URL
      });
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return NextResponse.json({ 
      isValid: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}