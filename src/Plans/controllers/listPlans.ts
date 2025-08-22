import { FastifyReply, FastifyRequest } from 'fastify'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'
import { ListPlansUseCase } from '../use-cases/listPlans'
import { z } from 'zod'

export async function listPlans(request: FastifyRequest, reply: FastifyReply) {
  const plansRepository = new PlansRepository()
  const listPlansUseCase = new ListPlansUseCase(plansRepository)

  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(10).max(40).default(40),
  })

  const { page, limit } = querySchema.parse(request.query)

  const response = await listPlansUseCase.execute({ page, limit })

  return reply.status(200).send(response.data)
}
