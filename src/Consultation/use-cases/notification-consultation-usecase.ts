/* eslint-disable no-useless-constructor */
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'

interface ListConsultationUseCaseResponse {
  data: Consultation[]
}

export class NotificationConsultationUseCase {
  constructor(private consultationRepository: ConsultationRepository) {}

  async execute(): Promise<ListConsultationUseCaseResponse> {
    const { data } = await this.consultationRepository.notification()

    return { data }
  }
}
