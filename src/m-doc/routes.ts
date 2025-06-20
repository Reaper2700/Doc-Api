import { FastifyInstance } from 'fastify'
import { registerMedicUseCase } from './controllers/registerMedic'
import { ListMedic } from './controllers/listMedic'
import { DeleteMedic } from './controllers/deleteMedic'
import { UpdateMedic } from './controllers/updateMedic'
import { FilterMedic } from './controllers/filterMedic'
import { exportToExcel } from './exportToExcel'
import ExcelJS from 'exceljs'
import { query } from '../../db/db'

export async function appRoutesMedic(app: FastifyInstance) {
  app.post('/medic', registerMedicUseCase)
  app.get('/medic', ListMedic)
  app.patch('/medic/:id', UpdateMedic)
  app.delete('/medic/:id', DeleteMedic)

  app.get('/medic/filter:name', FilterMedic)

  app.get('/medic/export', async (req, res) => {
    try {
      await exportToExcel(res)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      res.status(500).send('Erro interno ao exportar os dados')
    }
  })

  app.post('/medic/import', async (req, res) => {
    try {
      const file = await req.file()

      if (!file) {
        return res.status(400).send({ error: 'Arquivo não enviado' })
      }

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.read(file.file) // `file.file` é o stream

      const worksheet = workbook.getWorksheet(1) // primeira aba

      type Medic = {
        name: string
        cpf: string
        crm: string
        birthDate: Date | string
      }

      const rows: Medic[] = []

      if (!worksheet) {
        return res
          .status(400)
          .send({ error: 'Planilha inválida ou sem aba de dados' })
      }

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return // pula o cabeçalho
        const values = row.values as any[]
        const [, name, cpf, crm, birthDate] = values
        rows.push({ name, cpf, crm, birthDate })
      })

      // Exemplo: inserção básica na tabela "PLANS"
      for (const row of rows) {
        const existing = await query('SELECT FROM "Medic" WHERE cpf = $1', [
          row.cpf,
        ])

        if (existing.rowCount === 0) {
          await query(
            'INSERT INTO "Medic" (name, cpf,  "crm", "birthDate") VALUES ($1, $2, $3, $4)',
            [row.name, row.cpf, row.crm, row.birthDate],
          )
        } else {
          console.log(`Medico com CPF ${row.cpf} já existe, ignorando.`)
        }
      }

      res.send({ message: 'Importação concluída com sucesso' })
    } catch (err) {
      console.error(err)
    }
  })
}
