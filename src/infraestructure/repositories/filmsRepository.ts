import { DynamoDB } from 'aws-sdk'
import { mergedFilm } from '../../domain/models/mergedFilm'
import { IFilmRepository } from '../../domain/interfaces/IFilmsRepository'

const dynamoDB = new DynamoDB.DocumentClient()
const TABLE_NAME = process.env.FILMS_TABLE_NAME || 'Films'

export const FilmRepository = (): IFilmRepository => ({
  createFilms: async (
    films: mergedFilm[]
  ): Promise<{
    success: mergedFilm[]
    errors: { film: mergedFilm; error: { message: string } }[]
  }> => {
    const result = {
      success: [] as mergedFilm[],
      errors: [] as { film: mergedFilm; error: { message: string } }[],
    }

    for (const film of films) {
      const params = {
        TableName: TABLE_NAME,
        Item: film,
      }

      try {
        await dynamoDB.put(params).promise()
        result.success.push(film)
      } catch (error: any) {
        console.error(`Error trying to insert the film: ${film.titulo}`, error)
        result.errors.push({
          film,
          error: {
            message:
              error.message ||
              'An unknown error ocurred trying to save this film',
          },
        })
      }
    }

    return result
  },
})
