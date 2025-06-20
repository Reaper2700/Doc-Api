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
        'SELECT (id, name, varbase,"createat") FROM "PLANS" WHERE id = $1::uuid LIMIT 1',
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
      const currentPlan = await this.findById(id)

      if (!currentPlan) {
        console.log('Plano não encontrado!')
        throw new Error('Plano não encontrado!')
      }

      const updatedFields: Partial<PlansSchema> = {}

      if (data.name && data.name !== currentPlan.name) {
        updatedFields.name = data.name
      }
      if (
        typeof data.varbase === 'number' &&
        data.varbase !== currentPlan.varbase
      ) {
        updatedFields.varbase = data.varbase
      }

      if (Object.keys(updatedFields).length === 0) {
        console.log('Nenhuma alteração detectada.')
        throw new Error('Nenhuma alteração detectada.')
      }

      const queryText =
        'UPDATE "PLANS" SET ' +
        Object.keys(updatedFields)
          .map((key, index) => `"${key}" = $${index + 1}`)
          .join(', ') +
        ' WHERE id = $' +
        (Object.keys(updatedFields).length + 1) +
        ' RETURNING *'

      const queryValues = [...Object.values(updatedFields), id]

      const res = await query(queryText, queryValues)

      console.log('Plano atualizado com sucesso!')
      return res.rows[0] as PLANS
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

  async varFilter(varbase?: number, name?: string): Promise<PLANS[]> {
    try {
      let baseQuery = 'SELECT * FROM "PLANS"'
      const conditions: string[] = []
      const values: any[] = []

      if (varbase !== undefined) {
        values.push(varbase)
        conditions.push(`varbase <= $${values.length}`)
      }

      if (name !== undefined) {
        values.push(`%${name}%`)
        conditions.push(`name ILIKE $${values.length}`)
      }

      if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ')
      }

      const res = await query(baseQuery, values)
      return res.rows
    } catch (err) {
      console.error('erro ao aplicar filtro', err)
      throw err
    }
  }
}
