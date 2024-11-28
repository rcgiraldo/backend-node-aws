import { mergedFilm } from "../../domain/models/mergedFilm"
import { FilmRepository } from "../../infraestructure/repositories/filmsRepository"
import { DynamoDB } from "aws-sdk"

const filmRepository = FilmRepository()

export const getPaginatedFilms = async (
  lastKey?: DynamoDB.DocumentClient.Key,
  limit = 10
): Promise<{
  success: boolean
  data?: mergedFilm[]
  lastKey?: DynamoDB.DocumentClient.Key
  error?: string
}> => {
  const result = await filmRepository.getPaginatedFilms(lastKey, limit)
  if (!result.error) {
    return {
      success: true,
      data: result.success,
      lastKey: result.lastEvaluatedKey,
    }
  } else {
    return { success: false, error: result.error }
  }
}
