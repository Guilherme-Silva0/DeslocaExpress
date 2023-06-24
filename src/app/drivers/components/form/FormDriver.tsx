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
} from '@mui/material'
import { LaughIcon, XIcon, Contact2Icon, CalendarIcon } from 'lucide-react'
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import InputText from './InputText'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useApi, { IDriver } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'

interface IFormDriverProps {
  open: boolean
  handleOpen: () => void
  setAllDrivers?: Dispatch<SetStateAction<IDriver[]>>
  isEdit?: boolean
  driverData?: IDriver
}

const schema = z.object({
  nome: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  numeroHabilitacao: z
    .string()
    .trim()
    .nonempty('Todos os campos são obrigatórios'),
  categoriaHabilitacao: z
    .string()
    .trim()
    .nonempty('Todos os campos são obrigatórios'),
  vencimentoHabilitacao: z
    .string()
    .trim()
    .nonempty('Todos os campos são obrigatórios'),
})

export type FormDriverData = z.infer<typeof schema>

const FormDriver: FC<IFormDriverProps> = ({
  open,
  handleOpen,
  setAllDrivers,
  isEdit,
  driverData,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [typeInput, setTypeInput] = useState('')
  const [formattedDate, setFormattedDate] = useState('')
  const [showError, setShowError] = useState(false)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const navigation = useRouter()
  const { editDriver, createNewDriver } = useApi()

  const categorys = [
    'AB',
    'AC',
    'AD',
    'AE',
    'B',
    'C',
    'D',
    'E',
    'ACC',
    'AM',
    'AS',
    'M',
    'T',
    'ACC',
    'AT',
    'AA',
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormDriverData>({
    defaultValues: {
      nome: '',
      numeroHabilitacao: '',
      categoriaHabilitacao: '',
      vencimentoHabilitacao: '',
    },
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (driverData && isEdit) {
      setValue('nome', driverData.nome || '')
      setValue('numeroHabilitacao', driverData.numeroHabilitacao || '')
      setValue('categoriaHabilitacao', driverData?.catergoriaHabilitacao || '')
      setValue('vencimentoHabilitacao', driverData.vencimentoHabilitacao || '')
      setTypeInput(driverData?.catergoriaHabilitacao ?? '')
    }
  }, [driverData, setValue, isEdit])

  const formatToAPI = (date: string): string => {
    const parts = date.split('/')
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`

    return formattedDate
  }

  const onSubmitForm = async (dataForm: FormDriverData) => {
    const formattedDate = formatToAPI(dataForm.vencimentoHabilitacao)
    if (isEdit) {
      try {
        setIsLoading(true)
        const { error } = await editDriver(driverData?.id, {
          id: driverData?.id,
          categoriaHabilitacao: dataForm.categoriaHabilitacao,
          vencimentoHabilitacao: formattedDate,
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
        const { data, error } = await createNewDriver({
          ...dataForm,
          vencimentoHabilitacao: formattedDate,
        })
        if (error) return setShowError(true)
        setAllDrivers?.((oldDrivers) => [
          {
            id: data,
            ...dataForm,
            catergoriaHabilitacao: dataForm.categoriaHabilitacao,
          },
          ...oldDrivers,
        ])
        reset()
        handleOpen()
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    const numericValue = value.replace(/\D/g, '')

    const day = numericValue.substr(0, 2)
    const month = numericValue.substr(2, 2)
    const year = numericValue.substr(4, 4)

    const formattedDate = `${day}/${month}/${year}`

    setValue('vencimentoHabilitacao', formattedDate)
    setFormattedDate(formattedDate)
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
            {isEdit ? 'Edite o condutor' : 'Cadastre um novo condutor'}
          </Typography>
          <IconButton onClick={handleOpen}>
            <XIcon />
          </IconButton>
        </Stack>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
          <Stack spacing={2} paddingX={theme.spacing(smDown ? 1 : 2)}>
            {!isEdit && (
              <>
                <InputText
                  id="nome"
                  type="text"
                  label="Nome"
                  disabled={isLoading}
                  errors={errors}
                  register={register}
                  icon={LaughIcon}
                />

                <InputText
                  id="numeroHabilitacao"
                  type="number"
                  label="Numero da habilitação"
                  disabled={isLoading}
                  errors={errors}
                  register={register}
                  icon={Contact2Icon}
                />
              </>
            )}
            <Stack direction={isEdit ? 'column' : 'row'} gap={2}>
              <FormControl fullWidth>
                <InputLabel id="label-categoriaHabilitacao">
                  Categoria da habilitação
                </InputLabel>
                <Select
                  fullWidth
                  id="categoriaHabilitacao"
                  label="Categoria da habilitação"
                  labelId="label-categoriaHabilitacao"
                  disabled={isLoading}
                  {...register('categoriaHabilitacao')}
                  error={!!errors.categoriaHabilitacao}
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {categorys.map((category, index) => (
                    <MenuItem value={category} key={index}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <InputText
                id="vencimentoHabilitacao"
                type="text"
                label="Validade da habilitação"
                fullWidth
                disabled={isLoading}
                errors={errors}
                register={register}
                value={formattedDate}
                onChange={handleDateChange}
                icon={CalendarIcon}
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
                Ops, Houve um erro, verifique se a nova data não é maior que a
                data já existente!
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      </Box>
    </Backdrop>
  )
}

export default FormDriver
