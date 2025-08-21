import ExcelJS from 'exceljs'
import { FastifyReply } from 'fastify'
import { FilterPlanData } from '../utils/filterPlan'

export async function exportPlanToExcel(
  res: FastifyReply,
  query: { id?: string; name?: string; varbase?: number },
) {
  const { plans } = await FilterPlanData(query)

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('plans')

  if (plans.length > 0) {
    sheet.columns = Object.keys(plans[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }))

    plans.forEach((row) => {
      sheet.addRow(row)
    })
  }

  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  res.header('Content-Disposition', 'attachment; filename=plans.xlsx')

  const buffer = await workbook.xlsx.writeBuffer()
  res.send(buffer)
}
