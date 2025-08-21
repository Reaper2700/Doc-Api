import { Patient } from '@prisma/client'

export interface PatientSchema {
  id?: string
  name: string
  cpf: string
  health_plan: string
  birthDate: Date | string
  createAt?: Date | string
}

export interface PatientRepository {
  create(data: PatientSchema): Promise<Patient>
  findAll(): Promise<Patient[]>
  findById(id: string): Promise<Patient | null>
  update(id: string, data: Partial<PatientSchema>): Promise<Patient>
  delete(id: string): Promise<Patient>

  filterForPlan(
    name?: string,
    cpf?: string,
    health_plan?: string,
    olderThan50?: boolean,
  ): Promise<Patient[]>
}
