/* eslint-disable no-useless-constructor */
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/patient-repository'

interface DeletePlansResponse {
  plans: PLANS
}

export class DeletePlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(id: string): Promise<DeletePlansResponse> {
    const deletePlans = await this.plansRepository.delete(id)

    return { plans: deletePlans }
  }
}
