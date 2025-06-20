/* eslint-disable no-useless-constructor */
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'

interface UpdatePlansUseCaseRequest {
  id: string
  name: string
  varbase: number
}

interface UpdatePlansUseCaseResponse {
  plans: PLANS
}

export class UpdatePlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    id,
    name,
    varbase,
  }: UpdatePlansUseCaseRequest): Promise<UpdatePlansUseCaseResponse> {
    const plans = await this.plansRepository.update(id, {
      name,
      varbase,
    })

    return {
      plans,
    }
  }
}
