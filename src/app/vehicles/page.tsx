'use client'

import { Alert, Box, Snackbar } from '@mui/material'
import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import useApi, { IVehicle } from '@/hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TableVehicles from './components/TableVehicles'
import FormVehicle from './components/form/FormVehicle'

export default function Home() {
  const [allVehicles, setAllVehicles] = useState<IVehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showError, setShowError] = useState(false)
  const [openFormNewVehicle, setOpenFormNewVehicle] = useState(false)
  const { getAllVehicles } = useApi()

  const loadVehicles = useCallback(async () => {
    try {
      const { data, error } = await getAllVehicles()
      if (error) return setShowError(true)
      setAllVehicles(data!)
    } finally {
      setIsLoading(false)
    }
  }, [getAllVehicles])

  useEffect(() => {
    loadVehicles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredVehicles = useMemo(() => {
    if (searchTerm.trim()) {
      return allVehicles.filter((vehicle) =>
        vehicle?.marcaModelo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase().trim()),
      )
    }
    return allVehicles
  }, [allVehicles, searchTerm])

  const totalCount = useMemo(() => {
    return filteredVehicles.length
  }, [filteredVehicles])

  return (
    <Box height="100%">
      <Header title="Veículos" />
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
            Houve um erro ao buscar veículos
          </Alert>
        </Snackbar>
        <ToolBar
          searchText={searchTerm}
          onChangeSearchText={setSearchTerm}
          onClickButtonNew={() => setOpenFormNewVehicle((oldOpen) => !oldOpen)}
        />
        <TableVehicles
          data={filteredVehicles}
          isLoading={isLoading}
          totalCount={totalCount}
        />
        <FormVehicle
          open={openFormNewVehicle}
          handleOpen={() => setOpenFormNewVehicle((oldOpen) => !oldOpen)}
          setAllVehicles={setAllVehicles}
        />
      </Box>
    </Box>
  )
}
