import axios from 'axios'
import { API_URL } from '../constants'

const getAll = async (start: string, end: string) => {
  if (!start || !end) {
    throw new Error('Start and end dates are required')
  }
  const response = await axios.get(`${API_URL}/history/all?start=${start}&end=${end}`)
  return response.data
}

export default { getAll }
