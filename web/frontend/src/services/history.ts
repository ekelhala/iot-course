import axios from 'axios'
import { API_URL } from '../constants'

const getAll = async () => {
  const response = await axios.get(`${API_URL}/history/all?start=2024-11-01&end=2024-12-31`)
  return response.data
}

export default { getAll }
