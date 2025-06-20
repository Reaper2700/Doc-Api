import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'
import { FilterPlansUseCase } from '../use-cases/FilterPlans'

export async function FilterPlans(
  request: FastifyRequest<{ Querystring: { name?: string; varbase?: number } }>,
  reply: FastifyReply,
) {
  const filterPlansParamsSchema = z.object({
    name: z.coerce.string(),
    varbase: z.coerce.number().nonnegative().min(100).optional(),
  })

  try {
    const { name, varbase } = await filterPlansParamsSchema.parseAsync(
      request.query,
    )

    const plansRepository = new PlansRepository()
    const filterPlansUseCase = new FilterPlansUseCase(plansRepository)

    const { plans } = await filterPlansUseCase.execute({
      name,
      varbase,
    })
    console.log(`[FilterPlans] name: ${name} varbase: ${varbase}`)

    return reply.status(200).send({ plans })
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'erro de validação', issues: err.errors })
    }

    console.error('Error unspected', err)
    return reply.status(500).send({
      message: 'Error intern of server',
    })
  }
}
