import { GRAMMAR } from '../data/grammar'
import { LISTENING } from '../data/listening'
import { READING } from '../data/reading'
import { themeById } from '../data/vocab'
import { useStore } from './store'
import { todayKey } from './text'
import { dueWords, nextNewWords } from './vocabQuiz'

export interface PlanTask {
  id: 'review' | 'learn' | 'speak' | 'grammar' | 'skill'
  title: string
  subtitle: string
  emoji: string
  to: string
  minutes: number
  hue: string
}

export function dailyPlan(): PlanTask[] {
  const s = useStore.getState()
  const level = s.profile.level
  const tasks: PlanTask[] = []

  const due = dueWords(s.words, 25).length
  if (due > 0) tasks.push({ id: 'review', title: `Review ${due} word${due > 1 ? 's' : ''}`, subtitle: 'Spaced repetition — lock them into memory', emoji: '🧠', to: '/review', minutes: 4, hue: 'violet' })

  const fresh = nextNewWords(s.words, level, s.profile.focus, s.profile.newPerDay)
  if (fresh.length) {
    const t = themeById(fresh[0].theme)!
    tasks.push({ id: 'learn', title: `Learn ${fresh.length} new words`, subtitle: `${t.emoji} ${t.title}`, emoji: '✨', to: `/vocab/${t.id}/learn`, minutes: 5, hue: 'sky' })
  }

  tasks.push({ id: 'speak', title: 'Pronunciation workout', subtitle: 'Say 6 words out loud', emoji: '🎤', to: '/say', minutes: 3, hue: 'rose' })

  const g =
    GRAMMAR.filter((x) => x.level <= level).find((x) => !s.grammar[x.id]) ??
    [...GRAMMAR.filter((x) => x.level <= level)].sort((a, b) => (s.grammar[a.id]?.best ?? 0) - (s.grammar[b.id]?.best ?? 0))[0]
  tasks.push({ id: 'grammar', title: g.title, subtitle: `Grammar · ${g.en}`, emoji: g.emoji, to: `/grammar/${g.id}`, minutes: 5, hue: 'amber' })

  // alternate listening / reading by day
  const dayNum = Math.floor(new Date(todayKey()).getTime() / 86400000)
  if (dayNum % 2 === 0) {
    const l = LISTENING.filter((x) => x.level <= level).find((x) => s.scores['listen:' + x.id] === undefined) ?? LISTENING[dayNum % LISTENING.length]
    tasks.push({ id: 'skill', title: l.title, subtitle: 'Listening', emoji: '🎧', to: `/listen/${l.id}`, minutes: 4, hue: 'teal' })
  } else {
    const r = READING.filter((x) => x.level <= level).find((x) => s.scores['read:' + x.id] === undefined) ?? READING[dayNum % READING.length]
    tasks.push({ id: 'skill', title: r.title, subtitle: 'Reading', emoji: '📖', to: `/read/${r.id}`, minutes: 5, hue: 'green' })
  }
  return tasks
}
