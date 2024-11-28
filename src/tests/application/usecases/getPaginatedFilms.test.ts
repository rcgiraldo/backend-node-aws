import { getPaginatedFilms } from "../../../application/usecases/getPaginatedFilms"
import { FilmRepository } from "../../../infraestructure/repositories/filmsRepository"
import { DynamoDB } from "aws-sdk"
import { mergedFilm } from "../../../domain/models/mergedFilm"

jest.mock("../../../infrastructure/repositories/filmsRepository")

const mockFilmRepository = FilmRepository as jest.Mock

describe("getPaginatedFilms", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return paginated films sorted chronologically", async () => {
    const mockFilms: mergedFilm[] = [
      {
        id: "1",
        titulo: "Film 1",
        episodio_id: 1,
        apertura: "Opening crawl 1",
        director: "Director 1",
        productor: "Producer 1",
        fecha_estreno: "2024-01-01",
        personajes: ["Character 1"],
        planetas: ["Planet 1"],
        naves_estelares: ["Starship 1"],
        vehiculos: ["Vehicle 1"],
        especies: ["Species 1"],
        popularidad: 10,
        calificacion_promedio: 8.1,
        cantidad_votos: 1000,
        presupuesto: 1000000,
        ingresos: 5000000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        titulo: "Film 2",
        episodio_id: 2,
        apertura: "Opening crawl 2",
        director: "Director 2",
        productor: "Producer 2",
        fecha_estreno: "2024-01-02",
        personajes: ["Character 2"],
        planetas: ["Planet 2"],
        naves_estelares: ["Starship 2"],
        vehiculos: ["Vehicle 2"],
        especies: ["Species 2"],
        popularidad: 20,
        calificacion_promedio: 8.2,
        cantidad_votos: 2000,
        presupuesto: 2000000,
        ingresos: 10000000,
        createdAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: "3",
        titulo: "Film 3",
        episodio_id: 3,
        apertura: "Opening crawl 3",
        director: "Director 3",
        productor: "Producer 3",
        fecha_estreno: "2024-01-03",
        personajes: ["Character 3"],
        planetas: ["Planet 3"],
        naves_estelares: ["Starship 3"],
        vehiculos: ["Vehicle 3"],
        especies: ["Species 3"],
        popularidad: 30,
        calificacion_promedio: 8.3,
        cantidad_votos: 3000,
        presupuesto: 3000000,
        ingresos: 15000000,
        createdAt: "2024-01-03T00:00:00.000Z",
      },
    ]

    const mockGetPaginatedFilms = jest.fn().mockResolvedValue({
      success: mockFilms,
      lastEvaluatedKey: {
        id: "3",
        createdAt: "2024-01-03T00:00:00.000Z",
      },
    })

    mockFilmRepository.mockReturnValue({
      createFilms: jest.fn(),
      getPaginatedFilms: mockGetPaginatedFilms,
    })

    const result = await getPaginatedFilms()

    expect(result.success).toBe(true)
    expect(result.data).toEqual(
      mockFilms.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )
    expect(result.lastKey).toEqual({
      id: "3",
      createdAt: "2024-01-03T00:00:00.000Z",
    })
  })

  it("should return an error when the repository fails", async () => {
    const mockGetPaginatedFilms = jest.fn().mockResolvedValue({
      success: [],
      error: "Repository error",
    })

    mockFilmRepository.mockReturnValue({
      createFilms: jest.fn(),
      getPaginatedFilms: mockGetPaginatedFilms,
    })

    const result = await getPaginatedFilms()

    expect(result.success).toBe(false)
    expect(result.error).toBe("Repository error")
  })
})
