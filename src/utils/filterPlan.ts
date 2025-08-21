import { PlansRepository } from '../Plans/repositories/Plans-patient/plan-repository'
import { FilterPlansUseCase } from '../Plans/use-cases/FilterPlans'

export async function FilterPlanData(params: {
  id?: string
  name?: string
  varbase?: number
}) {
  const plansRepository = new PlansRepository()
  const filterPlansUseCase = new FilterPlansUseCase(plansRepository)

  const { plans, medics } = await filterPlansUseCase.execute(params)

  return { plans, medics }
}
