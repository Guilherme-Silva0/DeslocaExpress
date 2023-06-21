'use client'

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import ItemListLink from './ItemListLink'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useAppThemeContext } from '@/contexts/ThemeContext'
import { useDrawerContext } from '@/contexts/DrawerContext'
import useRoutes from '@/hooks/useRoutes'

const SideDrawer = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const routes = useRoutes()
  const { isDrawerOpen, toggleDrawerOpen, DrawerOptions, SetDrawerOption } =
    useDrawerContext()

  const { themeName, toggleTheme } = useAppThemeContext()

  useEffect(() => {
    SetDrawerOption(routes)
    setIsLoading(false)
  }, [SetDrawerOption, routes])

  return (
    <Box width="100vw" height="100vh">
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawerOpen}
        variant={smDown ? 'temporary' : 'permanent'}
      >
        <Box
          width={theme.spacing(28)}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            width="100%"
            height={theme.spacing(20)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              sx={{
                height: theme.spacing(12),
                width: theme.spacing(12),
              }}
            />
          </Box>

          <Divider />

          <Box flex="1">
            <List component="nav" sx={{ overflowY: 'auto' }}>
              {!isLoading
                ? DrawerOptions.map((option) => (
                    <ItemListLink
                      key={option.to}
                      label={option.label}
                      to={option.to}
                      icon={option.icon}
                      onClick={smDown ? toggleDrawerOpen : undefined}
                    />
                  ))
                : Array.from(Array(5).keys()).map((index) => (
                    <Skeleton
                      variant="rectangular"
                      height={48}
                      sx={{ marginBottom: 0.5 }}
                      key={index}
                    />
                  ))}
            </List>
          </Box>
          <Box>
            <List component="nav">
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  {themeName === 'dark' ? <SunIcon /> : <MoonIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={themeName === 'dark' ? 'Modo claro' : 'Modo escuro'}
                />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </Box>
  )
}

export default SideDrawer
