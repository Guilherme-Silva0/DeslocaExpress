'use client'

import { Alert, Box, Snackbar } from '@mui/material'
import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import useApi, { IDriver } from '@/hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TableDrivers from './components/TableDrivers'
import FormDriver from './components/form/FormDriver'

export default function Home() {
  const [allDrivers, setAllDrivers] = useState<IDriver[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showError, setShowError] = useState(false)
  const [openFormNewDriver, setOpenFormNewDriver] = useState(false)
  const { getAllDrivers } = useApi()

  const loadDrivers = useCallback(async () => {
    try {
      const { data, error } = await getAllDrivers()
      if (error) return setShowError(true)
      setAllDrivers(data!)
    } finally {
      setIsLoading(false)
    }
  }, [getAllDrivers])

  useEffect(() => {
    loadDrivers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredDrivers = useMemo(() => {
    if (searchTerm.trim()) {
      return allDrivers.filter((driver) =>
        driver.nome.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
    }
    return allDrivers
  }, [allDrivers, searchTerm])

  const totalCount = useMemo(() => {
    return filteredDrivers.length
  }, [filteredDrivers])

  return (
    <Box height="100%">
      <Header title="Condutores" />
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
            Houve um erro ao buscar condutores
          </Alert>
        </Snackbar>
        <ToolBar
          searchText={searchTerm}
          onChangeSearchText={setSearchTerm}
          onClickButtonNew={() => setOpenFormNewDriver((oldOpen) => !oldOpen)}
        />
        <TableDrivers
          data={filteredDrivers}
          isLoading={isLoading}
          totalCount={totalCount}
        />
        <FormDriver
          open={openFormNewDriver}
          handleOpen={() => setOpenFormNewDriver((oldOpen) => !oldOpen)}
          setAllDrivers={setAllDrivers}
        />
      </Box>
    </Box>
  )
}
