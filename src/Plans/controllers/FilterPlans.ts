import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { FilterPlanData } from '../../utils/filterPlan'

export async function FilterPlans(
  request: FastifyRequest<{ Querystring: { name?: string; varbase?: number } }>,
  reply: FastifyReply,
) {
  const filterPlansParamsSchema = z.object({
    name: z.coerce.string(),
    varbase: z.coerce.number().nonnegative().min(100).optional(),
    id: z.coerce.string().optional(),
  })

  try {
    const { name, varbase, id } = await filterPlansParamsSchema.parseAsync(
      request.query,
    )

    const { plans, medics } = await FilterPlanData({
      name,
      varbase,
      id,
    })
    console.log(`[FilterPlans] name: ${name} varbase: ${varbase}`)

    if (plans.length === 0) {
      return reply.status(404).send({
        message: `No Plans found this medic`,
      })
    }

    if (id && medics.length === 0) {
      return reply.status(404).send({
        message: `No Medics found for plan`,
      })
    }

    plans.push(...medics)

    return reply.status(200).send({ plans, medics })
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
