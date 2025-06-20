import { PLANS } from '../../../db/db'

export interface PlansSchema {
  id?: string
  name: string
  varbase: number
  createat?: Date | string
}

export interface PlansRepositorySchema {
  create(data: PlansSchema): Promise<PLANS>
  findAll(): Promise<PLANS[]>
  findById(id: string): Promise<PLANS | null>
  update(id: string, data: Partial<PlansSchema>): Promise<PLANS>
  delete(id: string): Promise<PLANS>

  varFilter(varbase?: number, name?: string): Promise<PLANS[]>
}

// filtro de valor variavel
