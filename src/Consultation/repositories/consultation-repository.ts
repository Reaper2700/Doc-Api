import { Consultation } from '../../../db/db'

export interface dataCreateSchema {
  id?: string
  consultation_data: Date | string
  medic_id: string
  patient_id: string
  notes: Text
}

export interface ConsultationRepository {
  create(data: dataCreateSchema): Promise<Consultation>
  findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Consultation[]; total: number }>
  findById(id: string): Promise<Consultation | null>
  update(id: string, data: Partial<dataCreateSchema>): Promise<Consultation>
  delete(id: string): Promise<Consultation>
  notification(): Promise<{ data: Consultation[] }>
  filterConsultation(
    consultation_data?: Date | string,
    medic_id?: string,
  ): Promise<Consultation[]>
}
