import axios from 'axios'

const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL

export const getMoviesFromSwapi = async () => {
  try {
    const response = await axios.get(`${SWAPI_BASE_URL}/films/`)
    return response.data.results
  } catch (error) {
    console.error('Error getting data from Swapi', error)
    throw new Error('Unable to get the films from Swapi')
  }
}
