import { PrismaMedicRepository } from '../m-doc/repositories/prisma/prisma-medic-repository'
import { FilterMedicUseCase } from '../m-doc/use-cases/filter-medic-usecase'

export async function filterMedicDate(params: {
  name?: string
  cpf?: string
  birthDate?: string
  id?: string
  olderThan50?: string
}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      if (typeof value === 'string') {
        return value.trim() !== ''
      }
      return value !== undefined && value !== null
    }),
  )

  const medicRepository = new PrismaMedicRepository()
  const filterMedicUseCase = new FilterMedicUseCase(medicRepository)

  const { medics, plans } = await filterMedicUseCase.execute(cleanParams)

  return { medics, plans }
}
