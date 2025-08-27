/* eslint-disable @typescript-eslint/no-explicit-any */
import { Medic } from '@prisma/client'
import { dataCreateSchema, MedicRepository } from '../medic-repository'
import { PLANS, query } from '../../../../db/db'
import { isValidUUID } from '../../../lib/prisma'

interface CreateMedicResult {
  medic: Medic
  plan: any // ou defina um tipo específico para o plano se tiver
}

interface MedicWithPlans {
  id: string
  name: string
  cpf: string
  crm: string
  birthDate: Date
  createAt: Date
  plans: { id: string; name: string }[]
}

export class PrismaMedicRepository implements MedicRepository {
  async create(data: dataCreateSchema): Promise<CreateMedicResult> {
    try {
      const res = await query(
        'INSERT INTO "Medic" (name, cpf, crm, "birthDate") VALUES ($1, $2, $3, $4) RETURNING *',
        [data.name, data.cpf, data.crm, data.birthDate],
      )

      const newMedic = res.rows[0]

      // Cadastrar múltiplos planos
      await Promise.all(
        data.plans.map((planId) =>
          query('INSERT INTO "MedicPlan" (id_medic, id_plan) VALUES ($1, $2)', [
            newMedic.id,
            planId,
          ]),
        ),
      )

      return newMedic
    } catch (err) {
      console.error('Erro ao criar médico:', err)
      throw new Error('Erro ao criar médico')
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Medic[]; total: number }> {
    try {
      const offset = (page - 1) * limit

      const res = await query(
        'SELECT * FROM "Medic" ORDER BY "createAt" DESC LIMIT $1 OFFSET $2',
        [limit, offset],
      )

      const countRes = await query('SELECT COUNT(*) FROM "Medic" ')

      console.log(res.rows)
      return { data: res.rows, total: parseInt(countRes.rows[0].count, limit) }
    } catch (err) {
      console.error('Erro ao buscar médicos:', err)
      return { data: [], total: 0 }
    }
  }

  async findById(id: string): Promise<Medic | null> {
    if (!isValidUUID(id)) {
      console.error('ID inválido')
      return null
    }

    try {
      const res = await query(
        `SELECT 
        m.id, 
        m.name, 
        m.cpf, 
        m.crm, 
        m."birthDate", 
        m."createAt", 
        json_agg(json_build_object('id', p.id, 'name', p.name)) AS plans
        FROM "Medic" m
        LEFT JOIN "MedicPlan" mp ON mp.id_medic = m.id
        LEFT JOIN "PLANS" p ON p.id = mp.id_plan
        WHERE m.id = $1::uuid
        GROUP BY m.id`,
        [id],
      )

      return {
        ...res.rows[0],
      }
    } catch (err) {
      console.error('Erro ao buscar médico:', err)
      return null
    }
  }

  async update(
    id: string,
    data: Partial<dataCreateSchema>,
  ): Promise<MedicWithPlans | null> {
    try {
      const currentMedic = await this.findById(id)
      console.log(currentMedic)
      if (!currentMedic) {
        console.log('Médico não encontrado!')
        return null
      }

      const updatedFields: Partial<dataCreateSchema> = {}

      if (data.name && data.name !== currentMedic.name)
        updatedFields.name = data.name
      if (data.cpf && data.cpf !== currentMedic.cpf)
        updatedFields.cpf = data.cpf
      if (data.crm && data.crm !== currentMedic.crm)
        updatedFields.crm = data.crm
      if (data.birthDate && data.birthDate !== currentMedic.birthDate)
        updatedFields.birthDate = data.birthDate

      if (Object.keys(updatedFields).length > 0) {
        const queryText =
          'UPDATE "Medic" SET ' +
          Object.keys(updatedFields)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(', ') +
          ' WHERE id = $' +
          (Object.keys(updatedFields).length + 1) +
          ' RETURNING *'
        const queryValues = [...Object.values(updatedFields), id]
        await query(queryText, queryValues)
        console.log('Médico atualizado com sucesso!')
      } else {
        console.log('Nenhuma alteração detectada.')
      }

      if (data.plans) {
        // Deletar planos antigos
        await query('DELETE FROM "MedicPlan" WHERE medic_id = $1', [id])

        // Inserir planos novos
        if (data.plans.length > 0) {
          const insertValues = data.plans
            .map((planId, idx) => `($1, $${idx + 2})`)
            .join(', ')
          await query(
            `INSERT INTO "MedicPlan" (medic_id, plan_id) VALUES ${insertValues}`,
            [id, ...data.plans],
          )
          console.log('Planos atualizados com sucesso!')
        }

        const resMedic = await query('SELECT * FROM "Medic" WHERE id = $1', [
          id,
        ])
        const resPlans = await query(
          'SELECT p.id, p.name FROM "PLANS" p JOIN "MedicPlan" mp ON mp.plan_id = p.id WHERE mp.medic_id = $1',
          [id],
        )

        const medicWithPlans: MedicWithPlans = {
          ...resMedic.rows[0],
          plans: resPlans.rows,
        }

        return medicWithPlans
      }
    } catch (err) {
      console.error('Erro ao atualizar médico:', err)
      return null
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
    olderThan50?: boolean,
  ): Promise<Medic[]> {
    try {
      let baseQuery = 'SELECT * FROM "Medic" '
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

      if (olderThan50) {
        conditions.push(
          `DATE_PART('year', AGE(current_date, "birthDate")) >= 50`,
        )
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

  async filterMedicByPlan(id?: string): Promise<PLANS[]> {
    try {
      const res = await query(
        ` SELECT "PLANS" FROM "PLANS" JOIN "MedicPlan" ON "MedicPlan"."id_plan" = "PLANS"."id"
        WHERE "MedicPlan"."id_medic" = $1`,
        [id],
      )

      return res.rows
    } catch (err) {
      console.error('Erro ao buscar Médico', err)
      return []
    }
  }
}
