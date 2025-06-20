/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { registerConsultation } from './controllers/registerConsultation'
import { ListConsultation } from './controllers/listConsultation'
import { DeleteConsultation } from './controllers/deleteConsultation'
import { UpdateConsultation } from './controllers/updateConsultation'
import { FilterConsultation } from './controllers/filterConsultation'
import { exportToExcel } from './exportToExcel'
import { query } from '../../db/db'
import ExcelJS from 'exceljs'

export async function appRoutesConsultation(app: FastifyInstance) {
  app.post('/consultation', registerConsultation)
  app.get('/consultation', ListConsultation)
  app.delete('/consultation/:id', DeleteConsultation)
  app.patch('/consultation/:id', UpdateConsultation)

  app.get('/consultation/filter', FilterConsultation)

  app.get('/consultation/export', async (req, res) => {
    try {
      await exportToExcel(res)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      res.status(500).send('Erro interno ao exportar os dados')
    }
  })

  app.post('/consultation/import', async (req, res) => {
    const file = await req.file()

    if (!file) {
      return res.status(400).send({ error: 'Arquivo não enviado' })
    }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.read(file.file) // `file.file` é o stream

    const worksheet = workbook.getWorksheet(1) // primeira aba

    type Consultation = {
      consultation_data: Date | string
      medic_id: string
      patient_id: string
      notes: string
    }

    const rows: Consultation[] = []

    if (!worksheet) {
      return res
        .status(400)
        .send({ error: 'Planilha inválida ou sem aba de dados' })
    }

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return // pula o cabeçalho
      const values = row.values as any[]
      const [, consultation_data, medic_id, patient_id, notes] = values
      rows.push({ consultation_data, medic_id, patient_id, notes })
    })

    // Exemplo: inserção básica na tabela "PLANS"
    for (const row of rows) {
      await query(
        'INSERT INTO "Consultation" ("consultation_data", "medic_id",  "patient_id", notes) VALUES ($1, $2, $3, $4)',
        [row.consultation_data, row.medic_id, row.patient_id, row.notes],
      )
    }

    res.send({ message: 'Importação concluída com sucesso' })
  })
}
