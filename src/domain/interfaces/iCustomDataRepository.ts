import { customData } from "../models/customData"

export interface ICustomDataRepository {
  createCustomData: (data: customData) => Promise<{
    success: customData
    error?: string
  }>
}
