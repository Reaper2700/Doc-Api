/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
import { Patient } from '@prisma/client'
import { PatientRepository } from '../repositories/patient-repository'

interface RegisterPatientUseCaseRequest {
  name: string
  cpf: string
  health_plan: string
  birthDate: Date
}

interface RegisterPatientUseCaseResponse {
  patient: Patient
}

export class RegisterUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute({
    name,
    cpf,
    health_plan,
    birthDate,
  }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse> {
    const patient = await this.patientRepository.create({
      name,
      cpf,
      health_plan,
      birthDate: new Date(birthDate),
    })

    return {
      patient,
    }
  }
}
