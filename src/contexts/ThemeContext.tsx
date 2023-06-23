'use client'

import { DarkTheme } from '@/themes/Dark'
import { LightTheme } from '@/themes/Light'
import { ThemeProvider } from '@mui/material'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface IAppThemeContextData {
  themeName: 'light' | 'dark'
  toggleTheme: () => void
}

const AppThemeContext = createContext({} as IAppThemeContextData)

export const useAppThemeContext = () => useContext(AppThemeContext)

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setThemeName((localStorage.getItem('theme') as 'light' | 'dark') ?? 'light')
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', themeName)
  }, [themeName])

  const toggleTheme = useCallback(() => {
    setThemeName((currentTime) => (currentTime === 'light' ? 'dark' : 'light'))
  }, [])

  const theme = useMemo(() => {
    if (themeName === 'light') return LightTheme

    return DarkTheme
  }, [themeName])

  return (
    <AppThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  )
}
