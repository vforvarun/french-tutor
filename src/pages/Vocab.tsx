import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, Dumbbell, Mic, Shapes, Printer, ChevronDown, RotateCw, Check, X, Timer } from 'lucide-react'
import { THEMES, themeById, type Word } from '../data/vocab'
import { useStore, wordStats } from '../lib/store'
import { buildPractice, dueWords, nextNewWords, weakWords } from '../lib/vocabQuiz'
import { pick, shuffle } from '../lib/text'
import { speak } from '../lib/speech'
import { hintsFor } from '../lib/phonics'
import { sfx, celebrate } from '../lib/fx'
import { Page, PageHeader, Progress, Button, Card, GenderTag, genderText, Empty, Pill } from '../components/ui'
import { AudioPair, SayIt, RecordCompare, SpeakButton } from '../components/audio'
import { QuizRunner } from '../components/QuizRunner'

function statusOf(box?: number) {
  if (box === undefined) return { label: 'New', cls: 'bg-black/[0.06] text-ink-soft' }
  if (box >= 4) return { label: 'Mastered', cls: 'bg-menthe-soft text-[#0f7a66]' }
  return { label: 'Learning', cls: 'bg-bleu-soft text-bleu' }
}

export function VocabHome() {
  const words = useStore((s) => s.words)
  const level = useStore((s) => s.profile.level)
  const [filter, setFilter] = useState<0 | 9 | 10>(0)
  const due = dueWords(words, 99).length
  const weak = weakWords(words, 50).length
  const ws = wordStats(words)
  const themes = THEMES.filter((t) => !filter || t.level === filter)

  return (
    <Page>
      <PageHeader title="Mots" subtitle={`Vocabulary · ${ws.seen} words started · ${ws.mastered} mastered`} emoji="📚" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/review" className={`card lift flex items-center gap-4 p-4 ${due ? 'ring-2 ring-lavande/40' : ''}`}>
          <div className="hue-violet grid h-14 w-14 place-items-center rounded-2xl text-2xl">🧠</div>
          <div className="flex-1">
            <div className="font-extrabold">Review due words</div>
            <div className="text-sm font-semibold text-ink-soft">{due ? `${due} words are ready to review` : 'Nothing due — great job!'}</div>
          </div>
          {due > 0 && <Pill className="bg-rouge text-white text-sm">{due}</Pill>}
        </Link>
        <Link to="/say?set=weak" className="card lift flex items-center gap-4 p-4">
          <div className="hue-rose grid h-14 w-14 place-items-center rounded-2xl text-2xl">🎯</div>
          <div className="flex-1">
            <div className="font-extrabold">Tricky words</div>
            <div className="text-sm font-semibold text-ink-soft">{weak ? `${weak} words you’ve got wrong — practise saying them` : 'Words you find hard will show here'}</div>
          </div>
        </Link>
      </div>

      <div className="mt-8 mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold">Themes</h2>
        <div className="flex rounded-2xl bg-white p-1 shadow-[var(--shadow-card)]">
          {([0, 9, 10] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-xl px-3 py-1.5 text-sm font-extrabold transition ${filter === f ? 'bg-bleu text-white' : 'text-ink-soft'}`}>
              {f === 0 ? 'All' : `Year ${f}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {themes.map((t, k) => {
          const seen = t.words.filter((w) => words[w.id]).length
          const mastered = t.words.filter((w) => (words[w.id]?.box ?? 0) >= 4).length
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(k * 0.03, 0.4) }}>
              <Link to={`/vocab/${t.id}`} className={`card lift block overflow-hidden ${t.level > level ? 'opacity-80' : ''}`}>
                <div className={`hue-${t.hue} relative flex h-24 items-center justify-center overflow-hidden`}>
                  <span className="text-5xl drop-shadow">{t.emoji}</span>
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
                  <div className="absolute left-2 top-2">
                    <span className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-extrabold text-ink">Y{t.level}</span>
                  </div>
                  {mastered === t.words.length && <div className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-menthe">★ Done</div>}
                </div>
                <div className="p-3.5">
                  <div className="font-display text-[1.05rem] font-bold leading-tight">{t.title}</div>
                  <div className="text-xs font-semibold text-ink-soft">{t.en}</div>
                  <Progress value={seen / t.words.length} className="mt-3 h-2" color="bg-gradient-to-r from-bleu to-menthe" />
                  <div className="mt-1 flex justify-between text-[11px] font-bold text-ink-soft">
                    <span>
                      {seen}/{t.words.length} started
                    </span>
                    <span>{mastered} ★</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </Page>
  )
}

export function ThemePage() {
  const { id } = useParams()
  const t = themeById(id!)
  const words = useStore((s) => s.words)
  const [tab, setTab] = useState<'words' | 'phrases'>('words')
  const [open, setOpen] = useState<string | null>(null)
  if (!t) return null
  const seen = t.words.filter((w) => words[w.id]).length
  const mastered = t.words.filter((w) => (words[w.id]?.box ?? 0) >= 4).length

  return (
    <Page>
      <div className={`hue-${t.hue} relative mb-6 overflow-hidden rounded-[2rem] p-6 text-white shadow-[var(--shadow-lift)]`}>
        <div className="absolute -right-8 -top-8 text-[9rem] opacity-20">{t.emoji}</div>
        <Link to="/vocab" className="no-print text-sm font-extrabold text-white/80 hover:text-white">
          ← All themes
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-5xl">{t.emoji}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">{t.title}</h1>
            <div className="font-semibold text-white/85">
              {t.en} · Year {t.level}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-extrabold">
          <span className="rounded-full bg-white/20 px-3 py-1">{t.words.length} words</span>
          <span className="rounded-full bg-white/20 px-3 py-1">{seen} started</span>
          <span className="rounded-full bg-white/20 px-3 py-1">{mastered} mastered ★</span>
        </div>
      </div>

      <div className="no-print grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { to: `/vocab/${t.id}/learn`, icon: Sparkles, label: 'Learn new', sub: 'Flashcards', c: 'from-bleu to-[#5a6cff]' },
          { to: `/vocab/${t.id}/practice`, icon: Dumbbell, label: 'Practise', sub: 'Quiz', c: 'from-menthe to-[#4fd8bd]' },
          { to: `/say?theme=${t.id}`, icon: Mic, label: 'Say it', sub: 'Pronunciation', c: 'from-rouge to-[#ff8a5c]' },
          { to: `/vocab/${t.id}/match`, icon: Shapes, label: 'Match', sub: 'Game', c: 'from-lavande to-[#b39bff]' },
        ].map((a) => (
          <Link key={a.label} to={a.to} className={`lift flex flex-col items-start gap-2 rounded-3xl bg-gradient-to-br ${a.c} p-4 text-white shadow-md`}>
            <a.icon size={26} />
            <div>
              <div className="font-extrabold leading-tight">{a.label}</div>
              <div className="text-xs font-bold text-white/80">{a.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="no-print mt-6 flex items-center justify-between">
        <div className="flex rounded-2xl bg-white p-1 shadow-[var(--shadow-card)]">
          {(['words', 'phrases'] as const).map((x) => (
            <button key={x} onClick={() => setTab(x)} className={`rounded-xl px-4 py-1.5 text-sm font-extrabold capitalize ${tab === x ? 'bg-ink text-white' : 'text-ink-soft'}`}>
              {x === 'words' ? 'Words' : 'Key phrases'}
            </button>
          ))}
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold text-ink-soft hover:bg-black/5">
          <Printer size={16} /> Print list
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-ink-soft">
        <span><span className="text-masc">■</span> masculine (le)</span>
        <span><span className="text-fem">■</span> feminine (la)</span>
        <span><span className="text-plur">■</span> plural (les)</span>
      </div>

      {tab === 'words' ? (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {t.words.map((w) => {
            const st = statusOf(words[w.id]?.box)
            const isOpen = open === w.id
            return (
              <div key={w.id} className="card overflow-hidden">
                <div className="flex cursor-pointer items-center gap-3 p-3" onClick={() => setOpen(isOpen ? null : w.id)}>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-2xl">{w.emoji || '💬'}</div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-extrabold leading-tight ${genderText(w.gender)}`}>{w.fr}</div>
                    <div className="truncate text-sm font-semibold text-ink-soft">{w.en}</div>
                  </div>
                  <span className={`hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-extrabold ${st.cls}`}>{st.label}</span>
                  <SpeakButton text={w.fr} size="sm" />
                  <ChevronDown size={18} className={`no-print text-ink-soft transition ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="space-y-3 border-t border-line bg-cream/50 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <GenderTag g={w.gender} />
                          <SpeakButton text={w.fr} size="sm" slow />
                          {hintsFor(w.fr).map((h) => (
                            <Link key={h.label} to={`/sounds/${h.sound}`} className="rounded-full bg-lavande-soft px-2 py-0.5 text-[11px] font-extrabold text-[#5b3cc4]">
                              {h.label} — {h.tip}
                            </Link>
                          ))}
                        </div>
                        <SayIt target={w.fr} compact onScore={(s) => useStore.getState().savePron(w.id, Math.round(s.score * 100))} />
                        <RecordCompare target={w.fr} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {t.phrases.map((p) => (
            <Card key={p.fr} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-lg font-extrabold">{p.fr}</div>
                  <div className="font-semibold text-ink-soft">{p.en}</div>
                </div>
                <AudioPair text={p.fr} size="sm" />
              </div>
              <div className="no-print mt-3">
                <SayIt target={p.fr} compact />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  )
}

function Flashcards({ words, onDone }: { words: Word[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const w = words[i]
  useEffect(() => {
    setFlipped(false)
    if (w) speak(w.fr)
  }, [i, w])
  if (!w) return null
  const next = () => (i + 1 < words.length ? setI(i + 1) : onDone())
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center gap-3">
        <Progress value={i / words.length} color="bg-gradient-to-r from-bleu to-lavande" />
        <span className="text-sm font-extrabold text-ink-soft">
          {i + 1}/{words.length}
        </span>
      </div>
      <div className="flip h-[22rem] sm:h-[24rem]" onClick={() => setFlipped((f) => !f)}>
        <div className={`flip-inner h-full ${flipped ? 'flipped' : ''}`}>
          <div className="flip-face card flex flex-col items-center justify-center p-6 text-center">
            <div className="text-7xl">{w.emoji}</div>
            <div className={`mt-4 font-display text-4xl font-extrabold ${genderText(w.gender)}`}>{w.fr}</div>
            <div className="mt-2">
              <GenderTag g={w.gender} />
            </div>
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              <AudioPair text={w.fr} />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-bold text-ink-soft">
              <RotateCw size={14} /> Tap to see the meaning
            </div>
          </div>
          <div className="flip-face flip-back card flex flex-col items-center justify-center bg-gradient-to-br from-white to-bleu-soft p-6 text-center">
            <div className="text-5xl">{w.emoji}</div>
            <div className="mt-3 font-display text-3xl font-extrabold">{w.en}</div>
            <div className={`mt-1 text-xl font-bold ${genderText(w.gender)}`}>{w.fr}</div>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {hintsFor(w.fr).map((h) => (
                <span key={h.label} className="rounded-full bg-lavande-soft px-2.5 py-1 text-xs font-extrabold text-[#5b3cc4]">
                  {h.label}: {h.tip}
                </span>
              ))}
            </div>
            <div className="mt-4 w-full" onClick={(e) => e.stopPropagation()}>
              <SayIt target={w.fr} compact onScore={(s) => useStore.getState().savePron(w.id, Math.round(s.score * 100))} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => (flipped ? next() : setFlipped(true))}>
          {flipped ? 'Next' : 'Show meaning'}
        </Button>
        <Button className="flex-1" onClick={next}>
          Got it <Check size={18} />
        </Button>
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink-soft">Say each word out loud as you learn it — it really helps it stick!</p>
    </div>
  )
}

export function Learn() {
  const { id } = useParams()
  const nav = useNavigate()
  const s = useStore()
  const t = themeById(id!)
  const [phase, setPhase] = useState<'cards' | 'quiz'>('cards')
  const batch = useMemo(() => {
    const fresh = nextNewWords(s.words, s.profile.level, [], Math.max(5, s.profile.newPerDay), id)
    if (fresh.length >= 3) return fresh
    // everything started: pick the weakest in this theme
    return [...t!.words].sort((a, b) => (s.words[a.id]?.box ?? 0) - (s.words[b.id]?.box ?? 0)).slice(0, 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  const quiz = useMemo(() => buildPractice(batch, {}, 1), [batch])
  if (!t) return null

  return (
    <Page>
      <div className="mb-5 text-center">
        <div className="text-sm font-extrabold uppercase tracking-wider text-bleu">
          {t.emoji} {t.title}
        </div>
        <h1 className="text-2xl font-extrabold">{phase === 'cards' ? 'Learn new words' : 'Quick check'}</h1>
      </div>
      {phase === 'cards' ? (
        <Flashcards words={batch} onDone={() => setPhase('quiz')} />
      ) : (
        <QuizRunner
          questions={quiz}
          onExit={() => nav(`/vocab/${t.id}`)}
          doneLabel="Back to theme"
          onFinish={() => {
            s.introduceWords(batch.map((w) => w.id))
            s.completeTask('learn')
            s.addXp(10)
          }}
        />
      )}
    </Page>
  )
}

export function Practice() {
  const { id } = useParams()
  const nav = useNavigate()
  const s = useStore()
  const t = themeById(id!)
  const qs = useMemo(() => {
    const started = t!.words.filter((w) => s.words[w.id])
    const pool = started.length >= 4 ? started : t!.words.slice(0, 10)
    return buildPractice(pick(pool, 12), s.words)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  if (!t) return null
  return (
    <Page>
      <QuizRunner questions={qs} onExit={() => nav(`/vocab/${t.id}`)} doneLabel="Back to theme" onFinish={() => s.addXp(5)} />
    </Page>
  )
}

export function Review() {
  const nav = useNavigate()
  const s = useStore()
  const qs = useMemo(() => buildPractice(dueWords(s.words, 20), s.words), []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Page>
      {qs.length === 0 ? (
        <>
          <PageHeader title="Review" back="/vocab" emoji="🧠" />
          <Empty emoji="🎉" title="Nothing to review right now">
            All your words are fresh in your memory. Learn some new ones!
            <div className="mt-4">
              <Button onClick={() => nav('/vocab')}>Choose a theme</Button>
            </div>
          </Empty>
        </>
      ) : (
        <>
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-extrabold">🧠 Review time</h1>
            <p className="font-semibold text-ink-soft">These words are due — answer correctly to push them further into long-term memory.</p>
          </div>
          <QuizRunner
            questions={qs}
            onExit={() => nav('/')}
            doneLabel="Back to today"
            onFinish={() => {
              s.completeTask('review')
              s.addXp(10)
            }}
          />
        </>
      )}
    </Page>
  )
}

export function Match() {
  const { id } = useParams()
  const nav = useNavigate()
  const s = useStore()
  const t = themeById(id!)
  const [round, setRound] = useState(0)
  const [set, setSet] = useState<Word[]>([])
  const [left, setLeft] = useState<Word[]>([])
  const [right, setRight] = useState<Word[]>([])
  const [selL, setSelL] = useState<string | null>(null)
  const [selR, setSelR] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [bad, setBad] = useState<string | null>(null)
  const [misses, setMisses] = useState(0)
  const [start, setStart] = useState(Date.now())
  const [, tick] = useState(0)

  const newRound = () => {
    const started = t!.words.filter((w) => s.words[w.id])
    const pool = started.length >= 6 ? started : t!.words
    const ws = pick(pool, 6)
    setSet(ws)
    setLeft(shuffle(ws))
    setRight(shuffle(ws))
    setMatched([])
    setSelL(null)
    setSelR(null)
  }
  useEffect(() => {
    newRound()
    setStart(Date.now())
    const iv = setInterval(() => tick((x) => x + 1), 1000)
    return () => clearInterval(iv)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selL || !selR) return
    if (selL === selR) {
      sfx.right()
      setMatched((m) => [...m, selL])
      s.reviewWord(selL, true)
      setSelL(null)
      setSelR(null)
    } else {
      sfx.wrong()
      setMisses((m) => m + 1)
      setBad(selR)
      s.logAnswer('v:' + t!.id, false)
      setTimeout(() => {
        setBad(null)
        setSelL(null)
        setSelR(null)
      }, 500)
    }
  }, [selL, selR]) // eslint-disable-line react-hooks/exhaustive-deps

  const roundDone = set.length > 0 && matched.length === set.length
  useEffect(() => {
    if (roundDone && round === 1) {
      celebrate()
      s.addXp(15)
    }
  }, [roundDone]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!t) return null
  const secs = Math.floor((Date.now() - start) / 1000)
  const finished = roundDone && round === 1

  return (
    <Page>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => nav(`/vocab/${t.id}`)} className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-black/5" aria-label="Quit">
            <X size={22} />
          </button>
          <h1 className="flex-1 text-2xl font-extrabold">Match the pairs</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-extrabold shadow-[var(--shadow-card)]">
            <Timer size={15} /> {finished ? '' : secs + 's'}
          </span>
          <span className="rounded-full bg-rouge-soft px-3 py-1 text-sm font-extrabold text-[#b0283f]">✗ {misses}</span>
        </div>
        {finished ? (
          <Card className="p-8 text-center">
            <div className="text-6xl">🏆</div>
            <h2 className="mt-2 text-3xl font-extrabold">Bravo !</h2>
            <p className="mt-2 font-semibold text-ink-soft">
              12 pairs in {secs} seconds with {misses} mistake{misses === 1 ? '' : 's'}.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setRound(0)
                  setMisses(0)
                  setStart(Date.now())
                  newRound()
                }}
              >
                Play again
              </Button>
              <Button onClick={() => nav(`/vocab/${t.id}`)}>Done</Button>
            </div>
          </Card>
        ) : (
          <>
            <p className="mb-3 text-center text-sm font-bold text-ink-soft">Round {round + 1} of 2 · tap a French word, then its meaning</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                {left.map((w) => {
                  const done = matched.includes(w.id)
                  return (
                    <button
                      key={w.id}
                      disabled={done}
                      onClick={() => {
                        speak(w.fr)
                        setSelL(w.id)
                      }}
                      className={`w-full rounded-2xl border-2 px-3 py-4 text-base sm:text-lg font-extrabold transition ${done ? 'border-transparent bg-menthe-soft text-menthe opacity-50' : selL === w.id ? 'border-bleu bg-bleu-soft' : 'border-line bg-white shadow-[0_4px_0_0_var(--color-line)]'} ${genderText(w.gender)}`}
                    >
                      {w.fr}
                    </button>
                  )
                })}
              </div>
              <div className="space-y-3">
                {right.map((w) => {
                  const done = matched.includes(w.id)
                  return (
                    <button
                      key={w.id}
                      disabled={done || !selL}
                      onClick={() => setSelR(w.id)}
                      className={`w-full rounded-2xl border-2 px-3 py-4 text-base sm:text-lg font-bold transition ${done ? 'border-transparent bg-menthe-soft text-menthe opacity-50' : bad === w.id ? 'wiggle border-rouge bg-rouge-soft' : 'border-line bg-white shadow-[0_4px_0_0_var(--color-line)]'}`}
                    >
                      {w.emoji} {w.en}
                    </button>
                  )
                })}
              </div>
            </div>
            {roundDone && round === 0 && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => {
                    setRound(1)
                    newRound()
                  }}
                >
                  Next round →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  )
}

