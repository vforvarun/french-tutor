// Text helpers: normalising answers, accent-lenient comparison, and a rough
// French "sounds-like" key used to be fair to speech recognition.

export function clean(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[.,!?;:«»"()¿¡…–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const ARTICLE = /^(le|la|les|l'|un|une|des|du|de la|de l')\s*/

export type Verdict = 'correct' | 'accent' | 'article' | 'wrong'

/** Compare a typed answer with the accepted answers. */
export function checkTyped(input: string, answers: string[]): Verdict {
  const a = clean(input)
  if (!a) return 'wrong'
  const accepted = answers.map(clean)
  if (accepted.includes(a)) return 'correct'
  const bare = stripAccents(a)
  if (accepted.some((x) => stripAccents(x) === bare)) return 'accent'
  // Right word, missing or wrong article (le/la) — important for gender.
  const noArt = (x: string) => stripAccents(x.replace(ARTICLE, ''))
  if (accepted.some((x) => ARTICLE.test(x) && noArt(x) === noArt(a))) return 'article'
  return 'wrong'
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[b.length]
}

export function similarity(a: string, b: string): number {
  if (!a && !b) return 1
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length)
}

/** Very rough phonetic key for a single French word (handles silent letters & spellings that sound alike). */
export function phonWord(w: string): string {
  let s = stripAccents(w.toLowerCase()).replace(/[^a-z']/g, '')
  s = s.replace(/^[a-z]'/, '') // l', d', j' …
  s = s
    .replace(/(ent)$/, (m) => (s.length > 4 ? '' : m))
    .replace(/(es|s|x|z|t|d|p)$/, '')
    .replace(/e$/, '')
    .replace(/(er|ez|et)$/, 'e')
    .replace(/eaux?|aux?/g, 'o')
    .replace(/ou/g, 'U')
    .replace(/oi/g, 'wa')
    .replace(/(ain|ein|in|im|un|um)(?![aeiouy])/g, 'I')
    .replace(/(an|am|en|em)(?![aeiouy])/g, 'A')
    .replace(/(on|om)(?![aeiouy])/g, 'O')
    .replace(/ai|ei/g, 'e')
    .replace(/eu|oe/g, 'E')
    .replace(/qu|q|ck/g, 'k')
    .replace(/ph/g, 'f')
    .replace(/ch/g, 'S')
    .replace(/gn/g, 'N')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/g(?=[eiy])/g, 'j')
    .replace(/c/g, 'k')
    .replace(/h/g, '')
    .replace(/y/g, 'i')
    .replace(/(.)\1+/g, '$1')
  return s
}

export function phonKey(s: string): string {
  return clean(s).split(' ').filter(Boolean).map(phonWord).join(' ')
}

export interface SpeechScore {
  score: number // 0..1
  heard: string
  words: { word: string; ok: boolean }[]
}

/** Score what the recogniser heard against the target phrase. */
export function scoreSpeech(target: string, alternatives: string[]): SpeechScore {
  const tWords = clean(target).split(' ').filter(Boolean)
  let best: SpeechScore = { score: 0, heard: alternatives[0] ?? '', words: tWords.map((w) => ({ word: w, ok: false })) }
  for (const alt of alternatives) {
    const textSim = similarity(stripAccents(clean(alt)), stripAccents(clean(target)))
    const phonSim = similarity(phonKey(alt), phonKey(target))
    const score = Math.max(textSim, phonSim * 0.97)
    if (score > best.score) {
      const heardKeys = new Set(clean(alt).split(' ').map(phonWord))
      const heardPlain = new Set(clean(alt).split(' ').map(stripAccents))
      best = {
        score,
        heard: alt,
        words: tWords.map((w) => ({ word: w, ok: heardPlain.has(stripAccents(w)) || heardKeys.has(phonWord(w)) })),
      }
    }
  }
  return best
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000)
}
