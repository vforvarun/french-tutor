import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Square, Eye, EyeOff, Languages, Hash, X } from 'lucide-react'
import { LISTENING } from '../data/listening'
import { READING } from '../data/reading'
import { CULTURE } from '../data/culture'
import { useStore } from '../lib/store'
import { speak, speakSequence, stopSpeaking } from '../lib/speech'
import { shuffle } from '../lib/text'
import { sfx } from '../lib/fx'
import type { Q } from '../lib/quiz'
import { Page, PageHeader, Card, Button, LevelPill, Rich } from '../components/ui'
import { SpeakButton } from '../components/audio'
import { QuizRunner } from '../components/QuizRunner'

function ScoreBadge({ v }: { v?: number }) {
  if (v === undefined) return <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-extrabold text-ink-soft">New</span>
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${v >= 80 ? 'bg-menthe-soft text-[#0f7a66]' : 'bg-soleil-soft text-[#9a6700]'}`}>{v}%</span>
}

export function SkillsHome() {
  const scores = useStore((s) => s.scores)
  return (
    <Page>
      <PageHeader title="Écouter & lire" subtitle="Listening and reading — the skills exams test most" emoji="🎧" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/numbers" className="lift relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-bleu to-[#5a6cff] p-5 text-white shadow-md">
          <div className="absolute -right-3 -bottom-6 text-8xl opacity-20">🔢</div>
          <Hash size={26} />
          <div className="mt-2 font-display text-2xl font-extrabold">Number trainer</div>
          <div className="font-bold text-white/80">Numbers, prices and times — exam favourites!</div>
        </Link>
        <Link to="/culture" className="lift relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-rouge to-[#ff9a5c] p-5 text-white shadow-md">
          <div className="absolute -right-3 -bottom-6 text-8xl opacity-20">🗼</div>
          <span className="text-2xl">🌍</span>
          <div className="mt-2 font-display text-2xl font-extrabold">Culture corner</div>
          <div className="font-bold text-white/80">France and the French-speaking world</div>
        </Link>
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">🎧 Listening</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LISTENING.map((l) => (
          <Link key={l.id} to={`/listen/${l.id}`} className="card lift flex items-center gap-3 p-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-menthe-soft text-2xl">{l.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold leading-tight">{l.title}</div>
              <div className="text-xs font-bold text-ink-soft">
                {l.kind} · Y{l.level}
              </div>
            </div>
            <ScoreBadge v={scores['listen:' + l.id]} />
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">📖 Reading</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {READING.map((r) => (
          <Link key={r.id} to={`/read/${r.id}`} className="card lift flex items-center gap-3 p-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-soleil-soft text-2xl">{r.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold leading-tight">{r.title}</div>
              <div className="text-xs font-bold text-ink-soft">
                {r.kind} · Y{r.level}
              </div>
            </div>
            <ScoreBadge v={scores['read:' + r.id]} />
          </Link>
        ))}
      </div>
    </Page>
  )
}

export function ListeningPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const item = LISTENING.find((l) => l.id === id)
  const { saveScore, completeTask, addXp } = useStore()
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(0.85)
  const [showText, setShowText] = useState(false)
  const [showEn, setShowEn] = useState(false)
  const [plays, setPlays] = useState(0)
  const [started, setStarted] = useState(false)
  const cancel = useRef(false)
  useEffect(() => () => stopSpeaking(), [])
  if (!item) return null

  const playAll = async () => {
    if (playing) {
      cancel.current = true
      stopSpeaking()
      setPlaying(false)
      return
    }
    cancel.current = false
    setPlaying(true)
    setPlays((p) => p + 1)
    await speakSequence(
      item.lines.map((l) => ({ text: l.fr, alt: l.s === 'B' })),
      rate,
      () => cancel.current,
    )
    setPlaying(false)
  }

  return (
    <Page>
      <PageHeader title={item.title} subtitle={`${item.kind} · listen, then answer`} emoji={item.emoji} back="/skills" right={<LevelPill level={item.level} />} />
      <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-menthe to-[#169e8a] p-6 text-center text-white">
              <button onClick={playAll} className={`mx-auto grid h-24 w-24 place-items-center rounded-full bg-white text-menthe shadow-xl transition hover:scale-105 ${playing ? 'mic-live' : ''}`} aria-label={playing ? 'Stop' : 'Play'}>
                {playing ? <Square size={34} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
              </button>
              <div className="mt-3 font-extrabold">{playing ? 'Playing…' : plays ? `Played ${plays}×` : 'Press play'}</div>
            </div>
            <div className="p-4">
              <div className="text-xs font-extrabold uppercase text-ink-soft">Speed</div>
              <div className="mt-2 flex gap-2">
                {[
                  [0.6, '🐌 Slow'],
                  [0.85, 'Normal'],
                  [1.05, '🚀 Fast'],
                ].map(([r, l]) => (
                  <button key={l} onClick={() => setRate(r as number)} className={`flex-1 rounded-xl py-2 text-sm font-extrabold ${rate === r ? 'bg-ink text-white' : 'bg-cream'}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setShowText(!showText)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-bleu-soft py-2 text-sm font-extrabold text-bleu">
                  {showText ? <EyeOff size={16} /> : <Eye size={16} />} Transcript
                </button>
                <button onClick={() => setShowEn(!showEn)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lavande-soft py-2 text-sm font-extrabold text-[#5b3cc4]">
                  <Languages size={16} /> English
                </button>
              </div>
              <p className="mt-3 text-xs font-semibold text-ink-soft">Exam tip: listen twice before looking at the transcript!</p>
            </div>
          </Card>
          <AnimatePresence>
            {(showText || showEn) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Card className="space-y-2 p-4">
                  {item.lines.map((l, k) => (
                    <div key={k} className="flex gap-2">
                      <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white ${l.s === 'A' ? 'bg-bleu' : 'bg-rouge'}`}>{l.s}</span>
                      <div className="flex-1">
                        {showText && (
                          <button onClick={() => speak(l.fr, { alt: l.s === 'B', rate })} className="text-left font-bold hover:text-bleu">
                            {l.fr}
                          </button>
                        )}
                        {showEn && <div className="text-sm font-semibold text-ink-soft">{l.en}</div>}
                      </div>
                    </div>
                  ))}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          {!started ? (
            <Card className="p-6">
              <h2 className="text-xl font-extrabold">Questions</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 font-semibold text-ink-soft">
                {item.questions.map((q, k) => (
                  <li key={k}>{q.kind !== 'speak' && q.prompt}</li>
                ))}
              </ol>
              <p className="mt-4 font-semibold">Read the questions first, then listen. When you’re ready:</p>
              <Button className="mt-4 w-full" onClick={() => setStarted(true)}>
                Answer the questions
              </Button>
            </Card>
          ) : (
            <QuizRunner
              questions={item.questions}
              onExit={() => nav('/skills')}
              doneLabel="More listening"
              onFinish={(_, pct) => {
                saveScore('listen:' + item.id, pct)
                completeTask('skill')
                addXp(10)
              }}
            />
          )}
        </div>
      </div>
    </Page>
  )
}

function highlight(text: string, glossary: Record<string, string>, onPick: (k: string) => void) {
  const keys = Object.keys(glossary).sort((a, b) => b.length - a.length)
  if (!keys.length) return text
  const esc = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${esc.join('|')})`, 'gi')
  return text.split(re).map((part, i) => {
    const key = keys.find((k) => k.toLowerCase() === part.toLowerCase())
    return key ? (
      <button key={i} onClick={() => onPick(key)} className="rounded bg-soleil-soft px-0.5 font-bold text-[#7a5300] underline decoration-dotted decoration-2 underline-offset-4 hover:bg-soleil/50">
        {part}
      </button>
    ) : (
      <span key={i}>{part}</span>
    )
  })
}

export function ReadingPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const item = READING.find((r) => r.id === id)
  const { saveScore, completeTask, addXp } = useStore()
  const [word, setWord] = useState<string | null>(null)
  const [showEn, setShowEn] = useState(false)
  const [started, setStarted] = useState(false)
  if (!item) return null
  const paras = item.text.split(/\n\s*\n/)
  return (
    <Page>
      <PageHeader title={item.title} subtitle={`${item.kind} · tap highlighted words for help`} emoji={item.emoji} back="/skills" right={<LevelPill level={item.level} />} />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <Card className="p-5 sm:p-6">
            <div className="space-y-3 text-[1.08rem] leading-relaxed">
              {paras.map((p, k) => (
                <div key={k} className="group flex gap-2">
                  <p className="flex-1 whitespace-pre-line font-semibold">{highlight(p, item.glossary, setWord)}</p>
                  <SpeakButton text={p} size="sm" className="opacity-60 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </Card>
          <AnimatePresence>
            {word && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="sticky bottom-24 lg:bottom-4 z-10 flex items-center gap-3 rounded-2xl bg-ink p-4 text-white shadow-2xl">
                <SpeakButton text={word} size="sm" />
                <div className="flex-1">
                  <span className="font-extrabold">{word}</span> = <span className="font-semibold text-soleil">{item.glossary[word]}</span>
                </div>
                <button onClick={() => setWord(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setShowEn(!showEn)} className="inline-flex items-center gap-1.5 rounded-xl bg-lavande-soft px-3 py-2 text-sm font-extrabold text-[#5b3cc4]">
            <Languages size={16} /> {showEn ? 'Hide' : 'Show'} English translation
          </button>
          {showEn && <Card className="p-4 font-semibold text-ink-soft">{item.translation}</Card>}
        </div>
        <div>
          {!started ? (
            <Card className="p-6">
              <h2 className="text-xl font-extrabold">Questions</h2>
              <p className="mt-2 font-semibold text-ink-soft">Read the text carefully. Try to work out new words from context before tapping them.</p>
              <Button className="mt-4 w-full" onClick={() => setStarted(true)}>
                Start {item.questions.length} questions
              </Button>
            </Card>
          ) : (
            <QuizRunner
              questions={item.questions}
              onExit={() => nav('/skills')}
              doneLabel="More reading"
              onFinish={(_, pct) => {
                saveScore('read:' + item.id, pct)
                completeTask('skill')
                addXp(10)
              }}
            />
          )}
        </div>
      </div>
    </Page>
  )
}

// ---------- Numbers ----------

const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize']
export function frNumber(n: number): string {
  if (n <= 16) return UNITS[n]
  if (n < 20) return 'dix-' + UNITS[n - 10]
  if (n >= 100) {
    const h = Math.floor(n / 100)
    const r = n % 100
    const head = h === 1 ? 'cent' : UNITS[h] + ' cent' + (r === 0 ? 's' : '')
    return r ? `${head} ${frNumber(r)}` : head
  }
  const tensWords: Record<number, string> = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' }
  const t = Math.floor(n / 10)
  const u = n % 10
  if (t <= 6) return u === 0 ? tensWords[t] : u === 1 ? `${tensWords[t]} et un` : `${tensWords[t]}-${UNITS[u]}`
  if (t === 7) return n === 71 ? 'soixante et onze' : 'soixante-' + frNumber(n - 60)
  if (n === 80) return 'quatre-vingts'
  return 'quatre-vingt-' + frNumber(n - 80)
}

type NumMode = 'small' | 'big' | 'price' | 'time'
function makeNumberQ(mode: NumMode): Q {
  if (mode === 'price') {
    const e = 1 + Math.floor(Math.random() * 60)
    const c = [0, 20, 50, 75, 90, 99][Math.floor(Math.random() * 6)]
    const say = c ? `${frNumber(e)} euros ${frNumber(c)}` : `${frNumber(e)} euros`
    const cs = String(c).padStart(2, '0')
    return { kind: 'type', hint: 'Prices', prompt: 'Type the price you hear (e.g. 12.50)', say, hideText: true, answers: c ? [`${e}.${cs}`, `${e},${cs}`, `€${e}.${cs}`, `${e}.${cs}€`] : [`${e}`, `${e}.00`, `€${e}`, `${e}€`], explain: say, tag: 'numbers' } as Q
  }
  if (mode === 'time') {
    const h = 1 + Math.floor(Math.random() * 12)
    const m = [0, 15, 30, 45, 10, 20, 50][Math.floor(Math.random() * 7)]
    const hw = (x: number) => (x === 1 ? 'une heure' : `${frNumber(x)} heures`)
    const words = m === 0 ? hw(h) : m === 15 ? `${hw(h)} et quart` : m === 30 ? `${hw(h)} et demie` : m === 45 ? `${hw(h === 12 ? 1 : h + 1)} moins le quart` : `${hw(h)} ${frNumber(m)}`
    const mm = String(m).padStart(2, '0')
    return { kind: 'type', hint: 'Telling the time', prompt: 'Type the time you hear (e.g. 8:15)', say: words, hideText: true, answers: [`${h}:${mm}`, `${h}h${mm}`, `${h}.${mm}`, `0${h}:${mm}`], explain: words, tag: 'numbers' } as Q
  }
  const n = mode === 'small' ? Math.floor(Math.random() * 70) : 60 + Math.floor(Math.random() * 940)
  return { kind: 'type', hint: mode === 'small' ? 'Numbers 0–69' : 'Big numbers 60–999', prompt: 'Type the number you hear (in digits)', say: frNumber(n), hideText: true, answers: [String(n)], explain: frNumber(n), tag: 'numbers' } as Q
}

export function NumberTrainer() {
  const [mode, setMode] = useState<NumMode | null>(null)
  const { addXp } = useStore()
  const qs = useMemo(() => (mode ? Array.from({ length: 10 }, () => makeNumberQ(mode)) : []), [mode])
  if (mode) {
    return (
      <Page>
        <QuizRunner questions={qs} onExit={() => setMode(null)} doneLabel="Back" onFinish={() => addXp(5)} />
      </Page>
    )
  }
  return (
    <Page>
      <PageHeader title="Number trainer" subtitle="Numbers come up in almost every listening exam" emoji="🔢" back="/skills" />
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ['small', '0 – 69', 'The basics', '🔢', 'sky'],
            ['big', '60 – 999', 'soixante-dix, quatre-vingts…', '💯', 'violet'],
            ['price', 'Prices', 'douze euros cinquante', '💶', 'green'],
            ['time', 'Times', 'huit heures et quart', '⏰', 'amber'],
          ] as const
        ).map(([m, t, s, e, h]) => (
          <button key={m} onClick={() => setMode(m)} className="card lift flex items-center gap-4 p-5 text-left">
            <div className={`hue-${h} grid h-14 w-14 place-items-center rounded-2xl text-2xl`}>{e}</div>
            <div>
              <div className="font-display text-xl font-extrabold">{t}</div>
              <div className="font-semibold text-ink-soft">{s}</div>
            </div>
          </button>
        ))}
      </div>
      <Card className="mt-5 p-5">
        <div className="font-extrabold">Quick reference</div>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 30, 40, 50, 60, 70, 71, 75, 80, 81, 90, 95, 100, 200].map((n) => (
            <button key={n} onClick={() => speak(frNumber(n))} className="flex items-center gap-2 rounded-lg px-1 py-0.5 text-left hover:bg-bleu-soft">
              <span className="w-8 font-extrabold tabular-nums text-bleu">{n}</span>
              <span className="font-semibold">{frNumber(n)}</span>
            </button>
          ))}
        </div>
      </Card>
    </Page>
  )
}

// ---------- Culture ----------

export function CulturePage() {
  const [open, setOpen] = useState<string | null>(null)
  const [answer, setAnswer] = useState<number | null>(null)
  const { addXp } = useStore()
  const card = CULTURE.find((c) => c.id === open)
  const order = useMemo(() => (card ? shuffle(card.quiz.options.map((_, i) => i)) : []), [card])
  return (
    <Page>
      <PageHeader title="Culture" subtitle="La France et le monde francophone" emoji="🌍" back="/skills" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {CULTURE.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setOpen(c.id)
              setAnswer(null)
            }}
            className="card lift overflow-hidden text-left"
          >
            <div className={`hue-${c.hue} grid h-28 place-items-center text-6xl`}>{c.emoji}</div>
            <div className="p-4 font-display text-lg font-bold">{c.title}</div>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {card && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={() => setOpen(null)}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
              <div className={`hue-${card.hue} relative grid h-36 place-items-center text-7xl`}>
                {card.emoji}
                <button onClick={() => setOpen(null)} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/80" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-extrabold">{card.title}</h2>
                <p className="prose-lesson mt-3 font-semibold leading-relaxed">
                  <Rich text={card.text} />
                </p>
                <div className="mt-4 space-y-2">
                  {card.words.map(([fr, en]) => (
                    <div key={fr} className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2">
                      <SpeakButton text={fr} size="sm" />
                      <span className="font-extrabold">{fr}</span>
                      <span className="font-semibold text-ink-soft">— {en}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-soleil-soft p-4 font-bold text-[#6b4a00]">💡 {card.fact}</div>
                <div className="mt-5">
                  <div className="font-extrabold">{card.quiz.q}</div>
                  <div className="mt-2 grid gap-2">
                    {order.map((k) => (
                      <button
                        key={k}
                        disabled={answer !== null}
                        onClick={() => {
                          setAnswer(k)
                          if (k === card.quiz.answer) {
                            sfx.right()
                            addXp(3)
                          } else sfx.wrong()
                        }}
                        className={`rounded-2xl border-2 px-4 py-3 text-left font-bold ${answer === null ? 'border-line hover:bg-cream' : k === card.quiz.answer ? 'border-menthe bg-menthe-soft' : answer === k ? 'border-rouge bg-rouge-soft' : 'border-line opacity-60'}`}
                      >
                        {card.quiz.options[k]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}

