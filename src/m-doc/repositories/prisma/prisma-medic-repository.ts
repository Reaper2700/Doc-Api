import { Prisma, Medic } from '@prisma/client'
import { MedicRepository } from '../medic-repository'
import { prisma } from '../../../lib/prisma'

export class PrismaMedicRepository implements MedicRepository {
  async create(data: Prisma.MedicCreateInput): Promise<Medic> {
    const medic = await prisma.medic.create({
      data,
    })

    return medic
  }

  async findAll(): Promise<Medic[]> {
    const listMedic = await prisma.medic.findMany()

    return listMedic
  }

  async findById(id: string): Promise<Medic | null> {
    const listEspecificMedic = await prisma.medic.findUnique({
      where: { id },
    })

    return listEspecificMedic
  }

  async update(
    id: string,
    data: Partial<Prisma.MedicUpdateInput>,
  ): Promise<Medic> {
    const updateMedic = await prisma.medic.update({
      where: { id },
      data,
    })

    return updateMedic
  }

  async delete(id: string): Promise<Medic> {
    const deleteMedic = await prisma.medic.delete({
      where: { id },
    })

    return deleteMedic
  }
}
