import { Patient } from '@prisma/client'
import { PatientRepository } from '../repositories/patient-repository'

/* eslint-disable no-useless-constructor */
interface ListPatientsUseCaseReponse {
  patients: Patient[]
}

export class ListUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(): Promise<ListPatientsUseCaseReponse> {
    const patients = await this.patientRepository.findAll()

    return { patients }
  }
}
