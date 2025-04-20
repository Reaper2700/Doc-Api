import { Prisma, Patient } from '@prisma/client'

export interface PatientRepository {
  create(data: Prisma.PatientCreateInput): Promise<Patient>
  findAll(): Promise<Patient[]>
  findById(id: string): Promise<Patient | null>
  update(id: string, data: Partial<Prisma.PatientUpdateInput>): Promise<Patient>
  delete(id: string): Promise<Patient>
}
