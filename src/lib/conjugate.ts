import { VERBS, type Verb } from '../data/verbs'

export type Tense = 'present' | 'passe' | 'imparfait' | 'proche' | 'futur' | 'conditionnel'

export const TENSES: { id: Tense; label: string; en: string; level: 9 | 10 }[] = [
  { id: 'present', label: 'Présent', en: 'Present', level: 9 },
  { id: 'passe', label: 'Passé composé', en: 'Perfect (past)', level: 9 },
  { id: 'proche', label: 'Futur proche', en: 'Near future', level: 9 },
  { id: 'imparfait', label: 'Imparfait', en: 'Imperfect (was …ing / used to)', level: 10 },
  { id: 'futur', label: 'Futur simple', en: 'Future (will)', level: 10 },
  { id: 'conditionnel', label: 'Conditionnel', en: 'Conditional (would)', level: 10 },
]

// Person index: 0 je,1 tu,2 il,3 elle,4 nous,5 vous,6 ils,7 elles
export const PERSONS = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles']
const SLOT = [0, 1, 2, 2, 3, 4, 5, 5] // which of the 6 forms
const REFL = ['me', 'te', 'se', 'se', 'nous', 'vous', 'se', 'se']

const ENDINGS = {
  er: ['e', 'es', 'e', 'ons', 'ez', 'ent'],
  ir: ['is', 'is', 'it', 'issons', 'issez', 'issent'],
  re: ['s', 's', '', 'ons', 'ez', 'ent'],
  imp: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
  fut: ['ai', 'as', 'a', 'ons', 'ez', 'ont'],
}

const vowelStart = (s: string) => /^[aeiouyhéèêàâîôû]/i.test(s)

function baseInf(v: Verb): string {
  return v.refl ? v.inf.replace(/^se |^s'/, '').replace(/ les dents$/, '') : v.inf
}
function tail(v: Verb): string {
  return v.inf.endsWith(' les dents') ? ' les dents' : ''
}

export function presentForms(v: Verb): string[] {
  if (v.present) return v.present.split(' ')
  const inf = baseInf(v)
  const stem = inf.slice(0, -2)
  return ENDINGS[v.kind === 'irr' ? 'er' : v.kind].map((e) => stem + e)
}

export function pastParticiple(v: Verb): string {
  if (v.pp) return v.pp
  const inf = baseInf(v)
  const stem = inf.slice(0, -2)
  if (v.kind === 'er') return stem + 'é'
  if (v.kind === 'ir') return stem + 'i'
  return stem + 'u'
}

function imparfaitStem(v: Verb): string {
  if (baseInf(v) === 'être') return 'ét'
  return presentForms(v)[3].replace(/ons$/, '')
}

function futurStem(v: Verb): string {
  if (v.fut) return v.fut
  const inf = baseInf(v)
  return inf.endsWith('re') ? inf.slice(0, -1) : inf
}

function joinStem(stem: string, ending: string): string {
  // mangeais / mangions, commençais / commencions
  if (ending.startsWith('i')) {
    if (stem.endsWith('ge')) return stem.slice(0, -1) + ending
    if (stem.endsWith('ç')) return stem.slice(0, -1) + 'c' + ending
  }
  return stem + ending
}

function withSubject(p: number, verbPart: string, v: Verb): string {
  const subj = PERSONS[p]
  if (v.refl) {
    const r = REFL[p]
    const pron = vowelStart(verbPart) && ['me', 'te', 'se'].includes(r) ? r[0] + "'" : r + ' '
    return subj + ' ' + pron + verbPart
  }
  if (p === 0 && vowelStart(verbPart)) return "j'" + verbPart
  return subj + ' ' + verbPart
}

function agree(pp: string, p: number, fem: boolean): string {
  if (pp === 'été' || pp === 'eu') return pp
  const plural = p >= 4
  const f = fem || p === 3 || p === 7
  return pp + (f ? 'e' : '') + (plural ? 's' : '')
}

export interface Conjugation {
  display: string // e.g. "je suis allé(e)"
  answers: string[] // accepted full answers
}

export function conjugate(v: Verb, tense: Tense, p: number): Conjugation {
  const s = SLOT[p]
  const t = tail(v)
  const make = (form: string) => withSubject(p, form, v) + t
  switch (tense) {
    case 'present': {
      const f = make(presentForms(v)[s])
      return { display: f, answers: [f] }
    }
    case 'imparfait': {
      const f = make(joinStem(imparfaitStem(v), ENDINGS.imp[s]))
      return { display: f, answers: [f] }
    }
    case 'futur': {
      const f = make(futurStem(v) + ENDINGS.fut[s])
      return { display: f, answers: [f] }
    }
    case 'conditionnel': {
      const f = make(futurStem(v) + ENDINGS.imp[s])
      return { display: f, answers: [f] }
    }
    case 'proche': {
      const aller = presentForms(VERBS.find((x) => x.inf === 'aller')!)[s]
      const r = REFL[p]
      const inf = v.refl ? (vowelStart(baseInf(v)) && r.length === 2 ? r[0] + "'" : r + ' ') + baseInf(v) : v.inf
      const f = `${PERSONS[p]} ${aller} ${inf}${t}`
      return { display: f, answers: [f] }
    }
    case 'passe': {
      const pp = pastParticiple(v)
      if (!v.etre) {
        const aux = presentForms(VERBS[1])[s]
        const f = (p === 0 ? "j'" : PERSONS[p] + ' ') + aux + ' ' + pp
        return { display: f, answers: [f] }
      }
      const etre = presentForms(VERBS[0])[s]
      const pre = v.refl ? withSubject(p, etre, v) : PERSONS[p] + ' ' + etre
      if (t) {
        // body-part reflexives (se brosser les dents): no agreement
        const f = `${pre} ${pp}${t}`
        return { display: f, answers: [f] }
      }
      const masc = `${pre} ${agree(pp, p, false)}${t}`
      const fem = `${pre} ${agree(pp, p, true)}${t}`
      if ([0, 1, 4, 5].includes(p) && masc !== fem) {
        const ppM = agree(pp, p, false)
        const shown = p >= 4 ? ppM.replace(/s$/, '(e)s') : ppM + '(e)'
        return { display: `${pre} ${shown}${t}`, answers: [masc, fem] }
      }
      return { display: masc, answers: [masc] }
    }
  }
}

export function table(v: Verb, tense: Tense): Conjugation[] {
  return [0, 1, 2, 4, 5, 6].map((p) => conjugate(v, tense, p))
}
