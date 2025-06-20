/* eslint-disable no-useless-constructor */
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'

interface DeleteConsultationUseCaseResponse {
  consultation: Consultation
}

export class DeleteConsultationUseCase {
  constructor(private consultationRepository: ConsultationRepository) {}

  async execute(id: string): Promise<DeleteConsultationUseCaseResponse> {
    const ConsulExist = await this.consultationRepository.findById(id)

    if (!ConsulExist) {
      throw new Error('consulta não existe')
    }

    const deleteConsultation = await this.consultationRepository.delete(id)

    return { consultation: deleteConsultation }
  }
}
