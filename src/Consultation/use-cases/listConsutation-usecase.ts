/* eslint-disable no-useless-constructor */
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'

interface ListConsultationUseCaseRequest {
  page: number
  limit: number
}

interface ListConsultationUseCaseResponse {
  data: Consultation[]
  total: number
  totalPages: number
}

export class ListConsultationUseCase {
  constructor(private consultationRepository: ConsultationRepository) {}

  async execute({
    page,
    limit,
  }: ListConsultationUseCaseRequest): Promise<ListConsultationUseCaseResponse> {
    const { data, total } = await this.consultationRepository.findAll(
      page,
      limit,
    )

    return { data, total, totalPages: Math.ceil(total / limit) }
  }
}
