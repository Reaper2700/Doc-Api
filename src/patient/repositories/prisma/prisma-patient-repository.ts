import { Patient, Prisma } from '@prisma/client'
import { PatientRepository } from '../patient-repository'
import { prisma } from '../../../lib/prisma'

export class PrismaPatientRepository implements PatientRepository {
  async delete(id: string): Promise<Patient> {
    const deletePatient = await prisma.patient.delete({
      where: { id },
    })

    return deletePatient
  }

  async findById(id: string): Promise<Patient | null> {
    const listEspecificPatient = await prisma.patient.findUnique({
      where: { id },
    })

    return listEspecificPatient
  }

  async update(
    id: string,
    data: Partial<Prisma.PatientUpdateInput>,
  ): Promise<Patient> {
    const updatePatient = await prisma.patient.update({
      where: { id },
      data,
    })

    return updatePatient
  }

  async findAll(): Promise<Patient[]> {
    const patients = await prisma.patient.findMany()

    return patients
  }

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    const patient = await prisma.patient.create({
      data,
    })

    return patient
  }
}
