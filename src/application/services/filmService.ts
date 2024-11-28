import { IFilmRepository } from '../../domain/interfaces/IFilmsRepository'
import { mergedFilm } from '../../domain/models/mergedFilm'

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
    console.error('Error in saveMergedFilms service', error)
    throw new Error('Error in the saveMergedFilms service')
  }
}
