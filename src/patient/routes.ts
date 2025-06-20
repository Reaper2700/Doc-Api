/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { list } from './controllers/list'
import { updatePatient } from './controllers/update'

import { register } from './controllers/register'
import { DeletePatient } from './controllers/delete'
import { FilterPatientPlans } from './controllers/filterPatientPlans'
import { exportToExcel } from './exportToExcel'
import { query } from '../../db/db'
import ExcelJS from 'exceljs'

export async function appRoutesPatient(app: FastifyInstance) {
  app.post('/patient', register)
  app.get('/patient', list)
  app.patch('/patient/:id', updatePatient)
  app.delete('/patient/:id', DeletePatient)

  app.get('/patient/filter:health_plan', FilterPatientPlans)

  app.get('/patient/export', async (req, res) => {
    try {
      await exportToExcel(res)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      res.status(500).send('Erro interno ao exportar os dados')
    }
  })

  app.post('/patient/import', async (req, res) => {
    try {
      const file = await req.file()

      if (!file) {
        return res.status(400).send({ error: 'Arquivo não enviado' })
      }

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.read(file.file) // `file.file` é o stream

      const worksheet = workbook.getWorksheet(1) // primeira aba

      type Patient = {
        name: string
        cpf: string
        birthDate: Date | string
        health_plan: string
      }

      const rows: Patient[] = []

      if (!worksheet) {
        return res
          .status(400)
          .send({ error: 'Planilha inválida ou sem aba de dados' })
      }

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return // pula o cabeçalho
        const values = row.values as any[]
        const [, name, cpf, health_plan, birthDate] = values
        rows.push({ name, cpf, health_plan, birthDate })
      })
      console.log('Arquivo recebido:', file.filename)
      // Exemplo: inserção básica na tabela "PLANS"
      for (const row of rows) {
        const existing = await query('SELECT 1 FROM "Patient" WHERE cpf = $1', [
          row.cpf,
        ])

        if (existing.rowCount === 0) {
          await query(
            'INSERT INTO "Patient" (name, cpf, "health_plan", "birthDate") VALUES ($1, $2, $3, $4)',
            [row.name, row.cpf, row.health_plan, row.birthDate],
          )
        } else {
          console.log(`Paciente com CPF ${row.cpf} já existe, ignorando.`)
        }
      }
      console.log('Dados extraídos:', rows)
      res.send({ message: 'Importação concluída com sucesso' })
    } catch (err) {
      console.error('Erro na importação:', err)
      res.status(500).send({ error: 'Erro interno ao importar planilha' })
    }
  })
}
