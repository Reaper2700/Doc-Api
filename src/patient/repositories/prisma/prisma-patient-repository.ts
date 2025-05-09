import { Patient } from '@prisma/client'
import { PatientRepository, PatientSchema } from '../patient-repository'
import { isValidUUID } from '../../../lib/prisma'
import { query } from '../../../../db/db'

export class PrismaPatientRepository implements PatientRepository {
  async create(data: PatientSchema): Promise<Patient> {
    try {
      const res = await query(
        'INSERT INTO "Patient" (name, cpf, "health_plan", "birthDate") VALUES($1, $2, $3, $4) RETURNING *',
        [data.name, data.cpf, data.health_plan, data.birthDate],
      )
      console.log(res.rows[0])
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao criar Paciente:', err)
      throw new Error('Erro ao criar Paciente')
    }
  }

  async findAll(): Promise<Patient[]> {
    try {
      const res = await query('SELECT * FROM "Patient"')
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.error('Erro ao buscar Patient:', err)
      return []
    }
  }

  async findById(id: string): Promise<Patient | null> {
    if (!isValidUUID(id)) {
      console.error('ID inválido')
      return null
    }
    try {
      const res = await query(
        'SELECT (id, name, cpf, "health_plan", "birthDate", "createAt") FROM "Patient" WHERE id = $1::uuid LIMIT 1',
        [id],
      )
      return res.rows.length > 0 ? res.rows[0] : null
    } catch (err) {
      console.error('Erro ao buscar Patient:', err)
      return null
    }
  }

  async update(id: string, data: Partial<PatientSchema>): Promise<Patient> {
    try {
      const currentMedic = await this.findById(id)

      if (!currentMedic) {
        console.log('Paciente não encontrado!')
        throw new Error('Paciente não encontrado!')
      }

      const updatedFields: Partial<PatientSchema> = {}

      if (data.name && data.name !== currentMedic.name) {
        updatedFields.name = data.name
      }
      if (data.cpf && data.cpf !== currentMedic.cpf) {
        updatedFields.cpf = data.cpf
      }
      if (data.health_plan && data.health_plan !== currentMedic.health_plan) {
        updatedFields.health_plan = data.health_plan
      }
      if (data.birthDate && data.birthDate !== currentMedic.birthDate) {
        updatedFields.birthDate = data.birthDate
      }

      if (Object.keys(updatedFields).length > 0) {
        const queryText =
          'UPDATE "Patient" SET ' +
          Object.keys(updatedFields)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(', ') +
          ' WHERE id = $' +
          (Object.keys(updatedFields).length + 1)

        const queryValues = [...Object.values(updatedFields), id]

        const res = await query(queryText, queryValues)
        console.log('Paciente atualizado com sucesso!')
        return res.rows[0]
      } else {
        console.log('Nenhuma alteração detectada.')
        throw new Error('Nenhuma alteração detectada.')
      }
    } catch (err) {
      console.error('Erro ao atualizar Paciente:', err)
      throw err
    }
  }

  async delete(id: string): Promise<Patient> {
    try {
      const res = await query(
        'DELETE FROM "Patient" WHERE id = $1 RETURNING *',
        [id],
      )
      if (res.rowCount === 0) {
        throw new Error('Patient not found')
      }
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao deletar paciente:', err)
      throw err
    }
  }
}
