import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaPatientRepository } from '../repositories/prisma/prisma-patient-repository'
import { ListUseCase } from '../use-cases/list'
import { z } from 'zod'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const patientRepository = new PrismaPatientRepository()
  const listUseCase = new ListUseCase(patientRepository)

  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(20).default(10),
  })

  const { page, limit } = querySchema.parse(request.query)

  const response = await listUseCase.execute({ page, limit })

  return reply.status(200).send(response)
}
