import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Ear, Mic, ArrowRight, Lightbulb, Smile } from 'lucide-react'
import { SOUNDS, soundById } from '../data/sounds'
import { ALL_WORDS, themeById } from '../data/vocab'
import { useStore } from '../lib/store'
import { weakWords } from '../lib/vocabQuiz'
import { hintsFor } from '../lib/phonics'
import { pick, shuffle } from '../lib/text'
import { recognitionSupported, browserHint } from '../lib/speech'
import { sfx, celebrate } from '../lib/fx'
import type { Q } from '../lib/quiz'
import { Page, PageHeader, Card, Button, Progress, Rich, LevelPill } from '../components/ui'
import { AudioPair, SayIt, RecordCompare, SpeakButton } from '../components/audio'
import { QuizRunner } from '../components/QuizRunner'

export function SoundsHome() {
  const scores = useStore((s) => s.scores)
  const pron = useStore((s) => s.pron)
  const good = Object.values(pron).filter((p) => p.best >= 80).length
  return (
    <Page>
      <PageHeader title="Prononciation" subtitle="Hear it, say it, nail it" emoji="🎤" />

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rouge to-[#ff9a5c] p-6 text-white shadow-[var(--shadow-lift)]">
        <div className="absolute -right-6 -bottom-10 text-[10rem] opacity-15">🗣️</div>
        <h2 className="text-2xl font-extrabold">Pronunciation workout</h2>
        <p className="mt-1 max-w-md font-semibold text-white/90">Say 6 words out loud. The app listens and shows you which parts were spot on and which need work.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/say" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-extrabold text-rouge shadow-lg lift">
            <Mic size={18} /> Start workout
          </Link>
          <Link to="/say?set=weak" className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-3 font-extrabold text-white lift">
            🎯 My tricky words
          </Link>
        </div>
        <div className="mt-4 text-sm font-bold text-white/85">{good} words said with 80%+ so far</div>
      </div>

      {!recognitionSupported && <div className="mt-4 rounded-2xl bg-soleil-soft p-4 font-bold text-[#8a5c00]">🎙️ {browserHint()}</div>}

      <h2 className="mt-8 mb-1 text-2xl font-extrabold">The sounds of French</h2>
      <p className="mb-4 font-semibold text-ink-soft">Short lessons on the sounds English speakers find tricky — with “hear the difference” challenges.</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {SOUNDS.map((s, k) => {
          const sc = scores['sound:' + s.id]
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.03 }}>
              <Link to={`/sounds/${s.id}`} className="card lift block p-4">
                <div className="flex items-start justify-between">
                  <div className="grid h-14 min-w-14 place-items-center rounded-2xl bg-gradient-to-br from-lavande-soft to-bleu-soft px-2 font-display text-lg font-extrabold text-bleu-deep">{s.symbol}</div>
                  {sc !== undefined && <span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${sc >= 80 ? 'bg-menthe-soft text-[#0f7a66]' : 'bg-soleil-soft text-[#9a6700]'}`}>{sc}%</span>}
                </div>
                <div className="mt-3 font-display text-lg font-bold leading-tight">{s.title}</div>
                <div className="mt-1 text-xs font-bold text-ink-soft">
                  {s.examples.length} words{s.pairs.length ? ` · ${s.pairs.length} ear-training pairs` : ''}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <Card className="mt-8 p-5">
        <div className="flex items-center gap-2 font-extrabold">
          <Lightbulb size={18} className="text-soleil" /> Tips for the microphone
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-5 font-semibold text-ink-soft">
          <li>On the Windows laptop, use Microsoft Edge or Google Chrome and click “Allow” when asked for the microphone.</li>
          <li>On the iPad, use Safari. If the mic doesn’t work, check Settings → Siri & Search / Dictation is on.</li>
          <li>Speak at a normal pace in a quiet room, about an arm’s length from the device.</li>
          <li>Listen to the 🐌 slow version first, then copy the rhythm.</li>
        </ul>
      </Card>
    </Page>
  )
}

export function SoundLessonPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const s = soundById(id!)
  const { saveScore, addXp } = useStore()
  const [quiz, setQuiz] = useState(false)
  const questions = useMemo<Q[]>(() => {
    if (!s) return []
    const items: Q[] = []
    s.pairs.forEach(([a, b]) => {
      for (const target of shuffle([a, b])) items.push({ kind: 'mcq', hint: 'Hear the difference', prompt: 'Which one did you hear?', say: target, hideText: true, options: [target, target === a ? b : a], answer: 0, tag: 'pron:ear' })
    })
    return shuffle(items).slice(0, 10)
  }, [s])
  if (!s) return null

  if (quiz) {
    return (
      <Page>
        <div className="mb-4 text-center">
          <div className="text-sm font-extrabold uppercase tracking-wider text-rouge">👂 {s.title}</div>
          <h1 className="text-2xl font-extrabold">Hear the difference</h1>
        </div>
        <QuizRunner
          questions={questions}
          onExit={() => setQuiz(false)}
          doneLabel="Back to lesson"
          onFinish={(_, pct) => {
            saveScore('sound:' + s.id, pct)
            addXp(5)
          }}
        />
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader title={s.title} back="/sounds" right={<LevelPill level={s.level} />} />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-bleu to-lavande px-6 py-8 text-center text-white">
              <div className="font-display text-5xl font-extrabold">{s.symbol}</div>
            </div>
            <div className="p-5">
              <p className="text-[1.05rem] font-semibold leading-relaxed">
                <Rich text={s.tip} />
              </p>
              <div className="mt-4 flex gap-3 rounded-2xl bg-soleil-soft p-4">
                <Smile className="shrink-0 text-[#b77a00]" />
                <p className="font-bold text-[#7a5300]">{s.mouth}</p>
              </div>
            </div>
          </Card>
          {s.pairs.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 text-lg font-extrabold">
                <Ear className="text-bleu" /> Hear the difference
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.pairs.map(([a, b]) => (
                  <div key={a + b} className="flex items-center gap-1 rounded-2xl bg-cream p-1.5 pr-3">
                    <SpeakButton text={a} size="sm" />
                    <span className="font-bold">{a}</span>
                    <span className="mx-1 text-ink-soft">/</span>
                    <SpeakButton text={b} size="sm" />
                    <span className="font-bold">{b}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => setQuiz(true)}>
                Take the ear-training challenge <ArrowRight size={18} />
              </Button>
            </Card>
          )}
          {s.twister && (
            <Card className="p-5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-lavande">Virelangue · Tongue twister</div>
              <div className="mt-2 flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-xl font-extrabold leading-snug">{s.twister[0]}</div>
                  <div className="font-semibold text-ink-soft">{s.twister[1]}</div>
                </div>
                <AudioPair text={s.twister[0]} size="sm" />
              </div>
              <div className="mt-4">
                <SayIt target={s.twister[0]} />
              </div>
            </Card>
          )}
        </div>
        <div>
          <h2 className="mb-3 text-xl font-extrabold">Practise these words</h2>
          <div className="space-y-2">
            {s.examples.map(([fr, en]) => (
              <Card key={fr} className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-extrabold">{fr}</div>
                    <div className="text-sm font-semibold text-ink-soft">{en}</div>
                  </div>
                  <AudioPair text={fr} size="sm" />
                </div>
                <div className="mt-2">
                  <SayIt target={fr} compact />
                </div>
              </Card>
            ))}
          </div>
          <Button variant="secondary" className="mt-4 w-full" onClick={() => nav('/sounds')}>
            All sounds
          </Button>
        </div>
      </div>
    </Page>
  )
}

interface Target {
  id?: string
  fr: string
  en: string
  emoji?: string
}

export function SayItPage() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const st = useStore()
  const themeId = params.get('theme')
  const set = params.get('set')

  const targets = useMemo<Target[]>(() => {
    if (themeId) {
      const t = themeById(themeId)!
      return [
        ...pick(t.words.filter((w) => !w.fr.includes('…')), 6).map((w) => ({ id: w.id, fr: w.fr, en: w.en, emoji: w.emoji })),
        ...pick(t.phrases, 2).map((p) => ({ fr: p.fr, en: p.en, emoji: '💬' })),
      ]
    }
    if (set === 'weak') {
      const lowPron = Object.entries(st.pron)
        .filter(([, p]) => p.best < 75)
        .map(([id]) => ALL_WORDS.find((w) => w.id === id))
        .filter(Boolean) as typeof ALL_WORDS
      const list = [...lowPron, ...weakWords(st.words, 10)].filter((w, i, a) => a.indexOf(w) === i)
      return pick(list, 8)
    }
    // default: recently-started words, else level-appropriate starter words
    const started = ALL_WORDS.filter((w) => st.words[w.id] && !w.fr.includes('…')).sort((a, b) => st.words[b.id].last - st.words[a.id].last)
    const pool = started.length >= 6 ? started.slice(0, 30) : ALL_WORDS.filter((w) => themeById(w.theme)!.level <= st.profile.level && !w.fr.includes('…')).slice(0, 80)
    return pick(pool, 6)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId, set])

  const [i, setI] = useState(0)
  const [scores, setScores] = useState<Record<number, number>>({})
  const [done, setDone] = useState(false)
  const t = targets[i]

  if (!targets.length) {
    return (
      <Page>
        <PageHeader title="Tricky words" back="/sounds" emoji="🎯" />
        <Card className="p-8 text-center font-semibold text-ink-soft">No tricky words yet! Words you get wrong or say with a low score will appear here.</Card>
      </Page>
    )
  }

  const finish = () => {
    setDone(true)
    st.completeTask('speak')
    st.addXp(10)
    sfx.done()
    const vals = Object.values(scores)
    if (vals.length && vals.reduce((a, b) => a + b, 0) / vals.length >= 75) celebrate()
  }

  if (done) {
    const vals = Object.entries(scores)
    const avg = vals.length ? Math.round(vals.reduce((a, [, b]) => a + b, 0) / vals.length) : 0
    return (
      <Page>
        <Card className="mx-auto max-w-lg p-8 text-center">
          <div className="text-6xl">{avg >= 80 ? '🌟' : avg >= 60 ? '👏' : '💪'}</div>
          <h1 className="mt-2 text-3xl font-extrabold">{vals.length ? `Average ${avg}%` : 'Workout done!'}</h1>
          <div className="mt-5 space-y-2 text-left">
            {targets.map((x, k) => (
              <div key={k} className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2">
                <span className="text-xl">{x.emoji}</span>
                <span className="flex-1 font-bold">{x.fr}</span>
                <SpeakButton text={x.fr} size="sm" />
                <span className={`w-12 text-right font-extrabold ${scores[k] === undefined ? 'text-ink-soft' : scores[k] >= 75 ? 'text-menthe' : scores[k] >= 55 ? 'text-[#c98a00]' : 'text-rouge'}`}>{scores[k] === undefined ? '—' : scores[k] + '%'}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setI(0)
                setScores({})
                setDone(false)
              }}
            >
              Again
            </Button>
            <Button onClick={() => nav('/')}>Done</Button>
          </div>
        </Card>
      </Page>
    )
  }

  return (
    <Page>
      <div className="mx-auto max-w-xl">
        <PageHeader title="Say it!" subtitle={themeId ? themeById(themeId)?.title : set === 'weak' ? 'Your tricky words' : 'Pronunciation workout'} back={true} emoji="🎤" />
        <div className="mb-4 flex items-center gap-3">
          <Progress value={i / targets.length} color="bg-gradient-to-r from-rouge to-soleil" />
          <span className="text-sm font-extrabold text-ink-soft">
            {i + 1}/{targets.length}
          </span>
        </div>
        <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 text-center">
          <div className="text-6xl">{t.emoji}</div>
          <div className="mt-3 font-display text-3xl sm:text-4xl font-extrabold leading-tight">{t.fr}</div>
          <div className="mt-1 font-semibold text-ink-soft">{t.en}</div>
          <div className="mt-4 flex justify-center">
            <AudioPair text={t.fr} size="lg" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {hintsFor(t.fr).map((h) => (
              <Link key={h.label} to={`/sounds/${h.sound}`} className="rounded-full bg-lavande-soft px-2.5 py-1 text-xs font-extrabold text-[#5b3cc4]">
                {h.label}: {h.tip}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <SayIt
              target={t.fr}
              onScore={(sc) => {
                const pct = Math.round(sc.score * 100)
                setScores((x) => ({ ...x, [i]: Math.max(x[i] ?? 0, pct) }))
                if (t.id) st.savePron(t.id, pct)
                st.logAnswer('pron', pct >= 60)
                if (pct >= 60) {
                  st.addXp(3)
                  sfx.right()
                }
              }}
            />
          </div>
          <div className="mt-5 flex justify-center">
            <RecordCompare target={t.fr} />
          </div>
        </motion.div>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => (i + 1 < targets.length ? setI(i + 1) : finish())}>
            {scores[i] === undefined ? 'Skip' : 'Next'} <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </Page>
  )
}
