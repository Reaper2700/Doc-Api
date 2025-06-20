import { FastifyReply, FastifyRequest } from 'fastify'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { ListConsultationUseCase } from '../use-cases/listConsutation-usecase'

export async function ListConsultation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const consultationRepository = new DBConsultationRepository()
  const listUseCase = new ListConsultationUseCase(consultationRepository)

  const { consultation } = await listUseCase.execute()

  return reply.status(200).send(consultation)
}
