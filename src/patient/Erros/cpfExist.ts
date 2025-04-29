import { query } from '../../../db/db'

export async function cpfExisting(cpf: string): Promise<boolean> {
  const sql = `
    SELECT EXISTS (
      SELECT 1 FROM "Patient" WHERE "cpf" = $1
    ) AS "exists";
  `

  const result = await query(sql, [cpf])

  return result.rows[0]?.exists ?? false
}
