export type Q =
  | {
      kind: 'mcq'
      prompt: string
      hint?: string
      say?: string // play this audio (French)
      hideText?: boolean // listening item: don't show `say`
      options: string[] // options[answer] is correct
      answer: number
      explain?: string
      tag: string
      wordId?: string
    }
  | {
      kind: 'type'
      prompt: string
      hint?: string
      say?: string
      hideText?: boolean
      answers: string[]
      explain?: string
      tag: string
      wordId?: string
    }
  | {
      kind: 'speak'
      prompt: string
      target: string
      en?: string
      tag: string
      wordId?: string
    }

/** MCQ helper: correct answer first; options are shuffled when shown. */
export const mcq = (prompt: string, correct: string, wrong: string[], explain?: string, tag = ''): Q => ({
  kind: 'mcq',
  prompt,
  options: [correct, ...wrong],
  answer: 0,
  explain,
  tag,
})

export const typed = (prompt: string, answers: string | string[], explain?: string, tag = ''): Q => ({
  kind: 'type',
  prompt,
  answers: Array.isArray(answers) ? answers : [answers],
  explain,
  tag,
})

export interface QResult {
  q: Q
  ok: boolean
  given: string
}
