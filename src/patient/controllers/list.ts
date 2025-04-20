import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaPatientRepository } from '../repositories/prisma/prisma-patient-repository'
import { ListUseCase } from '../use-cases/list'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const patientRepository = new PrismaPatientRepository()
  const listUseCase = new ListUseCase(patientRepository)

  const { patients } = await listUseCase.execute()

  return reply.status(200).send(patients)
}
