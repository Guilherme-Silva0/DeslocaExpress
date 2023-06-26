import {
  Backdrop,
  Box,
  Button,
  IconButton,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import {
  XIcon,
  ClipboardSignatureIcon,
  ArrowUp01Icon,
  ClipboardListIcon,
} from 'lucide-react'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import InputText from './InputText'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useApi, {
  ICustomer,
  IDisplacement,
  IDriver,
  IVehicle,
} from '@/hooks/useApi'
import { useRouter } from 'next/navigation'

interface IFormDisplacementProps {
  open: boolean
  handleOpen: () => void
  setAllDisplacements?: Dispatch<SetStateAction<IDisplacement[]>>
  isEdit?: boolean
  displacementData?: IDisplacement
}

const schema = z.object({
  checkList: z.boolean().refine((value) => value === true, {
    message: 'Vocẽ deve aceitar os termos',
    path: ['checkList'],
  }),
  motivo: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  observacao: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  kmFinal: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  idCondutor: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  idVeiculo: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  idCliente: z.string().trim().nonempty('Todos os campos são obrigatórios'),
})

export type FormDisplacementData = z.infer<typeof schema>

const FormDisplacements: FC<IFormDisplacementProps> = ({
  open,
  handleOpen,
  setAllDisplacements,
  isEdit,
  displacementData,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [idCondutorInput, setIdCondutorInput] = useState('')
  const [idCustomerInput, setIdCustomerInput] = useState('')
  const [idVehicleInput, setIdVehicleInput] = useState('')
  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([])
  const [allDrivers, setAllDrivers] = useState<IDriver[]>([])
  const [allVehicles, setAllVehicles] = useState<IVehicle[]>([])
  const [vehicleEdit, setVehicleEdit] = useState<IVehicle>({} as IVehicle)
  const [showError, setShowError] = useState({ erro: false, message: '' })
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const navigation = useRouter()
  const {
    editDisplacement,
    editVehicle,
    createNewDisplacement,
    getAllCustomers,
    getAllDrivers,
    getAllVehicles,
    getVehicleById,
  } = useApi()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormDisplacementData>({
    defaultValues: {
      checkList: false,
      motivo: '',
      observacao: '',
      kmFinal: '',
      idCondutor: '',
      idVeiculo: '',
      idCliente: '',
    },
    resolver: zodResolver(schema),
  })

  const loadIds = useCallback(async () => {
    try {
      const { data: dataCustomers, error: errorCustomers } =
        await getAllCustomers()
      if (errorCustomers)
        return setShowError({
          erro: true,
          message: 'Houve um erro ao buscar clientes',
        })
      setAllCustomers(dataCustomers!)

      const { data: dataDrivers, error: errorDrivers } = await getAllDrivers()
      if (errorDrivers)
        return setShowError({
          erro: true,
          message: 'Houve um erro ao buscar condutores',
        })
      setAllDrivers(dataDrivers!)

      const { data: dataVehicles, error: errorVehicles } =
        await getAllVehicles()
      if (errorVehicles)
        return setShowError({
          erro: true,
          message: 'Houve um erro ao buscar veículos',
        })
      setAllVehicles(dataVehicles!)
    } finally {
      setIsLoading(false)
    }
  }, [getAllCustomers, getAllDrivers, getAllVehicles])

  const loadIdVehicleEdit = async () => {
    try {
      const { data, error } = await getVehicleById(
        displacementData?.idVeiculo?.toString()!,
      )
      if (error)
        return setShowError({
          erro: true,
          message: 'Houve um erro ao buscar o veículo',
        })
      setVehicleEdit(data as IVehicle)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isEdit) loadIds()
    if (isEdit) loadIdVehicleEdit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (displacementData && isEdit) {
      setValue('checkList', displacementData?.checkList === 'Ok')
      setValue('motivo', displacementData?.motivo || '')
      setValue('observacao', displacementData?.observacao || '')
      setValue('kmFinal', vehicleEdit?.kmAtual?.toString() || '')
      setValue('idCondutor', displacementData?.idCondutor?.toString() || '')
      setValue('idVeiculo', displacementData?.idVeiculo?.toString() || '')
      setValue('idCliente', displacementData?.idCliente?.toString() || '')
      setIdCustomerInput(displacementData?.idCliente?.toString() || '')
      setIdCondutorInput(displacementData?.idCondutor?.toString() || '')
      setIdVehicleInput(displacementData?.idVeiculo?.toString() || '')
    }

    if (!isEdit) setValue('kmFinal', '0')
  }, [displacementData, setValue, isEdit, vehicleEdit])

  const onSubmitForm = async (dataForm: FormDisplacementData) => {
    if (isEdit) {
      try {
        setIsLoading(true)
        const { error: errorDisplacement } = await editDisplacement(
          displacementData?.id,
          {
            id: displacementData?.id,
            kmFinal: Number(dataForm.kmFinal),
            fimDeslocamento: new Date().toISOString(),
            observacao: dataForm.observacao,
          },
        )
        if (errorDisplacement)
          return setShowError({
            erro: true,
            message:
              'Houve um erro, verifique se os quilômetros finais são maiores que os iniciais',
          })

        const { error: errorVehicle } = await editVehicle(vehicleEdit?.id, {
          id: vehicleEdit?.id,
          marcaModelo: vehicleEdit?.marcaModelo,
          anoFabricacao: vehicleEdit?.anoFabricacao,
          kmAtual: Number(dataForm.kmFinal),
        })
        if (errorVehicle)
          return setShowError({
            erro: true,
            message: 'Houve um erro ao atualizar o veículo',
          })

        reset()
        navigation.refresh()
        handleOpen()
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        setIsLoading(true)
        const [vehicle] = allVehicles.filter(
          (vehicle) => vehicle.id === Number(dataForm.idVeiculo),
        )

        const { data, error } = await createNewDisplacement({
          idCliente: Number(dataForm.idCliente),
          idCondutor: Number(dataForm.idCondutor),
          idVeiculo: Number(dataForm.idVeiculo),
          motivo: dataForm.motivo,
          observacao: dataForm.observacao,
          kmInicial: vehicle.kmAtual,
          inicioDeslocamento: new Date().toISOString(),
          checkList: dataForm.checkList ? 'Ok' : '',
        })
        if (error)
          return setShowError({
            erro: true,
            message: 'Houve um erro ao iniciar novo deslocamento! ',
          })
        setAllDisplacements?.((oldDisplacements) => [
          {
            id: data,
            idCliente: Number(dataForm.idCliente),
            idCondutor: Number(dataForm.idCondutor),
            idVeiculo: Number(dataForm.idVeiculo),
            motivo: dataForm.motivo,
            observacao: dataForm.observacao,
            kmInicial: vehicle.kmAtual,
            inicioDeslocamento: new Date().toISOString(),
            checkList: dataForm.checkList ? 'Ok' : '',
          },
          ...oldDisplacements,
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
            {isEdit ? 'Finalizar deslocamento' : 'Iniciar novo deslocamento'}
          </Typography>
          <IconButton onClick={handleOpen}>
            <XIcon />
          </IconButton>
        </Stack>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
          <Stack spacing={2} paddingX={theme.spacing(smDown ? 1 : 2)}>
            {isEdit ? (
              <>
                <InputText
                  id="kmFinal"
                  type="number"
                  label="Km Final"
                  disabled={isLoading}
                  errors={errors}
                  register={register}
                  icon={ArrowUp01Icon}
                />

                <InputText
                  id="observacao"
                  type="text"
                  multiline
                  label="Observações"
                  disabled={isLoading}
                  errors={errors}
                  register={register}
                  icon={ClipboardSignatureIcon}
                />
              </>
            ) : (
              <>
                <InputText
                  id="motivo"
                  type="text"
                  label="Motivo"
                  disabled={isLoading}
                  errors={errors}
                  register={register}
                  icon={ClipboardListIcon}
                />

                <InputText
                  id="observacao"
                  type="text"
                  multiline
                  label="Observações"
                  disabled={isLoading}
                  errors={errors}
                  register={register}
                  icon={ClipboardSignatureIcon}
                />

                <FormControl fullWidth>
                  <InputLabel id="label-idCliente">Cliente</InputLabel>
                  <Select
                    fullWidth
                    id="idCliente"
                    label="Cliente"
                    labelId="label-idCliente"
                    disabled={isLoading}
                    {...register('idCliente')}
                    error={!!errors.idCliente}
                    value={idCustomerInput}
                    onChange={(e) => setIdCustomerInput(e.target.value)}
                  >
                    <MenuItem value="">Nenhum</MenuItem>
                    {allCustomers.map((customer, index) => (
                      <MenuItem value={customer.id?.toString()} key={index}>
                        {customer.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack direction={'row'} gap={2}>
                  <FormControl fullWidth>
                    <InputLabel id="label-IdCondutor">Condutor</InputLabel>
                    <Select
                      fullWidth
                      id="idCondutor"
                      label="Condutor"
                      labelId="label-IdCondutor"
                      disabled={isLoading}
                      {...register('idCondutor')}
                      error={!!errors.idCondutor}
                      value={idCondutorInput}
                      onChange={(e) => setIdCondutorInput(e.target.value)}
                    >
                      <MenuItem value="">Nenhum</MenuItem>
                      {allDrivers.map((driver, index) => (
                        <MenuItem value={driver.id?.toString()} key={index}>
                          {driver.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="label-idVeiculo">Veículo</InputLabel>
                    <Select
                      fullWidth
                      id="idVeiculo"
                      label="Veículo"
                      labelId="label-idVeiculo"
                      disabled={isLoading}
                      {...register('idVeiculo')}
                      error={!!errors.idVeiculo}
                      value={idVehicleInput}
                      onChange={(e) => setIdVehicleInput(e.target.value)}
                    >
                      <MenuItem value="">Nenhum</MenuItem>
                      {allVehicles.map((vehicle, index) => (
                        <MenuItem value={vehicle.id?.toString()} key={index}>
                          {vehicle.marcaModelo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <FormControlLabel
                  required
                  control={<Checkbox {...register('checkList')} />}
                  color={errors.checkList ? 'error' : 'primary'}
                  label="Confirmo que o veículo foi checado adequadamente antes de iniciar a distribuição"
                />
              </>
            )}
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isEdit ? 'Salvar' : 'Criar'}
            </Button>
            <Snackbar
              open={showError.erro}
              onClose={() => setShowError({ erro: false, message: '' })}
              sx={{ zIndex: 9999 }}
            >
              <Alert
                onClose={() => setShowError({ erro: false, message: '' })}
                variant="filled"
                severity="error"
              >
                {showError.message}
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      </Box>
    </Backdrop>
  )
}

export default FormDisplacements
