import axios from 'axios'

export interface ICustomer {
  id?: number
  numeroDocumento?: string
  tipoDocumento?: string
  nome: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
}

export interface IDriver {
  id?: number
  nome?: string
  numeroHabilitacao?: string
  categoriaHabilitacao: string
  catergoriaHabilitacao?: string
  vencimentoHabilitacao: string
}

const api = axios.create({
  baseURL: 'https://api-deslocamento.herokuapp.com',
})

const useApi = () => ({
  getAllCustomers: async () => {
    try {
      const { data }: { data: ICustomer[] } = await api.get('/api/v1/Cliente')

      return { data, error: false }
    } catch (_error) {
      return { data: [], error: true }
    }
  },
  getCustomerById: async (id: string) => {
    try {
      const { data }: { data: ICustomer } = await api.get(
        `/api/v1/Cliente/${id}`,
      )

      return { data, error: false }
    } catch (_error) {
      return { data: {}, error: true }
    }
  },
  createNewCustomer: async (dataForm: ICustomer) => {
    try {
      const { data }: { data: number } = await api.post(
        '/api/v1/Cliente',
        dataForm,
      )

      return { data, error: false }
    } catch (error) {
      return { data: 0, error: true }
    }
  },
  editCustomer: async (id: number | undefined, dataForm: ICustomer) => {
    try {
      if (!id) return { data: 0, error: true }
      await api.put(`/api/v1/Cliente/${id}`, dataForm)

      return { data: 0, error: false }
    } catch (error) {
      return { data: 0, error: true }
    }
  },
  deleteCustomer: async (id: number) => {
    try {
      await api.delete(`/api/v1/Cliente/${id}`, { data: { id } })

      return { data: 0, error: false }
    } catch (_error) {
      return { data: 0, error: true }
    }
  },
  getAllDrivers: async () => {
    try {
      const { data }: { data: IDriver[] } = await api.get('/api/v1/Condutor')

      return { data, error: false }
    } catch (_error) {
      return { data: [], error: true }
    }
  },
  getDriverById: async (id: string) => {
    try {
      const { data }: { data: IDriver } = await api.get(
        `/api/v1/Condutor/${id}`,
      )

      return { data, error: false }
    } catch (_error) {
      return { data: {}, error: true }
    }
  },
  createNewDriver: async (dataForm: IDriver) => {
    try {
      const { data }: { data: number } = await api.post(
        '/api/v1/Condutor',
        dataForm,
      )

      return { data, error: false }
    } catch (_error) {
      return { data: 0, error: true }
    }
  },
  editDriver: async (id: number | undefined, dataForm: IDriver) => {
    try {
      if (!id) return { data: 0, error: true }
      console.log(dataForm)
      await api.put(`/api/v1/Condutor/${id}`, dataForm)

      return { data: 0, error: false }
    } catch (error) {
      return { data: 0, error: true }
    }
  },
  deleteDriver: async (id: number) => {
    try {
      await api.delete(`/api/v1/Condutor/${id}`, { data: { id } })

      return { data: 0, error: false }
    } catch (_error) {
      return { data: 0, error: true }
    }
  },
})

export default useApi
