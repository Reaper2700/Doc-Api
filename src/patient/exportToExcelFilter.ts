import { FastifyReply } from 'fastify'
import ExcelJS from 'exceljs'
import { filterPatientDate } from '../utils/filterPatients'

export async function exportPatientExcel(
  res: FastifyReply,
  query: {
    name?: string
    cpf?: string
    birthDate?: string
    id?: string
    olderThan50?: string
  },
) {
  const { patients } = await filterPatientDate(query)

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('patients')

  if (patients.length > 0) {
    sheet.columns = Object.keys(patients[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }))

    patients.forEach((row) => {
      sheet.addRow(row)
    })
  }

  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  res.header('Content-Disposition', 'attachment; filename=patients.xlsx')

  const buffer = await workbook.xlsx.writeBuffer()
  res.send(buffer)
}
