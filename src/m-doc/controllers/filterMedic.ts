import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { filterMedicDate } from '../../utils/filterMedic'

export async function FilterMedic(
  request: FastifyRequest<{
    Querystring: {
      name?: string
      cpf?: string
      birthDate?: string
      id?: string
      olderThan50?: string // virá como string na query
    }
  }>,
  reply: FastifyReply,
) {
  const filterMedicParamsSchema = z.object({
    name: z.string().optional(),
    cpf: z.string().optional(),
    birthDate: z.string().optional(),
    id: z.string().optional(),
    olderThan50: z
      .string()
      .optional()
      .transform((val) => val === 'true'), // transforma string 'true' para boolean true
  })

  try {
    const { name, cpf, birthDate, id, olderThan50 } =
      await filterMedicParamsSchema.parseAsync(request.query)

    const { medics, plans } = await filterMedicDate({
      name,
      cpf,
      birthDate,
      id,
      olderThan50,
    })

    console.log(
      `[FilterMedic] name: ${name} cpf: ${cpf} birthDate: ${birthDate} id: ${id} olderThan50: ${olderThan50}`,
    )

    if (medics.length === 0) {
      return reply.status(404).send({
        message: 'No medics found matching the criteria',
      })
    }

    if (id && plans.length === 0) {
      return reply.status(404).send({
        message: 'No plans found for the specified medic',
      })
    }

    // Não faça medics.push(...plans), retorne separado

    return reply.status(200).send({
      medics,
      plans,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error', issues: err.errors })
    }

    console.error('Unexpected error', err)
    return reply.status(500).send({
      message: 'Internal server error',
    })
  }
}
