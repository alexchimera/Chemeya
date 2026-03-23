import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DMTA Obeya',
  description: 'DMTA Obeya Board — Drug Discovery Visual Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  )
}
