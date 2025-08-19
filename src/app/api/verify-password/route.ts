import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/verify-password
 * 
 * Authenticates users by validating their password and role against the configured
 * environment variables. Supports both 'user' and 'admin' roles.
 * 
 * Security considerations:
 * - Password comparison is performed server-side only
 * - No password hashing (suitable for simple applications with limited users)
 * - Environment variable validation ensures proper configuration
 * - Role-based authentication for access control
 * 
 * @param request - NextRequest containing the password and role to verify
 * @returns NextResponse indicating whether the credentials are valid and the user role
 */
export async function POST(request: NextRequest) {
  try {
    const { password, role = 'user' } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    let correctPassword: string | undefined;
    
    if (role === 'admin') {
      correctPassword = process.env.ADMIN_PASSWORD;
      if (!correctPassword) {
        console.error('ADMIN_PASSWORD environment variable not set');
        return NextResponse.json(
          { error: 'Admin access not configured' },
          { status: 500 }
        );
      }
    } else {
      correctPassword = process.env.APP_PASSWORD;
      if (!correctPassword) {
        console.error('APP_PASSWORD environment variable not set');
        return NextResponse.json(
          { error: 'User access not configured' },
          { status: 500 }
        );
      }
    }

    const isValid = password === correctPassword;
    
    return NextResponse.json({ 
      isValid,
      role: isValid ? role : null
    });
    
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}