/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { RegisterMedicUseCase } from '../use-cases/create-medic-usecase'
import { cpfExistingMedic } from '../Erros/cpfExist'
import { CRMExistMedic } from '../Erros/crmExist'

export async function registerMedicUseCase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerMedicBodySchema = z.object({
    name: z.string(),
    cpf: z
      .string()
      .min(11)
      .max(11)
      .superRefine(async (cpf, ctx) => {
        const exists = await cpfExistingMedic(cpf)
        if (exists) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CPF já cadastrado',
          })
        }
      }),
    crm: z.string().superRefine(async (crm, ctx) => {
      const exist = await CRMExistMedic(crm)
      if (exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CRM já cadastrado',
        })
      }
    }),
    birthDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Formato de data inválido',
      })
      .transform((val) => new Date(val)),

    plans: z
      .array(z.string().uuid())
      .nonempty({ message: 'É necessário selecionar ao menos um plano' }), // <- Novo campo
  })

  try {
    const { name, cpf, crm, birthDate, plans } =
      await registerMedicBodySchema.parseAsync(request.body)

    const medicRepository = new PrismaMedicRepository()
    const registerMedicUseCase = new RegisterMedicUseCase(medicRepository)

    await registerMedicUseCase.execute({
      name,
      cpf,
      crm,
      birthDate,
      plans, // <- Enviando os planos para o use case
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }

    console.error('Erro inesperado:', err)
    return reply.status(500).send({
      message: 'Erro interno do servidor',
    })
  }
}
