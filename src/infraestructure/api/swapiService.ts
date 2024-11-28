import axios from 'axios'

const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL

export const getMoviesFromSwapi = async () => {
  try {
    const response = await axios.get(`${SWAPI_BASE_URL}/films/`)
    return response.data.results
  } catch (error) {
    console.error('Error getting all the data from Swapi', error)
    throw new Error('Unable to get the films from Swapi')
  }
}

export const getMoviesByTitleFromSwapi = async (title: string) => {
  try {
    const response = await axios.get(`${SWAPI_BASE_URL}/films/`)
    const films = response.data.results

    const foundFilms = films.filter((film: any) =>
      film.title.toLowerCase().includes(title.toLowerCase())
    )
    console.log('Filtered SWAPI Films:', foundFilms)
    return foundFilms.length > 0 ? foundFilms : []
  } catch (error) {
    console.error('Error getting movie by title from Swapi', error)
    throw new Error('Unable to get the film by title from Swapi')
  }
}
