import { Medic } from '@prisma/client'
import { PLANS } from '../../../db/db'

export interface PlansSchema {
  id?: string
  name: string
  varbase: number
  createat?: Date | string
}

export interface PlansRepositorySchema {
  create(data: PlansSchema): Promise<PLANS>
  findAll(
    page: number,
    limit: number,
  ): Promise<{ data: PLANS[]; total: number }>
  findById(id: string): Promise<PLANS | null>
  update(id: string, data: Partial<PlansSchema>): Promise<PLANS>
  delete(id: string): Promise<PLANS>

  varFilter(varbase?: number, name?: string): Promise<PLANS[]>

  MedicsByIdPlan(id?: string): Promise<Medic[]>
}
