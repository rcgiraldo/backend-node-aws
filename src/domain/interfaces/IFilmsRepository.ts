import { mergedFilm } from '../models/mergedFilm'

export interface IFilmRepository {
  createFilms: (films: mergedFilm[]) => Promise<{
    success: mergedFilm[]
    errors: { film: mergedFilm; error: { message: string } }[]
  }>
}
