import { CartProvider } from '@/context/CartContext'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tienda Pantalones',
  description: 'La mejor tienda de pantalones'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={` antialiased`}>
        <CartProvider>
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
