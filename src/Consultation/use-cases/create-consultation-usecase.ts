/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'

interface RegisterConsultationUseCaseRequest {
  consultation_data: Date
  medic_id: string
  patient_id: string
  notes: Text
}

interface RegisterConsultationUseCaseResponse {
  consultation: Consultation
}

export class RegisterConsultationUseCase {
  constructor(private consultationRepository: ConsultationRepository) {}

  async execute({
    consultation_data,
    medic_id,
    patient_id,
    notes,
  }: RegisterConsultationUseCaseRequest): Promise<RegisterConsultationUseCaseResponse> {
    const consultation = await this.consultationRepository.create({
      consultation_data,
      medic_id,
      patient_id,
      notes,
    })

    return {
      consultation,
    }
  }
}
