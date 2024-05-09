import type { Metadata } from 'next'
import '@/globals.css'

const title = 'Domain Dragon - Bringing the power of AI to top domainers worldwide.'
const description = 'Domain Dragon Bringing the power of AI to top domainers worldwide.'
const image = '/logo.png'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [image],
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="dark min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  )
}
