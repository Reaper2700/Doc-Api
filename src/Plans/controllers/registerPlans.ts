import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PlansRepository } from '../repositories/Plans-patient/plan-repository'
import { RegisterPlansUseCase } from '../use-cases/registerPlans'

export async function registerPlans(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string().trim().min(4, 'Nome deve ter pelo menos 4 caracteres'),
    varbase: z.number().nonnegative(),
  })

  try {
    const { name, varbase } = await registerBodySchema.parseAsync(request.body)

    const plansRepository = new PlansRepository()
    const registerPlanUseCase = new RegisterPlansUseCase(plansRepository)

    await registerPlanUseCase.execute({
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
