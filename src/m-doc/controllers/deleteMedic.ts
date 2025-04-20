import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { DeleteMedicUseCase } from '../use-cases/delete-medic-usecase'
import { IdExistMedic } from '../Erros/IdExist'

export async function DeleteMedic(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const DeleteMedicParamsSchema = z.object({
    id: z
      .string()
      .uuid()
      .superRefine(async (id, ctx) => {
        // Usando superRefine para operações assíncronas
        try {
          const exists = await IdExistMedic(id) // Chama a função assíncrona para verificar no banco de dados
          if (!exists) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'id não encontrado',
            })
          }
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Erro ao verificar id',
          })
        }
      }),
  })

  try {
    const { id } = await DeleteMedicParamsSchema.parseAsync(request.params)

    const medicRepository = new PrismaMedicRepository()
    const deletemediUseCase = new DeleteMedicUseCase(medicRepository)

    const medic = await deletemediUseCase.execute(id)

    return reply.status(200).send(medic)
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }
  }
}
