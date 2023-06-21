'use client'

import { DrawerProvider } from '@/contexts/DrawerContext'
import { AppThemeProvider } from '@/contexts/ThemeContext'
import { CssBaseline } from '@mui/material'
import { ReactNode } from 'react'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <DrawerProvider>{children}</DrawerProvider>
    </AppThemeProvider>
  )
}

export default Providers
