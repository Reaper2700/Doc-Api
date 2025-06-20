import ExcelJS from 'exceljs'
import { query } from '../../db/db'

import { FastifyReply } from 'fastify'

export async function exportToExcel(res: FastifyReply) {
  const result = await query('SELECT * FROM "PLANS"')
  const data = result.rows

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Dados')

  if (data.length > 0) {
    sheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }))

    data.forEach((row) => {
      sheet.addRow(row)
    })
  }

  // Configure os headers no res Fastify
  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  res.header('Content-Disposition', 'attachment; filename=dados.xlsx')

  // Use res.raw para passar a stream para ExcelJS
  const buffer = await workbook.xlsx.writeBuffer()
  res.send(buffer) // finalize a resposta
}
