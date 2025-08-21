/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'
import { PLANS } from '../../../db/db'

interface FilterMedicUseCaseResponse {
  medics: Medic[]
  plans: PLANS[]
}

interface FilterMedicUseCaseRequest {
  id?: string
  name?: string
  cpf?: string
  birthDate?: Date | string
  olderThan50?: boolean
}

export class FilterMedicUseCase {
  constructor(private MedicRepository: MedicRepository) {}

  async execute(
    request: FilterMedicUseCaseRequest,
  ): Promise<FilterMedicUseCaseResponse> {
    let medics: Medic[] = []

    if (request.id != null) {
      const medic = await this.MedicRepository.findById(request.id)
      if (medic) {
        medics = [medic]
      }
    } else {
      medics = await this.MedicRepository.filterMedic(
        request.name,
        request.cpf,
        request.birthDate,
        request.olderThan50,
      )
    }

    const plans =
      request.id != null
        ? await this.MedicRepository.filterMedicByPlan(request.id)
        : []

    return { medics, plans }
  }
}
