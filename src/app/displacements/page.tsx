'use client'

import { Alert, Box, Snackbar } from '@mui/material'
import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import useApi, { IDisplacement } from '@/hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TableDisplacements from './components/TableDisplacements'
import FormDisplacements from './components/form/FormDisplacements'

export default function Home() {
  const [allDisplacements, SetAllDisplacements] = useState<IDisplacement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showError, setShowError] = useState(false)
  const [openFormNewDisplacements, setOpenFormNewDisplacements] =
    useState(false)
  const { getAllDisplacements } = useApi()

  const loadDisplacements = useCallback(async () => {
    try {
      const { data, error } = await getAllDisplacements()
      if (error) return setShowError(true)
      SetAllDisplacements(data!)
    } finally {
      setIsLoading(false)
    }
  }, [getAllDisplacements])

  useEffect(() => {
    loadDisplacements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredDisplacements = useMemo(() => {
    if (searchTerm.trim()) {
      return allDisplacements.filter((displacement) =>
        displacement?.motivo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase().trim()),
      )
    }
    return allDisplacements
  }, [allDisplacements, searchTerm])

  const totalCount = useMemo(() => {
    return filteredDisplacements.length
  }, [filteredDisplacements])

  return (
    <Box height="100%">
      <Header title="Deslocamentos" />
      <Box paddingX={3}>
        <Snackbar
          open={showError}
          onClose={() => setShowError((oldShowError) => !oldShowError)}
        >
          <Alert
            onClose={() => setShowError((oldShowError) => !oldShowError)}
            variant="filled"
            severity="error"
          >
            Houve um erro ao buscar deslocamentos
          </Alert>
        </Snackbar>
        <ToolBar
          searchText={searchTerm}
          onChangeSearchText={setSearchTerm}
          onClickButtonNew={() =>
            setOpenFormNewDisplacements((oldOpen) => !oldOpen)
          }
        />
        <TableDisplacements
          data={filteredDisplacements}
          isLoading={isLoading}
          totalCount={totalCount}
        />
        <FormDisplacements
          open={openFormNewDisplacements}
          handleOpen={() => setOpenFormNewDisplacements((oldOpen) => !oldOpen)}
          setAllDisplacements={SetAllDisplacements}
        />
      </Box>
    </Box>
  )
}
