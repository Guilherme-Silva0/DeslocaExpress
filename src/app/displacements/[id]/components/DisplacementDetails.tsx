'use client'

import useApi, {
  ICustomer,
  IDisplacement,
  IDriver,
  IVehicle,
  IWeatherForecast,
} from '@/hooks/useApi'

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
  Box,
  Divider,
} from '@mui/material'

import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import FormDisplacements from '../../components/form/FormDisplacements'

const DisplacementDetails = ({ id }: { id: string }) => {
  const [displacement, setDisplacement] = useState<IDisplacement>(
    {} as IDisplacement,
  )
  const [driver, setDriver] = useState<IDriver>({} as IDriver)
  const [vehicle, setVehicle] = useState<IVehicle>({} as IVehicle)
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer)
  const [weatherForecast, setWeatherForecast] = useState<IWeatherForecast[]>(
    [] as IWeatherForecast[],
  )
  const [showError, setShowError] = useState({ erro: false, message: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [openFormEditDisplacement, setOpenFormEditDisplacement] =
    useState(false)
  const navigate = useRouter()
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    getDisplacementById,
    getDriverById,
    getVehicleById,
    getCustomerById,
    deleteDisplacement,
    getWeatherForecast,
  } = useApi()

  const loadData = useCallback(async () => {
    try {
      const { data: dataDisplacement, error: erroDisplacement } =
        await getDisplacementById(id)
      if (erroDisplacement)
        return setShowError({
          erro: true,
          message: 'Houve um erro ao buscar o deslocamento',
        })
      setDisplacement(dataDisplacement! as IDisplacement)

      const { data: dataDriver, error: errorDriver } = await getDriverById(
        dataDisplacement.idCondutor?.toString()!,
      )
      if (errorDriver)
        setShowError({
          erro: true,
          message: 'Houve um erro ao buscar o condutor',
        })

      setDriver(dataDriver! as IDriver)

      const { data: dataVehicle, error: errorVehicle } = await getVehicleById(
        dataDisplacement.idVeiculo?.toString()!,
      )
      if (errorVehicle)
        setShowError({
          erro: true,
          message: 'Houve um erro ao buscar o veículo',
        })

      setVehicle(dataVehicle! as IVehicle)

      const { data: dataCustomer, error: errorCustomer } =
        await getCustomerById(dataDisplacement.idCliente?.toString()!)
      if (errorCustomer)
        setShowError({
          erro: true,
          message: 'Houve um erro ao buscar o cliente',
        })

      setCustomer(dataCustomer! as ICustomer)

      const { data: dataWeatherForecast, error: errorWeatherForecast } =
        await getWeatherForecast()
      if (errorWeatherForecast)
        setShowError({
          erro: true,
          message: 'Houve um erro ao buscar a previsão',
        })

      setWeatherForecast(dataWeatherForecast! as IWeatherForecast[])
    } finally {
      setIsLoading(false)
    }
  }, [
    id,
    getDisplacementById,
    getCustomerById,
    getDriverById,
    getVehicleById,
    getWeatherForecast,
  ])

  const handleDelete = async () => {
    const { error } = await deleteDisplacement(parseInt(id))
    if (error)
      return setShowError({
        erro: true,
        message: 'Houve um erro ao deletar o deslocamento',
      })

    setIsDialogOpen(false)
    navigate.push('/displacements')
  }

  const calculateAverageSpeed = () => {
    const distance = displacement?.kmFinal! - displacement?.kmInicial!
    const startTime = new Date(displacement?.inicioDeslocamento!)
    const endTime = new Date(displacement?.fimDeslocamento!)
    const durationInSeconds =
      Math.abs(endTime.getTime() - startTime.getTime()) / 1000

    const averageSpeed = distance / (durationInSeconds / 3600)

    return averageSpeed.toFixed(2)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', paddingX: 2, width: '80%' }}
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
        open={showError.erro}
        onClose={() => setShowError({ erro: false, message: '' })}
      >
        <Alert
          onClose={() => setShowError({ erro: false, message: '' })}
          variant="filled"
          severity="error"
        >
          {showError.message}
        </Alert>
      </Snackbar>
      <Paper elevation={3} sx={{ p: 3, maxWidth: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Detalhes do Deslocamento
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Motivo do deslocamento:
            </Typography>
            <Typography variant="body2">{displacement.motivo}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Observação do deslocamento:
            </Typography>
            <Typography variant="body2">
              {displacement.observacao && displacement.observacao}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Início do deslocamento:
            </Typography>
            <Typography variant="body2">
              {displacement.inicioDeslocamento &&
                format(new Date(displacement.inicioDeslocamento), 'PPp')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Fim do deslocamento:
            </Typography>
            <Typography variant="body2">
              {displacement.fimDeslocamento
                ? format(new Date(displacement.fimDeslocamento), 'PPp')
                : 'Deslocamento ainda não finalizado'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Velocidade media em KM/h:
            </Typography>
            <Typography variant="body2">
              {displacement.fimDeslocamento &&
              displacement.inicioDeslocamento &&
              displacement.kmInicial &&
              displacement.kmFinal
                ? `${calculateAverageSpeed()} KM/h`
                : 'Deslocamento ainda não finalizado'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Nome do cliente:
            </Typography>
            <Typography variant="body2">
              {customer.nome
                ? customer?.nome
                : 'Possivelmente esse cliente foi excluído'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Nome do condutor:
            </Typography>
            <Typography variant="body2">
              {driver.nome
                ? driver?.nome
                : 'Possivelmente esse condutor foi excluído'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Categoria da Habilitação:
            </Typography>
            <Typography variant="body2">
              {driver.catergoriaHabilitacao
                ? driver?.catergoriaHabilitacao
                : 'Possivelmente esse condutor foi excluído'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Modelo do veículo:
            </Typography>
            <Typography variant="body2">
              {vehicle?.marcaModelo
                ? vehicle?.marcaModelo
                : 'Possivelmente esse veículo foi excluído'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" fontWeight="bold">
              Placa do veículo
            </Typography>
            <Typography variant="body2">
              {vehicle?.placa
                ? vehicle?.placa
                : 'Possivelmente esse veículo foi excluído'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {weatherForecast.length > 0 && (
              <>
                <Typography variant="body1" fontWeight="bold">
                  Previsão do tempo
                </Typography>
                <Stack
                  direction={smDown ? 'column' : 'row'}
                  spacing={smDown ? 0.5 : 2}
                  divider={
                    <Divider
                      orientation={smDown ? 'horizontal' : 'vertical'}
                      flexItem
                    />
                  }
                >
                  {weatherForecast.slice(0, 3).map((weather, index) => (
                    <Box key={index} p={2}>
                      <Typography variant="body1">
                        Data: {format(new Date(weather.date), 'dd/MM/yyyy')}
                      </Typography>
                      <Typography variant="body2">
                        Temperatura em C°: {weather.temperatureC}°C
                      </Typography>
                      <Typography variant="body2">
                        Descrição: {weather.summary}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            )}
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
              {!displacement.kmFinal && !displacement.fimDeslocamento && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PencilIcon size={18} />}
                  onClick={() =>
                    setOpenFormEditDisplacement((oldOpen) => !oldOpen)
                  }
                >
                  Encerrar deslocamento
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <FormDisplacements
        open={openFormEditDisplacement}
        handleOpen={() => setOpenFormEditDisplacement((oldOpen) => !oldOpen)}
        isEdit
        displacementData={displacement}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza de que deseja excluir o deslocamento?
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

export default DisplacementDetails
