'use client'

import useApi, { IVehicle } from '@/hooks/useApi'
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
import FormVehicle from '../../components/form/FormVehicle'

function VehicleDetails({ id }: { id: string }) {
  const [vehicle, setVehicle] = useState<IVehicle>({} as IVehicle)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [openFormEditVehicle, setOpenFormEditVehicle] = useState(false)
  const navigate = useRouter()
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { getVehicleById, deleteVehicle } = useApi()

  const loadVehicle = useCallback(async () => {
    try {
      const { data, error } = await getVehicleById(id)
      if (error) return setShowError(true)
      setVehicle(data! as IVehicle)
    } finally {
      setIsLoading(false)
    }
  }, [id, getVehicleById])

  const handleDelete = async () => {
    const { error } = await deleteVehicle(parseInt(id))
    if (error) return setShowError(true)

    setIsDialogOpen(false)
    navigate.push('/vehicles')
  }

  useEffect(() => {
    loadVehicle()
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
          Detalhes do veículo
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Modelo do veículo:
            </Typography>
            <Typography variant="body2">{vehicle.marcaModelo}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Placa:
            </Typography>
            <Typography variant="body2">{vehicle?.placa}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Ano de fabricação:
            </Typography>
            <Typography variant="body2">{vehicle.anoFabricacao}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Quilômetros rodados:
            </Typography>
            <Typography variant="body2">{vehicle.kmAtual}</Typography>
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
                onClick={() => setOpenFormEditVehicle((oldOpen) => !oldOpen)}
              >
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <FormVehicle
        open={openFormEditVehicle}
        handleOpen={() => setOpenFormEditVehicle((oldOpen) => !oldOpen)}
        isEdit
        vehicleData={vehicle}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza de que deseja excluir o veículo?
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

export default VehicleDetails
