import axios from 'axios'

const TMDB_BASE_URL = process.env.TMDB_BASE_URL
const TMDB_API_KEY = process.env.TMDB_API_KEY

export const getStarWarsMoviesFromTmdb = async () => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/collection/10-star-wars-collection`,
      {
        params: {
          api_key: TMDB_API_KEY,
        },
      }
    )

    return response.data.parts
  } catch (error) {
    console.error('Error getting all the data from Tmdb', error)
    throw new Error('Unable to get the films from Tmdb')
  }
}
