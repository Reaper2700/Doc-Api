import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { DeleteConsultationUseCase } from '../use-cases/delete-consultation-usecase'

export async function DeleteConsultation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const DeleteConsultationParamsSchema = z.object({
    id: z.string().uuid(),
  })

  try {
    const { id } = await DeleteConsultationParamsSchema.parseAsync(
      request.params,
    )
    const consultationRepository = new DBConsultationRepository()
    const deleteConsultationUseCase = new DeleteConsultationUseCase(
      consultationRepository,
    )

    const consultation = await deleteConsultationUseCase.execute(id)

    return reply.status(200).send(consultation)
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }
  }
}
