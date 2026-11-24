import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, X, Volume2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import type { Q, QResult } from '../lib/quiz'
import { checkTyped, shuffle } from '../lib/text'
import { useStore } from '../lib/store'
import { speak } from '../lib/speech'
import { sfx, celebrate } from '../lib/fx'
import { Button, Progress, Ring } from './ui'
import { AccentKeys } from './AccentKeys'
import { SayIt, SpeakButton } from './audio'

interface Props {
  questions: Q[]
  onFinish?: (results: QResult[], pct: number) => void
  onExit?: () => void
  xpPerRight?: number
  showEnd?: boolean
  doneLabel?: string
}

type Feedback = { ok: boolean; note?: string; correct?: string } | null

export function QuizRunner({ questions: initial, onFinish, onExit, xpPerRight = 2, showEnd = true, doneLabel = 'Done' }: Props) {
  const [questions, setQuestions] = useState(initial)
  const [i, setI] = useState(0)
  const [results, setResults] = useState<QResult[]>([])
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [typedValue, setTyped] = useState('')
  const [finished, setFinished] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { logAnswer, reviewWord, addXp } = useStore()

  const q = questions[i]
  const order = useMemo(() => (q?.kind === 'mcq' ? shuffle(q.options.map((_, k) => k)) : []), [q])

  useEffect(() => {
    setPicked(null)
    setTyped('')
    setFeedback(null)
    if (q && 'say' in q && q.say && q.hideText) speak(q.say)
    if (q?.kind === 'type') setTimeout(() => inputRef.current?.focus(), 50)
  }, [i, q])

  const record = (ok: boolean, given: string, fb: Feedback) => {
    setFeedback(fb)
    if (ok) sfx.right()
    else {
      sfx.wrong()
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
    if (q.tag) logAnswer(q.tag, ok)
    if (q.wordId) reviewWord(q.wordId, ok)
    if (ok) addXp(xpPerRight)
    setResults((r) => [...r, { q, ok, given }])
  }

  const answerMcq = (k: number) => {
    if (feedback || q.kind !== 'mcq') return
    setPicked(k)
    const ok = k === q.answer
    record(ok, q.options[k], { ok, correct: q.options[q.answer], note: q.explain })
  }

  const answerTyped = () => {
    if (feedback || q.kind !== 'type' || !typedValue.trim()) return
    const v = checkTyped(typedValue, q.answers)
    const ok = v !== 'wrong'
    const note =
      v === 'accent' ? `Watch the accents: ${q.answers[0]}` : v === 'article' ? `Remember the article: ${q.answers[0]}` : q.explain
    record(ok, typedValue, { ok, correct: q.answers[0], note })
    if (v === 'article') logAnswer('gender', false)
  }

  const next = () => {
    if (i + 1 < questions.length) setI(i + 1)
    else finish()
  }

  const finish = () => {
    const scored = results.length
    const right = results.filter((r) => r.ok).length
    const pct = scored ? Math.round((right / scored) * 100) : 100
    sfx.done()
    if (pct >= 80) celebrate()
    onFinish?.(results, pct)
    if (showEnd) setFinished(true)
  }

  // keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (finished) return
      if (feedback && e.key === 'Enter') {
        e.preventDefault()
        next()
        return
      }
      if (q?.kind === 'mcq' && !feedback) {
        const n = parseInt(e.key)
        if (n >= 1 && n <= order.length) answerMcq(order[n - 1])
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  if (finished) {
    const right = results.filter((r) => r.ok).length
    const pct = results.length ? right / results.length : 1
    const wrong = results.filter((r) => !r.ok)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-xl p-6 sm:p-8 text-center">
        <div className="text-5xl">{pct >= 0.9 ? '🏆' : pct >= 0.7 ? '🎉' : pct >= 0.5 ? '💪' : '🌱'}</div>
        <h2 className="mt-2 text-3xl font-extrabold">{pct >= 0.9 ? 'Magnifique !' : pct >= 0.7 ? 'Bravo !' : pct >= 0.5 ? 'Pas mal !' : 'Keep going!'}</h2>
        <div className="mt-5 flex justify-center">
          <Ring value={pct} size={130} stroke={14} color={pct >= 0.7 ? '#22b59a' : pct >= 0.5 ? '#ffb020' : '#ff5d73'}>
            <div>
              <div className="font-display text-3xl font-extrabold">{Math.round(pct * 100)}%</div>
              <div className="text-xs font-bold text-ink-soft">
                {right} / {results.length}
              </div>
            </div>
          </Ring>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-soleil-soft px-3 py-1 font-extrabold text-[#9a6700]">
          <Sparkles size={16} /> +{right * xpPerRight} XP
        </div>
        {wrong.length > 0 && (
          <div className="mt-6 text-left">
            <div className="mb-2 font-extrabold text-ink-soft">Review your mistakes</div>
            <div className="space-y-2">
              {wrong.map((r, k) => (
                <div key={k} className="rounded-2xl bg-rouge-soft/60 p-3">
                  <div className="font-bold">{r.q.kind === 'speak' ? r.q.target : r.q.prompt}</div>
                  <div className="text-sm">
                    <span className="text-rouge line-through decoration-2">{r.given || '—'}</span>
                    <span className="mx-2">→</span>
                    <span className="font-extrabold text-[#0f7a66]">{r.q.kind === 'mcq' ? r.q.options[r.q.answer] : r.q.kind === 'type' ? r.q.answers[0] : r.q.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {wrong.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                setQuestions(shuffle(wrong.map((w) => w.q)))
                setResults([])
                setI(0)
                setFinished(false)
              }}
            >
              <RotateCcw size={18} /> Practise mistakes
            </Button>
          )}
          <Button onClick={onExit}>{doneLabel}</Button>
        </div>
      </motion.div>
    )
  }

  if (!q) return null

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onExit} aria-label="Quit" className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-black/5">
          <X size={22} />
        </button>
        <Progress value={i / questions.length} color="bg-gradient-to-r from-bleu to-lavande" />
        <div className="text-sm font-extrabold text-ink-soft tabular-nums">
          {i + 1}/{questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className={`card p-5 sm:p-7 ${shake ? 'wiggle' : ''}`}>
          {q.kind !== 'speak' && (
            <>
              {q.hint && <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-lavande">{q.hint}</div>}
              <div className="flex items-start gap-3">
                <h2 className="flex-1 text-2xl sm:text-[1.7rem] font-bold leading-snug">{q.prompt}</h2>
                {q.say && !q.hideText && <SpeakButton text={q.say} />}
              </div>
              {q.say && q.hideText && (
                <div className="mt-5 flex justify-center gap-3">
                  <button onClick={() => speak(q.say!)} className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-bleu to-lavande text-white shadow-lg hover:scale-105 transition">
                    <Volume2 size={40} />
                  </button>
                  <button onClick={() => speak(q.say!, { rate: 0.6 })} className="self-end rounded-full bg-soleil-soft px-3 py-2 text-sm font-extrabold text-[#9a6700]">
                    🐌 slow
                  </button>
                </div>
              )}
            </>
          )}

          {q.kind === 'mcq' && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {order.map((k, n) => {
                const isRight = feedback && k === q.answer
                const isWrongPick = feedback && picked === k && k !== q.answer
                return (
                  <button
                    key={k}
                    onClick={() => answerMcq(k)}
                    disabled={!!feedback}
                    className={`group flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-lg font-bold transition-all ${
                      isRight ? 'border-menthe bg-menthe-soft text-[#0f6b5a]' : isWrongPick ? 'border-rouge bg-rouge-soft text-[#b0283f]' : 'border-line bg-white hover:border-bleu/40 hover:bg-bleu-soft/40 shadow-[0_4px_0_0_var(--color-line)] active:translate-y-[3px] active:shadow-none'
                    }`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm ${isRight ? 'bg-menthe text-white' : isWrongPick ? 'bg-rouge text-white' : 'bg-cream text-ink-soft'}`}>{isRight ? <Check size={16} /> : isWrongPick ? <X size={16} /> : n + 1}</span>
                    <span>{q.options[k]}</span>
                  </button>
                )
              })}
            </div>
          )}

          {q.kind === 'type' && (
            <div className="mt-6 space-y-3">
              <input
                ref={inputRef}
                value={typedValue}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !feedback) {
                    e.preventDefault()
                    e.stopPropagation()
                    answerTyped()
                  }
                }}
                disabled={!!feedback}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                lang="fr"
                placeholder="Type in French…"
                className={`w-full rounded-2xl border-2 bg-cream/50 px-4 py-4 text-xl font-bold outline-none transition focus:border-bleu focus:bg-white ${feedback ? (feedback.ok ? 'border-menthe bg-menthe-soft' : 'border-rouge bg-rouge-soft') : 'border-line'}`}
              />
              {!feedback && (
                <>
                  <AccentKeys target={inputRef} onInsert={setTyped} />
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={answerTyped} disabled={!typedValue.trim()}>
                      Check
                    </Button>
                    <Button variant="ghost" onClick={() => record(false, '', { ok: false, correct: q.answers[0], note: q.explain })}>
                      I don’t know
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {q.kind === 'speak' && (
            <div className="text-center">
              <div className="text-xs font-extrabold uppercase tracking-wider text-rouge">{q.prompt}</div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <h2 className="text-3xl font-extrabold">{q.target}</h2>
                <SpeakButton text={q.target} />
              </div>
              {q.en && <div className="mt-1 font-semibold text-ink-soft">{q.en}</div>}
              <div className="mt-6">
                <SayIt
                  target={q.target}
                  onScore={(s) => {
                    if (feedback) return
                    const ok = s.score >= 0.6
                    if (ok) record(true, s.heard, { ok: true, note: `${Math.round(s.score * 100)}% match` })
                  }}
                />
              </div>
              {!feedback && (
                <div className="mt-4 flex justify-center gap-3">
                  <Button variant="ghost" onClick={next}>
                    Skip
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-4 rounded-3xl p-5 ${feedback.ok ? 'bg-menthe-soft' : 'bg-rouge-soft'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className={`grid h-12 w-12 place-items-center rounded-full text-white ${feedback.ok ? 'bg-menthe' : 'bg-rouge'}`}>{feedback.ok ? <Check size={26} strokeWidth={3} /> : <X size={26} strokeWidth={3} />}</div>
              <div className="min-w-0 flex-1">
                <div className={`font-display text-xl font-extrabold ${feedback.ok ? 'text-[#0f6b5a]' : 'text-[#b0283f]'}`}>{feedback.ok ? pickPraise() : 'Not quite…'}</div>
                {!feedback.ok && feedback.correct && (
                  <div className="font-bold">
                    Answer: <span className="text-[#0f6b5a]">{feedback.correct}</span>
                  </div>
                )}
                {feedback.note && <div className="text-sm font-semibold text-ink-soft">{feedback.note}</div>}
              </div>
              <Button variant={feedback.ok ? 'success' : 'danger'} onClick={next} className="w-full sm:w-auto" autoFocus>
                Continue <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const PRAISE = ['Bravo !', 'Super !', 'Excellent !', 'Génial !', 'Parfait !', 'Bien joué !', 'Formidable !']
function pickPraise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)]
}
