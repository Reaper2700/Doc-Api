/* eslint-disable no-useless-constructor */
import { Patient } from '@prisma/client'
import { PatientRepository } from '../repositories/patient-repository'

interface FilterPlansPatientUseCaseResponse {
  patients: Patient[]
}

interface FilterPlansPatientUseCaseRequest {
  name?: string
  cpf?: string
  health_plan?: string
  olderThan50?: boolean
}

export class FilterPatientPlansUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(
    request: FilterPlansPatientUseCaseRequest,
  ): Promise<FilterPlansPatientUseCaseResponse> {
    const patients = await this.patientRepository.filterForPlan(
      request.name,
      request.cpf,
      request.health_plan,
      request.olderThan50,
    )

    return { patients }
  }
}
