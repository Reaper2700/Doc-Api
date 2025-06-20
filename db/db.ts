import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // user, host, database, password, port
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}

export interface PLANS {
  varbase: number
  id: string
  name: string
  varBase: string
  createAt: Date
}

export interface Consultation {
  id: string
  consultation_date: Date
  medic_id: string
  patient_id: string
  notes: Text
}
