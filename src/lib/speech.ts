// Text-to-speech and speech recognition using the browser's built-in engines.
// Works in Edge/Chrome on Windows and Safari on iPad.

let voicesCache: SpeechSynthesisVoice[] = []

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

function loadVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported) return []
  const v = window.speechSynthesis.getVoices().filter((x) => x.lang.toLowerCase().startsWith('fr'))
  if (v.length) voicesCache = v
  return voicesCache
}
if (ttsSupported) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
}

const QUALITY = ['natural', 'online', 'premium', 'enhanced', 'google', 'amélie', 'amelie', 'thomas', 'denise', 'henri', 'audrey', 'marie', 'eloise', 'vivienne']

function rank(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase()
  let r = 0
  QUALITY.forEach((q, i) => {
    if (n.includes(q)) r += 100 - i
  })
  if (v.lang === 'fr-FR') r += 20
  if (v.lang === 'fr-CA') r -= 5
  return r
}

export function frenchVoices(): SpeechSynthesisVoice[] {
  return [...loadVoices()].sort((a, b) => rank(b) - rank(a))
}

let preferredURI: string | undefined
let baseRate = 0.9
export function configureVoice(uri: string | undefined, rate: number) {
  preferredURI = uri
  baseRate = rate
}

function chooseVoice(alt = false): SpeechSynthesisVoice | undefined {
  const voices = frenchVoices()
  if (!voices.length) return undefined
  const main = voices.find((v) => v.voiceURI === preferredURI) ?? voices[0]
  if (!alt) return main
  return voices.find((v) => v !== main && v.lang.startsWith('fr-FR')) ?? main
}

export interface SpeakOpts {
  rate?: number // multiplier on the user's base rate
  alt?: boolean // use a second voice (for dialogues)
  pitch?: number
}

export function speak(text: string, opts: SpeakOpts = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!ttsSupported) return resolve()
    const synth = window.speechSynthesis
    const u = new SpeechSynthesisUtterance(text.replace(/\s\/\s/g, ', '))
    const v = chooseVoice(opts.alt)
    if (v) u.voice = v
    u.lang = v?.lang ?? 'fr-FR'
    u.rate = Math.max(0.4, Math.min(1.4, baseRate * (opts.rate ?? 1)))
    u.pitch = opts.pitch ?? (opts.alt && chooseVoice(true) === chooseVoice() ? 0.75 : 1)
    u.onend = () => resolve()
    u.onerror = () => resolve()
    synth.speak(u)
  })
}

export function stopSpeaking() {
  if (ttsSupported) window.speechSynthesis.cancel()
}

export async function speakSequence(lines: { text: string; alt?: boolean }[], rate = 1, isCancelled: () => boolean = () => false) {
  stopSpeaking()
  for (const l of lines) {
    if (isCancelled()) return
    await speak(l.text, { rate, alt: l.alt })
    await new Promise((r) => setTimeout(r, 250))
  }
}

// ---------- Speech recognition ----------

/* eslint-disable @typescript-eslint/no-explicit-any */
const SR: any = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined
export const recognitionSupported = !!SR

export interface Listening {
  result: Promise<string[]>
  stop: () => void
}

export function listen(): Listening {
  if (!SR) return { result: Promise.reject(new Error('unsupported')), stop: () => {} }
  stopSpeaking()
  const rec = new SR()
  rec.lang = 'fr-FR'
  rec.interimResults = false
  rec.maxAlternatives = 5
  rec.continuous = false
  const result = new Promise<string[]>((resolve, reject) => {
    let done = false
    rec.onresult = (e: any) => {
      done = true
      const alts: string[] = []
      for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript)
      resolve(alts)
    }
    rec.onerror = (e: any) => {
      done = true
      reject(new Error(e.error || 'error'))
    }
    rec.onend = () => {
      if (!done) resolve([])
    }
  })
  rec.start()
  return { result, stop: () => rec.stop() }
}

// ---------- Voice recorder (record & compare) ----------

export const recorderSupported = typeof window !== 'undefined' && 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia

export async function startRecording(): Promise<{ stop: () => Promise<string> }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const rec = new MediaRecorder(stream)
  const chunks: Blob[] = []
  rec.ondataavailable = (e) => chunks.push(e.data)
  rec.start()
  return {
    stop: () =>
      new Promise((resolve) => {
        rec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop())
          resolve(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })))
        }
        rec.stop()
      }),
  }
}

export function browserHint(): string {
  const ua = navigator.userAgent
  if (/Firefox/.test(ua)) return 'Speaking practice needs Microsoft Edge or Google Chrome on the laptop (Firefox can’t listen).'
  if (/iPad|iPhone|Macintosh/.test(ua) && !recognitionSupported) return 'On the iPad, turn on Siri & Dictation in Settings so the app can listen.'
  return 'Speaking practice needs Edge or Chrome on Windows, or Safari on iPad.'
}
