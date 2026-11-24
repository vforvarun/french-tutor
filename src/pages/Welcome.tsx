import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import { PLACEMENT } from '../data/placement'
import { QuizRunner } from '../components/QuizRunner'
import { Button, Page } from '../components/ui'
import { THEMES } from '../data/vocab'

export function Welcome() {
  const [step, setStep] = useState<'hello' | 'test' | 'result'>('hello')
  const [name, setName] = useState('')
  const [band, setBand] = useState<{ level: 9 | 10; msg: string; score: number } | null>(null)
  const { setProfile } = useStore()
  const nav = useNavigate()

  if (step === 'test') {
    return (
      <Page>
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-extrabold">Quick placement check</h1>
          <p className="font-semibold text-ink-soft">20 questions · no pressure — just do your best!</p>
        </div>
        <QuizRunner
          questions={PLACEMENT}
          xpPerRight={1}
          showEnd={false}
          onExit={() => {
            setProfile({ name: name.trim(), placed: true, level: 9 })
            nav('/')
          }}
          onFinish={(res) => {
            const by = (l: number) => res.filter((r) => r.q.tag === 'placement:' + l)
            const pct = (l: number) => by(l).filter((r) => r.ok).length / Math.max(1, by(l).length)
            const score = res.filter((r) => r.ok).length
            let b: { level: 9 | 10; msg: string }
            if (pct(1) < 0.6) b = { level: 9, msg: 'We’ll start with the Year 9 basics and build up your vocabulary step by step. That’s the fastest way to feel confident!' }
            else if (pct(2) < 0.6) b = { level: 9, msg: 'You know the basics. We’ll focus on Year 9 vocabulary, the past tense and key grammar.' }
            else if (pct(3) < 0.5) b = { level: 10, msg: 'Great foundations! You’re ready to start the Year 10 topics while we keep strengthening Year 9.' }
            else b = { level: 10, msg: 'Impressive! You’re working at Year 10 level. We’ll push your vocabulary and accuracy even further.' }
            setBand({ ...b, score })
            setProfile({ name: name.trim(), level: b.level })
            setStep('result')
          }}
        />
      </Page>
    )
  }

  if (step === 'result' && band) {
    return (
      <Page>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card mx-auto max-w-lg p-8 text-center">
          <div className="text-6xl">🎯</div>
          <h1 className="mt-3 text-3xl font-extrabold">You scored {band.score}/20</h1>
          <div className="mx-auto mt-3 inline-block rounded-full bg-bleu-soft px-4 py-1.5 font-extrabold text-bleu-deep">Starting level: Year {band.level}</div>
          <p className="mt-4 font-semibold leading-relaxed text-ink-soft">{band.msg}</p>
          <p className="mt-3 text-sm font-semibold text-ink-soft">You can change this any time in Settings.</p>
          <Button
            className="mt-6 w-full"
            onClick={() => {
              setProfile({ placed: true })
              nav('/')
            }}
          >
            Let’s go! Allons-y ! 🚀
          </Button>
        </motion.div>
      </Page>
    )
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-bleu via-[#5148d6] to-lavande text-white">
      <div className="pointer-events-none absolute inset-0">
        {THEMES.slice(0, 14).map((t, i) => (
          <motion.span
            key={t.id}
            className="absolute text-4xl opacity-25"
            style={{ left: `${(i * 37) % 95}%`, top: `${(i * 53) % 90}%` }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          >
            {t.emoji}
          </motion.span>
        ))}
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-10">
        <motion.img initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }} src={`${import.meta.env.BASE_URL}icon.svg`} className="h-24 w-24 rounded-3xl shadow-2xl" alt="" />
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6 text-5xl font-extrabold">
          Bienvenue !
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-3 text-lg font-semibold text-white/85">
          Your personal French coach for Years 9 & 10. Build your vocabulary, nail your pronunciation, master the grammar and get ready for your exams — a few minutes a day.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 rounded-3xl bg-white p-5 text-ink shadow-2xl">
          <label className="text-sm font-extrabold text-ink-soft">Comment tu t’appelles ? (What’s your name?)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="mt-2 w-full rounded-2xl border-2 border-line bg-cream/60 px-4 py-3 text-lg font-bold outline-none focus:border-bleu"
          />
          <Button className="mt-4 w-full" onClick={() => setStep('test')}>
            Start the placement check (5 min)
          </Button>
          <button
            className="mt-3 w-full text-sm font-bold text-ink-soft hover:text-ink"
            onClick={() => {
              setProfile({ name: name.trim(), placed: true, level: 9 })
              nav('/')
            }}
          >
            Skip — start at Year 9
          </button>
        </motion.div>
      </div>
    </div>
  )
}
