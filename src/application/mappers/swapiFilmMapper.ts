import { swapiFilm } from '../../domain/models/swapiFilm'

export const mapSwapiFilmFields = (film: any): swapiFilm => {
  return {
    titulo: film.title,
    episodio_id: film.episode_id,
    apertura: film.opening_crawl,
    director: film.director,
    productor: film.producer,
    fecha_estreno: film.release_date,
    personajes: film.characters || [],
    planetas: film.planets || [],
    naves_estelares: film.starships || [],
    vehiculos: film.vehicles || [],
    especies: film.species || [],
  }
}
