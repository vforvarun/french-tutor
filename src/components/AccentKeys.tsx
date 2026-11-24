import type { RefObject } from 'react'

const KEYS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'î', 'û', 'ù', 'ë', 'ï', 'œ']

/** On-screen accent keys that insert at the cursor of the given input/textarea. */
export function AccentKeys({ target, onInsert }: { target: RefObject<HTMLInputElement | HTMLTextAreaElement | null>; onInsert: (value: string) => void }) {
  const insert = (ch: string) => {
    const el = target.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const next = el.value.slice(0, start) + ch + el.value.slice(end)
    onInsert(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + ch.length, start + ch.length)
    })
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(k)}
          className="h-10 min-w-10 rounded-xl border-2 border-line bg-white px-2 text-lg font-bold text-ink shadow-[0_3px_0_0_var(--color-line)] active:translate-y-[2px] active:shadow-none hover:bg-cream"
        >
          {k}
        </button>
      ))}
    </div>
  )
}
