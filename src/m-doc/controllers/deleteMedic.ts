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
        try {
          const exists = await IdExistMedic(id)
          if (!exists) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'ID não encontrado',
            })
          }
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Erro ao verificar ID',
          })
        }
      }),
  })

  try {
    const { id } = await DeleteMedicParamsSchema.parseAsync(request.params)

    const medicRepository = new PrismaMedicRepository()
    const deleteMedicUseCase = new DeleteMedicUseCase(medicRepository)

    const medic = await deleteMedicUseCase.execute(id)

    if (!medic) {
      // Caso o delete não tenha retornado nada
      return reply
        .status(404)
        .send({ message: 'Não foi possível deletar o médico' })
    }

    return reply.status(200).send(medic)
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }

    // Verifica se é um erro do tipo Error (possui message)
    if (err instanceof Error) {
      // Aqui podemos acessar err.message
      console.error('Erro inesperado:', err)
      return reply
        .status(500)
        .send({ message: 'Erro interno no servidor', error: err.message })
    }

    // Caso seja um erro não padrão
    console.error('Erro inesperado não padrão:', err)
    return reply
      .status(500)
      .send({ message: 'Erro interno no servidor', error: String(err) })
  }
}
