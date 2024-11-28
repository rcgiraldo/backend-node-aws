import { DynamoDB } from "aws-sdk"
import { IFilmRepository } from "../../domain/interfaces/IFilmsRepository"
import { mergedFilm } from "../../domain/models/mergedFilm"
import { getPaginatedFilms } from "../usecases/getPaginatedFilms"

export const saveMergedFilmService = async (
  films: mergedFilm[],
  filmsRepository: IFilmRepository
): Promise<{
  success: mergedFilm[]
  errors: { film: mergedFilm; error: { message: string } }[]
}> => {
  try {
    const result = await filmsRepository.createFilms(films)
    return result
  } catch (error) {
    console.error("Error in saveMergedFilms service", error)
    throw new Error("Error in the saveMergedFilms service")
  }
}

export const getPaginatedFilmsService = async (
  lastKey?: DynamoDB.DocumentClient.Key,
  limit = 10
): Promise<{
  success: boolean
  data?: mergedFilm[]
  lastKey?: DynamoDB.DocumentClient.Key
  error?: string
}> => {
  return await getPaginatedFilms(lastKey, limit)
}
