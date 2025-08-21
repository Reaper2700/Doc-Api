/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'

interface ListMedicUseCaseRequest {
  page: number
  limit: number
}

interface ListMedicUseCaseResponse {
  data: Medic[]
  total: number
  totalPages: number
}

export class ListMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute({
    page,
    limit,
  }: ListMedicUseCaseRequest): Promise<ListMedicUseCaseResponse> {
    const { data, total } = await this.medicRepository.findAll(page, limit)

    return { data, total, totalPages: Math.ceil(total / limit) }
  }
}
