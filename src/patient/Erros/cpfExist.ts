import { prisma } from '../../lib/prisma'

export async function cpfExisting(cpf: string) {
  const existing = await prisma.patient.findUnique({
    where: { cpf },
  })

  return !!existing
}
