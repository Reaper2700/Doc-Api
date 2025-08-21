/* eslint-disable @typescript-eslint/no-explicit-any */
import { Medic } from '@prisma/client'
import { PLANS } from '../../../db/db'

export interface dataCreateSchema {
  id?: string
  name: string
  cpf: string
  crm: string
  birthDate: Date | string
  createAt?: Date | string
  plans: string[]
}

interface CreateMedicResult {
  medic: Medic
  plan: any // ou defina um tipo específico para o plano se tiver
}

export interface MedicRepository {
  create(data: dataCreateSchema): Promise<CreateMedicResult>
  findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Medic[]; total: number }>
  findById(id: string): Promise<Medic | null>
  update(id: string, data: Partial<dataCreateSchema>): Promise<Medic>
  delete(id: string): Promise<Medic>

  filterMedic(
    name?: string,
    cpf?: string,
    birthDate?: Date | string,
    olderThan50?: boolean,
  ): Promise<Medic[]>

  filterMedicByPlan(id?: string): Promise<PLANS[]>
}
