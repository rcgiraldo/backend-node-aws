import { IFilmRepository } from "../../domain/interfaces/IFilmsRepository"
import { mergedFilm } from "../../domain/models/mergedFilm"
import { swapiFilm } from "../../domain/models/swapiFilm"
import { tmdbFilm } from "../../domain/models/tmdbFilm"
import { getMoviesFromSwapi } from "../../infraestructure/api/swapiService"
import { getStarWarsMoviesFromTmdb } from "../../infraestructure/api/tmdbService"
import { mapSwapiFilmFields } from "../mappers/swapiFilmMapper"
import { mapTmdbFilmFields } from "../mappers/tmdbFilmMapper"
import { saveMergedFilmService } from "../services/filmService"
import { v4 as uuidv4 } from "uuid"

export const mergeFilmData = async (
  filmsRepository: IFilmRepository
): Promise<mergedFilm[]> => {
  try {
    const swapiFilms = await getMoviesFromSwapi()
    const tmdbFilms = await getStarWarsMoviesFromTmdb()

    const mappedSwapiFilms = swapiFilms.map(mapSwapiFilmFields)
    const mappedTmdbFilms = tmdbFilms.map(mapTmdbFilmFields)

    const mergedFilms: mergedFilm[] = mappedSwapiFilms.map(
      (swapiFilmObj: swapiFilm) => {
        const tmdbFilmObj = mappedTmdbFilms.find((tmdb: tmdbFilm) =>
          //tmdb.titulo === swapiFilmObj.titulo
          tmdb.titulo.toLowerCase().includes(swapiFilmObj.titulo.toLowerCase())
        )

        const id = uuidv4()

        if (tmdbFilmObj) {
          return {
            id,
            ...swapiFilmObj,
            popularidad: tmdbFilmObj.popularidad,
            calificacion_promedio: tmdbFilmObj.calificacion_promedio,
            cantidad_votos: tmdbFilmObj.cantidad_votos,
            presupuesto: tmdbFilmObj.presupuesto,
            ingresos: tmdbFilmObj.ingresos,
            createdAt: new Date().toISOString(),
          }
        }

        return {
          id,
          ...swapiFilmObj,
          popularidad: null,
          calificacion_promedio: null,
          cantidad_votos: null,
          presupuesto: null,
          ingresos: null,
          createdAt: new Date().toISOString(),
        }
      }
    )

    // Saving items to DynamoDb Films table
    await saveMergedFilmService(mergedFilms, filmsRepository)

    return mergedFilms
  } catch (error) {
    console.error("Error trying to merge the data", error)
    throw new Error("Error trying to merge the data")
  }
}
