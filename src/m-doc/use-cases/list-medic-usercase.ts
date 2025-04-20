/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'

interface ListMedicUseCaseResponse {
  medic: Medic[]
}

export class ListMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute(): Promise<ListMedicUseCaseResponse> {
    const medic = await this.medicRepository.findAll()

    return { medic }
  }
}
