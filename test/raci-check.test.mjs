import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseCsv, toDate } from '../lib/csv.mjs'

const sample = (n) => readFileSync(new URL(`../samples/${n}`, import.meta.url), 'utf8')
const mod = (n) => import(`../src/${n}.mjs`)

test('08 RACI : une seule autorité, au moins un exécutant', async () => {
  const { checkRaci } = await mod('raci-check')
  const { headers, records } = parseCsv(sample('raci.csv'))
  const { problems } = checkRaci(headers, records)
  const msgs = problems.map((p) => `${p.tache}: ${p.message}`)
  assert.ok(msgs.some((m) => m.startsWith('Mise en production') && m.includes('plusieurs autorités')))
  assert.ok(msgs.some((m) => m.startsWith('Formation') && m.includes('aucune autorité')))
  assert.ok(!msgs.some((m) => m.startsWith('Cadrage')))
})
