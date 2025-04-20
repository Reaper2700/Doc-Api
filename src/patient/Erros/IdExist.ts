import { prisma } from '../../lib/prisma'

export async function IdExist(id: string) {
  const exist = await prisma.patient.findUnique({
    where: { id },
  })

  return !!exist
}
