import { neon } from '@neondatabase/serverless'

async function getSQL() {
  const sql = neon(process.env.POSTGRES_URL)
  await sql`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id TEXT PRIMARY KEY,
      fornecedor_id TEXT NOT NULL,
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
      const { fornecedorId } = req.query
      const rows = fornecedorId
        ? await sql`SELECT data FROM avaliacoes WHERE fornecedor_id = ${fornecedorId} ORDER BY created_at ASC`
        : await sql`SELECT data FROM avaliacoes ORDER BY created_at ASC`
      return res.status(200).json(rows.map(r => r.data))
    }

    if (req.method === 'POST') {
      const av = req.body
      await sql`INSERT INTO avaliacoes (id, fornecedor_id, data) VALUES (${av.id}, ${av.fornecedorId}, ${av})`
      return res.status(201).json(av)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await sql`DELETE FROM avaliacoes WHERE id = ${id}`
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
