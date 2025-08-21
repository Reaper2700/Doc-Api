/* eslint-disable camelcase */
import ExcelJS from 'exceljs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getFilterConsultationDat } from '../utils/filterConsultationData'

interface FilterParams {
  consultation_data?: string
  medic_id?: string
}

export async function exportToExcelFilter(
  req: FastifyRequest,
  res: FastifyReply,
  filters?: FilterParams,
) {
  // Use os filtros passados ou, se não houver, extraia da query
  const { consultation_data, medic_id } = filters ?? (req.query as FilterParams)

  // Obtenha dados filtrados
  const { consultations } = await getFilterConsultationDat({
    consultation_data,
    medic_id,
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Consultations')

  if (consultations.length > 0) {
    sheet.columns = Object.keys(consultations[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }))

    consultations.forEach((row) => {
      sheet.addRow(row)
    })
  }

  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  res.header('Content-Disposition', 'attachment; filename=consultations.xlsx')

  const buffer = await workbook.xlsx.writeBuffer()
  res.send(buffer)
}
