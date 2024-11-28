import dynamoDBClient from "../../config/dynamoDBClient"
import { mergedFilm } from "../../domain/models/mergedFilm"

const CACHE_TABLE_NAME = "Cache"

const getCachedResult = async (
  cacheKey: string
): Promise<mergedFilm[] | null> => {
  const params = {
    TableName: CACHE_TABLE_NAME,
    Key: { cacheKey },
  }

  try {
    const result = await dynamoDBClient.get(params).promise()
    if (result.Item) {
      return JSON.parse(result.Item.data)
    }
    return null
  } catch (error) {
    console.error("Error fetching from cache", error)
    return null
  }
}

const setCachedResult = async (
  cacheKey: string,
  data: mergedFilm[],
  ttl: number
): Promise<void> => {
  const expiryTime = Math.floor(Date.now() / 1000) + ttl // TTL en segundos

  const params = {
    TableName: CACHE_TABLE_NAME,
    Item: {
      cacheKey,
      data: JSON.stringify(data),
      ttl: expiryTime,
    },
  }

  try {
    await dynamoDBClient.put(params).promise()
  } catch (error) {
    console.error("Error setting cache", error)
  }
}

export { getCachedResult, setCachedResult }
