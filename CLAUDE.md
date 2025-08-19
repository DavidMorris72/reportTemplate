# AI Toolkit - Project Documentation

## Project Overview

The AI Toolkit is a Next.js-based web application that provides a comprehensive suite of AI-powered tools for data analysis, content generation, automation, and more. The application features a secure admin dashboard with user management capabilities and role-based access control.

### Company Branding

- **Logo**: `/public/dmsi-logo.svg` - Official DMSI company logo
- **Brand Identity**: Professional, modern design with established color palette

## Recent Major Updates

### Admin Dashboard & User Management System (Latest Implementation)

A complete admin dashboard with user management has been implemented, featuring:

- **Database-driven authentication** replacing environment variable-based auth
- **Three-tier role system** (User, Admin, Super Admin)
- **Complete CRUD operations** for user management
- **Secure JWT-based sessions** with bcrypt password hashing
- **Role-based route protection** via middleware

## Architecture Overview

### Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: Neon PostgreSQL with serverless driver
- **Authentication**: JWT + bcrypt
- **UI Components**: Radix UI components
- **Icons**: Lucide React

### Database Schema

```sql
-- User table for authentication and role management
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Authentication System

### Login Credentials (Seeded Users)

- **Super Admin**: `admin@example.com` / `dmorris`
- **Default User**: `user@example.com` / `dmsi1234`

### Role Permissions

- **USER**: Access to main toolkit only
- **ADMIN**: Admin dashboard access + user management (cannot create other admins)
- **SUPER_ADMIN**: Full system access + can create/manage admin users

### JWT Token Structure

```typescript
{
  userId: string,
  email: string,
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN',
  exp: number // 24h expiration
}
```

## API Endpoints

### Authentication

- `POST /api/verify-password` - User authentication with email/password

### User Management (Admin/Super Admin only)

- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### API Authentication

All admin API endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Routes & Pages

### Public Routes

- `/` - Main application with login
- `/data-analysis` - Data analysis tool (authenticated users)

### Admin Routes (Protected)

- `/admin` - Admin dashboard landing page
- `/admin/users` - User management list
- `/admin/users/new` - Create new user form
- `/admin/users/[id]/edit` - Edit user form

### Route Protection

Middleware at `/src/middleware.ts` protects all `/admin/*` routes, requiring:

1. Valid JWT token
2. ADMIN or SUPER_ADMIN role

## Company Brand Colors & Logo

### Logo Reference

- **Location**: `/public/dmsi-logo.svg`
- **Logo Colors**: The DMSI logo uses `#56585b` (dark gray) and `#e04403` (orange-red)
- **Usage**: Official company branding, headers, and brand identification

### Brand Color Palette

#### Primary Colors

- **Primary Red**: `#cd442c` - Main brand color for headers and CTAs
- **Primary Dark Gray**: `#4d504e` - Text and UI elements

#### Secondary Colors

- **Secondary Blue**: `#006ca7` - Accent and interactive elements
- **Secondary Green**: `#6fb544` - Success states and positive actions
- **Secondary Yellow**: `#eaab30` - Warnings and highlights

#### Tertiary Colors

- **Tertiary Teal**: `#42b59f` - Supporting elements and variety
- **Tertiary Purple**: `#612b52` - Special highlights and variety

### Color Usage Guidelines

#### Logo Integration

- The logo's orange-red (`#e04403`) complements the Primary Red (`#cd442c`)
- Logo's dark gray (`#56585b`) pairs well with Primary Dark Gray (`#4d504e`)
- Use logo prominently in headers and brand identification areas

#### Application Guidelines

- **Primary Red** (`#cd442c`): Main navigation, primary buttons, brand accents
- **Secondary Blue** (`#006ca7`): Links, secondary actions, admin interface elements
- **Secondary Green** (`#6fb544`): Success messages, confirmations, positive states
- **Secondary Yellow** (`#eaab30`): Warnings, highlights, important notices
- **Primary Dark Gray** (`#4d504e`): Body text, subtle UI elements
- **Tertiary Colors**: Supporting elements, variety, and visual interest

#### Accessibility Notes

- Ensure sufficient contrast ratios for text readability
- Test color combinations for accessibility compliance
- Consider color-blind friendly alternatives when needed

### Tailwind CSS Integration

```css
/* Add to tailwind.config.ts theme.extend.colors */
colors: {
  brand: {
    primary: '#cd442c',
    'primary-gray': '#4d504e',
    'secondary-blue': '#006ca7',
    'secondary-green': '#6fb544',
    'secondary-yellow': '#eaab30',
    'tertiary-teal': '#42b59f',
    'tertiary-purple': '#612b52',
    'logo-red': '#e04403',
    'logo-gray': '#56585b'
  }
}
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="your_neon_postgresql_connection_string"

# Authentication (Legacy)
APP_PASSWORD="dmsi1234"
ADMIN_PASSWORD="dmorris"

# JWT Security
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Optional API Keys
ANTHROPIC_API_KEY="your_anthropic_api_key"
OPENAI_API_KEY="your_openai_api_key"
```

## Development Commands

### Database Operations

```bash
# Run the SQL schema to set up the database
# Execute the contents of schema.sql in your Neon database console
# or run it via psql: psql $DATABASE_URL < schema.sql
```

### Development Server

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

## File Structure

### Key Directories

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── users/         # User management pages
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes
│   │   ├── users/         # User CRUD endpoints
│   │   └── verify-password/ # Authentication
│   └── page.tsx           # Main application
├── components/            # Reusable React components
│   ├── ui/               # Radix UI components
│   └── Header.tsx        # App header with admin link
├── lib/                  # Utility libraries
│   ├── db.ts             # Neon serverless database connection
│   └── utils.ts          # General utilities
└── middleware.ts         # Route protection middleware

schema.sql                # Database schema and initial data
```

## Security Considerations

### Implemented Security Measures

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: 24-hour expiration
- **Role-based Access**: Middleware protection on admin routes
- **Input Validation**: Zod schemas for API endpoints
- **HTTPS Required**: Database connections use SSL

### Security Best Practices

- Change JWT_SECRET in production
- Use strong, unique passwords for seeded accounts
- Regularly rotate API keys and secrets
- Monitor admin access and user activities

## Troubleshooting

### Common Issues

**Database Connection Errors**

- Verify DATABASE_URL in .env/.env.local
- Check Neon database status and credentials
- Ensure SSL mode is enabled for connections

**Authentication Issues**

- Check JWT_SECRET is set in Vercel as well
- Verify user exists in database with correct role
- Clear localStorage and re-authenticate

**Database Issues**

- Ensure DATABASE_URL is properly configured for Neon serverless
- Check that the database schema has been applied
- Verify database connection string format

### Development Tips

- Use Neon console or psql to inspect database data
- Check browser Network tab for API call details
- Use React DevTools to inspect component state
- Monitor Next.js dev server console for errors

## Future Enhancements

### Potential Improvements

- **Audit Logging**: Track admin actions and user changes
- **Password Reset**: Email-based password reset functionality
- **User Profiles**: Extended user information and preferences
- **Session Management**: Active session monitoring and management
- **API Rate Limiting**: Prevent abuse of API endpoints
- **Email Notifications**: Account creation and changes
- **Two-Factor Authentication**: Enhanced security for admin accounts
- **Bulk Operations**: Mass user import/export capabilities

---

_Last Updated: August 2025_
_Version: 1.0 with Admin Dashboard_
