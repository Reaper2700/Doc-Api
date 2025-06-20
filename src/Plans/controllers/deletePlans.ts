import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { PlansRepository } from '../repositories/Plans-patient/plan-repository'
import { DeletePlansUseCase } from '../use-cases/deletePlans'
import { IdExistPlan } from '../Erros/IdExist'

export async function DeletePlans(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    id: z.string().uuid().refine(IdExistPlan, {
      message: 'id não encontrado',
    }),
  })

  try {
    const { id } = await deleteParamsSchema.parseAsync(request.params)

    const plansRepository = new PlansRepository()
    const deleteUseCase = new DeletePlansUseCase(plansRepository)

    const plans = await deleteUseCase.execute(id)

    return reply.status(200).send(plans)
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }
  }
}
