/* eslint-disable no-useless-constructor */
import { Medic } from '@prisma/client'
import { MedicRepository } from '../repositories/medic-repository'

interface RegisterMedicUseCaseRequest {
  name: string
  cpf: string
  crm: string
  birthDate: Date
  plans: string[] // <-- Adicionado
}

interface RegisterMedicUseCaseResponse {
  medic: Medic
}

export class RegisterMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute({
    name,
    cpf,
    crm,
    birthDate,
    plans,
  }: RegisterMedicUseCaseRequest): Promise<RegisterMedicUseCaseResponse> {
    const medic = await this.medicRepository.create({
      name,
      cpf,
      crm,
      birthDate: new Date(birthDate),
      plans,
    })

    return {
      medic,
    }
  }
}
