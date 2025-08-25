/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { randomUUID } from 'crypto'
import { Consultation, query } from '../../../../db/db'
import {
  ConsultationRepository,
  dataCreateSchema,
} from '../consultation-repository'

export class DBConsultationRepository implements ConsultationRepository {
  async create(data: dataCreateSchema): Promise<Consultation> {
    try {
      data.id = randomUUID()
      const res = await query(
        'INSERT INTO "Consultation" (id, consultation_data, medic_id, patient_id, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          data.id,
          data.consultation_data,
          data.medic_id,
          data.patient_id,
          data.notes,
        ],
      )
      console.log(res.rows)
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao criar agendamento:', err)
      throw new Error('Erro ao criar agendamento')
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Consultation[]; total: number }> {
    try {
      const offset = (page - 1) * limit

      const res = await query(
        `
      SELECT 
        c.id,
        c.consultation_data,
        c.notes,
        m.id AS medic_id,
        m.name AS medic_name,
        p.id AS patient_id,
        p.name AS patient_name
      FROM "Consultation" c
      JOIN "Medic" m ON c.medic_id = m.id
      JOIN "Patient" p ON c.patient_id = p.id
      ORDER BY c.consultation_data DESC
      LIMIT $1 OFFSET $2
      `,
        [limit, offset],
      )

      const resCount = await query('SELECT COUNT(*) FROM "Consultation" ')

      console.log(res.rows)
      return { data: res.rows, total: parseInt(resCount.rows[0].count, limit) }
    } catch (err) {
      console.error('Erro ao requisitar tabela agendamento:', err)
      return { data: [], total: 0 }
    }
  }

  async findById(id: string): Promise<Consultation | null> {
    try {
      const res = await query(
        'SELECT * FROM "Consultation" WHERE id = $1 ::uuid LIMIT 1',
        [id],
      )
      return res.rows.length > 0 ? res.rows[0] : null
    } catch (err) {
      console.error('Erro ao buscar consulta:', err)
      return null
    }
  }

  async update(
    id: string,
    data: Partial<dataCreateSchema>,
  ): Promise<Consultation> {
    try {
      const currentConsultation = await this.findById(id)

      if (!currentConsultation) {
        console.log('Consulta não encontrado!')
        throw new Error('Consulta não encontrado!')
      }

      const updatedFields: Partial<dataCreateSchema> = {}

      if (
        data.consultation_data &&
        data.consultation_data !== currentConsultation.consultation_data
      ) {
        updatedFields.consultation_data = data.consultation_data
      }
      if (data.medic_id && data.medic_id !== currentConsultation.medic_id) {
        updatedFields.medic_id = data.medic_id
      }
      if (
        data.patient_id &&
        data.patient_id !== currentConsultation.patient_id
      ) {
        updatedFields.patient_id = data.patient_id
      }
      if (data.notes && data.notes !== currentConsultation.notes) {
        updatedFields.notes = data.notes
      }

      if (Object.keys(updatedFields).length > 0) {
        const queryText =
          'UPDATE "Consultation" SET ' +
          Object.keys(updatedFields)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(', ') +
          ' WHERE id = $' +
          (Object.keys(updatedFields).length + 1)

        const queryValues = [...Object.values(updatedFields), id]

        const res = await query(queryText, queryValues)
        console.log('Consulta atualizado com sucesso!')
        return res.rows[0]
      } else {
        console.log('Nenhuma alteração detectada.')
        throw new Error('Nenhuma alteração detectada.')
      }
    } catch (err) {
      console.error('Erro ao atualizar a consulta:', err)
      throw err
    }
  }

  async delete(id: string): Promise<Consultation> {
    try {
      const res = await query(
        'DELETE FROM "Consultation" WHERE id = $1 RETURNING *',
        [id],
      )
      if (res.rowCount === 0) {
        throw new Error('consulta not found')
      }
      return res.rows[0]
    } catch (err) {
      console.error('Erro ao deletar consulta:', err)
      throw err
    }
  }

  async filterConsultation(
    consultation_data?: Date | string,
    medic_id?: string,
  ): Promise<Consultation[]> {
    try {
      let baseQuery = 'SELECT * FROM "Consultation"'
      const conditions: string[] = []
      const values: any[] = []

      if (consultation_data !== undefined) {
        values.push(consultation_data)
        conditions.push(`consultation_data = $${values.length}`)
      }

      if (medic_id !== undefined) {
        values.push(medic_id)
        conditions.push(`"medic_id" = $${values.length}`)
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
