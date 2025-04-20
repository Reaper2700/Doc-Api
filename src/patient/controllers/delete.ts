import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaPatientRepository } from '../repositories/prisma/prisma-patient-repository'
import { DeletePatienteUseCase } from '../use-cases/delete'
import { z, ZodError } from 'zod'
import { IdExist } from '../Erros/IdExist'

export async function DeletePatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    id: z.string().uuid().refine(IdExist, {
      message: 'id não encontrado',
    }),
  })

  try {
    const { id } = await deleteParamsSchema.parseAsync(request.params)

    const patienteRepository = new PrismaPatientRepository()
    const deleteUseCase = new DeletePatienteUseCase(patienteRepository)

    const patient = await deleteUseCase.execute(id)

    return reply.status(200).send(patient)
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }
  }
}
