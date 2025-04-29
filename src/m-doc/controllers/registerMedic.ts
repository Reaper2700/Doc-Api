/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { RegisterMedicUseCase } from '../use-cases/create-medic-usecase'
import { isValidCPF } from '../../patient/Erros/isValidCPF'
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
      .refine(isValidCPF, {
        message: 'CPF invalido',
      })
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
        message: 'Invalid date format',
      })
      .transform((val) => new Date(val)),
  })

  try {
    const { name, cpf, crm, birthDate } =
      await registerMedicBodySchema.parseAsync(request.body)

    const medicRepository = new PrismaMedicRepository()
    const registerMedicUseCase = new RegisterMedicUseCase(medicRepository)

    await registerMedicUseCase.execute({
      name,
      cpf,
      crm,
      birthDate: new Date(birthDate),
    })
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
  return reply.status(201).send()
}
