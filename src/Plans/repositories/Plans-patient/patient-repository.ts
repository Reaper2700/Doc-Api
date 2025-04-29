import { PLANS, query } from '../../../../db/db'
import { isValidUUID } from '../../../lib/prisma'
import { PlansRepositorySchema, PlansSchema } from '../plans-repository'

export class PlansRepository implements PlansRepositorySchema {
  async create(data: PlansSchema): Promise<PLANS> {
    try {
      const res = await query(
        'INSERT INTO "PLANS" (name, varbase) VALUES($1, $2) RETURNING *',
        [data.name, data.varbase],
      )
      console.log(res.rows[0])
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao criar Plano:', err)
      throw new Error('Erro ao criar Plano')
    }
  }

  async findAll(): Promise<PLANS[]> {
    try {
      const res = await query('SELECT * FROM "PLANS"')
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.error('Erro ao buscar Planos:', err)
      return []
    }
  }

  async findById(id: string): Promise<PLANS | null> {
    if (!isValidUUID(id)) {
      console.error('ID inválido')
      return null
    }
    try {
      const res = await query(
        'SELECT (id, name, varbase,"createAt") FROM "PLANS" WHERE id = $1::uuid LIMIT 1',
        [id],
      )
      return res.rows.length > 0 ? res.rows[0] : null
    } catch (err) {
      console.error('Erro ao buscar Plano:', err)
      return null
    }
  }

  async update(id: string, data: Partial<PlansSchema>): Promise<PLANS> {
    try {
      const currentMedic = await this.findById(id)

      if (!currentMedic) {
        console.log('Plano não encontrado!')
        throw new Error('Plano não encontrado!')
      }

      const updatedFields: Partial<PlansSchema> = {}

      if (data.name && data.name !== currentMedic.name) {
        updatedFields.name = data.name
      }

      if (Object.keys(updatedFields).length > 0) {
        const queryText =
          'UPDATE "PLANS" SET ' +
          Object.keys(updatedFields)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(', ') +
          ' WHERE id = $' +
          (Object.keys(updatedFields).length + 1)

        const queryValues = [...Object.values(updatedFields), id]

        const res = await query(queryText, queryValues)
        console.log('Plano atualizado com sucesso!')
        return res.rows[0]
      } else {
        console.log('Nenhuma alteração detectada.')
        throw new Error('Nenhuma alteração detectada.')
      }
    } catch (err) {
      console.error('Erro ao atualizar Plano:', err)
      throw err
    }
  }

  async delete(id: string): Promise<PLANS> {
    try {
      const res = await query('DELETE FROM "PLANS" WHERE id = $1 RETURNING *', [
        id,
      ])
      if (res.rowCount === 0) {
        throw new Error('Plano not found')
      }
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao deletar paciente:', err)
      throw err
    }
  }
}
