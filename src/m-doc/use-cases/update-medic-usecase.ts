/* eslint-disable no-useless-constructor */
import {
  dataCreateSchema,
  MedicRepository,
} from '../repositories/medic-repository'

interface UpdateMedicUseCaseRequest {
  id: string
  name?: string
  cpf?: string
  crm?: string
  birthDate?: Date
  plans?: { id: string; name: string }[]
}

interface UpdateMedicUseCaseResponse {
  medic: dataCreateSchema | null
}

export class UpdateMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute({
    id,
    name,
    cpf,
    crm,
    birthDate,
    plans,
  }: UpdateMedicUseCaseRequest): Promise<UpdateMedicUseCaseResponse> {
    const existingMedic = await this.medicRepository.findById(id)

    if (!existingMedic) {
      throw new Error('Medic not found')
    }

    const updateMedic = await this.medicRepository.update(id, {
      name,
      cpf,
      crm,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      plans,
    })

    return { medic: updateMedic }
  }
}
