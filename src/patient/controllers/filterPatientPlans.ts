/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaPatientRepository } from '../repositories/prisma/prisma-patient-repository'
import { FilterPatientPlansUseCase } from '../use-cases/filterPlansPatient'

export async function FilterPatientPlans(
  request: FastifyRequest<{ Querystring: { health_plan: string } }>,
  reply: FastifyReply,
) {
  const filterPatientPlansParamsSchema = z.object({
    name: z.coerce.string().optional(),
    cpf: z.coerce.string().optional(),
    health_plan: z.coerce.string().optional(),
  })

  try {
    const { name, cpf, health_plan } =
      await filterPatientPlansParamsSchema.parseAsync(request.query)

    const patientRepository = new PrismaPatientRepository()
    const filterPatientPlansUseCase = new FilterPatientPlansUseCase(
      patientRepository,
    )

    const { patients } = await filterPatientPlansUseCase.execute({
      name,
      cpf,
      health_plan,
    })
    console.log(
      `[FilterPatient] name: ${name} cpf: ${cpf} plan: ${health_plan}`,
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
