import { createTheme } from '@mui/material'

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
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
      paper: '#141b2d',
      default: '#0c101b',
    },
  },
})
