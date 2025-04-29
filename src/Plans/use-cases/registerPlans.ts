/* eslint-disable no-useless-constructor */
import { PLANS } from '../../../db/db'
import { PlansRepository } from '../repositories/Plans-patient/patient-repository'

interface RegisterPlansUseCaseRequest {
  name: string
  varbase: number
}

interface RegisterPlansUseCaseResponse {
  plans: PLANS
}

export class RegisterPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    name,
    varbase,
  }: RegisterPlansUseCaseRequest): Promise<RegisterPlansUseCaseResponse> {
    const plans = await this.plansRepository.create({
      name,
      varbase,
    })

    return {
      plans,
    }
  }
}
