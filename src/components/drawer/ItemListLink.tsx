import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

interface ItemListLinkProps {
  to: string
  icon: LucideIcon
  label: string
  onClick?: () => void
}

const ItemListLink = ({
  icon: Icon,
  label,
  to,
  onClick,
}: ItemListLinkProps) => {
  const pathname = usePathname()
  const handleClick = () => {
    onClick?.()
  }

  const match = useMemo(() => {
    return pathname === to
  }, [pathname, to])

  return (
    <ListItemButton
      LinkComponent={Link}
      selected={match}
      href={to}
      onClick={handleClick}
    >
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}

export default ItemListLink
