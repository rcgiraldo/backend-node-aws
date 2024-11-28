import axios from "axios"

import { getStarWarsMoviesFromTmdb } from "../../../infraestructure/api/tmdbService"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("getStarWarsMoviesFromTmdb", () => {
  // Test: Debería devolver las películas de Star Wars
  it("should return Star Wars movies when the API call works", async () => {
    // Configuramos el mock de axios para devolver una respuesta simulada
    mockedAxios.get.mockResolvedValue({
      data: {
        parts: [
          { title: "Star Wars: A New Hope" },
          { title: "Star Wars: The Empire Strikes Back" },
        ],
      },
    })

    const result = await getStarWarsMoviesFromTmdb()

    // Verificamos que los resultados coincidan
    expect(result).toEqual([
      { title: "Star Wars: A New Hope" },
      { title: "Star Wars: The Empire Strikes Back" },
    ])
  })

  // Test: Debería lanzar un error cuando la llamada a la API falla
  it("should throw an error when the API call fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API call failed"))

    // Verificamos que la función lance un error
    await expect(getStarWarsMoviesFromTmdb()).rejects.toThrow(
      "Unable to get the films from Tmdb"
    )
  })
})
