import { APIGatewayProxyHandler } from "aws-lambda"
import { saveCustomDataService } from "../services/customDataService"

export const saveCustomDataHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}")

    const result = await saveCustomDataService(body)
    if (result.success) {
      return {
        statusCode: 201,
        body: JSON.stringify(result.data),
        headers: { "Content-Type": "application/json" },
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error storing custom data",
          error: result.error,
        }),
        headers: { "Content-Type": "application/json" },
      }
    }
  } catch (error) {
    console.error("Error in storeCustomDataHandler", error)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
      headers: { "Content-Type": "application/json" },
    }
  }
}
