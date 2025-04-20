/* eslint-disable no-useless-constructor */
import { Patient } from '@prisma/client'
import { PatientRepository } from '../repositories/patient-repository'

interface DeletePatienteResponse {
  patient: Patient
}

export class DeletePatienteUseCase {
  constructor(private patienteRepository: PatientRepository) {}

  async execute(id: string): Promise<DeletePatienteResponse> {
    const deletePatient = await this.patienteRepository.delete(id)

    return { patient: deletePatient }
  }
}
