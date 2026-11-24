import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, ChevronRight, Flame, CalendarClock, Clock } from 'lucide-react'
import { useStore, streak, levelFromXp, wordStats, daysUntil } from '../lib/store'
import { dailyPlan } from '../lib/plan'
import { todayKey } from '../lib/text'
import { ALL_WORDS, themeById } from '../data/vocab'
import { CULTURE } from '../data/culture'
import { Page, Ring, Progress, Card, Rich } from '../components/ui'
import { AudioPair, SayIt } from '../components/audio'
import { hintsFor } from '../lib/phonics'

export function Home() {
  const s = useStore()
  const today = s.days[todayKey()]
  const xpToday = today?.xp ?? 0
  const done = today?.tasks ?? []
  const plan = dailyPlan()
  const st = streak(s.days)
  const lvl = levelFromXp(s.xp)
  const ws = wordStats(s.words)
  const dateFr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const dayNum = Math.floor(Date.now() / 86400000)
  const levelWords = ALL_WORDS.filter((w) => themeById(w.theme)!.level <= s.profile.level && !w.fr.includes('…'))
  const wotd = levelWords[(dayNum * 7919) % levelWords.length]
  const fact = CULTURE[dayNum % CULTURE.length]
  const upcoming = [...s.assessments].filter((a) => daysUntil(a.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0]
  const allDone = plan.every((t) => done.includes(t.id))
  const greeting = new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <Page>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-bleu via-[#4b4fd8] to-lavande p-6 sm:p-8 text-white shadow-[var(--shadow-lift)]">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-rouge/30 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold capitalize text-white/75">{dateFr}</div>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">
              {greeting}{s.profile.name ? `, ${s.profile.name}` : ''} ! 👋
            </h1>
            <p className="mt-2 max-w-md font-semibold text-white/85">{allDone ? 'You finished today’s plan. Incroyable ! Come back tomorrow to keep your streak.' : 'Your plan for today is ready. Petit à petit, l’oiseau fait son nid — little by little!'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-extrabold">
                <Flame size={16} className="text-soleil" /> {st} day streak
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-extrabold">⭐ Level {lvl.level}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-extrabold">📚 {ws.seen} words</span>
            </div>
            <div className="mt-4 max-w-xs">
              <div className="mb-1 text-xs font-bold text-white/70">
                Level {lvl.level} → {lvl.level + 1}: {lvl.into} / {lvl.span} XP
              </div>
              <Progress value={lvl.into / lvl.span} color="bg-soleil" className="bg-white/20" />
            </div>
          </div>
          <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
            <Ring value={xpToday / s.profile.dailyGoal} size={120} stroke={12} color="#ffc94d">
              <div>
                <div className="font-display text-3xl font-extrabold">{xpToday}</div>
                <div className="text-[11px] font-bold text-white/75">/ {s.profile.dailyGoal} XP</div>
              </div>
            </Ring>
            <div className="mt-1 text-center text-xs font-extrabold text-white/80">Daily goal</div>
          </div>
        </div>
      </motion.div>

      {upcoming && (
        <Link to="/planner" className="mt-4 flex items-center gap-3 rounded-2xl bg-rouge-soft px-4 py-3 font-bold text-[#b0283f] lift">
          <CalendarClock size={20} />
          <span className="flex-1">
            {upcoming.title} — {daysUntil(upcoming.date) === 0 ? 'today!' : `in ${daysUntil(upcoming.date)} day${daysUntil(upcoming.date) > 1 ? 's' : ''}`}
          </span>
          <ChevronRight size={18} />
        </Link>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Plan */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold">Today’s plan</h2>
            <span className="text-sm font-bold text-ink-soft">
              {plan.filter((t) => done.includes(t.id)).length}/{plan.length} done · ~{plan.reduce((a, t) => a + t.minutes, 0)} min
            </span>
          </div>
          <div className="space-y-3">
            {plan.map((t, k) => {
              const isDone = done.includes(t.id)
              return (
                <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * k }}>
                  <Link to={t.to} className={`card lift flex items-center gap-4 p-3.5 ${isDone ? 'opacity-70' : ''}`}>
                    <div className={`hue-${t.hue} grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl shadow-sm`}>{t.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-extrabold leading-tight ${isDone ? 'line-through decoration-2' : ''}`}>{t.title}</div>
                      <div className="truncate text-sm font-semibold text-ink-soft">{t.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-ink-soft">
                      <Clock size={13} /> {t.minutes}m
                    </div>
                    <div className={`grid h-9 w-9 place-items-center rounded-full ${isDone ? 'bg-menthe text-white' : 'border-2 border-line text-transparent'}`}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { n: ws.learning, l: 'Learning', c: 'text-bleu', bg: 'bg-bleu-soft' },
              { n: ws.mastered, l: 'Mastered', c: 'text-[#0f7a66]', bg: 'bg-menthe-soft' },
              { n: ws.due, l: 'Due now', c: 'text-[#b0283f]', bg: 'bg-rouge-soft' },
            ].map((x) => (
              <div key={x.l} className={`rounded-2xl ${x.bg} p-3 text-center`}>
                <div className={`font-display text-2xl font-extrabold ${x.c}`}>{x.n}</div>
                <div className="text-xs font-bold text-ink-soft">{x.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Side */}
        <section className="space-y-4">
          <Card className="overflow-hidden">
            <div className="hue-rose px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white">Mot du jour · Word of the day</div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-4xl">{wotd.emoji}</div>
                  <div className="mt-1 font-display text-2xl font-extrabold">{wotd.fr}</div>
                  <div className="font-semibold text-ink-soft">{wotd.en}</div>
                </div>
                <AudioPair text={wotd.fr} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {hintsFor(wotd.fr).map((h) => (
                  <Link key={h.label} to={`/sounds/${h.sound}`} title={h.tip} className="rounded-full bg-lavande-soft px-2.5 py-1 text-xs font-extrabold text-[#5b3cc4]">
                    {h.label}: {h.tip}
                  </Link>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-cream p-3">
                <SayIt target={wotd.fr} compact />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-menthe">Le saviez-vous ? · Did you know?</div>
            <div className="mt-2 flex gap-3">
              <span className="text-3xl">{fact.emoji}</span>
              <p className="font-semibold leading-relaxed">
                <Rich text={fact.fact} />
              </p>
            </div>
            <Link to="/culture" className="mt-3 inline-flex items-center text-sm font-extrabold text-bleu">
              More culture <ChevronRight size={16} />
            </Link>
          </Card>
        </section>
      </div>
    </Page>
  )
}
