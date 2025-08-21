/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { getFilterConsultationDat } from '../../utils/filterConsultationData'

export async function FilterConsultation(
  request: FastifyRequest<{
    Querystring: { consultation_data?: string; medic_id?: string }
  }>,
  reply: FastifyReply,
): Promise<[]> {
  const filterConsultationParamsSchema = z.object({
    consultation_data: z.coerce.string().optional(),
    medic_id: z.coerce.string().optional(),
  })

  try {
    const { consultation_data, medic_id } =
      await filterConsultationParamsSchema.parseAsync(request.query)

    const { consultations, medics } = await getFilterConsultationDat({
      consultation_data,
      medic_id,
    })

    if (consultations.length === 0) {
      return reply.status(404).send({
        message: `No Consultations found for Consultation: ${consultation_data} medic_id: ${medic_id}`,
      })
    }

    console.log('retorno:', consultations)

    return reply.status(200).send({ consultation: consultations })
  } catch (err) {
    if (err instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'erro de validação', issues: err.errors })
    }

    console.error('Error unspected', err)
    return reply.status(500).send({
      message: 'Error intern of server',
    })
  }
}
