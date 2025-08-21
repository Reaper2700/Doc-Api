import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { ListMedicUseCase } from '../use-cases/list-medic-usercase'
import { z } from 'zod'

export async function ListMedic(request: FastifyRequest, reply: FastifyReply) {
  const medicRepository = new PrismaMedicRepository()
  const listUseCase = new ListMedicUseCase(medicRepository)

  const listMedicQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(10).max(20).default(10),
  })

  const { page, limit } = listMedicQuerySchema.parse(request.query)

  const response = await listUseCase.execute({ page, limit })

  return reply.status(200).send(response)
}
