import { Prisma, Medic } from '@prisma/client'

export interface MedicRepository {
  create(data: Prisma.MedicCreateInput): Promise<Medic>
  findAll(): Promise<Medic[]>
  findById(id: string): Promise<Medic | null>
  update(id: string, data: Partial<Prisma.MedicUpdateInput>): Promise<Medic>
  delete(id: string): Promise<Medic>
}
