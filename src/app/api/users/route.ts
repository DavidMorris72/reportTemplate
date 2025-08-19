import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/env';
import { z } from 'zod';

// Force runtime to be nodejs to ensure proper server-side execution
export const runtime = 'nodejs';

// Validation schemas
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN'])
});

const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional()
});

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      throw new Error('Insufficient permissions');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    await verifyAdminToken(request);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: error.message === 'Insufficient permissions' ? 403 : 401 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const currentUser = await verifyAdminToken(request);
    const body = await request.json();

    // Validate input
    const validatedData = CreateUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Only Super Admins can create other Admins
    if (validatedData.role === 'ADMIN' || validatedData.role === 'SUPER_ADMIN') {
      if (currentUser.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Only Super Administrators can create Admin users' },
          { status: 403 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
        hashedPassword,
        role: validatedData.role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: error.message === 'Insufficient permissions' ? 403 : 500 }
    );
  }
}