import { PrismaPatientRepository } from '../patient/repositories/prisma/prisma-patient-repository'
import { FilterPatientPlansUseCase } from '../patient/use-cases/filterPlansPatient'

export async function filterPatientDate(params: {
  name?: string
  cpf?: string
  health_plan?: string
  olderThan50?: string
}) {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      if (typeof value === 'string') return value.trim() !== ''
      return value !== undefined && value !== null
    }),
  )

  const patientRepository = new PrismaPatientRepository()
  const filterPatientUseCase = new FilterPatientPlansUseCase(patientRepository)

  const { patients } = await filterPatientUseCase.execute(cleanedParams)

  return { patients }
}
