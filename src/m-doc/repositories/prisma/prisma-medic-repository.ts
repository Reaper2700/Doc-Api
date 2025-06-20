import { Medic } from '@prisma/client'
import { dataCreateSchema, MedicRepository } from '../medic-repository'
import { query } from '../../../../db/db'
import { isValidUUID } from '../../../lib/prisma'

export class PrismaMedicRepository implements MedicRepository {
  async create(data: dataCreateSchema): Promise<Medic> {
    try {
      const res = await query(
        'INSERT INTO "Medic" (name, cpf, crm, "birthDate") VALUES ($1, $2, $3, $4) RETURNING *',
        [data.name, data.cpf, data.crm, data.birthDate],
      )
      console.log(res.rows)
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao criar médico:', err)
      throw new Error('Erro ao criar médico')
    }
  }

  async findAll(): Promise<Medic[]> {
    try {
      const res = await query('SELECT * FROM "Medic"')
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.error('Erro ao buscar médicos:', err)
      return []
    }
  }

  async findById(id: string): Promise<Medic | null> {
    if (!isValidUUID(id)) {
      console.error('ID inválido')
      return null
    }

    try {
      const res = await query(
        'SELECT id, name, cpf, crm, "birthDate", "createAt" FROM "Medic" WHERE id = $1::uuid LIMIT 1',
        [id],
      )
      return res.rows.length > 0 ? res.rows[0] : null
    } catch (err) {
      console.error('Erro ao buscar médico:', err)
      return null
    }
  }

  async update(id: string, data: Partial<dataCreateSchema>): Promise<Medic> {
    try {
      const currentMedic = await this.findById(id)

      if (!currentMedic) {
        console.log('Médico não encontrado!')
        throw new Error('Médico não encontrado!')
      }

      const updatedFields: Partial<dataCreateSchema> = {}

      if (data.name && data.name !== currentMedic.name) {
        updatedFields.name = data.name
      }
      if (data.cpf && data.cpf !== currentMedic.cpf) {
        updatedFields.cpf = data.cpf
      }
      if (data.crm && data.crm !== currentMedic.crm) {
        updatedFields.crm = data.crm
      }
      if (data.birthDate && data.birthDate !== currentMedic.birthDate) {
        updatedFields.birthDate = data.birthDate
      }

      if (Object.keys(updatedFields).length > 0) {
        const queryText =
          'UPDATE "Medic" SET ' +
          Object.keys(updatedFields)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(', ') +
          ' WHERE id = $' +
          (Object.keys(updatedFields).length + 1)

        const queryValues = [...Object.values(updatedFields), id]

        const res = await query(queryText, queryValues)
        console.log('Médico atualizado com sucesso!')
        return res.rows[0]
      } else {
        console.log('Nenhuma alteração detectada.')
        throw new Error('Nenhuma alteração detectada.')
      }
    } catch (err) {
      console.error('Erro ao atualizar médico:', err)
      throw err
    }
  }

  async delete(id: string): Promise<Medic> {
    try {
      const res = await query('DELETE FROM "Medic" WHERE id=$1 RETURNING *', [
        id,
      ])
      if (res.rowCount === 0) {
        throw new Error('Medic not found')
      }
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao deletar médico:', err)
      throw err
    }
  }

  async filterMedic(
    name?: string,
    cpf?: string,
    birthDate?: Date | string,
  ): Promise<Medic[]> {
    try {
      let baseQuery = 'SELECT * FROM "Medic"'
      const conditions: string[] = []
      const values: any[] = []

      if (name !== undefined) {
        values.push(`%${name}%`)
        conditions.push(`name ILIKE $${values.length}`)
      }

      if (cpf !== undefined) {
        values.push(cpf)
        conditions.push(`cpf = $${values.length}`)
      }

      if (birthDate !== undefined) {
        values.push(birthDate)
        conditions.push(`"birthDate" = $${values.length}`)
      }

      if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ')
      }

      const res = await query(baseQuery, values)
      return res.rows
    } catch (err) {
      console.error('Erro ao buscar Médico', err)
      return []
    }
  }
}
