/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { PrismaPatientRepository } from '../repositories/prisma/prisma-patient-repository'
import { RegisterUseCase } from '../use-cases/register'
import { isValidCPF } from '../Erros/isValidCPF'
import { cpfExisting } from '../Erros/cpfExist'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().trim().min(6, 'Nome deve ter pelo menos 6 caracteres'),
    cpf: z
      .string()
      .min(11)
      .max(11)
      .refine(isValidCPF, {
        message: 'CPF inválido',
      })
      .refine(
        async (cpf) => {
          return !(await cpfExisting(cpf)) // Se existir, dá erro
        },
        {
          message: 'CPF já cadastrado',
        },
      ),
    health_plan: z.string().nonempty('Plano de saúde é obrigatório'),
    birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  })

  try {
    const { name, cpf, health_plan, birthDate } =
      await registerBodySchema.parseAsync(request.body)

    const patientRepository = new PrismaPatientRepository()
    const registerUseCase = new RegisterUseCase(patientRepository)

    await registerUseCase.execute({
      name,
      cpf,
      health_plan,
      birthDate: new Date(birthDate),
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
