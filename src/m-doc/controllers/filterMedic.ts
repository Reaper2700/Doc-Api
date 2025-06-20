/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { FilterMedicUseCase } from '../use-cases/filter-medic-usecase'

export async function FilterMedic(
  request: FastifyRequest<{ Querystring: { birthDate: string } }>,
  reply: FastifyReply,
) {
  const filterMedicParamsSchema = z.object({
    name: z.coerce.string().optional(),
    cpf: z.coerce.string().optional(),
    birthDate: z.coerce.string().optional(),
  })

  try {
    const { name, cpf, birthDate } = await filterMedicParamsSchema.parseAsync(
      request.query,
    )

    const medicRepository = new PrismaMedicRepository()
    const filterMedicUseCase = new FilterMedicUseCase(medicRepository)

    const { medics } = await filterMedicUseCase.execute({
      name,
      cpf,
      birthDate,
    })
    console.log(
      `[FilterMedic] name: ${name} cpf: ${cpf} bithDate: ${birthDate}`,
    )

    if (medics.length === 0) {
      return reply.status(404).send({
        message: `No Medics found for plan: ${birthDate}`,
      })
    }

    return reply.status(200).send({ medics })
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
