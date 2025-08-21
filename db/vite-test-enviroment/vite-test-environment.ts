import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a Database_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    // criar banco de teste

    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    console.log(databaseUrl)

    process.env.DATABASE_URL = generateDatabaseUrl(schema)

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // apagar banco de testes
        await db.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
