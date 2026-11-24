import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayKey, daysBetween } from './text'

// Leitner-style spaced repetition: box → days until next review
export const INTERVALS = [0, 1, 2, 4, 8, 16, 35]
const DAY = 86400000

export interface WordState {
  box: number
  due: number
  right: number
  wrong: number
  last: number
}
export interface Tally {
  r: number
  w: number
}
export interface DayLog {
  xp: number
  minutes: number
  tasks: string[]
  answers: number
}
export interface ExamResult {
  date: number
  score: number
  total: number
  sections: Record<string, [number, number]>
}
export interface Assessment {
  id: string
  title: string
  date: string
  kind: string
  notes: string
}

export interface Profile {
  name: string
  level: 9 | 10
  placed: boolean
  dailyGoal: number
  voiceURI?: string
  rate: number
  pin?: string
  focus: string[] // vocab theme ids to prioritise
  newPerDay: number
  sound: boolean
}

interface State {
  profile: Profile
  words: Record<string, WordState>
  tags: Record<string, Tally>
  days: Record<string, DayLog>
  grammar: Record<string, { best: number; attempts: number }>
  scores: Record<string, number> // best % for listening/reading/sounds items, keyed "listen:id"
  pron: Record<string, { best: number; attempts: number }>
  exams: ExamResult[]
  writing: { date: number; taskId: string; words: number; score: number }[]
  assessments: Assessment[]
  badges: Record<string, number>
  xp: number
  lastBadge?: string

  setProfile: (p: Partial<Profile>) => void
  addXp: (n: number) => void
  logAnswer: (tag: string, ok: boolean) => void
  reviewWord: (id: string, ok: boolean) => void
  introduceWords: (ids: string[]) => void
  completeTask: (id: string) => void
  saveGrammar: (id: string, pct: number) => void
  saveScore: (key: string, pct: number) => void
  savePron: (id: string, pct: number) => void
  saveExam: (e: ExamResult) => void
  saveWriting: (w: State['writing'][number]) => void
  setAssessments: (a: Assessment[]) => void
  addMinute: () => void
  clearBadge: () => void
  importAll: (json: string) => boolean
  resetAll: () => void
}

const emptyDay = (): DayLog => ({ xp: 0, minutes: 0, tasks: [], answers: 0 })

const initial = {
  profile: { name: '', level: 9 as const, placed: false, dailyGoal: 60, rate: 0.9, focus: [], newPerDay: 8, sound: true },
  words: {},
  tags: {},
  days: {},
  grammar: {},
  scores: {},
  pron: {},
  exams: [],
  writing: [],
  assessments: [],
  badges: {},
  xp: 0,
}

function touchDay(days: Record<string, DayLog>, f: (d: DayLog) => DayLog) {
  const k = todayKey()
  return { ...days, [k]: f({ ...(days[k] ?? emptyDay()) }) }
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      addXp: (n) => {
        set((s) => ({ xp: s.xp + n, days: touchDay(s.days, (d) => ({ ...d, xp: d.xp + n })) }))
        checkBadges()
      },
      logAnswer: (tag, ok) =>
        set((s) => {
          const t = s.tags[tag] ?? { r: 0, w: 0 }
          return {
            tags: { ...s.tags, [tag]: ok ? { ...t, r: t.r + 1 } : { ...t, w: t.w + 1 } },
            days: touchDay(s.days, (d) => ({ ...d, answers: d.answers + 1 })),
          }
        }),
      reviewWord: (id, ok) => {
        set((s) => {
          const w = s.words[id] ?? { box: 0, due: 0, right: 0, wrong: 0, last: 0 }
          const box = ok ? Math.min(w.box + 1, INTERVALS.length - 1) : Math.max(1, w.box - 2)
          // a wrong answer comes back later today; a right one waits for its interval
          const due = ok ? startOfDay() + INTERVALS[box] * DAY : Date.now() + 10 * 60000
          return { words: { ...s.words, [id]: { box, due, right: w.right + (ok ? 1 : 0), wrong: w.wrong + (ok ? 0 : 1), last: Date.now() } } }
        })
        checkBadges()
      },
      introduceWords: (ids) =>
        set((s) => {
          const words = { ...s.words }
          ids.forEach((id) => {
            if (!words[id]) words[id] = { box: 1, due: startOfDay() + DAY, right: 0, wrong: 0, last: Date.now() }
          })
          return { words }
        }),
      completeTask: (id) => {
        set((s) => ({ days: touchDay(s.days, (d) => (d.tasks.includes(id) ? d : { ...d, tasks: [...d.tasks, id] })) }))
        checkBadges()
      },
      saveGrammar: (id, pct) => {
        set((s) => {
          const g = s.grammar[id] ?? { best: 0, attempts: 0 }
          return { grammar: { ...s.grammar, [id]: { best: Math.max(g.best, pct), attempts: g.attempts + 1 } } }
        })
        checkBadges()
      },
      saveScore: (key, pct) => set((s) => ({ scores: { ...s.scores, [key]: Math.max(s.scores[key] ?? 0, pct) } })),
      savePron: (id, pct) => {
        set((s) => {
          const p = s.pron[id] ?? { best: 0, attempts: 0 }
          return { pron: { ...s.pron, [id]: { best: Math.max(p.best, pct), attempts: p.attempts + 1 } } }
        })
        checkBadges()
      },
      saveExam: (e) => {
        set((s) => ({ exams: [...s.exams, e] }))
        checkBadges()
      },
      saveWriting: (w) => {
        set((s) => ({ writing: [...s.writing, w] }))
        checkBadges()
      },
      setAssessments: (a) => set({ assessments: a }),
      addMinute: () => set((s) => ({ days: touchDay(s.days, (d) => ({ ...d, minutes: d.minutes + 1 })) })),
      clearBadge: () => set({ lastBadge: undefined }),
      importAll: (json) => {
        try {
          const data = JSON.parse(json)
          const st = data.state ?? data
          if (!st.profile || !st.words) return false
          set({ ...initial, ...st })
          return true
        } catch {
          return false
        }
      },
      resetAll: () => set({ ...initial }),
    }),
    { name: 'allez-french-v1', version: 1 },
  ),
)

