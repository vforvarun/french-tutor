import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Home, BookOpen, Mic, Puzzle, Headphones, GraduationCap, BarChart3, Settings, LayoutGrid, Flame } from 'lucide-react'
import { useStore, streak, BADGES, levelFromXp } from '../lib/store'
import { configureVoice } from '../lib/speech'
import { celebrate } from '../lib/fx'

const NAV = [
  { to: '/', label: 'Aujourd’hui', sub: 'Today', icon: Home, end: true },
  { to: '/vocab', label: 'Mots', sub: 'Vocabulary', icon: BookOpen },
  { to: '/sounds', label: 'Prononciation', sub: 'Pronunciation', icon: Mic },
  { to: '/grammar', label: 'Grammaire', sub: 'Grammar & verbs', icon: Puzzle },
  { to: '/skills', label: 'Écouter & lire', sub: 'Listening & reading', icon: Headphones },
  { to: '/exam', label: 'Examens', sub: 'Exam prep', icon: GraduationCap },
  { to: '/progress', label: 'Progrès', sub: 'Progress & badges', icon: BarChart3 },
]

const MOBILE = [
  { to: '/', label: 'Today', icon: Home, end: true },
  { to: '/vocab', label: 'Words', icon: BookOpen },
  { to: '/sounds', label: 'Speak', icon: Mic },
  { to: '/grammar', label: 'Grammar', icon: Puzzle },
  { to: '/more', label: 'More', icon: LayoutGrid },
]

export function Layout() {
  const profile = useStore((s) => s.profile)
  const days = useStore((s) => s.days)
  const xp = useStore((s) => s.xp)
  const lastBadge = useStore((s) => s.lastBadge)
  const clearBadge = useStore((s) => s.clearBadge)
  const addMinute = useStore((s) => s.addMinute)
  const loc = useLocation()
  const lastActive = useRef(Date.now())

  useEffect(() => {
    configureVoice(profile.voiceURI, profile.rate)
  }, [profile.voiceURI, profile.rate])

  // Study-time tracker: counts a minute when the app is visible and was used recently
  useEffect(() => {
    const bump = () => (lastActive.current = Date.now())
    window.addEventListener('pointerdown', bump)
    window.addEventListener('keydown', bump)
    const t = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastActive.current < 90000) addMinute()
    }, 60000)
    return () => {
      window.removeEventListener('pointerdown', bump)
      window.removeEventListener('keydown', bump)
      clearInterval(t)
    }
  }, [addMinute])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc.pathname])

  useEffect(() => {
    if (!lastBadge) return
    celebrate()
    const t = setTimeout(clearBadge, 4500)
    return () => clearTimeout(t)
  }, [lastBadge, clearBadge])

  const badge = BADGES.find((b) => b.id === lastBadge)
  const st = streak(days)
  const lvl = levelFromXp(xp)
  const focusMode = /\/(learn|practice|quiz|match|mock|review)(\/|$)/.test(loc.pathname) || loc.pathname === '/review' || loc.pathname === '/welcome'

  return (
    <div className="min-h-dvh lg:flex">
      {!focusMode && (
        <aside className="no-print sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r border-line/70 bg-white/60 px-4 py-6 backdrop-blur lg:flex">
          <div className="flex items-center gap-3 px-2">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} className="h-11 w-11 rounded-2xl shadow" alt="" />
            <div>
              <div className="font-display text-2xl font-extrabold leading-none">Allez !</div>
              <div className="text-xs font-bold text-ink-soft">French · Years 9–10</div>
            </div>
          </div>
          <div className="mt-5 flex gap-2 px-1">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-soleil-soft px-3 py-2">
              <Flame className="text-[#ff8a00]" size={20} />
              <div>
                <div className="font-extrabold leading-none">{st}</div>
                <div className="text-[10px] font-bold text-ink-soft">day streak</div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-bleu-soft px-3 py-2">
              <span className="text-lg">⭐</span>
              <div>
                <div className="font-extrabold leading-none">Niv. {lvl.level}</div>
                <div className="text-[10px] font-bold text-ink-soft">{xp} XP</div>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${isActive ? 'bg-bleu text-white shadow-md' : 'text-ink hover:bg-black/[0.04]'}`}
              >
                {({ isActive }) => (
                  <>
                    <n.icon size={20} className={isActive ? '' : 'text-bleu'} />
                    <div className="leading-tight">
                      <div className="font-extrabold">{n.label}</div>
                      <div className={`text-xs font-semibold ${isActive ? 'text-white/75' : 'text-ink-soft'}`}>{n.sub}</div>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 font-bold ${isActive ? 'bg-black/5' : 'text-ink-soft hover:bg-black/[0.04]'}`}>
            <Settings size={18} /> Settings
          </NavLink>
          <div className="tri mt-4 h-1.5 rounded-full opacity-80" />
        </aside>
      )}

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      {!focusMode && (
        <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 backdrop-blur-lg pb-safe lg:hidden">
          <div className="mx-auto flex max-w-xl justify-around px-2 pt-1.5">
            {MOBILE.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex min-w-16 flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] font-extrabold transition ${isActive ? 'text-bleu' : 'text-ink-soft'}`}>
                {({ isActive }) => (
                  <>
                    <span className={`grid h-8 w-12 place-items-center rounded-full transition ${isActive ? 'bg-bleu-soft' : ''}`}>
                      <n.icon size={21} />
                    </span>
                    {n.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      <AnimatePresence>
        {badge && (
          <motion.div initial={{ opacity: 0, y: -40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30 }} className="fixed left-1/2 top-4 z-50 -translate-x-1/2" onClick={clearBadge}>
            <div className="flex items-center gap-3 rounded-3xl bg-ink px-5 py-3 text-white shadow-2xl">
              <span className="text-4xl">{badge.emoji}</span>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-soleil">New badge!</div>
                <div className="font-display text-lg font-bold">{badge.title}</div>
                <div className="text-sm text-white/70">{badge.desc}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
