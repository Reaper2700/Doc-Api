import { Medic } from '@prisma/client'

export interface dataCreateSchema {
  id?: string
  name: string
  cpf: string
  crm: string
  birthDate: Date | string
  createAt?: Date | string
}

export interface MedicRepository {
  create(data: dataCreateSchema): Promise<Medic>
  findAll(): Promise<Medic[]>
  findById(id: string): Promise<Medic | null>
  update(id: string, data: Partial<dataCreateSchema>): Promise<Medic>
  delete(id: string): Promise<Medic>
}
