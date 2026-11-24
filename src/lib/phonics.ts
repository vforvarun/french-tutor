// Spots the tricky sounds in a French word and links each to a pronunciation lesson.

export interface Hint {
  label: string
  tip: string
  sound: string // SoundLesson id
}

const RULES: { re: RegExp; label: string; tip: string; sound: string }[] = [
  { re: /(?<![aeoqg])u(?![nm](?![aeiouy]))/, label: 'u', tip: 'Say “ee” with rounded lips', sound: 'u' },
  { re: /ou/, label: 'ou', tip: 'Like “oo” in food', sound: 'u' },
  { re: /r(?![^a-zà-ÿ]|$)|r(?<=(?:^|[^e])r)|(?:^|\s)(hiver|cher|mer|fer|hier|super|amer)(?=\s|$)/, label: 'r', tip: 'Soft gargle at the back of the throat', sound: 'r' },
  { re: /(an|am|en|em)(?=[^aeiouyn m]|$|\s)/, label: 'an / en', tip: 'Nasal “ahn” — no n sound', sound: 'nasal' },
  { re: /(on|om)(?=[^aeiouyn m]|$|\s)/, label: 'on', tip: 'Nasal “ohn” — no n sound', sound: 'nasal' },
  { re: /(in|im|ain|ein|un)(?=[^aeiouyn m]|$|\s)/, label: 'in / un', tip: 'Nasal “a” with a smile', sound: 'nasal' },
  { re: /eu|œu/, label: 'eu', tip: 'Like “ur” in fur, lips round', sound: 'eu' },
  { re: /oi/, label: 'oi', tip: 'Sounds like “wa”', sound: 'oi' },
  { re: /eau|au/, label: 'eau / au', tip: 'A short, pure “o”', sound: 'oi' },
  { re: /ch/, label: 'ch', tip: 'Sounds like “sh”', sound: 'ch-j' },
  { re: /j|g[eiy]/, label: 'j / soft g', tip: 'Like the s in “measure”', sound: 'ch-j' },
  { re: /gn/, label: 'gn', tip: 'Like “ny” in canyon', sound: 'gn-ill' },
  { re: /(?<!\bm|\bv|tranqu)ill/, label: 'ill', tip: 'Usually a “y” sound', sound: 'gn-ill' },
  { re: /(^|\s|')h/, label: 'h', tip: 'The h is silent', sound: 'h-th-qu' },
  { re: /qu/, label: 'qu', tip: 'Just “k” — no w', sound: 'h-th-qu' },
  { re: /ç/, label: 'ç', tip: 'Soft “s”', sound: 'h-th-qu' },
  { re: /[aeiouyéè]s[aeiouyé]/, label: 's → z', tip: 'Single s between vowels sounds like z', sound: 's-z' },
  { re: /tion\b/, label: '-tion', tip: 'Say “see-ohn”', sound: 'tion-ent' },
  { re: /é|er\b|ez\b/, label: 'é', tip: 'Crisp “ay”', sound: 'e-accents' },
  { re: /è|ê|ai(?!n)/, label: 'è / ai', tip: 'Open “e” as in bed', sound: 'e-accents' },
]

const SOUNDED = new Set(['bus', 'tennis', 'fils', 'huit', 'sept', 'net', 'ouest', 'sud', 'basket', 'short', 'match', 'skate', 'internet', 'stress', 'ours', 'sens', 'six', 'dix', 'mars'])

export function hintsFor(fr: string): Hint[] {
  // Look at the word without its article and without English-style extras
  const text = fr
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/^(le|la|les|l'|un|une|des)\s*/, '')
    .split(' / ')[0]
  const out: Hint[] = []
  const seen = new Set<string>()
  const erWord = /(^|\s)(hiver|cher|mer|fer|hier|super|amer)(\s|$)/.test(text) && !text.includes('é')
  for (const r of RULES) {
    if (erWord && r.label === 'é') continue
    if (r.re.test(text) && !seen.has(r.label)) {
      seen.add(r.label)
      out.push({ label: r.label, tip: r.tip, sound: r.sound })
    }
  }
  // silent final consonant
  const words = text.replace(/[?!.…]/g, '').trim().split(/\s+/)
  const last = words[words.length - 1] ?? ''
  if (/[stdxzp]$/.test(last) && !SOUNDED.has(last) && last.length > 2) {
    out.unshift({ label: `silent -${last.slice(-1)}`, tip: `Don’t pronounce the final ${last.slice(-1)}`, sound: 'silent' })
  } else if (/[^aeiouyé]e$/.test(last) && last.length > 2) {
    out.unshift({ label: 'silent -e', tip: 'Final e is silent — but say the consonant before it', sound: 'silent' })
  }
  return out.slice(0, 4)
}
