import { Patient } from '@prisma/client'
import { PatientRepository } from '../repositories/patient-repository'

/* eslint-disable no-useless-constructor */
interface ListPatientsUseCaseRequest {
  page: number
  limit: number
}

interface ListPatientsUseCaseReponse {
  data: Patient[]
  total: number
  totalPages: number
}

export class ListUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute({
    page,
    limit,
  }: ListPatientsUseCaseRequest): Promise<ListPatientsUseCaseReponse> {
    const { data, total } = await this.patientRepository.findAll(page, limit)

    return { data, total, totalPages: Math.ceil(total / limit) }
  }
}
