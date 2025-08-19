# Next.js AI Toolkit Boilerplate

A comprehensive Next.js boilerplate with TypeScript, Tailwind CSS, authentication, and AI integration foundations. Perfect for building modern AI-powered applications.

## ✨ Features

### 🏗️ Foundation Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **40+ shadcn/ui components** pre-configured
- **SWR** for data fetching
- **Responsive design** patterns

### 🔐 Authentication System

- Role-based authentication (User/Admin)
- Password-protected access
- localStorage session management
- Protected route patterns
- Clean login/logout flow

### 🎨 UI Components

- Complete shadcn/ui component library
- Professional header/footer
- Tool card layout system
- Loading states and error handling
- Customizable themes and colors

### 🔧 Development Tools

- **ESLint** with comprehensive rules
- **Prettier** code formatting
- **Husky** pre-commit hooks
- **TypeScript** strict mode
- Quality gates (lint, format, type-check)

### 🚀 Integration Ready

- **Anthropic AI SDK** setup
- **Puppeteer** for PDF generation
- **Markdown Editor** integration
- **Icon libraries** (Lucide, Phosphor)
- **File handling** utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone or download this boilerplate**

   ```bash
   git clone <your-repo-url> my-ai-app
   cd my-ai-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your configuration.

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create `.env.local` with these variables:

```bash
# Authentication passwords
APP_PASSWORD=your_user_password
ADMIN_PASSWORD=your_admin_password

# AI API Keys (optional)
ANTHROPIC_API_KEY=your_anthropic_key

# Add your other API keys here
```

### Customization

#### 1. **Branding**

- Update `src/app/layout.tsx` metadata
- Replace favicon files in `public/`
- Modify header branding in `src/components/Header.tsx`

#### 2. **Colors & Theme**

- Customize Tailwind config in `tailwind.config.ts`
- Update CSS variables in `src/app/globals.css`
- Modify component themes in tool sections

#### 3. **Tool Configuration**

Edit the tool definitions in `src/app/page.tsx`:

```typescript
const dataTools = [
  {
    title: "Your Tool Name",
    description: "Tool description",
    href: "/your-tool-route",
    comingSoon: false,
  },
];
```

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/          # API routes
│   │   │   ├── health-check/
│   │   │   └── verify-password/
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   ├── not-found.tsx # 404 page
│   │   └── page.tsx      # Home page
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── ToolCard.tsx  # Tool card component
│   │   └── ToolSection.tsx # Tool section wrapper
│   └── lib/
│       └── utils.ts      # Utility functions
├── .eslintrc.json        # ESLint configuration
├── .husky/               # Git hooks
├── components.json       # shadcn/ui configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript checker
npm run quality      # Run all quality checks
```

### Adding New Pages

1. Create a new file in `src/app/your-page/page.tsx`
2. Add authentication wrapper if needed
3. Update navigation or tool links

### Adding New API Routes

1. Create `src/app/api/your-endpoint/route.ts`
2. Implement GET, POST, etc. handlers
3. Add error handling and validation

### Adding New Components

1. Create component in `src/components/`
2. Use existing shadcn/ui components
3. Follow TypeScript patterns
4. Add to exports if reusable

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

1. Build the application: `npm run build`
2. Deploy the `.next` folder and `public/` directory
3. Ensure Node.js runtime is available
4. Set environment variables

## 🎨 Customization Guide

### Theme Colors

Update these CSS variables in `globals.css`:

```css
:root {
  --primary: 221 83% 53%; /* Blue */
  --secondary: 210 40% 98%;
  /* Add your brand colors */
}
```

### Component Themes

Modify theme configurations in components:

```typescript
const themeColors = {
  blue: { bg: "from-blue-50", accent: "text-blue-600" },
  // Add your themes
};
```

### Adding New Tool Categories

1. Define tools array in `page.tsx`
2. Add new theme to `ToolSection.tsx`
3. Create corresponding pages/routes

## 🔐 Security

- Passwords are verified server-side only
- No sensitive data in client-side code
- Environment variables for configuration
- HTTPS recommended for production
- Regular dependency updates recommended

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks: `npm run quality`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions and support:

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Tailwind CSS docs](https://tailwindcss.com/docs)
- Explore [shadcn/ui components](https://ui.shadcn.com/)

## 🚀 What's Next?

After setting up the boilerplate:

1. Customize branding and colors
2. Add your specific tool implementations
3. Integrate your preferred AI services
4. Deploy to your hosting platform
5. Build amazing AI-powered applications!

---

**Happy coding! 🎉**
