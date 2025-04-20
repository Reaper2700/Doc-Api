import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { ListMedicUseCase } from '../use-cases/list-medic-usercase'

export async function ListMedic(request: FastifyRequest, reply: FastifyReply) {
  const medicRepository = new PrismaMedicRepository()
  const listUseCase = new ListMedicUseCase(medicRepository)

  const { medic } = await listUseCase.execute()

  return reply.status(200).send(medic)
}
