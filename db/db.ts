import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Ou, se preferir:
  // user, host, database, password, port
})

// Exemplo de função genérica para fazer query:
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
  id: string
  name: string
  varBase: string
  createAt: Date
}
