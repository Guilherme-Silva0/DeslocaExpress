import {
  Contact2Icon,
  HomeIcon,
  Users2Icon,
  MapIcon,
  TruckIcon,
} from 'lucide-react'
import { useMemo } from 'react'

const useRoutes = () => {
  const routes = useMemo(
    () => [
      {
        icon: HomeIcon,
        label: 'Home',
        to: '/',
      },
      {
        icon: Users2Icon,
        label: 'Clientes',
        to: '/customers',
      },
      {
        icon: Contact2Icon,
        label: 'Condutores',
        to: '/drivers',
      },
      {
        icon: TruckIcon,
        label: 'Veículos',
        to: '/vehicles',
      },
      {
        icon: MapIcon,
        label: 'Deslocamentos',
        to: '/displacements',
      },
    ],
    [],
  )

  return routes
}

export default useRoutes
