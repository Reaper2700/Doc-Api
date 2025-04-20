import { prisma } from '../../lib/prisma'

export async function CRMExistMedic(crm: string) {
  const crmExist = await prisma.medic.findUnique({
    where: { crm },
  })

  return !!crmExist
}
