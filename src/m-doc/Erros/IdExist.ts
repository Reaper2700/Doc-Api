import { prisma } from '../../lib/prisma'

export async function IdExistMedic(id: string) {
  const exist = await prisma.medic.findUnique({
    where: { id },
  })

  return !!exist
}
