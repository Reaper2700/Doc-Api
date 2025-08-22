import { FastifyReply, FastifyRequest } from 'fastify'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { ListConsultationUseCase } from '../use-cases/listConsutation-usecase'
import { z } from 'zod'

export async function ListConsultation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const consultationRepository = new DBConsultationRepository()
  const listUseCase = new ListConsultationUseCase(consultationRepository)
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(10).max(20).default(10),
  })

  const { page, limit } = querySchema.parse(request.query)

  const response = await listUseCase.execute({ page, limit })

  return reply.status(200).send(response.data)
}
