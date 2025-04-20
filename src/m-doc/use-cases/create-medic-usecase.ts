/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'

interface RegisterMedicUseCaseRequest {
  name: string
  cpf: string
  crm: string
  birthDate: Date
}

interface RegisterMedicUseCaseReponse {
  medic: Medic
}

export class RegisterMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute({
    name,
    cpf,
    crm,
    birthDate,
  }: RegisterMedicUseCaseRequest): Promise<RegisterMedicUseCaseReponse> {
    const medic = await this.medicRepository.create({
      name,
      cpf,
      crm,
      birthDate: new Date(birthDate),
    })

    return {
      medic,
    }
  }
}
