import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { UpdateConsultationUseCase } from '../use-cases/update-consultation-usecase'

export async function UpdateConsultation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const UpdateConsultationParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const UpdateConsultationBodySchema = z
    .object({
      consultation_data: z.coerce.date().optional(),
      medic_id: z.string().optional(),
      patient_id: z.string().optional(),
      notes: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Pelo menos um campo deve ser fornecido para atualização',
    })

  try {
    const { id } = UpdateConsultationParamsSchema.parse(request.params)
    const body = UpdateConsultationBodySchema.parse(request.body)

    const updateData = { ...body }

    const consultationRepository = new DBConsultationRepository()
    const updateConsultationUseCase = new UpdateConsultationUseCase(
      consultationRepository,
    )

    const { consultation } = await updateConsultationUseCase.execute({
      id,
      ...updateData,
    })

    return reply.status(200).send(consultation)
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação nos dados enviados',
        issues: err.errors,
      })
    }

    console.error('Erro inesperado:', err)
    return reply.status(500).send({ message: 'Erro interno do servidor' })
  }
}
