import axios from "axios"

import { getMoviesByTitleFromSwapi } from "../../../infraestructure/api/swapiService"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("getMoviesByTitleFromSwapi", () => {
  // Test: Deberia de devolver las peliculas que contienen en el titulo parte del parametro enviado
  it("should return films that contain the title parameter", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          { title: "StarWars" },
          { title: "A New Hope" },
          { title: "The Empire Strikes Back" },
        ],
      },
    })

    const result = await getMoviesByTitleFromSwapi("Hope")
    // Verificamos
    expect(result).toEqual([{ title: "A New Hope" }])
  })

  // Test: Deberia de devolver un array vacio
  it("should return an empty array if no films contains the title parameter", async () => {
    mockedAxios.get.mockResolvedValue({ data: { results: [] } })

    const result = await getMoviesByTitleFromSwapi("Dandadan")
    expect(result).toEqual([])
  })
})
