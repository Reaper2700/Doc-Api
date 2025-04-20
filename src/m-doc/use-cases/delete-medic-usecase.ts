/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'

interface DeleteMedicUseCaseReponse {
  medic: Medic
}

export class DeleteMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute(id: string): Promise<DeleteMedicUseCaseReponse> {
    const deleteMedic = await this.medicRepository.delete(id)

    return { medic: deleteMedic }
  }
}
