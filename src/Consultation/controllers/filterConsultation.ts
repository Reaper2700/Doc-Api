/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { FilterConsultationUseCase } from '../use-cases/filter_consultation_usecase'
import { PrismaMedicRepository } from '../../m-doc/repositories/prisma/prisma-medic-repository'

export async function FilterConsultation(
  request: FastifyRequest<{
    Querystring: { birthDate: string; medic_id: string }
  }>,
  reply: FastifyReply,
) {
  const filterConsultationParamsSchema = z.object({
    consultation_data: z.coerce.string().optional(),
    medic_id: z.coerce.string().optional(),
  })

  try {
    const { consultation_data, medic_id } =
      await filterConsultationParamsSchema.parseAsync(request.query)

    const consultationRepository = new DBConsultationRepository()
    const medicRepository = new PrismaMedicRepository()

    const filterConsultationUseCase = new FilterConsultationUseCase(
      consultationRepository,
      medicRepository,
    )

    const { consultations, medics } = await filterConsultationUseCase.execute({
      consultation_data,
      medic_id,
    })
    console.log(
      `[FilterConsultation] consultation date: ${consultation_data} medic_id: ${medic_id}`,
    )

    if (consultations.length === 0) {
      return reply.status(404).send({
        message: `No Consultations found for Consultation: ${consultation_data} medic_id: ${medic_id}`,
      })
    }

    const medic = [
      {
        field: 'medic_id',
        type: 'select',
        label: 'Médico',
        options: medics.map((m) => ({ label: m.name, value: m.id })),
      },
    ]

    return reply.status(200).send({ consultation: consultations })
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
