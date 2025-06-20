/* eslint-disable no-useless-constructor */
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'

interface FilterPlansUseCaseResponse {
  plans: PLANS[] | null
}

interface FilterPlansUseCaseRequest {
  name?: string
  varbase?: number
}
export class FilterPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(
    request: FilterPlansUseCaseRequest,
  ): Promise<FilterPlansUseCaseResponse> {
    const plans = await this.plansRepository.varFilter(request.varbase)

    return { plans }
  }
}
