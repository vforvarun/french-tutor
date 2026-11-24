import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Copy, Check } from 'lucide-react'
import { useStore, streak, levelFromXp, wordStats, BADGES, accuracy, daysUntil, type Tally } from '../lib/store'
import { GRAMMAR } from '../data/grammar'
import { THEMES } from '../data/vocab'
import { weakWords } from '../lib/vocabQuiz'
import { todayKey } from '../lib/text'
import { Page, PageHeader, Card, Button, Progress } from '../components/ui'
import { SpeakButton } from '../components/audio'

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}

function Bars({ data, color = '#3b4cca', unit }: { data: { label: string; value: number; today?: boolean }[]; color?: string; unit: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex h-40 items-end gap-1.5">
      {data.map((d, i) => (
        <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
          <div className="pointer-events-none absolute -top-1 z-10 hidden -translate-y-full rounded-lg bg-ink px-2 py-1 text-xs font-bold text-white group-hover:block whitespace-nowrap">
            {d.value} {unit}
          </div>
          <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 4 : 2, background: d.value ? color : 'rgb(0 0 0 / 0.07)', opacity: d.today ? 1 : 0.8 }} />
          <div className={`mt-1 text-[10px] font-bold ${d.today ? 'text-ink' : 'text-ink-soft'}`}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

function sumTags(tags: Record<string, Tally>, pred: (k: string) => boolean): Tally {
  return Object.entries(tags)
    .filter(([k]) => pred(k))
    .reduce((a, [, t]) => ({ r: a.r + t.r, w: a.w + t.w }), { r: 0, w: 0 })
}

export function skillBreakdown(tags: Record<string, Tally>) {
  return [
    { label: 'Vocabulary', emoji: '📚', t: sumTags(tags, (k) => k.startsWith('v:')) },
    { label: 'Gender (le / la)', emoji: '⚧️', t: sumTags(tags, (k) => k === 'gender') },
    { label: 'Grammar', emoji: '🧩', t: sumTags(tags, (k) => k.startsWith('g:')) },
    { label: 'Verbs', emoji: '🏋️', t: sumTags(tags, (k) => k.startsWith('verb:')) },
    { label: 'Pronunciation', emoji: '🎤', t: sumTags(tags, (k) => k.startsWith('pron')) },
    { label: 'Listening', emoji: '🎧', t: sumTags(tags, (k) => k === 'listening' || k === 'numbers') },
    { label: 'Reading', emoji: '📖', t: sumTags(tags, (k) => k === 'reading') },
  ]
}

export function weakAreas(tags: Record<string, Tally>) {
  const items: { label: string; to: string; acc: number; n: number }[] = []
  GRAMMAR.forEach((g) => {
    const t = tags['g:' + g.id]
    if (t && t.r + t.w >= 3) items.push({ label: `${g.emoji} ${g.title}`, to: `/grammar/${g.id}`, acc: accuracy(t)!, n: t.r + t.w })
  })
  THEMES.forEach((th) => {
    const t = tags['v:' + th.id]
    if (t && t.r + t.w >= 5) items.push({ label: `${th.emoji} ${th.title}`, to: `/vocab/${th.id}/practice`, acc: accuracy(t)!, n: t.r + t.w })
  })
  return items.filter((x) => x.acc < 0.8).sort((a, b) => a.acc - b.acc).slice(0, 6)
}

export function ProgressPage() {
  const s = useStore()
  const lvl = levelFromXp(s.xp)
  const ws = wordStats(s.words)
  const days = lastDays(14)
  const xpData = days.map((d) => ({ label: d.toLocaleDateString('en-AU', { weekday: 'narrow' }), value: s.days[todayKey(d)]?.xp ?? 0, today: todayKey(d) === todayKey() }))
  const week = lastDays(7).reduce((a, d) => a + (s.days[todayKey(d)]?.minutes ?? 0), 0)
  const weak = weakAreas(s.tags)
  const tricky = weakWords(s.words, 10)

  return (
    <Page>
      <PageHeader title="Progrès" subtitle="Look how far you’ve come!" emoji="📈" right={<Link to="/parent" className="rounded-xl px-3 py-2 text-sm font-extrabold text-ink-soft hover:bg-black/5">👪 Parent view</Link>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { v: `Lv ${lvl.level}`, l: `${s.xp} XP total`, c: 'from-bleu to-lavande' },
          { v: `${streak(s.days)} 🔥`, l: 'day streak', c: 'from-[#ff9f43] to-rouge' },
          { v: ws.mastered, l: `mastered · ${ws.seen} started`, c: 'from-menthe to-[#169e8a]' },
          { v: `${week} min`, l: 'studied this week', c: 'from-[#5aa9ff] to-bleu' },
        ].map((x) => (
          <div key={x.l} className={`rounded-3xl bg-gradient-to-br ${x.c} p-4 text-white shadow-md`}>
            <div className="font-display text-3xl font-extrabold">{x.v}</div>
            <div className="text-sm font-bold text-white/85">{x.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 font-extrabold">XP — last 14 days</div>
          <Bars data={xpData} unit="XP" />
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-extrabold">Accuracy by skill</div>
          <div className="space-y-3">
            {skillBreakdown(s.tags).map((x) => {
              const a = accuracy(x.t)
              return (
                <div key={x.label}>
                  <div className="flex justify-between text-sm font-extrabold">
                    <span>
                      {x.emoji} {x.label}
                    </span>
                    <span className="text-ink-soft">{a === null ? 'not started' : `${Math.round(a * 100)}% · ${x.t.r + x.t.w} answers`}</span>
                  </div>
                  <Progress value={a ?? 0} color={a === null ? 'bg-transparent' : a >= 0.8 ? 'bg-menthe' : a >= 0.6 ? 'bg-soleil' : 'bg-rouge'} className="mt-1 h-2.5" />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 font-extrabold">🎯 Focus areas</div>
          {weak.length === 0 ? (
            <div className="font-semibold text-ink-soft">Nothing below 80% yet — keep practising and your weak spots will show up here.</div>
          ) : (
            <div className="space-y-2">
              {weak.map((w) => (
                <Link key={w.to} to={w.to} className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2.5 hover:bg-bleu-soft">
                  <span className="flex-1 font-bold">{w.label}</span>
                  <span className={`font-extrabold ${w.acc >= 0.6 ? 'text-[#c98a00]' : 'text-rouge'}`}>{Math.round(w.acc * 100)}%</span>
                  <span className="text-sm font-extrabold text-bleu">Practise →</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-extrabold">🧠 Words to revise</div>
          {tricky.length === 0 ? (
            <div className="font-semibold text-ink-soft">No tricky words yet.</div>
          ) : (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {tricky.map((w) => (
                <div key={w.id} className="flex items-center gap-2 rounded-xl bg-cream px-2 py-1.5">
                  <SpeakButton text={w.fr} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold">{w.fr}</div>
                    <div className="truncate text-xs font-semibold text-ink-soft">{w.en}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">🏅 Badges</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {BADGES.map((b) => {
          const got = s.badges[b.id]
          return (
            <div key={b.id} className={`card p-3 text-center ${got ? '' : 'opacity-50 grayscale'}`}>
              <div className="text-4xl">{got ? b.emoji : '🔒'}</div>
              <div className="mt-1 text-sm font-extrabold leading-tight">{b.title}</div>
              <div className="text-[11px] font-semibold text-ink-soft">{b.desc}</div>
            </div>
          )
        })}
      </div>

      {s.exams.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 text-2xl font-extrabold">📝 Mock exams</h2>
          <Card className="p-5">
            <Bars data={s.exams.slice(-10).map((e) => ({ label: new Date(e.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric' }), value: Math.round((e.score / e.total) * 100) }))} color="#22b59a" unit="%" />
          </Card>
        </>
      )}
    </Page>
  )
}

function weeklySummary() {
  const s = useStore.getState()
  const week = lastDays(7)
  const mins = week.reduce((a, d) => a + (s.days[todayKey(d)]?.minutes ?? 0), 0)
  const active = week.filter((d) => (s.days[todayKey(d)]?.xp ?? 0) > 0).length
  const ws = wordStats(s.words)
  const grammarDone = Object.values(s.grammar).filter((g) => g.best >= 80).length
  const weak = weakAreas(s.tags)
  const lastExam = s.exams[s.exams.length - 1]
  const lines = [
    `French progress — week ending ${new Date().toLocaleDateString('en-AU')}`,
    `• Practised on ${active} of the last 7 days (${mins} minutes). Current streak: ${streak(s.days)} days.`,
    `• Vocabulary: ${ws.seen} words started, ${ws.mastered} mastered, ${ws.due} due for review.`,
    `• Grammar: ${grammarDone} of ${GRAMMAR.length} topics at 80%+.`,
    lastExam ? `• Latest mock exam: ${Math.round((lastExam.score / lastExam.total) * 100)}%.` : '• No mock exam taken yet.',
    weak.length ? `• Needs work: ${weak.map((w) => w.label.replace(/^\S+\s/, '') + ` (${Math.round(w.acc * 100)}%)`).join(', ')}.` : '• No weak areas flagged yet.',
  ]
  return lines.join('\n')
}

export function ParentPage() {
  const s = useStore()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [copied, setCopied] = useState(false)

  if (!unlocked) {
    const hasPin = !!s.profile.pin
    return (
      <Page>
        <PageHeader title="Parent dashboard" back="/progress" emoji="👪" />
        <Card className="mx-auto max-w-sm p-7 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-bleu-soft text-bleu">
            <Lock size={30} />
          </div>
          {hasPin ? (
            <>
              <div className="mt-4 font-extrabold">Enter parent PIN</div>
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" className="mt-3 w-full rounded-2xl border-2 border-line px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] outline-none focus:border-bleu" />
              <Button className="mt-4 w-full" onClick={() => (pin === s.profile.pin ? setUnlocked(true) : setPin(''))}>
                Unlock
              </Button>
            </>
          ) : (
            <>
              <div className="mt-4 font-extrabold">Create a parent PIN</div>
              <p className="text-sm font-semibold text-ink-soft">4–6 digits. Keeps this page private.</p>
              <input value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" className="mt-3 w-full rounded-2xl border-2 border-line px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] outline-none focus:border-bleu" />
              <Button
                className="mt-4 w-full"
                disabled={newPin.length < 4}
                onClick={() => {
                  s.setProfile({ pin: newPin })
                  setUnlocked(true)
                }}
              >
                Set PIN & open
              </Button>
            </>
          )}
        </Card>
      </Page>
    )
  }

  const days = lastDays(14)
  const minData = days.map((d) => ({ label: d.toLocaleDateString('en-AU', { weekday: 'narrow' }), value: s.days[todayKey(d)]?.minutes ?? 0, today: todayKey(d) === todayKey() }))
  const upcoming = [...s.assessments].filter((a) => daysUntil(a.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))
  const summary = weeklySummary()

  return (
    <Page>
      <PageHeader title="Parent dashboard" subtitle={s.profile.name ? `${s.profile.name}’s French at a glance` : 'French at a glance'} back="/progress" emoji="👪" />
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="font-extrabold">This week</div>
          <Button
            variant="soft"
            className="px-3 py-2 text-sm"
            onClick={() => {
              navigator.clipboard?.writeText(summary)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy summary'}
          </Button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-sans font-semibold leading-relaxed text-ink">{summary}</pre>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 font-extrabold">Minutes practised — last 14 days</div>
          <Bars data={minData} color="#22b59a" unit="min" />
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-extrabold">Accuracy by skill</div>
          <div className="space-y-3">
            {skillBreakdown(s.tags).map((x) => {
              const a = accuracy(x.t)
              return (
                <div key={x.label}>
                  <div className="flex justify-between text-sm font-extrabold">
                    <span>{x.label}</span>
                    <span className="text-ink-soft">{a === null ? '—' : `${Math.round(a * 100)}%`}</span>
                  </div>
                  <Progress value={a ?? 0} color={a !== null && a >= 0.8 ? 'bg-menthe' : a !== null && a >= 0.6 ? 'bg-soleil' : 'bg-rouge'} className="mt-1 h-2.5" />
                </div>
              )
            })}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-extrabold">Grammar topics</div>
          <div className="space-y-1.5">
            {GRAMMAR.filter((g) => g.level <= s.profile.level || s.grammar[g.id]).map((g) => {
              const b = s.grammar[g.id]?.best
              return (
                <div key={g.id} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 font-semibold">
                    {g.emoji} {g.title}
                  </span>
                  <span className={`font-extrabold ${b === undefined ? 'text-ink-soft' : b >= 80 ? 'text-menthe' : 'text-[#c98a00]'}`}>{b === undefined ? 'not yet' : b + '%'}</span>
                </div>
              )
            })}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-extrabold">Upcoming assessments</div>
          {upcoming.length === 0 ? (
            <div className="font-semibold text-ink-soft">None entered. You can add them in the Term planner.</div>
          ) : (
            upcoming.map((a) => (
              <div key={a.id} className="flex justify-between border-b border-line py-2 font-semibold last:border-0">
                <span>{a.title}</span>
                <span className="font-extrabold">{daysUntil(a.date)} days</span>
              </div>
            ))
          )}
          <div className="mt-4 mb-2 font-extrabold">Writing tasks completed</div>
          <div className="font-semibold text-ink-soft">{s.writing.length === 0 ? 'None yet' : `${s.writing.length} (latest: ${s.writing[s.writing.length - 1].words} words)`}</div>
        </Card>
      </div>
    </Page>
  )
}
