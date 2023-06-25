import { ChangeEvent, useState } from 'react'
import {
  IconButton,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { IDisplacement } from '@/hooks/useApi'
import { InfoIcon } from 'lucide-react'
import Link from 'next/link'

interface ITableDisplacementsProps {
  data: IDisplacement[]
  isLoading: boolean
  totalCount: number
}

const TableDisplacements = ({
  data,
  isLoading,
  totalCount,
}: ITableDisplacementsProps) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))

  const maxRows = smDown ? 8 : 5
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * maxRows
  const endIndex = startIndex + maxRows

  const currentPageData = data.slice(startIndex, endIndex)

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  return (
    <TableContainer
      component={Paper}
      elevation={4}
      sx={{ marginTop: 3, width: 'auto' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Informações</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading
            ? Array.from(Array(maxRows).keys()).map((index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            : currentPageData.map((displacements) => (
                <TableRow key={displacements.id}>
                  <TableCell>
                    <IconButton
                      component={Link}
                      href={`/displacements/${displacements.id}`}
                    >
                      <InfoIcon size={18} />
                    </IconButton>
                  </TableCell>
                  <TableCell>{displacements?.motivo}</TableCell>
                  <TableCell>
                    {displacements?.fimDeslocamento
                      ? 'Finalizado'
                      : 'Em andamento'}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>

        <TableFooter>
          {totalCount > 0 && totalCount > maxRows && (
            <TableRow>
              <TableCell colSpan={3}>
                <Pagination
                  count={Math.ceil(totalCount / maxRows)}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default TableDisplacements
