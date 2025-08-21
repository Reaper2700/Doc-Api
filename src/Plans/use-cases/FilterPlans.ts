/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'

interface FilterPlansUseCaseResponse {
  plans: PLANS[]
  medics: Medic[]
}

interface FilterPlansUseCaseRequest {
  name?: string
  varbase?: number
  id?: string
}
export class FilterPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(
    request: FilterPlansUseCaseRequest,
  ): Promise<FilterPlansUseCaseResponse> {
    let plans: PLANS[] = []

    if (request.id != null) {
      const plan = await this.plansRepository.findById(request.id)
      if (plan) {
        plans = [plan]
      }
    } else {
      plans = await this.plansRepository.varFilter(
        request.varbase,
        request.name,
      )
    }

    const medics =
      request.id != null
        ? await this.plansRepository.MedicsByIdPlan(request.id)
        : []

    return { plans, medics }
  }
}
