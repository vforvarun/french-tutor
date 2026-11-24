import { useEffect, useRef, useState } from 'react'
import { Volume2, Snail, Mic, Square, Play, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { speak, listen, recognitionSupported, recorderSupported, startRecording, browserHint, type Listening } from '../lib/speech'
import { scoreSpeech, type SpeechScore } from '../lib/text'

export function SpeakButton({ text, size = 'md', slow = false, className = '', label }: { text: string; size?: 'sm' | 'md' | 'lg'; slow?: boolean; className?: string; label?: string }) {
  const [playing, setPlaying] = useState(false)
  const dims = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-16 w-16' : 'h-12 w-12'
  const icon = size === 'sm' ? 16 : size === 'lg' ? 28 : 22
  return (
    <button
      type="button"
      aria-label={label ?? `Listen: ${text}`}
      onClick={async (e) => {
        e.stopPropagation()
        setPlaying(true)
        await speak(text, { rate: slow ? 0.6 : 1 })
        setPlaying(false)
      }}
      className={`${dims} grid shrink-0 place-items-center rounded-full transition-all ${slow ? 'bg-soleil-soft text-[#b77a00]' : 'bg-bleu-soft text-bleu'} ${playing ? 'scale-110 ring-4 ring-bleu/20' : 'hover:scale-105'} ${className}`}
    >
      {slow ? <Snail size={icon} /> : <Volume2 size={icon} />}
    </button>
  )
}

export function AudioPair({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center gap-2">
      <SpeakButton text={text} size={size} />
      <SpeakButton text={text} size={size === 'lg' ? 'md' : 'sm'} slow label={`Listen slowly: ${text}`} />
    </div>
  )
}

function verdict(score: number) {
  if (score >= 0.9) return { label: 'Parfait !', emoji: '🌟', cls: 'bg-menthe-soft text-[#0f7a66]' }
  if (score >= 0.75) return { label: 'Très bien !', emoji: '👏', cls: 'bg-menthe-soft text-[#0f7a66]' }
  if (score >= 0.55) return { label: 'Presque ! Almost', emoji: '💪', cls: 'bg-soleil-soft text-[#9a6700]' }
  return { label: 'Try again', emoji: '🔁', cls: 'bg-rouge-soft text-[#c23452]' }
}

/** Mic button: listens, scores against `target`, shows feedback. */
export function SayIt({ target, onScore, compact = false }: { target: string; onScore?: (s: SpeechScore) => void; compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'listening' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SpeechScore | null>(null)
  const [err, setErr] = useState('')
  const live = useRef<Listening | null>(null)

  useEffect(() => {
    setState('idle')
    setResult(null)
    return () => live.current?.stop()
  }, [target])

  if (!recognitionSupported) {
    return <div className="rounded-2xl bg-soleil-soft p-3 text-sm font-bold text-[#8a5c00]">🎙️ {browserHint()}</div>
  }

  const go = async () => {
    if (state === 'listening') {
      live.current?.stop()
      return
    }
    setState('listening')
    setResult(null)
    try {
      live.current = listen()
      const alts = await live.current.result
      if (!alts.length) {
        setErr('I didn’t hear anything — tap the mic and speak clearly.')
        setState('error')
        return
      }
      const s = scoreSpeech(target, alts)
      setResult(s)
      setState('done')
      onScore?.(s)
    } catch (e) {
      const m = (e as Error).message
      setErr(m === 'not-allowed' ? 'Microphone permission was blocked. Allow the microphone in your browser settings.' : m === 'no-speech' ? 'I didn’t hear anything — try again a little louder.' : 'Something went wrong. Try again.')
      setState('error')
    }
  }

  const v = result ? verdict(result.score) : null
  return (
    <div className={`flex ${compact ? 'items-center gap-3' : 'flex-col items-center gap-3'}`}>
      <button
        type="button"
        onClick={go}
        aria-label={state === 'listening' ? 'Stop listening' : 'Speak now'}
        className={`grid ${compact ? 'h-12 w-12' : 'h-20 w-20'} place-items-center rounded-full text-white transition-all ${state === 'listening' ? 'bg-rouge mic-live scale-105' : 'bg-gradient-to-br from-rouge to-[#ff8a5c] hover:scale-105 shadow-lg'}`}
      >
        {state === 'listening' ? <Square size={compact ? 18 : 28} fill="white" /> : <Mic size={compact ? 22 : 34} />}
      </button>
      {!compact && state === 'idle' && <div className="text-sm font-bold text-ink-soft">Tap the mic and say it</div>}
      {state === 'listening' && <div className="text-sm font-extrabold text-rouge">Listening… 👂</div>}
      {state === 'error' && <div className="text-sm font-bold text-rouge text-center">{err}</div>}
      <AnimatePresence>
        {result && v && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl px-4 py-3 ${v.cls} ${compact ? '' : 'w-full max-w-md text-center'}`}>
            <div className="font-extrabold">
              {v.emoji} {v.label} <span className="opacity-70">· {Math.round(result.score * 100)}%</span>
            </div>
            {!compact && (
              <>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {result.words.map((w, i) => (
                    <span key={i} className={`rounded-lg px-2 py-0.5 font-bold ${w.ok ? 'bg-white/70 text-[#0f7a66]' : 'bg-white/70 text-rouge underline decoration-wavy'}`}>
                      {w.word}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs font-semibold opacity-80">I heard: “{result.heard}”</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Record your own voice, then play it back to compare with the model. */
export function RecordCompare({ target }: { target: string }) {
  const [rec, setRec] = useState<{ stop: () => Promise<string> } | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    setUrl(null)
  }, [target])
  if (!recorderSupported) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!rec ? (
        <button
          type="button"
          onClick={async () => {
            try {
              setErr('')
              setRec(await startRecording())
            } catch {
              setErr('Microphone blocked')
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-ink border-2 border-line hover:bg-cream"
        >
          <Circle size={14} className="fill-rouge text-rouge" /> Record myself
        </button>
      ) : (
        <button
          type="button"
          onClick={async () => {
            const u = await rec.stop()
            setRec(null)
            setUrl(u)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-rouge px-3 py-2 text-sm font-extrabold text-white mic-live"
        >
          <Square size={14} fill="white" /> Stop
        </button>
      )}
      {url && (
        <>
          <button type="button" onClick={() => new Audio(url).play()} className="inline-flex items-center gap-2 rounded-xl bg-lavande-soft px-3 py-2 text-sm font-extrabold text-[#5b3cc4]">
            <Play size={14} /> My voice
          </button>
          <button type="button" onClick={() => speak(target)} className="inline-flex items-center gap-2 rounded-xl bg-bleu-soft px-3 py-2 text-sm font-extrabold text-bleu">
            <Volume2 size={14} /> French voice
          </button>
        </>
      )}
      {err && <span className="text-sm font-bold text-rouge">{err}</span>}
    </div>
  )
}
