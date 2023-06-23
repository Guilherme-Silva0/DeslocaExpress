'use client'

import { Alert, Box, Snackbar } from '@mui/material'
import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import TableCustomers from './components/TableCustomers'
import useApi, { ICustomer } from '@/hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import FormCustomer from './components/form/FormCustomer'

export default function Home() {
  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showError, setShowError] = useState(false)
  const [openFormNewCustomer, setOpenFormNewCustomer] = useState(false)
  const { getAllCustomers } = useApi()

  const loadCustomers = useCallback(async () => {
    try {
      const { data, error } = await getAllCustomers()
      if (error) return setShowError(true)
      setAllCustomers(data!)
    } finally {
      setIsLoading(false)
    }
  }, [getAllCustomers])

  useEffect(() => {
    loadCustomers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredCustomers = useMemo(() => {
    if (searchTerm.trim()) {
      return allCustomers.filter((customer) =>
        customer.nome.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
    }
    return allCustomers
  }, [allCustomers, searchTerm])

  const totalCount = useMemo(() => {
    return filteredCustomers.length
  }, [filteredCustomers])

  return (
    <Box height="100%">
      <Header title="Clientes" />
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
            Houve um erro ao buscar clientes
          </Alert>
        </Snackbar>
        <ToolBar
          searchText={searchTerm}
          onChangeSearchText={setSearchTerm}
          onClickButtonNew={() => setOpenFormNewCustomer((oldOpen) => !oldOpen)}
        />
        <TableCustomers
          data={filteredCustomers}
          isLoading={isLoading}
          totalCount={totalCount}
        />
        <FormCustomer
          open={openFormNewCustomer}
          handleOpen={() => setOpenFormNewCustomer((oldOpen) => !oldOpen)}
          setAllCustomers={setAllCustomers}
        />
      </Box>
    </Box>
  )
}
