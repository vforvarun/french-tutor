import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Square, Trash2, Plus, ChevronDown, CheckCircle2, Circle, Eye, ArrowLeft, ArrowRight, Mic, Timer, ClipboardCheck } from 'lucide-react'
import { WRITING, SPEAKING, TECHNIQUE } from '../data/exam'
import { LISTENING, type ListeningItem } from '../data/listening'
import { READING, type ReadingItem } from '../data/reading'
import { GRAMMAR } from '../data/grammar'
import { ALL_WORDS, THEMES, themeById } from '../data/vocab'
import { useStore, daysUntil, type Assessment } from '../lib/store'
import { buildPractice } from '../lib/vocabQuiz'
import { pick, shuffle, todayKey } from '../lib/text'
import { speak, speakSequence, stopSpeaking } from '../lib/speech'
import { celebrate, sfx } from '../lib/fx'
import type { Q } from '../lib/quiz'
import { Page, PageHeader, Card, Button, LevelPill, Ring, Progress } from '../components/ui'
import { SpeakButton, SayIt, RecordCompare, AudioPair } from '../components/audio'
import { QuizRunner } from '../components/QuizRunner'
import { AccentKeys } from '../components/AccentKeys'

export function ExamHome() {
  const exams = useStore((s) => s.exams)
  const level = useStore((s) => s.profile.level)
  const assessments = useStore((s) => s.assessments)
  const [openTip, setOpenTip] = useState<string | null>(null)
  const next = [...assessments].filter((a) => daysUntil(a.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0]
  const last = exams[exams.length - 1]
  return (
    <Page>
      <PageHeader title="Examens" subtitle="Practise exactly what your assessments test" emoji="🎓" />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink to-[#3a3d7a] p-6 text-white shadow-[var(--shadow-lift)]">
          <div className="absolute -right-6 -top-6 text-[9rem] opacity-10">📝</div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-soleil">Mock exam</div>
          <h2 className="mt-1 text-3xl font-extrabold">Full practice test</h2>
          <p className="mt-2 max-w-md font-semibold text-white/80">Listening, reading, vocabulary and grammar — about 20 minutes. Find your weak spots before the real thing.</p>
          <Link to="/exam/mock" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-soleil px-5 py-3 font-extrabold text-ink shadow-lg lift">
            <Timer size={18} /> Start mock exam
          </Link>
          {last && (
            <div className="mt-4 text-sm font-bold text-white/70">
              Last score: {Math.round((last.score / last.total) * 100)}% on {new Date(last.date).toLocaleDateString('en-AU')}
            </div>
          )}
        </div>
        <Link to="/planner" className="card lift flex flex-col justify-between p-5">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-rouge">Term planner</div>
            {next ? (
              <>
                <div className="mt-2 font-display text-2xl font-extrabold">{next.title}</div>
                <div className="font-semibold text-ink-soft">{new Date(next.date + 'T00:00').toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              </>
            ) : (
              <div className="mt-2 font-semibold text-ink-soft">Add your upcoming French tests and orals so the app can count down and focus your practice.</div>
            )}
          </div>
          <div className="mt-4 flex items-end justify-between">
            {next && (
              <div>
                <span className="font-display text-5xl font-extrabold text-rouge">{daysUntil(next.date)}</span>
                <span className="ml-1 font-bold text-ink-soft">days to go</span>
              </div>
            )}
            <span className="font-extrabold text-bleu">{next ? 'Manage' : 'Add a test'} →</span>
          </div>
        </Link>
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">✍️ Writing practice</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WRITING.map((w) => (
          <Link key={w.id} to={`/exam/write/${w.id}`} className={`card lift flex items-center gap-3 p-4 ${w.level > level ? 'opacity-80' : ''}`}>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lavande-soft text-2xl">{w.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold leading-tight">{w.title}</div>
              <div className="text-xs font-bold text-ink-soft">
                ~{w.words} words · Y{w.level}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">🎤 Speaking (oral) practice</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SPEAKING.map((s) => (
          <Link key={s.id} to={`/exam/speak/${s.id}`} className="card lift flex items-center gap-3 p-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rouge-soft text-2xl">{s.emoji}</div>
            <div>
              <div className="font-extrabold">{s.title}</div>
              <div className="text-xs font-bold text-ink-soft">
                {s.questions.length} questions · Y{s.level}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">🧭 Exam technique</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {TECHNIQUE.map((t) => (
          <Card key={t.title} className="overflow-hidden">
            <button onClick={() => setOpenTip(openTip === t.title ? null : t.title)} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="text-2xl">{t.emoji}</span>
              <span className="flex-1 text-lg font-extrabold">{t.title}</span>
              <ChevronDown className={`transition ${openTip === t.title ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openTip === t.title && (
                <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="space-y-2 px-4 pb-4">
                    {t.tips.map((tip) => (
                      <li key={tip} className="flex gap-2 font-semibold">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-menthe" /> {tip}
                      </li>
                    ))}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </Page>
  )
}

// ---------- Mock exam ----------

type Step =
  | { kind: 'listen'; item: ListeningItem }
  | { kind: 'read'; item: ReadingItem }
  | { kind: 'quiz'; name: string; emoji: string; qs: Q[] }

function MiniPlayer({ item }: { item: ListeningItem }) {
  const [plays, setPlays] = useState(0)
  const [playing, setPlaying] = useState(false)
  const cancel = useRef(false)
  useEffect(
    () => () => {
      cancel.current = true
      stopSpeaking()
    },
    [],
  )
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-menthe-soft p-4">
      <button
        disabled={plays >= 2 && !playing}
        onClick={async () => {
          if (playing) return
          cancel.current = false
          setPlaying(true)
          setPlays((p) => p + 1)
          await speakSequence(
            item.lines.map((l) => ({ text: l.fr, alt: l.s === 'B' })),
            0.9,
            () => cancel.current,
          )
          setPlaying(false)
        }}
        className={`grid h-16 w-16 place-items-center rounded-full bg-menthe text-white shadow-lg disabled:opacity-40 ${playing ? 'mic-live' : ''}`}
      >
        {playing ? <Square size={24} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
      </button>
      <div>
        <div className="font-extrabold">
          {item.emoji} {item.title}
        </div>
        <div className="text-sm font-bold text-ink-soft">You can play this twice ({2 - plays} left) — like the real exam.</div>
      </div>
    </div>
  )
}

export function MockExam() {
  const nav = useNavigate()
  const s = useStore()
  const level = s.profile.level
  const steps = useMemo<Step[]>(() => {
    const ls = pick(LISTENING.filter((l) => l.level <= level), 2)
    const rd = pick(READING.filter((r) => r.level <= level), 1)[0]
    const levelWords = ALL_WORDS.filter((w) => themeById(w.theme)!.level <= level && !w.fr.includes('…'))
    const started = levelWords.filter((w) => s.words[w.id])
    const vocab = buildPractice(pick(started.length >= 10 ? started : levelWords.slice(0, 200), 10), s.words).map((q) => ({ ...q, wordId: undefined }))
    const gram = pick(
      GRAMMAR.filter((g) => g.level <= level).flatMap((g) => g.drills),
      10,
    )
    return [
      { kind: 'listen', item: ls[0] },
      { kind: 'listen', item: ls[1] },
      { kind: 'read', item: rd },
      { kind: 'quiz', name: 'Vocabulary', emoji: '📚', qs: vocab },
      { kind: 'quiz', name: 'Grammar', emoji: '🧩', qs: shuffle(gram) },
    ]
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [k, setK] = useState(-1)
  const [results, setResults] = useState<Record<string, [number, number]>>({})
  const [startTime] = useState(Date.now())
  const [, tick] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => tick((x) => x + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const sectionName = (st: Step) => (st.kind === 'listen' ? 'Listening' : st.kind === 'read' ? 'Reading' : st.name)
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`

  if (k === -1) {
    return (
      <Page>
        <PageHeader title="Mock exam" back="/exam" emoji="📝" />
        <Card className="mx-auto max-w-xl p-7">
          <h2 className="text-2xl font-extrabold">How it works</h2>
          <div className="mt-4 space-y-3">
            {steps.map((st, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-extrabold text-white">{i + 1}</span>
                <span className="font-extrabold">{sectionName(st)}</span>
                <span className="text-sm font-semibold text-ink-soft">
                  {st.kind === 'quiz' ? `${st.qs.length} questions` : st.item.title}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-semibold text-ink-soft">No hints, no transcript. Use headphones for listening. Take a breath — tu peux le faire !</p>
          <Button className="mt-5 w-full" onClick={() => setK(0)}>
            Begin
          </Button>
        </Card>
      </Page>
    )
  }

  if (k >= steps.length) {
    const total = Object.values(results).reduce((a, [r]) => a + r, 0)
    const max = Object.values(results).reduce((a, [, t]) => a + t, 0)
    const pct = max ? total / max : 0
    return (
      <Page>
        <Card className="mx-auto max-w-xl p-8 text-center">
          <div className="text-6xl">{pct >= 0.8 ? '🏆' : pct >= 0.6 ? '🎉' : '💪'}</div>
          <h1 className="mt-2 text-3xl font-extrabold">Mock exam complete!</h1>
          <div className="mt-2 font-bold text-ink-soft">Time: {mmss}</div>
          <div className="mt-5 flex justify-center">
            <Ring value={pct} size={140} stroke={14} color={pct >= 0.7 ? '#22b59a' : pct >= 0.5 ? '#ffb020' : '#ff5d73'}>
              <div>
                <div className="font-display text-4xl font-extrabold">{Math.round(pct * 100)}%</div>
                <div className="text-xs font-bold text-ink-soft">
                  {total}/{max}
                </div>
              </div>
            </Ring>
          </div>
          <div className="mt-6 space-y-3 text-left">
            {Object.entries(results).map(([name, [r, t]]) => (
              <div key={name}>
                <div className="flex justify-between text-sm font-extrabold">
                  <span>{name}</span>
                  <span>
                    {r}/{t}
                  </span>
                </div>
                <Progress value={r / t} color={r / t >= 0.7 ? 'bg-menthe' : r / t >= 0.5 ? 'bg-soleil' : 'bg-rouge'} />
              </div>
            ))}
          </div>
          <p className="mt-5 font-semibold text-ink-soft">
            {(() => {
              const weakest = Object.entries(results).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0]
              return weakest ? `Focus next on: ${weakest[0]}.` : ''
            })()}
          </p>
          <Button className="mt-5 w-full" onClick={() => nav('/exam')}>
            Back to exam prep
          </Button>
        </Card>
      </Page>
    )
  }

  const st = steps[k]
  const done = (res: { ok: boolean }[]) => {
    const name = sectionName(st)
    const right = res.filter((r) => r.ok).length
    const next = { ...results, [name]: [(results[name]?.[0] ?? 0) + right, (results[name]?.[1] ?? 0) + res.length] as [number, number] }
    setResults(next)
    if (k + 1 >= steps.length) {
      const total = Object.values(next).reduce((a, [r]) => a + r, 0)
      const max = Object.values(next).reduce((a, [, t]) => a + t, 0)
      s.saveExam({ date: Date.now(), score: total, total: max, sections: next })
      s.addXp(30)
      if (total / max >= 0.8) celebrate()
      else sfx.done()
    }
    setK(k + 1)
  }

  return (
    <Page>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < k ? 'bg-menthe' : i === k ? 'bg-bleu' : 'bg-black/10'}`} />
          ))}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-extrabold shadow-[var(--shadow-card)]">
          <Timer size={14} /> {mmss}
        </span>
      </div>
      <div className="mb-3 text-center text-sm font-extrabold uppercase tracking-wider text-bleu">
        Section {k + 1} · {sectionName(st)}
      </div>
      {st.kind === 'listen' && (
        <div className="mx-auto mb-4 max-w-2xl">
          <MiniPlayer key={st.item.id} item={st.item} />
        </div>
      )}
      {st.kind === 'read' && (
        <Card className="mx-auto mb-4 max-w-2xl p-5">
          <div className="mb-2 font-extrabold">
            {st.item.emoji} {st.item.title}
          </div>
          <p className="whitespace-pre-line font-semibold leading-relaxed">{st.item.text}</p>
        </Card>
      )}
      <QuizRunner key={k} questions={st.kind === 'quiz' ? st.qs : st.item.questions} showEnd={false} onExit={() => nav('/exam')} onFinish={(res) => done(res)} />
    </Page>
  )
}

// ---------- Writing ----------

// Accent-aware word patterns (JS \w and \b don't understand é, è, à …)
const L = "[a-zà-ÿœ]"
const W = `${L}+`
const B = `(?<!${L})` // word start
const E = `(?!${L})` // word end
const rx = (src: string) => new RegExp(src.replace(/\\B/g, B).replace(/\\E/g, E).replace(/\\W/g, W), 'i')
const has = (t: string, re: RegExp) => re.test(t)

export function analyseWriting(text: string) {
  const t = ' ' + text.toLowerCase().replace(/[’]/g, "'") + ' '
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const CONN = ['et', 'mais', 'cependant', 'donc', 'aussi', 'puis', 'ensuite', 'par contre', 'pourtant', 'alors', 'car', 'parce que', 'par exemple', "d'abord", 'enfin', 'surtout', 'quand', 'après', 'malheureusement']
  const connectives = CONN.filter((c) => rx(`\\B${c}\\E`).test(t))
  const checks = [
    { label: 'Present tense', tip: 'je joue, j’habite…', ok: has(t, rx(`\\B(je|j'|il|elle|on|nous|ils|elles|c'est)\\s?\\W`)) },
    {
      label: 'Past tense (passé composé)',
      tip: 'j’ai mangé, je suis allé(e)',
      ok:
        has(t, rx(`\\B(ai|as|a|avons|avez|ont)\\s+(\\W[éiu]s?|fait|pris|bu|vu|lu|écrit|mis|dû|pu|eu|été|reçu|ouvert|appris|compris)\\E`)) ||
        has(t, rx(`\\B(suis|es|est|sommes|êtes|sont)\\s+(allé|parti|sorti|venu|arrivé|resté|rentré|né|tombé|monté|descendu|entré|devenu|revenu|levé|couché|amusé|réveillé|habillé)e?s?\\E`)),
    },
    { label: 'Future (je vais + infinitive or futur)', tip: 'je vais jouer, j’irai', ok: has(t, rx(`\\B(vais|vas|va|allons|allez|vont)\\s+(me |te |se |nous |vous )?\\W(er|ir|re)\\E`)) || has(t, rx(`\\B\\W(rai|ras|rons|rez|ront)\\E`)) },
    { label: 'Opinion', tip: 'à mon avis, j’adore, je pense que', ok: has(t, rx(`(à mon avis|je pense que|je trouve que|selon moi|j'adore|j'aime|je déteste|je préfère|je n'aime pas|c'était|c'est (génial|nul|super|ennuyeux|intéressant|facile|difficile|amusant))`)) },
    { label: 'Reason', tip: 'parce que, car', ok: has(t, rx(`(parce que|parce qu'|\\Bcar\\E)`)) },
    { label: 'Connectives (3+)', tip: 'cependant, donc, ensuite…', ok: connectives.length >= 3 },
    { label: 'Negative', tip: 'ne … pas / jamais', ok: has(t, rx(`\\B(ne|n')\\s?(\\W\\s)?\\W\\s(pas|jamais|rien|plus|personne)\\E`)) },
    { label: 'Intensifier', tip: 'très, assez, trop, vraiment', ok: has(t, rx(`\\B(très|assez|trop|vraiment|un peu|tellement|beaucoup)\\E`)) },
    { label: '“Wow” phrase', tip: 'si j’avais…, quand j’étais…, depuis', ok: has(t, rx(`(si j'avais|si j'étais|quand j'étais|quand j'avais|depuis|j'aimerais|je voudrais|il faut|on devrait|ce serait|on pourrait|si on)`)) },
  ]
  return { words, checks, connectives, score: checks.filter((c) => c.ok).length }
}

export function WritingPage() {
  const { id } = useParams()
  const task = WRITING.find((w) => w.id === id)
  const { saveWriting, addXp } = useStore()
  const key = 'draft:' + id
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(key) ?? ''
    } catch {
      return ''
    }
  })
  const [ticks, setTicks] = useState<number[]>([])
  const [showModel, setShowModel] = useState(false)
  const [selfCheck, setSelfCheck] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    try {
      localStorage.setItem(key, text)
    } catch {
      /* ignore */
    }
  }, [text, key])
  if (!task) return null
  const a = analyseWriting(text)
  const accuracy = ['Verb endings match the subject', 'Adjectives agree (e / s)', 'Accents are in the right places', 'Nouns have the right le / la', 'Être verbs in the past agree (allée)']

  return (
    <Page>
      <PageHeader title={task.title} subtitle={`Writing task · aim for about ${task.words} words`} emoji={task.emoji} back="/exam" right={<LevelPill level={task.level} />} />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="font-display text-xl font-bold">{task.prompt}</div>
            <div className="mt-3 text-sm font-extrabold text-ink-soft">Include (tick as you go):</div>
            <div className="mt-2 space-y-2">
              {task.bullets.map((b, i) => (
                <button key={b} onClick={() => setTicks(ticks.includes(i) ? ticks.filter((x) => x !== i) : [...ticks, i])} className="flex w-full items-center gap-2 text-left font-semibold">
                  {ticks.includes(i) ? <CheckCircle2 className="shrink-0 text-menthe" size={20} /> : <Circle className="shrink-0 text-line" size={20} />}
                  <span className={ticks.includes(i) ? 'text-ink-soft line-through' : ''}>{b}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <textarea
              ref={ref}
              value={text}
              onChange={(e) => setText(e.target.value)}
              lang="fr"
              spellCheck={false}
              placeholder="Écris ici… (Write here)"
              className="min-h-72 w-full resize-y rounded-2xl border-2 border-line bg-cream/40 p-4 text-[1.05rem] font-semibold leading-relaxed outline-none focus:border-bleu focus:bg-white"
            />
            <div className="mt-3">
              <AccentKeys target={ref} onInsert={setText} />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm font-extrabold">
                <span>
                  {a.words} / {task.words} words
                </span>
                <span className={a.words >= task.words ? 'text-menthe' : 'text-ink-soft'}>{a.words >= task.words ? 'Target reached ✓' : `${task.words - a.words} to go`}</span>
              </div>
              <Progress value={a.words / task.words} color={a.words >= task.words ? 'bg-menthe' : 'bg-bleu'} className="mt-1" />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 font-extrabold">
              <ClipboardCheck size={18} className="text-bleu" /> Check your accuracy before you finish
            </div>
            <div className="mt-2 space-y-2">
              {accuracy.map((c) => (
                <button key={c} onClick={() => setSelfCheck(selfCheck.includes(c) ? selfCheck.filter((x) => x !== c) : [...selfCheck, c])} className="flex w-full items-center gap-2 text-left font-semibold">
                  {selfCheck.includes(c) ? <CheckCircle2 className="shrink-0 text-menthe" size={20} /> : <Circle className="shrink-0 text-line" size={20} />}
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                disabled={a.words < 15 || saved}
                onClick={() => {
                  saveWriting({ date: Date.now(), taskId: task.id, words: a.words, score: a.score })
                  addXp(20)
                  setSaved(true)
                  if (a.score >= 7) celebrate()
                  else sfx.done()
                }}
              >
                {saved ? 'Saved ✓ +20 XP' : 'Finish & save'}
              </Button>
              <Button variant="secondary" onClick={() => setShowModel(!showModel)}>
                <Eye size={18} /> {showModel ? 'Hide' : 'Show'} model answer
              </Button>
            </div>
          </Card>
          <AnimatePresence>
            {showModel && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="border-2 border-menthe/40 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-menthe">Model answer</div>
                    <AudioPair text={task.model} size="sm" />
                  </div>
                  <p className="mt-2 font-semibold leading-relaxed">{task.model}</p>
                  <div className="mt-2 text-xs font-bold text-ink-soft">This scores {analyseWriting(task.model).score}/9 on the checklist. Notice the tenses, opinions and connectives!</div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Ring value={a.score / a.checks.length} size={70} stroke={8} color={a.score >= 7 ? '#22b59a' : a.score >= 4 ? '#ffb020' : '#3b4cca'}>
                <span className="font-display text-lg font-extrabold">
                  {a.score}/{a.checks.length}
                </span>
              </Ring>
              <div>
                <div className="font-extrabold">Range checklist</div>
                <div className="text-xs font-semibold text-ink-soft">Updates as you write. More ticks = higher marks.</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {a.checks.map((c) => (
                <div key={c.label} className="flex gap-2">
                  {c.ok ? <CheckCircle2 className="mt-0.5 shrink-0 text-menthe" size={18} /> : <Circle className="mt-0.5 shrink-0 text-line" size={18} />}
                  <div>
                    <div className={`text-sm font-extrabold ${c.ok ? '' : 'text-ink-soft'}`}>{c.label}</div>
                    {!c.ok && <div className="text-xs font-semibold text-ink-soft">e.g. {c.tip}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="font-extrabold">Useful phrases</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.phrases.map((p) => (
                <button key={p} onClick={() => speak(p.replace(/…/g, ''))} className="rounded-xl bg-bleu-soft px-2.5 py-1 text-left text-sm font-bold text-bleu-deep">
                  {p}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}

// ---------- Speaking ----------

export function SpeakingPage() {
  const { id } = useParams()
  const set = SPEAKING.find((s) => s.id === id)
  const { addXp, completeTask } = useStore()
  const [i, setI] = useState(0)
  const [showEn, setShowEn] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [visited, setVisited] = useState<number[]>([0])
  useEffect(() => {
    setShowModel(false)
    setShowEn(false)
    if (set) speak(set.questions[i].q)
  }, [i, set])
  if (!set) return null
  const q = set.questions[i]
  const go = (n: number) => {
    setI(n)
    if (!visited.includes(n)) {
      setVisited([...visited, n])
      if (visited.length + 1 === set.questions.length) {
        addXp(15)
        completeTask('speak')
      }
    }
  }
  return (
    <Page>
      <PageHeader title={set.title} subtitle="Oral practice · answer out loud in full sentences" emoji={set.emoji} back="/exam" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex gap-1.5">
          {set.questions.map((_, k) => (
            <button key={k} onClick={() => go(k)} className={`h-2.5 flex-1 rounded-full ${k === i ? 'bg-rouge' : visited.includes(k) ? 'bg-rouge/40' : 'bg-black/10'}`} aria-label={`Question ${k + 1}`} />
          ))}
        </div>
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-rouge to-[#ff9a5c] p-6 text-white">
              <div className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                Question {i + 1} of {set.questions.length}
              </div>
              <div className="mt-2 flex items-start gap-3">
                <h2 className="flex-1 text-3xl font-extrabold leading-tight">{q.q}</h2>
                <button onClick={() => speak(q.q)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/25" aria-label="Play question">
                  <Play size={22} fill="white" />
                </button>
              </div>
              <button onClick={() => setShowEn(!showEn)} className="mt-2 text-sm font-bold text-white/85 underline">
                {showEn ? q.en : 'Show English'}
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <div className="mb-2 flex items-center gap-2 font-extrabold">
                  <Mic size={18} className="text-rouge" /> 1. Answer out loud and record yourself
                </div>
                <RecordCompare target={q.model} />
                <p className="mt-2 text-sm font-semibold text-ink-soft">Try to give a detail and a reason (parce que…). Aim for 2–3 sentences.</p>
              </div>
              <div>
                <div className="mb-2 font-extrabold">2. Compare with a model answer</div>
                {!showModel ? (
                  <Button variant="secondary" onClick={() => setShowModel(true)}>
                    <Eye size={18} /> Show model answer
                  </Button>
                ) : (
                  <div className="rounded-2xl bg-menthe-soft p-4">
                    <div className="flex items-start gap-3">
                      <p className="flex-1 text-lg font-bold">{q.model}</p>
                      <SpeakButton text={q.model} size="sm" />
                    </div>
                    <div className="mt-4 border-t border-menthe/30 pt-4">
                      <div className="mb-2 text-sm font-extrabold">3. Say the model answer — check your pronunciation</div>
                      <SayIt target={q.model} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" disabled={i === 0} onClick={() => go(i - 1)}>
            <ArrowLeft size={18} />
          </Button>
          <Button className="flex-1" disabled={i === set.questions.length - 1} onClick={() => go(i + 1)}>
            Next question <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </Page>
  )
}

// ---------- Planner ----------

export function Planner() {
  const { assessments, setAssessments, profile, setProfile } = useStore()
  const [form, setForm] = useState<Omit<Assessment, 'id'>>({ title: '', date: todayKey(), kind: 'Test', notes: '' })
  const sorted = [...assessments].sort((a, b) => a.date.localeCompare(b.date))
  return (
    <Page>
      <PageHeader title="Term planner" subtitle="Add your French assessments — the app counts down and focuses your practice" emoji="🗓️" back="/exam" />
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-3">
          {sorted.length === 0 && <Card className="p-6 text-center font-semibold text-ink-soft">No assessments yet. Add your next test, oral or writing task →</Card>}
          {sorted.map((a) => {
            const d = daysUntil(a.date)
            return (
              <Card key={a.id} className={`flex items-center gap-4 p-4 ${d < 0 ? 'opacity-50' : ''}`}>
                <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-center ${d < 0 ? 'bg-black/5' : d <= 7 ? 'bg-rouge text-white' : 'bg-bleu-soft text-bleu-deep'}`}>
                  <div>
                    <div className="font-display text-2xl font-extrabold leading-none">{d < 0 ? '✓' : d}</div>
                    <div className="text-[10px] font-extrabold">{d < 0 ? 'done' : d === 1 ? 'day' : 'days'}</div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold">{a.title}</div>
                  <div className="text-sm font-semibold text-ink-soft">
                    {a.kind} · {new Date(a.date + 'T00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  {a.notes && <div className="mt-1 text-sm font-semibold">{a.notes}</div>}
                </div>
                <button onClick={() => setAssessments(assessments.filter((x) => x.id !== a.id))} className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-rouge-soft hover:text-rouge" aria-label="Delete">
                  <Trash2 size={18} />
                </button>
              </Card>
            )
          })}

          <Card className="p-5">
            <div className="font-extrabold">Focus themes</div>
            <p className="text-sm font-semibold text-ink-soft">Choose the vocabulary themes you’re studying in class this term. New words will come from these first.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {THEMES.map((t) => {
                const on = profile.focus.includes(t.id)
                return (
                  <button key={t.id} onClick={() => setProfile({ focus: on ? profile.focus.filter((x) => x !== t.id) : [...profile.focus, t.id] })} className={`rounded-full border-2 px-3 py-1.5 text-sm font-extrabold transition ${on ? 'border-bleu bg-bleu text-white' : 'border-line bg-white'}`}>
                    {t.emoji} {t.title}
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
        <Card className="p-5 lg:sticky lg:top-5 lg:self-start">
          <div className="font-extrabold">Add an assessment</div>
          <div className="mt-3 space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Term 4 oral — Ma famille" className="w-full rounded-xl border-2 border-line px-3 py-2.5 font-bold outline-none focus:border-bleu" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border-2 border-line px-3 py-2.5 font-bold outline-none focus:border-bleu" />
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="w-full rounded-xl border-2 border-line bg-white px-3 py-2.5 font-bold outline-none focus:border-bleu">
              {['Test', 'Oral / speaking', 'Writing task', 'Listening', 'Reading', 'Exam', 'Vocab quiz'].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Topics / notes (optional)" className="h-20 w-full rounded-xl border-2 border-line px-3 py-2 font-semibold outline-none focus:border-bleu" />
            <Button
              className="w-full"
              disabled={!form.title.trim()}
              onClick={() => {
                setAssessments([...assessments, { ...form, id: String(Date.now()) }])
                setForm({ title: '', date: todayKey(), kind: 'Test', notes: '' })
              }}
            >
              <Plus size={18} /> Add
            </Button>
          </div>
        </Card>
      </div>
    </Page>
  )
}
