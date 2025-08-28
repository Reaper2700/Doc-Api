/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaMedicRepository } from '../repositories/prisma/prisma-medic-repository'
import { UpdateMedicUseCase } from '../use-cases/update-medic-usecase'
import { isValidCPF } from '../../patient/Erros/isValidCPF'
import { cpfExistingMedic } from '../Erros/cpfExist'
import { CRMExistMedic } from '../Erros/crmExist'
import { IdExistMedic } from '../Erros/IdExist'

export async function UpdateMedic(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateMedicParamsSchema = z.object({
    id: z
      .string()
      .uuid()
      .superRefine(async (id, ctx) => {
        const exists = await IdExistMedic(id)
        if (!exists) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'id não encontrado',
          })
        }
      }),
  })

  const updateMedicBodySchema = z.object({
    name: z.string().optional(),
    cpf: z
      .string()
      .min(11)
      .max(11)
      .refine(isValidCPF, {
        message: 'CPF Invalido',
      })
      .superRefine(async (cpf, ctx) => {
        const exist = await cpfExistingMedic(cpf)
        if (exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CPF Já cadastrado',
          })
        }
      })
      .optional(),
    crm: z
      .string()
      .superRefine(async (crm, ctx) => {
        const exist = await CRMExistMedic(crm)
        if (exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CRM já cadastrado',
          })
        }
      })
      .optional(),
    birthDate: z.coerce.date().optional(),
    plans: z.array(z.string()).optional(),
  })

  try {
    const { id } = await updateMedicParamsSchema.parseAsync(request.params)
    const body = await updateMedicBodySchema.parseAsync(request.body)

    const exists = await IdExistMedic(id)
    console.log(exists)
    console.log('Parâmetros recebidos:', request.params)

    const { name, cpf, crm, birthDate, plans } = body
    const updateData: any = {
      name,
      cpf,
      crm,
      birthDate,
      plans,
    }

    const medicRepository = new PrismaMedicRepository()
    const updateMedicUseCase = new UpdateMedicUseCase(medicRepository)

    const { medic } = await updateMedicUseCase.execute({
      id,
      ...updateData,
    })

    return reply.status(200).send(medic)
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Erro de validação', issues: err.errors })
    }

    console.error('Erro inesperado:', err)
    return reply.status(500).send({ message: 'Erro interno do servidor' })
  }
}
