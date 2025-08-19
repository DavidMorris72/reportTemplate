import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Toolkit',
  description: 'AI-powered application toolkit with Next.js, TypeScript, and Tailwind CSS',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
}

/**
 * RootLayout Component
 * 
 * The root layout component for the AI Toolkit Next.js application. 
 * Provides the basic HTML structure and applies global styles including the Inter font family.
 * 
 * This layout wraps all pages and components in the application, ensuring
 * consistent styling and typography throughout the user experience.
 * 
 * @param children - The page content to be rendered within the layout
 * @returns HTML structure with global styles and font configuration
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}