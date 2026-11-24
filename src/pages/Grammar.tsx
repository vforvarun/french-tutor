import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Printer, Dumbbell, Lightbulb, Table2, Search } from 'lucide-react'
import { GRAMMAR, grammarById } from '../data/grammar'
import { VERBS, verbByInf, type Verb } from '../data/verbs'
import { conjugate, table, TENSES, PERSONS, type Tense } from '../lib/conjugate'
import { useStore } from '../lib/store'
import { pick, shuffle, clean, stripAccents } from '../lib/text'
import type { Q } from '../lib/quiz'
import { Page, PageHeader, Card, Button, Ring, Rich, LevelPill } from '../components/ui'
import { SpeakButton } from '../components/audio'
import { speak } from '../lib/speech'
import { QuizRunner } from '../components/QuizRunner'

export function GrammarHome() {
  const grammar = useStore((s) => s.grammar)
  const level = useStore((s) => s.profile.level)
  return (
    <Page>
      <PageHeader title="Grammaire" subtitle="Short, clear lessons — then practise until it clicks" emoji="🧩" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/verbs" className="lift relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-soleil to-[#ff9f43] p-5 text-ink shadow-md">
          <div className="absolute -right-4 -bottom-6 text-8xl opacity-25">🏋️</div>
          <Dumbbell size={28} />
          <div className="mt-2 font-display text-2xl font-extrabold">Verb Gym</div>
          <div className="font-bold text-ink/70">Conjugation workouts in every tense</div>
        </Link>
        <Link to="/verbs/tables" className="lift relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-menthe to-[#169e8a] p-5 text-white shadow-md">
          <div className="absolute -right-4 -bottom-6 text-8xl opacity-20">📋</div>
          <Table2 size={28} />
          <div className="mt-2 font-display text-2xl font-extrabold">Verb tables</div>
          <div className="font-bold text-white/80">{VERBS.length} verbs, all tenses, with audio</div>
        </Link>
      </div>

      {[9, 10].map((lvl) => (
        <section key={lvl} className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-2xl font-extrabold">Year {lvl}</h2>
            {lvl > level && <span className="rounded-full bg-lavande-soft px-2.5 py-0.5 text-xs font-extrabold text-[#5b3cc4]">coming up next</span>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GRAMMAR.filter((g) => g.level === lvl).map((g, k) => {
              const best = grammar[g.id]?.best
              return (
                <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.02 }}>
                  <Link to={`/grammar/${g.id}`} className="card lift flex items-center gap-3 p-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream text-2xl">{g.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold leading-tight">{g.title}</div>
                      <div className="text-sm font-semibold text-ink-soft">{g.en}</div>
                    </div>
                    <Ring value={(best ?? 0) / 100} size={44} stroke={5} color={best === undefined ? '#ddd' : best >= 80 ? '#22b59a' : '#ffb020'}>
                      <span className="text-[11px] font-extrabold">{best === undefined ? '–' : best}</span>
                    </Ring>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>
      ))}
    </Page>
  )
}

/** Renders the lesson mini-markup. */
function LessonBody({ body }: { body: string }) {
  const lines = body.split('\n')
  const out: ReactNode[] = []
  let k = 0
  while (k < lines.length) {
    const line = lines[k]
    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (k < lines.length && lines[k].startsWith('|')) {
        rows.push(lines[k].split('|').slice(1, -1).map((c) => c.trim()))
        k++
      }
      out.push(
        <div key={k} className="my-4 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-left text-[0.95rem]">
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? 'bg-cream/60' : 'bg-white'}>
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-3 py-2 ${ci === 0 ? 'font-extrabold text-ink-soft' : 'font-semibold'}`}>
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }
    if (line.startsWith('= ')) {
      const ex: [string, string][] = []
      while (k < lines.length && lines[k].startsWith('= ')) {
        const [fr, en] = lines[k].slice(2).split(' = ')
        ex.push([fr, en])
        k++
      }
      out.push(
        <div key={k} className="my-3 space-y-2">
          {ex.map(([fr, en], i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-bleu-soft/50 px-3 py-2">
              <SpeakButton text={fr.replace(/\*\*/g, '')} size="sm" />
              <div>
                <div className="font-extrabold">
                  <Rich text={fr} />
                </div>
                <div className="text-sm font-semibold text-ink-soft">{en}</div>
              </div>
            </div>
          ))}
        </div>,
      )
      continue
    }
    if (line.startsWith('> ')) {
      out.push(
        <div key={k} className="my-3 flex gap-3 rounded-2xl bg-soleil-soft p-4">
          <Lightbulb className="shrink-0 text-[#c98a00]" size={20} />
          <div className="font-semibold text-[#6b4a00]">
            <Rich text={line.slice(2)} />
          </div>
        </div>,
      )
      k++
      continue
    }
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (k < lines.length && lines[k].startsWith('- ')) items.push(lines[k++].slice(2))
      out.push(
        <ul key={k} className="my-3 list-disc space-y-1 pl-6 font-semibold">
          {items.map((it, i) => (
            <li key={i}>
              <Rich text={it} />
            </li>
          ))}
        </ul>,
      )
      continue
    }
    if (line.trim()) {
      out.push(
        <p key={k} className="font-semibold">
          <Rich text={line} />
        </p>,
      )
    }
    k++
  }
  return <div className="prose-lesson text-[1.02rem]">{out}</div>
}

export function GrammarLesson() {
  const { id } = useParams()
  const g = grammarById(id!)
  const best = useStore((s) => (id ? s.grammar[id]?.best : undefined))
  if (!g) return null
  const idx = GRAMMAR.indexOf(g)
  const nextG = GRAMMAR[idx + 1]
  return (
    <Page>
      <PageHeader title={g.title} subtitle={g.en} emoji={g.emoji} back="/grammar" right={<LevelPill level={g.level} />} />
      <div className="grid gap-5 lg:grid-cols-[1fr_17rem]">
        <Card className="p-5 sm:p-7">
          <LessonBody body={g.body} />
        </Card>
        <div className="no-print space-y-3 lg:sticky lg:top-5 lg:self-start">
          <Card className="p-5 text-center">
            <Ring value={(best ?? 0) / 100} size={96} color={best !== undefined && best >= 80 ? '#22b59a' : '#3b4cca'}>
              <div>
                <div className="font-display text-2xl font-extrabold">{best ?? '–'}</div>
                <div className="text-[10px] font-bold text-ink-soft">best %</div>
              </div>
            </Ring>
            <Link to={`/grammar/${g.id}/practice`} className="mt-4 block">
              <Button className="w-full">
                <Dumbbell size={18} /> Practise ({g.drills.length})
              </Button>
            </Link>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => window.print()}>
              <Printer size={18} /> Print cheat sheet
            </Button>
          </Card>
          {nextG && (
            <Link to={`/grammar/${nextG.id}`} className="card lift block p-4">
              <div className="text-xs font-extrabold uppercase text-ink-soft">Next topic</div>
              <div className="font-extrabold">
                {nextG.emoji} {nextG.title}
              </div>
            </Link>
          )}
        </div>
      </div>
    </Page>
  )
}

export function GrammarPractice() {
  const { id } = useParams()
  const nav = useNavigate()
  const g = grammarById(id!)
  const { saveGrammar, completeTask, addXp } = useStore()
  const qs = useMemo(() => shuffle(g?.drills ?? []), [g])
  if (!g) return null
  return (
    <Page>
      <div className="mb-4 text-center">
        <div className="text-sm font-extrabold uppercase tracking-wider text-bleu">
          {g.emoji} {g.title}
        </div>
      </div>
      <QuizRunner
        questions={qs}
        xpPerRight={3}
        onExit={() => nav(`/grammar/${g.id}`)}
        doneLabel="Back to lesson"
        onFinish={(_, pct) => {
          saveGrammar(g.id, pct)
          completeTask('grammar')
          addXp(10)
        }}
      />
    </Page>
  )
}

const SETS: { id: string; label: string; filter: (v: Verb) => boolean }[] = [
  { id: 'all', label: 'All verbs', filter: () => true },
  { id: 'regular', label: 'Regular -er/-ir/-re', filter: (v) => v.kind !== 'irr' && !v.present && !v.refl },
  { id: 'irregular', label: 'Irregular', filter: (v) => v.kind === 'irr' },
  { id: 'etre', label: 'Être verbs', filter: (v) => !!v.etre && !v.refl },
  { id: 'refl', label: 'Reflexive', filter: (v) => !!v.refl },
]

function stripSubject(s: string): string {
  return s.replace(/^(je |j'|tu |il |elle |nous |vous |ils |elles )/, '')
}

export function VerbGym() {
  const level = useStore((s) => s.profile.level)
  const { addXp } = useStore()
  const [tenses, setTenses] = useState<Tense[]>(level >= 10 ? ['present', 'passe', 'imparfait'] : ['present', 'passe'])
  const [setId, setSetId] = useState('all')
  const [qs, setQs] = useState<Q[] | null>(null)

  const start = () => {
    const pool = VERBS.filter(SETS.find((s) => s.id === setId)!.filter).filter((v) => v.level <= Math.max(level, 9))
    const items: Q[] = []
    for (let n = 0; n < 12; n++) {
      const v = pick(pool, 1)[0]
      const t = pick(tenses, 1)[0]
      const p = Math.floor(Math.random() * 8)
      const c = conjugate(v, t, p)
      const answers = [...c.answers, ...c.answers.map(stripSubject)]
      items.push({
        kind: 'type',
        hint: TENSES.find((x) => x.id === t)!.label,
        prompt: `${PERSONS[p]} · ${v.inf}`,
        answers,
        explain: `${c.display}  (${v.en})`,
        tag: 'verb:' + t,
      })
    }
    setQs(items)
  }

  if (qs) {
    return (
      <Page>
        <div className="mb-3 text-center text-sm font-bold text-ink-soft">Type the verb form — with or without the pronoun.</div>
        <QuizRunner questions={qs} xpPerRight={3} onExit={() => setQs(null)} doneLabel="Back to the gym" onFinish={() => addXp(5)} />
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader title="Verb Gym" subtitle="Pick your tenses, pick your verbs, go!" emoji="🏋️" back="/grammar" />
      <Card className="p-6">
        <div className="font-extrabold">1 · Tenses</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TENSES.map((t) => {
            const on = tenses.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => setTenses(on ? tenses.filter((x) => x !== t.id) : [...tenses, t.id])}
                className={`rounded-2xl border-2 px-4 py-2 text-left transition ${on ? 'border-bleu bg-bleu text-white' : 'border-line bg-white'}`}
              >
                <div className="font-extrabold">{t.label}</div>
                <div className={`text-xs font-semibold ${on ? 'text-white/80' : 'text-ink-soft'}`}>
                  {t.en} · Y{t.level}
                </div>
              </button>
            )
          })}
        </div>
        <div className="mt-6 font-extrabold">2 · Verbs</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SETS.map((s) => (
            <button key={s.id} onClick={() => setSetId(s.id)} className={`rounded-full border-2 px-4 py-2 font-extrabold transition ${setId === s.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink'}`}>
              {s.label}
            </button>
          ))}
        </div>
        <Button className="mt-7 w-full text-lg" disabled={!tenses.length} onClick={start}>
          Start workout · 12 verbs 💪
        </Button>
      </Card>
      <Card className="mt-4 p-5">
        <div className="flex items-center gap-2 font-extrabold">
          <Lightbulb size={18} className="text-soleil" /> Coach’s tip
        </div>
        <p className="mt-1 font-semibold text-ink-soft">Say each answer out loud as you type it. Mixing tenses (e.g. présent + passé composé) is great exam practice because you have to think about which one you need.</p>
      </Card>
    </Page>
  )
}

export function VerbTables() {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState('être')
  const v = verbByInf(sel)!
  const matches = VERBS.filter((x) => !q || stripAccents(clean(x.inf + ' ' + x.en)).includes(stripAccents(clean(q))))
  return (
    <Page>
      <PageHeader title="Verb tables" subtitle="Tap any form to hear it" emoji="📋" back="/grammar" />
      <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
        <div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3.5 text-ink-soft" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search verbs…" className="w-full rounded-2xl border-2 border-line bg-white py-3 pl-10 pr-3 font-bold outline-none focus:border-bleu" />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:max-h-[65vh] lg:flex-col lg:overflow-y-auto">
            {matches.map((x) => (
              <button key={x.inf} onClick={() => setSel(x.inf)} className={`shrink-0 rounded-2xl px-3 py-2 text-left transition ${sel === x.inf ? 'bg-bleu text-white' : 'bg-white hover:bg-cream'}`}>
                <div className="font-extrabold">{x.inf}</div>
                <div className={`text-xs font-semibold ${sel === x.inf ? 'text-white/80' : 'text-ink-soft'}`}>{x.en}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <Card className="mb-4 flex flex-wrap items-center gap-3 p-5">
            <SpeakButton text={v.inf} />
            <div className="flex-1">
              <div className="font-display text-3xl font-extrabold">{v.inf}</div>
              <div className="font-semibold text-ink-soft">{v.en}</div>
            </div>
            {v.etre && <span className="rounded-full bg-rouge-soft px-3 py-1 text-xs font-extrabold text-[#b0283f]">uses être</span>}
            {v.kind === 'irr' && <span className="rounded-full bg-soleil-soft px-3 py-1 text-xs font-extrabold text-[#9a6700]">irregular</span>}
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            {TENSES.map((t) => (
              <Card key={t.id} className="p-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="font-extrabold">{t.label}</div>
                  <div className="text-xs font-bold text-ink-soft">{t.en}</div>
                </div>
                <div className="space-y-1">
                  {table(v, t.id).map((c) => (
                    <button key={c.display} onClick={() => speak(c.answers[0])} className="block w-full rounded-lg px-2 py-1 text-left font-semibold hover:bg-bleu-soft">
                      {c.display}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}
