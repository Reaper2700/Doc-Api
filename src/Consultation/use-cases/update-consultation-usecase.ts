/* eslint-disable no-useless-constructor */
/* eslint-disable camelcase */
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'

export interface UpdateConsultationUseCaseRequest {
  id: string
  consultation_data?: Date
  medic_id?: string
  patient_id?: string
  notes?: string
}

interface UpdateConsultationUseCaseResponse {
  consultation: Consultation
}

export class UpdateConsultationUseCase {
  constructor(private consultationRepository: ConsultationRepository) {}

  async execute({
    id,
    consultation_data,
    medic_id,
    patient_id,
    notes,
  }: UpdateConsultationUseCaseRequest): Promise<UpdateConsultationUseCaseResponse> {
    const existConsultation = await this.consultationRepository.findById(id)

    if (!existConsultation) {
      throw new Error('consultion not found')
    }

    const UpdateConsultation = await this.consultationRepository.update(id, {
      consultation_data,
      medic_id,
      patient_id,
      notes,
    })

    return { consultation: UpdateConsultation }
  }
}
