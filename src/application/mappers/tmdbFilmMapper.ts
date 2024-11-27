import { tmdbFilm } from '../../domain/models/tmdbFilm'

export const mapTmdbFilmFields = (film: any): tmdbFilm => {
  return {
    titulo: film.title,
    resumen: film.overview,
    fecha_estreno: film.release_date,
    popularidad: film.popularity,
    calificacion_promedio: film.vote_average,
    cantidad_votos: film.vote_count,
    presupuesto: film.budget,
    ingresos: film.revenue,
  }
}
