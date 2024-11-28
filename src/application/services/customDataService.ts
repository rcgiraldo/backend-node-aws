import { customData } from "@src/domain/models/customData"
import { saveCustomData } from "../usecases/saveCustomData"

export const saveCustomDataService = async (
  data: any
): Promise<{
  success: boolean
  data?: customData
  error?: string
}> => {
  return await saveCustomData(data)
}
