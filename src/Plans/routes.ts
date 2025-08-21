import { FastifyInstance } from 'fastify'
import { listPlans } from './controllers/listPlans'
import { registerPlans } from './controllers/registerPlans'
import { DeletePlans } from './controllers/deletePlans'
import { updatePlans } from './controllers/updatePlans'
import { FilterPlans } from './controllers/FilterPlans'
import { exportToExcel } from './exportToExcel'
import { query } from '../../db/db'
import ExcelJS from 'exceljs'
import { exportPlanToExcel } from './exportToExcelFilter'

export async function appRoutesPlans(app: FastifyInstance) {
  app.post('/plans', registerPlans)
  app.get('/plans', listPlans)
  app.patch('/plans/:id', updatePlans)
  app.delete('/plans/:id', DeletePlans)

  app.get('/plans/filter', FilterPlans)

  app.get('/plans/filter/export', async (req, res) => {
    try {
      const query = req.query as Record<string, string>

      // Remove filtros com valores vazios
      const filtered = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value?.trim() !== ''),
      )

      await exportPlanToExcel(res, filtered)
    } catch (error) {
      console.error('Erro ao exportar médicos:', error)
      res.status(500).send('Erro interno ao exportar os médicos')
    }
  })

  app.get('/plans/export', async (req, res) => {
    try {
      await exportToExcel(res)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      res.status(500).send('Erro interno ao exportar os dados')
    }
  })

  app.post('/plans/import', async (req, res) => {
    try {
      const file = await req.file()

      if (!file) {
        return res.status(400).send({ error: 'Arquivo não enviado' })
      }

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.read(file.file) // `file.file` é o stream

      const worksheet = workbook.getWorksheet(1) // primeira aba

      type Plan = {
        name: string
        varbase: number
      }

      const rows: Plan[] = []

      if (!worksheet) {
        return res
          .status(400)
          .send({ error: 'Planilha inválida ou sem aba de dados' })
      }

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return // pula o cabeçalho
        const values = row.values as any[]
        const [, name, varbase] = values
        rows.push({ name, varbase })
      })

      // Exemplo: inserção básica na tabela "PLANS"
      for (const row of rows) {
        const existing = await query('SELECT FROM "PLANS" WHERE name = $1', [
          row.name,
        ])

        if (existing.rowCount === 0) {
          await query('INSERT INTO "PLANS" (name, varbase) VALUES ($1, $2)', [
            row.name,
            row.varbase,
          ])
        } else {
          console.log('Plano já cadastrado', row.name)
        }
      }

      res.send({ message: 'Importação concluída com sucesso' })
    } catch (err) {
      console.error('Erro na importação:', err)
    }
  })
}
