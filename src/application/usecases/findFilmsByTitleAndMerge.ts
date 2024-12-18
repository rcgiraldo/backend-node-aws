import { IFilmRepository } from "../../domain/interfaces/IFilmsRepository"
import { mergedFilm } from "../../domain/models/mergedFilm"
import { getMoviesByTitleFromSwapi } from "../../infraestructure/api/swapiService"
import { getStarWarsMoviesFromTmdb } from "../../infraestructure/api/tmdbService"
import { mapSwapiFilmFields } from "../mappers/swapiFilmMapper"
import { mapTmdbFilmFields } from "../mappers/tmdbFilmMapper"
import { swapiFilm } from "../../domain/models/swapiFilm"
import { tmdbFilm } from "../../domain/models/tmdbFilm"
import { saveMergedFilmService } from "../services/filmService"
import { v4 as uuidv4 } from "uuid"
import { getCachedResult, setCachedResult } from "../services/cacheService"

const CACHE_EXPIRY = 1800 // 60 x30 min

export const findFilmsByTitleAndMerge = async (
  title: string,
  filmsRepository: IFilmRepository
): Promise<mergedFilm[]> => {
  const cacheKey = `films:${title}` // Verificar si el resultado está en la caché
  const cachedResult = await getCachedResult(cacheKey)
  if (cachedResult) {
    console.log("Fetching data from cache")
    return cachedResult
  }

  try {
    const swapiFilms = await getMoviesByTitleFromSwapi(title)
    const tmdbFilms = await getStarWarsMoviesFromTmdb()

    console.log("SWAPI Films:", swapiFilms)
    console.log("TMDb Films:", tmdbFilms)
    if (!swapiFilms.length || !tmdbFilms.length) {
      throw new Error(
        `No films found with title: ${title} in either SWAPI or TMDb`
      )
    }

    const mappedSwapiFilms = swapiFilms.map(mapSwapiFilmFields)
    const mappedTmdbFilms = tmdbFilms.map(mapTmdbFilmFields)

    const mergedFilms: mergedFilm[] = mappedSwapiFilms.map(
      (swapiFilmObj: swapiFilm) => {
        const tmdbFilmObj = mappedTmdbFilms.find((tmdb: tmdbFilm) =>
          //tmdb.titulo.toLowerCase() === swapiFilmObj.titulo.toLowerCase()
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

    await setCachedResult(cacheKey, mergedFilms, CACHE_EXPIRY)

    return mergedFilms
  } catch (error) {
    console.error("Error trying to merge the data", error)
    throw new Error("Error trying to merge the data")
  }
}
