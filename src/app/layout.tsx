import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SoulVault AI',
  description: 'Secure your digital life. Preserve your story for the people who matter.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  )
}
