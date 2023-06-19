import { ReactNode } from 'react'
import './globals.css'
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
  title: 'Desloca Express',
  description: 'Uma aplicação de deslocamento poderosa e rápida!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
