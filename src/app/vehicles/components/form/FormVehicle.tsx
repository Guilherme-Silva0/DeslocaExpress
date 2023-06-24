import {
  Backdrop,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useApi, { IVehicle } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import InputText from './InputText'
import {
  ArrowDownUpIcon,
  XIcon,
  TruckIcon,
  ConstructionIcon,
  CalendarDaysIcon,
} from 'lucide-react'

interface IFormVehicleProps {
  open: boolean
  handleOpen: () => void
  setAllVehicles?: Dispatch<SetStateAction<IVehicle[]>>
  isEdit?: boolean
  vehicleData?: IVehicle
}

const schema = z.object({
  placa: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  marcaModelo: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  anoFabricacao: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  kmAtual: z.string().trim().nonempty('Todos os campos são obrigatórios'),
})

export type FormVehicleData = z.infer<typeof schema>

const FormDriver: FC<IFormVehicleProps> = ({
  open,
  handleOpen,
  setAllVehicles,
  isEdit,
  vehicleData,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const navigation = useRouter()
  const { editVehicle, createNewVehicle } = useApi()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormVehicleData>({
    defaultValues: {
      placa: '',
      marcaModelo: '',
      anoFabricacao: '',
      kmAtual: '',
    },
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (vehicleData && isEdit) {
      setValue('marcaModelo', vehicleData.marcaModelo || '')
      setValue('placa', vehicleData.placa || '')
      setValue('anoFabricacao', vehicleData.anoFabricacao.toString() || '')
      setValue('kmAtual', vehicleData.kmAtual.toString() || '')
    }
  }, [vehicleData, setValue, isEdit])

  const onSubmitForm = async (dataForm: FormVehicleData) => {
    if (isEdit) {
      try {
        setIsLoading(true)
        const { error } = await editVehicle(vehicleData?.id, {
          id: vehicleData?.id,
          anoFabricacao: Number(dataForm.anoFabricacao),
          kmAtual: Number(dataForm.kmAtual),
          marcaModelo: dataForm.marcaModelo,
        })
        if (error) return setShowError(true)
        reset()
        navigation.refresh()
        handleOpen()
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        setIsLoading(true)
        const { data, error } = await createNewVehicle({
          ...dataForm,
          anoFabricacao: Number(dataForm.anoFabricacao),
          kmAtual: Number(dataForm.kmAtual),
        })
        if (error) return setShowError(true)
        setAllVehicles?.((oldVehicles) => [
          {
            ...dataForm,
            id: data,
            anoFabricacao: Number(dataForm.anoFabricacao),
            kmAtual: Number(dataForm.kmAtual),
          },
          ...oldVehicles,
        ])
        reset()
        handleOpen()
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Backdrop
      open={open}
      sx={{ padding: 2, marginLeft: smDown ? 0 : theme.spacing(28) }}
    >
      <Box
        component={Paper}
        elevation={5}
        padding={theme.spacing(smDown ? 2 : 3)}
        width={smDown ? '100%' : theme.spacing(70)}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant={smDown ? 'h6' : 'h5'}
            component="h2"
            marginLeft={theme.spacing(smDown ? 1 : 2)}
          >
            {isEdit ? 'Edite o veículo' : 'Cadastre um novo veículo'}
          </Typography>
          <IconButton onClick={handleOpen}>
            <XIcon />
          </IconButton>
        </Stack>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
          <Stack spacing={2} paddingX={theme.spacing(smDown ? 1 : 2)}>
            <InputText
              id="marcaModelo"
              type="text"
              label="Modelo do veículo"
              disabled={isLoading}
              errors={errors}
              register={register}
              icon={TruckIcon}
            />

            {!isEdit && (
              <InputText
                id="placa"
                type="text"
                label="Placa"
                disabled={isLoading}
                errors={errors}
                register={register}
                icon={ConstructionIcon}
              />
            )}
            <Stack direction={isEdit ? 'column' : 'row'} gap={2}>
              <InputText
                id="anoFabricacao"
                type="number"
                label="Ano de fabricação"
                disabled={isLoading}
                errors={errors}
                register={register}
                icon={CalendarDaysIcon}
              />

              <InputText
                id="kmAtual"
                type="number"
                label="KM Rodados"
                disabled={isLoading}
                errors={errors}
                register={register}
                icon={ArrowDownUpIcon}
              />
            </Stack>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isEdit ? 'Salvar' : 'Criar'}
            </Button>
            <Snackbar
              open={showError}
              onClose={() => setShowError((oldShowError) => !oldShowError)}
              sx={{ zIndex: 9999 }}
            >
              <Alert
                onClose={() => setShowError((oldShowError) => !oldShowError)}
                variant="filled"
                severity="error"
              >
                Ops, Houve um erro!
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      </Box>
    </Backdrop>
  )
}

export default FormDriver
