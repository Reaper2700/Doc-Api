/* eslint-disable no-useless-constructor */
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'

interface ListPlansUseCaseRequest {
  page: number
  limit: number
}

interface ListPlansUseCaseResponse {
  data: PLANS[]
  total: number
  totalPage: number
}

export class ListPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    page,
    limit,
  }: ListPlansUseCaseRequest): Promise<ListPlansUseCaseResponse> {
    const { data, total } = await this.plansRepository.findAll(page, limit)

    return { data, total, totalPage: Math.ceil(total / limit) }
  }
}
