'use client'

import useApi, { IDriver } from '@/hooks/useApi'
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
import FormDriver from '../../components/form/FormDriver'
import { format } from 'date-fns'

function DriverDetails({ id }: { id: string }) {
  const [driver, setDriver] = useState<IDriver>({} as IDriver)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [openFormEditDriver, setOpenFormEditDriver] = useState(false)
  const navigate = useRouter()
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { getDriverById, deleteDriver } = useApi()

  const loadDriver = useCallback(async () => {
    try {
      const { data, error } = await getDriverById(id)
      if (error) return setShowError(true)
      setDriver(data! as IDriver)
    } finally {
      setIsLoading(false)
    }
  }, [id, getDriverById])

  const handleDelete = async () => {
    const { error } = await deleteDriver(parseInt(id))
    if (error) return setShowError(true)

    setIsDialogOpen(false)
    navigate.push('/drivers')
  }

  useEffect(() => {
    loadDriver()
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
      sx={{ minHeight: '100vh', paddingX: 2 }}
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
          Ops, houve um erro!
        </Alert>
      </Snackbar>
      <Paper elevation={3} sx={{ p: 3, marginTop: smDown ? -25 : 0 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Detalhes do Condutor
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Nome do condutor:
            </Typography>
            <Typography variant="body2">{driver?.nome}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Número da Habilitação:
            </Typography>
            <Typography variant="body2">{driver.numeroHabilitacao}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Categoria da Habilitação:
            </Typography>
            <Typography variant="body2">
              {driver?.catergoriaHabilitacao}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Vencimento da Habilitação:
            </Typography>
            <Typography variant="body2">
              {format(new Date(driver.vencimentoHabilitacao), 'dd/MM/yyyy')}
            </Typography>
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
                onClick={() => setOpenFormEditDriver((oldOpen) => !oldOpen)}
              >
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <FormDriver
        open={openFormEditDriver}
        handleOpen={() => setOpenFormEditDriver((oldOpen) => !oldOpen)}
        isEdit
        driverData={driver}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza de que deseja excluir o condutor?
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

export default DriverDetails
