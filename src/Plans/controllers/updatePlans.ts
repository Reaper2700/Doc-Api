import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'
import { UpdatePlansUseCase } from '../use-cases/updatePlansUseCase'

export async function updatePlans(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const updateBodySchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, 'Nome deve ter pelo menos 4 caracteres')
      .optional(),
    varbase: z.number().nonnegative().optional(),
  })

  try {
    const { id } = request.params
    const { name, varbase } = await updateBodySchema.parseAsync(request.body)

    const plansRepository = new PlansRepository()
    const updatePlanUseCase = new UpdatePlansUseCase(plansRepository)

    await updatePlanUseCase.execute({
      id,
      name,
      varbase,
    })
    return reply.status(201).send()
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }

    console.error('Erro inesperado:', err)
    return reply.status(500).send({
      message: 'Erro interno do servidor',
    })
  }
}
