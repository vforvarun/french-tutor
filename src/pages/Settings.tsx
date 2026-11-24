import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Upload, Volume2, RotateCcw } from 'lucide-react'
import { useStore } from '../lib/store'
import { frenchVoices, speak, configureVoice, recognitionSupported, browserHint } from '../lib/speech'
import { Page, PageHeader, Card, Button } from '../components/ui'

function Row({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="font-extrabold">{title}</div>
        {sub && <div className="text-sm font-semibold text-ink-soft">{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-2xl bg-cream p-1">
      {options.map(([v, l]) => (
        <button key={String(v)} onClick={() => onChange(v)} className={`rounded-xl px-3 py-1.5 text-sm font-extrabold transition ${value === v ? 'bg-white shadow text-ink' : 'text-ink-soft'}`}>
          {l}
        </button>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const s = useStore()
  const p = s.profile
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(frenchVoices())
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = () => setVoices(frenchVoices())
    load()
    window.speechSynthesis?.addEventListener?.('voiceschanged', load)
    const t = setTimeout(load, 800)
    return () => {
      window.speechSynthesis?.removeEventListener?.('voiceschanged', load)
      clearTimeout(t)
    }
  }, [])

  const exportData = () => {
    const raw = localStorage.getItem('allez-french-v1') ?? '{}'
    const blob = new Blob([raw], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `french-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setMsg('Progress file downloaded. Open Settings on the other device and choose “Load progress”.')
  }

  return (
    <Page>
      <PageHeader title="Settings" emoji="⚙️" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="px-5">
          <Row title="Your name">
            <input value={p.name} onChange={(e) => s.setProfile({ name: e.target.value })} className="w-40 rounded-xl border-2 border-line px-3 py-2 font-bold outline-none focus:border-bleu" />
          </Row>
          <Row title="Year level" sub="Unlocks Year 10 content in the daily plan">
            <Seg value={p.level} options={[[9, 'Year 9'], [10, 'Year 10']]} onChange={(v) => s.setProfile({ level: v })} />
          </Row>
          <Row title="Daily XP goal">
            <Seg value={p.dailyGoal} options={[[30, 'Easy'], [60, 'Regular'], [100, 'Serious'], [150, 'Intense']]} onChange={(v) => s.setProfile({ dailyGoal: v })} />
          </Row>
          <Row title="New words per day">
            <Seg value={p.newPerDay} options={[[5, '5'], [8, '8'], [12, '12'], [15, '15']]} onChange={(v) => s.setProfile({ newPerDay: v })} />
          </Row>
          <Row title="Sound effects">
            <Seg value={p.sound ? 'on' : 'off'} options={[['on', 'On'], ['off', 'Off']]} onChange={(v) => s.setProfile({ sound: v === 'on' })} />
          </Row>
          <Row title="Retake placement check">
            <Link to="/welcome" onClick={() => s.setProfile({ placed: false })} className="rounded-xl bg-cream px-3 py-2 text-sm font-extrabold">
              Start
            </Link>
          </Row>
        </Card>

        <Card className="px-5">
          <Row title="French voice" sub={voices.length ? `${voices.length} French voices on this device` : 'No French voice found — see tip below'}>
            <select
              value={p.voiceURI ?? voices[0]?.voiceURI ?? ''}
              onChange={(e) => {
                s.setProfile({ voiceURI: e.target.value })
                configureVoice(e.target.value, p.rate)
                setTimeout(() => speak('Bonjour ! Je m’appelle Allez.'), 50)
              }}
              className="max-w-56 rounded-xl border-2 border-line bg-white px-3 py-2 text-sm font-bold"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </Row>
          <Row title="Speaking speed" sub={`${Math.round(p.rate * 100)}%`}>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.6}
                max={1.15}
                step={0.05}
                value={p.rate}
                onChange={(e) => {
                  s.setProfile({ rate: parseFloat(e.target.value) })
                  configureVoice(p.voiceURI, parseFloat(e.target.value))
                }}
                className="accent-bleu"
              />
              <button onClick={() => speak('Je voudrais un croissant, s’il vous plaît.')} className="grid h-10 w-10 place-items-center rounded-full bg-bleu-soft text-bleu" aria-label="Test voice">
                <Volume2 size={18} />
              </button>
            </div>
          </Row>
          <div className="py-4 text-sm font-semibold text-ink-soft">
            <b className="text-ink">Best voices:</b> on Windows, Microsoft Edge has natural “Online (Natural)” French voices (e.g. Denise, Henri). On iPad, go to Settings → Accessibility → Spoken Content → Voices → French, and download an “Enhanced” or “Premium” voice.
            {!recognitionSupported && <div className="mt-2 rounded-xl bg-soleil-soft p-2 text-[#8a5c00]">🎙️ {browserHint()}</div>}
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-extrabold">Move progress between laptop & iPad</div>
          <p className="mt-1 text-sm font-semibold text-ink-soft">Progress is saved on each device. To continue on another device, download your progress here and load it there (e.g. via OneDrive, Google Drive or AirDrop).</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={exportData}>
              <Download size={18} /> Save progress file
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload size={18} /> Load progress
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const ok = s.importAll(await f.text())
                setMsg(ok ? 'Progress loaded! ✓' : 'That file doesn’t look like a progress file.')
              }}
            />
          </div>
          {msg && <div className="mt-3 rounded-xl bg-menthe-soft p-3 text-sm font-bold text-[#0f6b5a]">{msg}</div>}
        </Card>

        <Card className="p-5">
          <div className="font-extrabold">Install as an app</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-ink-soft">
            <li>
              <b className="text-ink">iPad (Safari):</b> tap the Share button → “Add to Home Screen”.
            </li>
            <li>
              <b className="text-ink">Windows (Edge):</b> click the “App available / Install” icon in the address bar, or ⋯ → Apps → Install this site as an app.
            </li>
          </ul>
          <div className="mt-5 font-extrabold">Parent PIN</div>
          <p className="text-sm font-semibold text-ink-soft">{p.pin ? 'A PIN protects the parent dashboard.' : 'Not set — you’ll be asked to create one on the parent dashboard.'}</p>
          {p.pin && (
            <button onClick={() => s.setProfile({ pin: undefined })} className="mt-2 text-sm font-extrabold text-rouge">
              Remove PIN
            </button>
          )}
          <div className="mt-5 border-t border-line pt-4">
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 text-sm font-extrabold text-rouge">
                <RotateCcw size={16} /> Reset all progress
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-rouge">Delete everything on this device? This can’t be undone.</span>
                <Button variant="danger" className="px-3 py-2 text-sm" onClick={() => (s.resetAll(), setConfirmReset(false))}>
                  Yes, reset
                </Button>
                <Button variant="ghost" className="px-3 py-2 text-sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Page>
  )
}

export function MorePage() {
  const items = [
    { to: '/skills', emoji: '🎧', title: 'Listening & reading', hue: 'teal' },
    { to: '/exam', emoji: '🎓', title: 'Exam prep', hue: 'indigo' },
    { to: '/verbs', emoji: '🏋️', title: 'Verb Gym', hue: 'amber' },
    { to: '/numbers', emoji: '🔢', title: 'Number trainer', hue: 'sky' },
    { to: '/culture', emoji: '🌍', title: 'Culture', hue: 'rose' },
    { to: '/planner', emoji: '🗓️', title: 'Term planner', hue: 'orange' },
    { to: '/progress', emoji: '📈', title: 'Progress & badges', hue: 'green' },
    { to: '/parent', emoji: '👪', title: 'Parent dashboard', hue: 'violet' },
    { to: '/settings', emoji: '⚙️', title: 'Settings', hue: 'pink' },
  ]
  return (
    <Page>
      <PageHeader title="More" emoji="✨" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((x) => (
          <Link key={x.to} to={x.to} className="card lift overflow-hidden">
            <div className={`hue-${x.hue} grid h-20 place-items-center text-4xl`}>{x.emoji}</div>
            <div className="p-3 text-center font-extrabold">{x.title}</div>
          </Link>
        ))}
      </div>
    </Page>
  )
}
