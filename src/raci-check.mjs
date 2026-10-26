#!/usr/bin/env node
/* Contrôle une matrice RACI : une et une seule autorité (A) par tâche, au moins un exécutant (R). */
import { readFileSync } from 'node:fs'
import { parseCsv } from '../lib/csv.mjs'
import { isMain, parseArgs, usage, fail } from '../lib/cli.mjs'

/** Première colonne = tâche ; les autres = rôles/personnes avec R, A, C ou I. */
export function checkRaci(headers, records) {
  const taskCol = headers[0]
  const roles = headers.slice(1)
  const problems = []
  const charge = Object.fromEntries(roles.map((r) => [r, 0]))
  for (const rec of records) {
    const cells = roles.map((r) => [r, rec[r].trim().toUpperCase()])
    const bad = cells.filter(([, v]) => v && !/^[RACI]+$/.test(v))
    for (const [r, v] of bad) problems.push({ tache: rec[taskCol], niveau: 'erreur', message: `valeur « ${v} » invalide pour ${r} (attendu : R, A, C, I).` })
    const has = (letter) => cells.filter(([, v]) => v.includes(letter)).map(([r]) => r)
    const A = has('A')
    if (A.length === 0) problems.push({ tache: rec[taskCol], niveau: 'erreur', message: 'aucune autorité (A) — personne ne répond du résultat.' })
    if (A.length > 1) problems.push({ tache: rec[taskCol], niveau: 'erreur', message: `plusieurs autorités (A) : ${A.join(', ')}.` })
    if (has('R').length === 0) problems.push({ tache: rec[taskCol], niveau: 'erreur', message: 'aucun exécutant (R).' })
    for (const r of has('R')) charge[r]++
  }
  const total = Object.values(charge).reduce((a, b) => a + b, 0)
  for (const [r, n] of Object.entries(charge)) {
    if (records.length >= 4 && total > 0 && n / total > 0.5) {
      problems.push({ tache: '(global)', niveau: 'alerte', message: `${r} porte ${n} tâche(s) sur ${total} en exécution : charge concentrée.` })
    }
  }
  return { problems, charge }
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2), ['help'])
  usage(`
Usage : node src/raci-check.mjs raci.csv
Première colonne : la tâche ; les suivantes : un rôle ou une personne, avec R/A/C/I.
Code de sortie 2 s'il y a au moins une erreur.`, args, 1)
  const { headers, records } = parseCsv(readFileSync(args._[0], 'utf8'))
  if (headers.length < 2) fail('il faut au moins une colonne de tâche et une colonne de rôle.')
  const { problems, charge } = checkRaci(headers, records)
  console.log(`${records.length} tâche(s), ${headers.length - 1} rôle(s). Exécution (R) : ${Object.entries(charge).map(([r, n]) => `${r}=${n}`).join(', ')}`)
  if (!problems.length) console.log('Matrice cohérente.')
  else problems.forEach((p) => console.log(`${p.niveau === 'erreur' ? '✗' : '!'} ${p.tache} : ${p.message}`))
  process.exit(problems.some((p) => p.niveau === 'erreur') ? 2 : 0)
}
