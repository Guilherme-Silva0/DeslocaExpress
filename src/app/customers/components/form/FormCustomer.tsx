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
import {
  LaughIcon,
  XIcon,
  ConstructionIcon,
  HashIcon,
  MapIcon,
  MapPinIcon,
  FileTextIcon,
} from 'lucide-react'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import InputText from './InputText'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useApi, { ICustomer } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'

interface IFormCustomerProps {
  open: boolean
  handleOpen: () => void
  setAllCustomers?: Dispatch<SetStateAction<ICustomer[]>>
  isEdit?: boolean
  customerData?: ICustomer
}

const schema = z.object({
  numeroDocumento: z
    .string()
    .trim()
    .nonempty('Todos os campos são obrigatórios'),
  tipoDocumento: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  nome: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  logradouro: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  numero: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  bairro: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  cidade: z.string().trim().nonempty('Todos os campos são obrigatórios'),
  uf: z.string().trim().nonempty('Todos os campos são obrigatórios'),
})

export type FormCustomerData = z.infer<typeof schema>

const FormCustomer: FC<IFormCustomerProps> = ({
  open,
  handleOpen,
  setAllCustomers,
  isEdit,
  customerData,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [ufInput, setUfInput] = useState('')
  const [documentTypeInput, setDocumentTypeInput] = useState('')
  const [showError, setShowError] = useState(false)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const navigation = useRouter()
  const { createNewCustomer, editCustomer } = useApi()

  const ufs = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormCustomerData>({
    defaultValues: {
      numeroDocumento: '',
      tipoDocumento: '',
      nome: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
    },
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (customerData && isEdit) {
      setValue('nome', customerData.nome || '')
      setValue('logradouro', customerData.logradouro || '')
      setValue('numero', customerData.numero || '')
      setValue('bairro', customerData.bairro || '')
      setValue('cidade', customerData.cidade || '')
      setValue('uf', customerData.uf || '')
      setValue('tipoDocumento', customerData.tipoDocumento || '')
      setValue('numeroDocumento', customerData.numeroDocumento || '')
    }
  }, [customerData, setValue, isEdit])

  const formatDocument = (tipoDocumento: string, numeroDocumento: string) => {
    if (tipoDocumento === 'CPF') {
      return numeroDocumento
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else if (tipoDocumento === 'CNPJ') {
      return numeroDocumento
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return numeroDocumento
  }

  const numeroDocumento = watch('numeroDocumento', '')

  const formattedNumeroDocumento = formatDocument(
    watch('tipoDocumento', ''),
    numeroDocumento,
  )

  const onSubmitForm = async (dataForm: FormCustomerData) => {
    if (isEdit) {
      try {
        setIsLoading(true)
        const { error } = await editCustomer(customerData?.id, {
          id: customerData?.id,
          nome: dataForm.nome,
          logradouro: dataForm.logradouro,
          numero: dataForm.numero,
          bairro: dataForm.bairro,
          cidade: dataForm.cidade,
          uf: dataForm.uf,
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
        const { data, error } = await createNewCustomer(dataForm)
        if (error) return setShowError(true)
        setAllCustomers?.((oldCustomers) => [
          { id: data, ...dataForm },
          ...oldCustomers,
        ])
      } finally {
        setIsLoading(false)
        reset()
        handleOpen()
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
            {isEdit ? 'Edite o cliente' : 'Cadastre um novo cliente'}
          </Typography>
          <IconButton onClick={handleOpen}>
            <XIcon />
          </IconButton>
        </Stack>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
          <Stack spacing={2} paddingX={theme.spacing(smDown ? 1 : 2)}>
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
              id="logradouro"
              type="text"
              label="Logradouro"
              disabled={isLoading}
              errors={errors}
              register={register}
              icon={ConstructionIcon}
            />
            <InputText
              id="numero"
              type="text"
              label="Número"
              disabled={isLoading}
              errors={errors}
              register={register}
              icon={HashIcon}
            />
            <InputText
              id="bairro"
              type="text"
              label="Bairro"
              disabled={isLoading}
              errors={errors}
              register={register}
              icon={MapIcon}
            />
            <InputText
              id="cidade"
              type="text"
              label="Cidade"
              disabled={isLoading}
              errors={errors}
              register={register}
              icon={MapPinIcon}
            />

            <Stack direction="row" gap={2}>
              <FormControl fullWidth>
                <InputLabel id="label-uf">UF</InputLabel>
                <Select
                  fullWidth
                  id="uf"
                  label="UF"
                  labelId="label-uf"
                  disabled={isLoading}
                  {...register('uf')}
                  error={!!errors.uf}
                  value={ufInput}
                  onChange={(e) => setUfInput(e.target.value)}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {ufs.map((uf) => (
                    <MenuItem value={uf} key={uf}>
                      {uf}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!isEdit && (
                <FormControl fullWidth>
                  <InputLabel id="label-type-document">
                    Tipo de Documento
                  </InputLabel>
                  <Select
                    fullWidth
                    id="tipoDocumento"
                    labelId="label-type-document"
                    label="Tipo de Documento"
                    disabled={isLoading}
                    error={!!errors.tipoDocumento}
                    {...register('tipoDocumento')}
                    value={documentTypeInput}
                    onChange={(e) => setDocumentTypeInput(e.target.value)}
                  >
                    <MenuItem value="">Nenhum</MenuItem>
                    <MenuItem value="RG">RG</MenuItem>
                    <MenuItem value="CPF">CPF</MenuItem>
                    <MenuItem value="CNPJ">CNPJ</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>

            {!isEdit && (
              <InputText
                id="numeroDocumento"
                type="text"
                label="Número Documento"
                disabled={isLoading}
                errors={errors}
                register={register}
                value={formattedNumeroDocumento}
                onChange={(e) => {
                  setValue('numeroDocumento', e.target.value)
                }}
                icon={FileTextIcon}
              />
            )}
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isEdit ? 'Salvar' : 'Criar'}
            </Button>
          </Stack>
        </Box>
        <Snackbar
          open={showError}
          onClose={() => setShowError((oldShowError) => !oldShowError)}
        >
          <Alert
            onClose={() => setShowError((oldShowError) => !oldShowError)}
            variant="filled"
            severity="error"
          >
            Ops, Houve um erro!
          </Alert>
        </Snackbar>
      </Box>
    </Backdrop>
  )
}

export default FormCustomer
