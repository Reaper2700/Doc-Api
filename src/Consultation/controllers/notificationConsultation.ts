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
  try {
    const response = await notificationUseCase.execute()

    return reply.status(200).send(response)
  } catch (err) {
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
