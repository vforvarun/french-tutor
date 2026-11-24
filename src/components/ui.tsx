import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import type { Gender } from '../data/vocab'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'soft'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-bleu text-white shadow-[0_6px_0_0_var(--color-bleu-deep)] hover:brightness-110 active:translate-y-[4px] active:shadow-[0_2px_0_0_var(--color-bleu-deep)]',
  success: 'bg-menthe text-white shadow-[0_6px_0_0_#168a74] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_0_#168a74]',
  danger: 'bg-rouge text-white shadow-[0_6px_0_0_#d8405a] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_0_#d8405a]',
  secondary: 'bg-white text-ink border-2 border-line shadow-[0_4px_0_0_var(--color-line)] hover:bg-cream active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-line)]',
  soft: 'bg-bleu-soft text-bleu-deep hover:brightness-95',
  ghost: 'text-ink-soft hover:bg-black/5',
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-extrabold transition-all disabled:opacity-40 disabled:pointer-events-none select-none ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Card({ className = '', children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <div className={`card ${onClick ? 'lift cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`mx-auto w-full max-w-5xl px-4 sm:px-6 pt-5 pb-28 lg:pb-12 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function PageHeader({ title, subtitle, back, emoji, right }: { title: string; subtitle?: string; back?: string | true; emoji?: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="mb-6 flex items-start gap-3">
      {back && (
        <button
          aria-label="Back"
          onClick={() => (back === true ? nav(-1) : nav(back))}
          className="no-print mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-ink shadow-[var(--shadow-card)] hover:bg-cream"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-[1.7rem] sm:text-4xl font-extrabold leading-tight">
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-ink-soft font-semibold">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

export function Progress({ value, className = '', color = 'bg-bleu' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-black/[0.06] ${className}`}>
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
    </div>
  )
}

export function Ring({ value, size = 84, stroke = 10, color = '#3b4cca', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgb(0 0 0 / 0.07)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${className}`}>{children}</span>
}

export function LevelPill({ level }: { level: 9 | 10 }) {
  return <Pill className={level === 9 ? 'bg-bleu-soft text-bleu-deep' : 'bg-lavande-soft text-[#5b3cc4]'}>Year {level}</Pill>
}

export function GenderTag({ g }: { g: Gender }) {
  if (!g) return null
  const map = { m: ['masc.', 'bg-[#e3edff] text-masc'], f: ['fém.', 'bg-[#ffe3ea] text-fem'], pl: ['plural', 'bg-[#f0e6ff] text-plur'] } as const
  const [label, cls] = map[g]
  return <Pill className={cls}>{label}</Pill>
}

export const genderText = (g: Gender) => (g === 'm' ? 'text-masc' : g === 'f' ? 'text-fem' : g === 'pl' ? 'text-plur' : 'text-ink')

export function Tile({ to, hue, emoji, title, subtitle, children }: { to: string; hue: string; emoji: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <Link to={to} className="card lift block overflow-hidden">
      <div className={`hue-${hue} relative flex h-24 items-center justify-center overflow-hidden`}>
        <span className="text-5xl drop-shadow-sm">{emoji}</span>
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
        <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10" />
      </div>
      <div className="p-4">
        <div className="font-display text-lg font-bold leading-tight">{title}</div>
        {subtitle && <div className="text-sm font-semibold text-ink-soft">{subtitle}</div>}
        {children}
      </div>
    </Link>
  )
}

export function Empty({ emoji, title, children }: { emoji: string; title: string; children?: ReactNode }) {
  return (
    <div className="card p-8 text-center">
      <div className="text-5xl">{emoji}</div>
      <div className="mt-3 font-display text-xl font-bold">{title}</div>
      <div className="mt-2 text-ink-soft font-semibold">{children}</div>
    </div>
  )
}

/** Renders **bold** inside a string. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>))}
    </>
  )
}
