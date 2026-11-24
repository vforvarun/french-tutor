import { ALL_WORDS, THEMES, typeable, type Word } from '../data/vocab'
import type { Q } from './quiz'
import { pick, shuffle } from './text'
import type { WordState } from './store'

const bare = (fr: string) => fr.replace(/^(le |la |les |l')/i, '')

function distractors(w: Word, n: number, field: 'en' | 'fr'): string[] {
  const theme = THEMES.find((t) => t.id === w.theme)!
  const pool = theme.words.filter((x) => x.id !== w.id && x[field] !== w[field])
  const extra = pool.length >= n ? [] : ALL_WORDS.filter((x) => x.theme !== w.theme)
  return pick([...pool, ...pick(extra, n)], n).map((x) => x[field])
}

function forWord(w: Word, box: number, variety: number): Q {
  const tag = 'v:' + w.theme
  const canGender = /^(le|la) /i.test(w.fr)
  const stage = box <= 1 ? 0 : box <= 3 ? 1 : 2
  const choices: (() => Q)[] = []

  // stage 0: recognise
  const frToEn = (): Q => ({ kind: 'mcq', hint: 'What does this mean?', prompt: w.fr, say: w.fr, options: [w.en, ...distractors(w, 3, 'en')], answer: 0, tag, wordId: w.id })
  const listen = (): Q => ({ kind: 'mcq', hint: 'Listen — what did you hear?', prompt: 'Choose the meaning', say: w.fr, hideText: true, options: [w.en, ...distractors(w, 3, 'en')], answer: 0, tag, wordId: w.id, explain: `It was “${w.fr}”.` })
  // stage 1: recall from English
  const enToFr = (): Q => ({ kind: 'mcq', hint: 'How do you say…', prompt: `${w.emoji ? w.emoji + ' ' : ''}${w.en}`, options: [w.fr, ...distractors(w, 3, 'fr')], answer: 0, tag, wordId: w.id })
  const gender = (): Q => ({ kind: 'mcq', hint: 'Le ou la ?', prompt: `___ ${bare(w.fr)}  (${w.en})`, options: [w.fr.slice(0, 2).toLowerCase(), w.fr.toLowerCase().startsWith('le') ? 'la' : 'le'], answer: 0, tag: 'gender', wordId: w.id, explain: `${w.fr} is ${w.gender === 'm' ? 'masculine' : 'feminine'}.` })
  // stage 2: produce
  const type = (): Q => ({ kind: 'type', hint: 'Type it in French', prompt: `${w.emoji ? w.emoji + ' ' : ''}${w.en}`, answers: w.answers, tag, wordId: w.id, explain: /^(le|la|les|l')/i.test(w.fr) ? 'Include the article (le / la / l’ / les).' : undefined })

  if (stage === 0) choices.push(frToEn, listen, enToFr)
  if (stage === 1) {
    choices.push(enToFr, listen)
    if (canGender) choices.push(gender)
    if (typeable(w)) choices.push(type)
  }
  if (stage === 2) {
    if (typeable(w)) choices.push(type, type)
    choices.push(listen, enToFr)
    if (canGender) choices.push(gender)
  }
  return choices[variety % choices.length]()
}

export function buildPractice(words: Word[], states: Record<string, WordState>, rounds = 1): Q[] {
  const qs: Q[] = []
  for (let r = 0; r < rounds; r++) {
    shuffle(words).forEach((w) => qs.push(forWord(w, (states[w.id]?.box ?? 0) + r, Math.floor(Math.random() * 10))))
  }
  return qs
}

/** Pick the next words to learn, favouring focus themes and the student's level. */
export function nextNewWords(states: Record<string, WordState>, level: 9 | 10, focus: string[], n: number, themeId?: string): Word[] {
  const order = themeId
    ? THEMES.filter((t) => t.id === themeId)
    : [...THEMES.filter((t) => focus.includes(t.id)), ...THEMES.filter((t) => !focus.includes(t.id) && t.level <= level), ...THEMES.filter((t) => !focus.includes(t.id) && t.level > level)]
  const out: Word[] = []
  for (const t of order) {
    for (const w of t.words) {
      if (!states[w.id] && !out.includes(w)) out.push(w)
      if (out.length >= n) return out
    }
  }
  return out
}

export function dueWords(states: Record<string, WordState>, limit = 20): Word[] {
  const now = Date.now()
  return ALL_WORDS.filter((w) => states[w.id] && states[w.id].due <= now)
    .sort((a, b) => states[a.id].due - states[b.id].due)
    .slice(0, limit)
}

export function weakWords(states: Record<string, WordState>, limit = 12): Word[] {
  return ALL_WORDS.filter((w) => states[w.id] && states[w.id].wrong > 0)
    .sort((a, b) => states[b.id].wrong - states[b.id].right / 2 - (states[a.id].wrong - states[a.id].right / 2))
    .slice(0, limit)
}
