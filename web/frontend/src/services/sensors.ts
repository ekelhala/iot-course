import axios from 'axios'
import { API_URL } from '../constants'

const getAll = async () => {
  const response = await axios.get(`${API_URL}/sensors/all`)
  return response.data
}

export default { getAll }
