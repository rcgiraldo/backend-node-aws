import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { mergeFilmData } from '../usecases/mergeFilmsData'
import { FilmRepository } from '../../infraestructure/repositories/filmsRepository'
import { findFilmsByTitleAndMerge } from '../usecases/findFilmsByTitleAndMerge'

const filmRepository = FilmRepository()

export const getMergedFilmsHandler: APIGatewayProxyHandler = async () => {
  try {
    const mergedFilms = await mergeFilmData(filmRepository)
    return {
      statusCode: 200,
      body: JSON.stringify(mergedFilms),
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (error) {
    console.error('Error in getMergedFilmsHandler', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}

export const getMergedFilmsByTitleHandler: APIGatewayProxyHandler = async (
  event
) => {
  try {
    const title = event.queryStringParameters?.titulo
    if (!title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Se requiere el titulo' }),
        headers: { 'Content-Type': 'application/json' },
      }
    }

    const mergedFilms = await findFilmsByTitleAndMerge(title, filmRepository)

    if (!mergedFilms.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No se encontraron peliculas' }),
        headers: { 'Content-Type': 'application/json' },
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(mergedFilms),
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (error) {
    console.error('Error in getMergedFilmsHandler', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
