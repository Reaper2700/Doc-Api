import { FastifyReply, FastifyRequest } from 'fastify'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'
import { ListPlansUseCase } from '../use-cases/listPlans'

export async function listPlans(request: FastifyRequest, reply: FastifyReply) {
  const plansRepository = new PlansRepository()
  const listPlansUseCase = new ListPlansUseCase(plansRepository)

  const { plans } = await listPlansUseCase.execute()

  return reply.status(200).send(plans)
}