function startOfDay() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// ---------- derived values ----------

export function streak(days: Record<string, DayLog>): number {
  let n = 0
  const d = new Date()
  if (!(days[todayKey(d)]?.xp > 0)) d.setDate(d.getDate() - 1) // today not done yet: count from yesterday
  while (days[todayKey(d)]?.xp > 0) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function levelFromXp(xp: number) {
  // level n needs 100 * n * (n+1) / 2 xp in total
  let lvl = 1
  while (xp >= (100 * lvl * (lvl + 1)) / 2) lvl++
  const prev = (100 * (lvl - 1) * lvl) / 2
  const next = (100 * lvl * (lvl + 1)) / 2
  return { level: lvl, into: xp - prev, span: next - prev }
}

export function wordStats(words: Record<string, WordState>) {
  const all = Object.values(words)
  return {
    learning: all.filter((w) => w.box >= 1 && w.box < 4).length,
    mastered: all.filter((w) => w.box >= 4).length,
    seen: all.length,
    due: all.filter((w) => w.due <= Date.now()).length,
  }
}

export const isDue = (w?: WordState) => !!w && w.due <= Date.now()

export function accuracy(t?: Tally) {
  if (!t || t.r + t.w === 0) return null
  return t.r / (t.r + t.w)
}

// ---------- badges ----------

export const BADGES: { id: string; emoji: string; title: string; desc: string }[] = [
  { id: 'first', emoji: '🌱', title: 'Bonjour !', desc: 'Earn your first XP' },
  { id: 'streak3', emoji: '🔥', title: 'On fire', desc: '3-day streak' },
  { id: 'streak7', emoji: '🏅', title: 'Une semaine', desc: '7-day streak' },
  { id: 'streak30', emoji: '👑', title: 'Unstoppable', desc: '30-day streak' },
  { id: 'words50', emoji: '📗', title: '50 mots', desc: 'Learn 50 words' },
  { id: 'words150', emoji: '📘', title: '150 mots', desc: 'Learn 150 words' },
  { id: 'words300', emoji: '📚', title: '300 mots', desc: 'Learn 300 words' },
  { id: 'master50', emoji: '💎', title: 'Word master', desc: 'Master 50 words' },
  { id: 'grammar1', emoji: '🧩', title: 'Rule breaker', desc: 'Score 80%+ on a grammar topic' },
  { id: 'grammar10', emoji: '🧠', title: 'Grammar guru', desc: '80%+ on 10 grammar topics' },
  { id: 'pron20', emoji: '🎤', title: 'Belle voix', desc: 'Say 20 words with 80%+' },
  { id: 'exam1', emoji: '📝', title: 'Exam ready', desc: 'Finish a mock exam' },
  { id: 'writer', emoji: '✍️', title: 'Écrivain', desc: 'Complete a writing task' },
  { id: 'xp1000', emoji: '⭐', title: '1000 XP', desc: 'Earn 1000 XP' },
]

function checkBadges() {
  const s = useStore.getState()
  const ws = wordStats(s.words)
  const st = streak(s.days)
  const earned: Record<string, boolean> = {
    first: s.xp > 0,
    streak3: st >= 3,
    streak7: st >= 7,
    streak30: st >= 30,
    words50: ws.seen >= 50,
    words150: ws.seen >= 150,
    words300: ws.seen >= 300,
    master50: ws.mastered >= 50,
    grammar1: Object.values(s.grammar).some((g) => g.best >= 80),
    grammar10: Object.values(s.grammar).filter((g) => g.best >= 80).length >= 10,
    pron20: Object.values(s.pron).filter((p) => p.best >= 80).length >= 20,
    exam1: s.exams.length > 0,
    writer: s.writing.length > 0,
    xp1000: s.xp >= 1000,
  }
  const add: Record<string, number> = {}
  let last: string | undefined
  for (const [id, ok] of Object.entries(earned)) {
    if (ok && !s.badges[id]) {
      add[id] = Date.now()
      last = id
    }
  }
  if (last) useStore.setState({ badges: { ...s.badges, ...add }, lastBadge: last })
}

export function daysUntil(date: string) {
  return daysBetween(todayKey(), date)
}
