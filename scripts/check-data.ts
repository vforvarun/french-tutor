// Sanity checks on all learning content.
import { THEMES, ALL_WORDS } from '../src/data/vocab'
import { GRAMMAR } from '../src/data/grammar'
import { VERBS } from '../src/data/verbs'
import { conjugate, TENSES } from '../src/lib/conjugate'
import { LISTENING } from '../src/data/listening'
import { READING } from '../src/data/reading'
import { SOUNDS } from '../src/data/sounds'
import { PLACEMENT } from '../src/data/placement'
import { WRITING } from '../src/data/exam'
import { analyseWriting } from '../src/pages/Exam'
let problems = 0
const bad = (m: string) => { problems++; console.log('✗', m) }
const ids = new Map<string, string>()
for (const t of THEMES) {
  for (const w of t.words) {
    if (!w.fr || !w.en) bad(`empty field in ${t.id}: ${JSON.stringify(w)}`)
    if (ids.has(w.id)) bad(`duplicate word "${w.id}" in ${t.id} and ${ids.get(w.id)}`)
    ids.set(w.id, t.id)
    if (/^l'/i.test(w.fr) && !w.gender && !w.fr.includes(' / ')) bad(`l' word without gender: ${w.fr}`)
  }
  for (const p of t.phrases) if (!p.en) bad(`phrase missing en: ${p.fr}`)
}
for (const g of GRAMMAR) for (const d of g.drills) {
  if (d.kind === 'mcq' && new Set(d.options).size !== d.options.length) bad(`dup options in ${g.id}: ${d.prompt}`)
  if (d.kind === 'type' && !d.answers.length) bad(`no answers ${g.id}`)
}
for (const v of VERBS) for (const t of TENSES) for (let p = 0; p < 8; p++) {
  const c = conjugate(v, t.id, p)
  if (!c.display || c.display.includes('undefined')) bad(`conj ${v.inf} ${t.id} ${p}: ${c.display}`)
}
for (const q of [...LISTENING.flatMap(l => l.questions), ...READING.flatMap(r => r.questions), ...PLACEMENT])
  if (q.kind === 'mcq' && new Set(q.options).size !== q.options.length) bad(`dup options: ${q.prompt}`)
for (const s of SOUNDS) if (!s.examples.length) bad(`sound ${s.id} no examples`)
for (const w of WRITING) { const a = analyseWriting(w.model); if (a.score < 5) bad(`model ${w.id} only scores ${a.score}: ${a.checks.filter(c=>!c.ok).map(c=>c.label)}`) }
console.log(`${THEMES.length} themes, ${ALL_WORDS.length} words, ${THEMES.reduce((a,t)=>a+t.phrases.length,0)} phrases, ${GRAMMAR.length} grammar topics (${GRAMMAR.reduce((a,g)=>a+g.drills.length,0)} drills), ${VERBS.length} verbs, ${LISTENING.length} listening, ${READING.length} reading, ${SOUNDS.length} sound lessons, ${WRITING.length} writing tasks`)
console.log(problems ? `${problems} problem(s)` : 'All content checks passed ✓')
