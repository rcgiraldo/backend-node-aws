import { DynamoDB } from "aws-sdk"
import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda"

import { mergeFilmData } from "../usecases/mergeFilmsData"
import { FilmRepository } from "../../infraestructure/repositories/filmsRepository"
import { findFilmsByTitleAndMerge } from "../usecases/findFilmsByTitleAndMerge"
import { getPaginatedFilmsService } from "../services/filmService"

const filmRepository = FilmRepository()

export const getMergedFilmsHandler: APIGatewayProxyHandler = async () => {
  try {
    const mergedFilms = await mergeFilmData(filmRepository)
    return {
      statusCode: 200,
      body: JSON.stringify(mergedFilms),
      headers: { "Content-Type": "application/json" },
    }
  } catch (error) {
    console.error("Error in getMergedFilmsHandler", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    }
  }
}

export const getMergedFilmsByTitleHandler: APIGatewayProxyHandler = async (
  event
) => {
  try {
    const title = event.queryStringParameters?.titulo
    if (!title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Se requiere el titulo" }),
        headers: { "Content-Type": "application/json" },
      }
    }

    const mergedFilms = await findFilmsByTitleAndMerge(title, filmRepository)

    if (!mergedFilms.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No se encontraron peliculas" }),
        headers: { "Content-Type": "application/json" },
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(mergedFilms),
      headers: { "Content-Type": "application/json" },
    }
  } catch (error) {
    console.error("Error in getMergedFilmsHandler", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    }
  }
}

export const getPaginatedFilmsHandler: APIGatewayProxyHandler = async (
  event
) => {
  try {
    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit)
      : 10
    const lastKey = event.queryStringParameters?.lastKey
      ? (JSON.parse(
          event.queryStringParameters.lastKey
        ) as DynamoDB.DocumentClient.Key)
      : undefined
    const result = await getPaginatedFilmsService(lastKey, limit)
    if (result.success) {
      return {
        statusCode: 200,
        body: JSON.stringify({ data: result.data, lastKey: result.lastKey }),
        headers: { "Content-Type": "application/json" },
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error retrieving films history",
          error: result.error,
        }),
        headers: { "Content-Type": "application/json" },
      }
    }
  } catch (error) {
    console.error("Error in getPaginatedFilmsHandler", error)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
      headers: { "Content-Type": "application/json" },
    }
  }
}
