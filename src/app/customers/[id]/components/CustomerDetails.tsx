'use client'

import useApi, { ICustomer } from '@/hooks/useApi'
import {
  Typography,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import FormCustomer from '../../components/form/FormCustomer'

function CustomerDetails({ id }: { id: string }) {
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [openFormEditCustomer, setOpenFormEditCustomer] = useState(false)
  const navigate = useRouter()
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { getCustomerById, deleteCustomer } = useApi()

  const loadCustomer = useCallback(async () => {
    try {
      const { data, error } = await getCustomerById(id)
      if (error) return setShowError(true)
      setCustomer(data! as ICustomer)
    } finally {
      setIsLoading(false)
    }
  }, [id, getCustomerById])

  const handleDelete = async () => {
    const { error } = await deleteCustomer(parseInt(id))
    if (error) return setShowError(true)

    setIsDialogOpen(false)
    navigate.push('/customers')
  }

  useEffect(() => {
    loadCustomer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', paddingX: 2 }}
      >
        <Paper elevation={3} sx={{ p: 3, marginTop: smDown ? -25 : 0 }}>
          <Skeleton variant="text" width="50%" />
          <Grid container spacing={2}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="body1" fontWeight="bold">
                  <Skeleton variant="text" width="80%" />
                </Typography>
                <Typography variant="body2">
                  <Skeleton variant="text" width="90%" />
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    )
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', paddingX: 2, maxWidth: '100%' }}
    >
      <Snackbar
        open={showError}
        onClose={() => setShowError((oldShowError) => !oldShowError)}
      >
        <Alert
          onClose={() => setShowError((oldShowError) => !oldShowError)}
          variant="filled"
          severity="error"
        >
          Ops, Houve um erro!!
        </Alert>
      </Snackbar>
      <Paper elevation={3} sx={{ p: 3, maxWidth: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Detalhes do Cliente
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Número do Documento:
            </Typography>
            <Typography variant="body2">{customer.numeroDocumento}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Tipo de Documento:
            </Typography>
            <Typography variant="body2">{customer.tipoDocumento}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Nome:
            </Typography>
            <Typography variant="body2">{customer.nome}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Logradouro:
            </Typography>
            <Typography variant="body2">{customer.logradouro}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Número:
            </Typography>
            <Typography variant="body2">{customer.numero}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Bairro:
            </Typography>
            <Typography variant="body2">{customer.bairro}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Cidade:
            </Typography>
            <Typography variant="body2">{customer.cidade}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              UF:
            </Typography>
            <Typography variant="body2">{customer.uf}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" gap={0.5}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsDialogOpen(true)}
                startIcon={<Trash2Icon size={18} />}
              >
                Excluir
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PencilIcon size={18} />}
                onClick={() => setOpenFormEditCustomer((oldOpen) => !oldOpen)}
              >
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <FormCustomer
        open={openFormEditCustomer}
        handleOpen={() => setOpenFormEditCustomer((oldOpen) => !oldOpen)}
        isEdit
        customerData={customer}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza de que deseja excluir o cliente?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default CustomerDetails
