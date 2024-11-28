import { mergedFilm } from "../models/mergedFilm"
import { DynamoDB } from "aws-sdk"

export interface IFilmRepository {
  createFilms: (films: mergedFilm[]) => Promise<{
    success: mergedFilm[]
    errors: { film: mergedFilm; error: { message: string } }[]
  }>

  getPaginatedFilms: (
    lastKey?: DynamoDB.DocumentClient.Key,
    limit?: number
  ) => Promise<{
    success: mergedFilm[]
    lastEvaluatedKey?: DynamoDB.DocumentClient.Key
    error?: string
  }>
}
