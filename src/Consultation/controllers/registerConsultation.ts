/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { RegisterConsultationUseCase } from '../use-cases/create-consultation-usecase'

export interface dataCreateSchema {
  id?: string
  consultation_data: Date
  medic_id: string
  patient_id: string
  notes: string
}

export async function registerConsultation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerConsultationBodySchema = z.object({
    consultation_data: z.string().transform((str) => new Date(str)),
    medic_id: z.string(),
    patient_id: z.string(),
    notes: z.string(),
  })

  try {
    const { consultation_data, medic_id, patient_id, notes } =
      await registerConsultationBodySchema.parseAsync(request.body)

    const ConsultationRepository = new DBConsultationRepository()
    const registerConsultationUseCase = new RegisterConsultationUseCase(
      ConsultationRepository,
    )

    await registerConsultationUseCase.execute({
      consultation_data,
      medic_id,
      patient_id,
      notes,
    })
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
  return reply.status(201).send()
}
