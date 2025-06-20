/* eslint-disable no-useless-constructor */

import { Medic } from '@prisma/client'
import { Consultation } from '../../../db/db'
import { ConsultationRepository } from '../repositories/consultation-repository'
import { MedicRepository } from '../../m-doc/repositories/medic-repository'

interface FilterConsultationUseCaseResponse {
  consultations: Consultation[]
  medics: Medic[]
}

interface FilterConsultationUseCaseRequest {
  consultation_data?: string
  medic_id?: string
}

export class FilterConsultationUseCase {
  constructor(
    private ConsultationRepository: ConsultationRepository,
    private medicRepository: MedicRepository,
  ) {}

  async execute(
    request: FilterConsultationUseCaseRequest,
  ): Promise<FilterConsultationUseCaseResponse> {
    const consultations = await this.ConsultationRepository.filterConsultation(
      request.consultation_data,
      request.medic_id,
    )
    const medics = await this.medicRepository.findAll()

    return { consultations, medics }
  }
}
