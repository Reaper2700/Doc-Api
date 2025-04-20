/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
import { Patient } from '@prisma/client'
import { PatientRepository } from '../repositories/patient-repository'

interface UpdatePatientUseCaseRequest {
  id: string
  name?: string
  cpf?: string
  health_plan?: string
  birthDate?: Date
}

interface UpdatePatientUseCaseResponse {
  patient: Patient
}

export class UpdatePatientUseCase {
  constructor(private patientsRepository: PatientRepository) {}

  async execute({
    id,
    name,
    cpf,
    health_plan,
    birthDate,
  }: UpdatePatientUseCaseRequest): Promise<UpdatePatientUseCaseResponse> {
    const existingPatient = await this.patientsRepository.findById(id)

    if (!existingPatient) {
      throw new Error('patient not found')
    }

    const updatePatient = await this.patientsRepository.update(id, {
      name,
      cpf,
      health_plan,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    })

    return {
      patient: updatePatient,
    }
  }
}
