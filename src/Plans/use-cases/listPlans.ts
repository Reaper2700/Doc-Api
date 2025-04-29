/* eslint-disable no-useless-constructor */
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/patient-repository'

interface ListPlansUseCaseResponse {
  plans: PLANS[]
}

export class ListPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(): Promise<ListPlansUseCaseResponse> {
    const plans = await this.plansRepository.findAll()

    return { plans }
  }
}
