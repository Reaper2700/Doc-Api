/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'

interface FilterMedicUseCaseResponse {
  medics: Medic[]
}

interface FilterMedicUseCaseRequest {
  name?: string
  cpf?: string
  birthDate?: Date | string
}

export class FilterMedicUseCase {
  constructor(private MedicRepository: MedicRepository) {}

  async execute(
    request: FilterMedicUseCaseRequest,
  ): Promise<FilterMedicUseCaseResponse> {
    const medics = await this.MedicRepository.filterMedic(
      request.name,
      request.cpf,
      request.birthDate,
    )

    return { medics }
  }
}
