/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { filterPatientDate } from '../../utils/filterPatients'

export async function FilterPatientPlans(
  request: FastifyRequest<{ Querystring: { health_plan: string } }>,
  reply: FastifyReply,
) {
  const filterPatientPlansParamsSchema = z.object({
    name: z.coerce.string().optional(),
    cpf: z.coerce.string().optional(),
    health_plan: z.coerce.string().optional(),
    olderThan50: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
  })

  try {
    const { name, cpf, health_plan, olderThan50 } =
      await filterPatientPlansParamsSchema.parseAsync(request.query)

    const { patients } = await filterPatientDate({
      name,
      cpf,
      health_plan,
      olderThan50,
    })
    console.log(
      `[FilterPatient] name: ${name} cpf: ${cpf} plan: ${health_plan} older: ${olderThan50}`,
    )

    if (patients.length === 0) {
      return reply.status(404).send({
        message: `No patients found for plan: ${health_plan}`,
      })
    }

    return reply.status(200).send({ patients })
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
