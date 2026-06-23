import { neon } from '@neondatabase/serverless'

async function getSQL() {
  const sql = neon(process.env.POSTGRES_URL)
  await sql`
    CREATE TABLE IF NOT EXISTS fornecedores (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  return sql
}

export default async function handler(req, res) {
  try {
    const sql = await getSQL()

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM fornecedores ORDER BY created_at ASC`
      return res.status(200).json(rows.map(r => r.data))
    }

    if (req.method === 'POST') {
      const forn = req.body
      await sql`INSERT INTO fornecedores (id, data) VALUES (${forn.id}, ${forn})`
      return res.status(201).json(forn)
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      const forn = req.body
      await sql`UPDATE fornecedores SET data = ${forn} WHERE id = ${id}`
      return res.status(200).json(forn)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await sql`DELETE FROM fornecedores WHERE id = ${id}`
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
