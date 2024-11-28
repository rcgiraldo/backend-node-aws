import { DynamoDB } from "aws-sdk"
import { customData } from "../../domain/models/customData"
import { ICustomDataRepository } from "../../domain/interfaces/iCustomDataRepository"

const dynamoDB = new DynamoDB.DocumentClient()
const TABLE_NAME = process.env.CUSTOM_DATA_TABLE_NAME || "CustomData"

export const CustomDataRepository = (): ICustomDataRepository => ({
  createCustomData: async (
    data: customData
  ): Promise<{
    success: customData
    error?: string
  }> => {
    const params = { TableName: TABLE_NAME, Item: data }
    try {
      await dynamoDB.put(params).promise()
      return { success: data }
    } catch (error: any) {
      console.error(`Error trying to insert custom data: ${data.id}`, error)
      return {
        success: data,
        error:
          error.message ||
          "An unknown error occurred trying to save this custom data",
      }
    }
  },
})
