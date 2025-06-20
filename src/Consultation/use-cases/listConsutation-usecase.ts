/* eslint-disable no-useless-constructor */
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'

interface ListConsultationUseCaseResponse {
  consultation: Consultation[]
}

export class ListConsultationUseCase {
  constructor(private consultationRepository: ConsultationRepository) {}

  async execute(): Promise<ListConsultationUseCaseResponse> {
    const consultation = await this.consultationRepository.findAll()

    return { consultation }
  }
}
