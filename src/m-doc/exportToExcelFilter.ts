import { FastifyReply } from 'fastify'
import ExcelJS from 'exceljs'
import { filterMedicDate } from '../utils/filterMedic'

export async function exportMedicExcel(
  res: FastifyReply,
  query: {
    name?: string
    cpf?: string
    birthDate?: string
    id?: string
    olderThan50?: string
  },
) {
  const { medics } = await filterMedicDate(query)

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Medics')

  if (medics.length > 0) {
    sheet.columns = Object.keys(medics[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }))

    medics.forEach((row) => {
      sheet.addRow(row)
    })
  }

  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  res.header('Content-Disposition', 'attachment; filename=medics.xlsx')

  const buffer = await workbook.xlsx.writeBuffer()
  res.send(buffer)
}
