'use client'

import { LucideIcon } from 'lucide-react'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

interface IDrawerOption {
  icon: LucideIcon
  label: string
  to: string
}

interface IDrawerContextData {
  isDrawerOpen: boolean
  DrawerOptions: IDrawerOption[]
  toggleDrawerOpen: () => void
  SetDrawerOption: (newDrawerOptions: IDrawerOption[]) => void
}

const DrawerContext = createContext({} as IDrawerContextData)

export const useDrawerContext = () => useContext(DrawerContext)

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [DrawerOptions, setDrawerOptions] = useState<IDrawerOption[]>([])

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((currentIsDrawerOpen) => !currentIsDrawerOpen)
  }, [])

  const handleSetDrawerOption = useCallback(
    (newDrawerOptions: IDrawerOption[]) => {
      setDrawerOptions(newDrawerOptions)
    },
    [],
  )

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        toggleDrawerOpen,
        DrawerOptions,
        SetDrawerOption: handleSetDrawerOption,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}
