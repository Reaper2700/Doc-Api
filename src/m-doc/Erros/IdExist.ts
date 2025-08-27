import { query } from '../../../db/db'

export async function IdExistMedic(id: string): Promise<boolean> {
  try {
    const res = await query('SELECT * FROM "Medic" WHERE id = $1 LIMIT 1', [id])
    return res.rows.length > 0
  } catch (err) {
    console.error('Erro ao verificar existência de médico:', err)
    return false
  }
}
