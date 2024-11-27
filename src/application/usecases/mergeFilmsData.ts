import { mergedFilm } from '../../domain/models/mergedFilm'
import { swapiFilm } from '../../domain/models/swapiFilm'
import { tmdbFilm } from '../../domain/models/tmdbFilm'
import { getMoviesFromSwapi } from '../../infraestructure/api/swapiService'
import { getStarWarsMoviesFromTmdb } from '../../infraestructure/api/tmdbService'
import { mapSwapiFilmFields } from '../mappers/swapiFilmMapper'
import { mapTmdbFilmFields } from '../mappers/tmdbFilmMapper'

export const mergeFilmData = async (): Promise<mergedFilm[]> => {
  try {
    const swapiFilms = await getMoviesFromSwapi()
    const tmdbFilms = await getStarWarsMoviesFromTmdb()

    const mappedSwapiFilms = swapiFilms.map(mapSwapiFilmFields)
    const mappedTmdbFilms = tmdbFilms.map(mapTmdbFilmFields)

    const mergedFilms: mergedFilm[] = mappedSwapiFilms.map(
      (swapiFilmObj: swapiFilm) => {
        const tmdbFilmObj = mappedTmdbFilms.find(
          (tmdb: tmdbFilm) => tmdb.titulo === swapiFilmObj.titulo
        )

        if (tmdbFilmObj) {
          return {
            ...swapiFilmObj,
            popularidad: tmdbFilmObj.popularidad,
            calificacion_promedio: tmdbFilmObj.calificacion_promedio,
            cantidad_votos: tmdbFilmObj.cantidad_votos,
            presupuesto: tmdbFilmObj.presupuesto,
            ingresos: tmdbFilmObj.ingresos,
          }
        }
        return swapiFilmObj
      }
    )

    return mergedFilms
  } catch (error) {
    console.error('Error trying to merge the data', error)
    throw new Error('Error trying to merge the data')
  }
}
