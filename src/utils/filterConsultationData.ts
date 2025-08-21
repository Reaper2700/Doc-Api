/* eslint-disable camelcase */
import { DBConsultationRepository } from '../Consultation/repositories/db/db-consultation-repository'
import { FilterConsultationUseCase } from '../Consultation/use-cases/filter_consultation_usecase'
import { PrismaMedicRepository } from '../m-doc/repositories/prisma/prisma-medic-repository'

export async function getFilterConsultationDat(params: {
  consultation_data?: string
  medic_id?: string
}) {
  const consultationRepository = new DBConsultationRepository()
  const medicRepository = new PrismaMedicRepository()

  const filterConsultation = new FilterConsultationUseCase(
    consultationRepository,
    medicRepository,
  )

  const { consultations, medics } = await filterConsultation.execute(params)

  console.log(consultations)

  return { consultations, medics }
}
