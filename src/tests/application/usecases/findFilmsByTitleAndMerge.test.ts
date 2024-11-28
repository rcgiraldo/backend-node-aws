import { jest } from "@jest/globals"

import { findFilmsByTitleAndMerge } from "../../../application/usecases/findFilmsByTitleAndMerge"
import { getMoviesByTitleFromSwapi } from "../../../infraestructure/api/swapiService"
import { getStarWarsMoviesFromTmdb } from "../../../infraestructure/api/tmdbService"
import { IFilmRepository } from "../../../domain/interfaces/IFilmsRepository"
import { mergedFilm } from "../../../domain/models/mergedFilm"

// Mockeamos las dependencias para evitar llamadas reales a APIs externas y bases de datos
/*
jest.mock("../../../infrastructure/api/swapiService")
jest.mock("../../../infrastructure/api/tmdbService")
*/
jest.mock("@src/infrastructure/api/swapiService")
jest.mock("@src/infrastructure/api/tmdbService")
jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("mocked-uuid"),
}))

const mockedGetMoviesByTitleFromSwapi =
  getMoviesByTitleFromSwapi as jest.MockedFunction<
    typeof getMoviesByTitleFromSwapi
  >
const mockedGetStarWarsMoviesFromTmdb =
  getStarWarsMoviesFromTmdb as jest.MockedFunction<
    typeof getStarWarsMoviesFromTmdb
  >

describe("findFilmsByTitleAndMerge", () => {
  // Creamos un mock del repositorio de películas con el tipo correcto
  const mockCreateFilms: jest.MockedFunction<
    (films: mergedFilm[]) => Promise<{
      success: mergedFilm[]
      errors: { film: mergedFilm; error: { message: string } }[]
    }>
  > = jest.fn()

  const mockFilmsRepository: IFilmRepository = {
    createFilms: mockCreateFilms,
  }

  //Antes de cada prueba, limpiamos los Mocks
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateFilms.mockResolvedValue({
      success: [],
      errors: [],
    })
  })

  // Test: Debería fusionar correctamente las películas cuando los títulos tienen partes en comun
  it("should merge films correctly when there are matching titles", async () => {
    mockedGetMoviesByTitleFromSwapi.mockResolvedValue([
      {
        title: "A New Hope",
        episode_id: 4,
        opening_crawl: "...opening crawl...",
        director: "George Lucas",
        producer: "Gary Kurtz, Rick McCallum",
        release_date: "1977-05-25",
        characters: ["character1", "character2"],
        planets: ["planet1"],
        starships: ["starship1"],
        vehicles: ["vehicle1"],
        species: ["species1"],
      },
    ])

    mockedGetStarWarsMoviesFromTmdb.mockResolvedValue([
      {
        titulo: "Star Wars: A New Hope",
        resumen: "...resumen...",
        fecha_estreno: "1977-05-25",
        popularidad: 80,
        calificacion_promedio: 8.6,
        cantidad_votos: 5000,
        presupuesto: 11000000,
        ingresos: 775000000,
      },
    ])

    const result = await findFilmsByTitleAndMerge(
      "A New Hope",
      mockFilmsRepository
    )

    // Como solo le dimos 1 elemento que coincide, deberia de tener el tamaño de 1
    expect(result).toHaveLength(1)

    expect(result[0]).toMatchObject({
      id: "mocked-uuid",
      titulo: "A New Hope",
      popularidad: 80,
      calificacion_promedio: 8.6,
      cantidad_votos: 5000,
      presupuesto: 11000000,
      ingresos: 775000000,
    })

    // Verificamos que createFilms fue utilizado con los datos correctos: result
    expect(mockFilmsRepository.createFilms).toHaveBeenCalledWith(result)
  })

  // Prueba: Debería lanzar un error cuando no se encuentran películas con el título dado
  it("should throw an error when no films with the given title are found", async () => {
    mockedGetMoviesByTitleFromSwapi.mockResolvedValue([])
    mockedGetStarWarsMoviesFromTmdb.mockResolvedValue([])

    await expect(
      findFilmsByTitleAndMerge("Dandadan", mockFilmsRepository)
    ).rejects.toThrow(
      "No films found with title: Unknown Title in either SWAPI or TMDb"
    )
  })
})
