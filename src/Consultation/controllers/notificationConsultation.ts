import { FastifyReply, FastifyRequest } from 'fastify'
import { DBConsultationRepository } from '../repositories/db/db-consultation-repository'
import { NotificationConsultationUseCase } from '../use-cases/notification-consultation-usecase'

export async function Notification(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const consultationRepository = new DBConsultationRepository()
  const notificationUseCase = new NotificationConsultationUseCase(
    consultationRepository,
  )

  const response = await notificationUseCase.execute()

  return reply.status(200).send(response)
}
