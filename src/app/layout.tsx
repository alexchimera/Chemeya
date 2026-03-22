import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DMTA OBEYA',
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
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-mono">
        {children}
      </body>
    </html>
  )
}
