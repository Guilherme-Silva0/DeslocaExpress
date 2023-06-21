import { ReactNode } from 'react'
import './globals.css'
import { Outfit } from 'next/font/google'
import Providers from './providers'
import SideDrawer from '@/components/drawer/SideDrawer'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
  title: 'Desloca Express',
  description: 'Uma aplicação de deslocamento poderosa e rápida!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <Providers>
        <body className={outfit.className}>
          <SideDrawer>{children}</SideDrawer>
        </body>
      </Providers>
    </html>
  )
}
