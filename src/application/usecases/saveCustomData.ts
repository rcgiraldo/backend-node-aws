import { customData } from "../../domain/models/customData"
import { CustomDataRepository } from "@src/infraestructure/repositories/customDataRepository"
import { v4 as uuidv4 } from "uuid"

const customDataRepository = CustomDataRepository()

export const saveCustomData = async (
  data: any
): Promise<{
  success: boolean
  data?: customData
  error?: string
}> => {
  const customData: customData = { id: uuidv4(), data }

  const result = await customDataRepository.createCustomData(customData)
  if (!result.error) {
    return { success: true, data: result.success }
  } else {
    return { success: false, error: result.error }
  }
}
