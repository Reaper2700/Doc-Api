import { prisma } from '../../lib/prisma'

export async function cpfExistingMedic(cpf: string) {
  const existing = await prisma.medic.findUnique({
    where: { cpf },
  })

  return !!existing
}
