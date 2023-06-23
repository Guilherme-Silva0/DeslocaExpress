'use client'

import { useDrawerContext } from '@/contexts/DrawerContext'
import {
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { MenuIcon } from 'lucide-react'

interface IHeaderProps {
  title: string
}

const Header = ({ title }: IHeaderProps) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { toggleDrawerOpen } = useDrawerContext()
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={!smDown && title === '' ? 0 : 0.5}
      padding={!smDown && title === '' ? 0 : 2}
      width="auto"
    >
      {smDown && (
        <IconButton onClick={toggleDrawerOpen}>
          <MenuIcon size={28} />
        </IconButton>
      )}
      <Typography
        variant={smDown ? 'h5' : 'h4'}
        fontWeight="500"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        component="h2"
      >
        {title}
      </Typography>
    </Stack>
  )
}

export default Header
