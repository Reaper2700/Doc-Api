/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaPatientRepository } from '../repositories/prisma/prisma-patient-repository'
import { UpdatePatientUseCase } from '../use-cases/update'
import { isValidCPF } from '../Erros/isValidCPF'
import { cpfExisting } from '../Erros/cpfExist'
import { IdExist } from '../Erros/IdExist'

export async function updatePatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string().uuid().refine(IdExist, {
      message: 'Id não existe',
    }),
  })

  const updateBodySchema = z.object({
    name: z.string().optional(),
    cpf: z
      .string()
      .min(11)
      .max(11)
      .refine(isValidCPF, {
        message: 'CPF inválido',
      })
      .superRefine(async (cpf, ctx) => {
        if (isValidCPF(cpf)) {
          const exists = await cpfExisting(cpf)
          if (exists) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'CPF já cadastrado',
              path: ['cpf'],
            })
          }
        }
      })
      .optional(),
    health_plan: z.string().nonempty('Plano de saúde é obrigatório').optional(),
    birthDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .optional(),
  })

  try {
    const { id } = await updateParamsSchema.parseAsync(request.params)
    const body = await updateBodySchema.parseAsync(request.body)

    const { name, cpf, health_plan, birthDate } = body
    const updateData: any = {
      name,
      cpf,
      health_plan,
      birthDate,
    }

    const patientRepository = new PrismaPatientRepository()
    const updateUseCase = new UpdatePatientUseCase(patientRepository)

    const { patient } = await updateUseCase.execute({
      id,
      ...updateData,
    })

    return reply.status(200).send(patient)
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
