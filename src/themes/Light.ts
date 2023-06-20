import { createTheme } from '@mui/material'

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6870fa',
      dark: '#3e4396',
      light: '#a4a9fc',
      contrastText: '#fefefe',
    },
    secondary: {
      main: '#4cceac',
      dark: '#2e7c67',
      light: '#94e2cd',
      contrastText: '#fefefe',
    },
    background: {
      paper: '#fefefe',
      default: '#e5e7eb',
    },
  },
})
