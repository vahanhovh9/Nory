import { useState, useRef, useEffect } from 'react'
import { AiIcon, XIcon, ChevronUp } from './icons'

// ─── Think (model logic) modes ─────────────────────────────────────────────────
type ThinkMode = 'quick' | 'normal' | 'long'
const THINK_MODES: { id: ThinkMode; label: string }[] = [
  { id: 'quick',  label: 'Think quick' },
  { id: 'normal', label: 'Think normal' },
  { id: 'long',   label: 'Think long' },
]

// ─── Integrations powering Nory (Sources modal) ────────────────────────────────
const INTEGRATIONS = [
  { name: 'Square POS',      cat: 'Point of sale',   connected: true },
  { name: 'Lightspeed',      cat: 'Point of sale',   connected: true },
  { name: 'Google Reviews',  cat: 'Reviews',         connected: true },
  { name: 'Tripadvisor',     cat: 'Reviews',         connected: true },
  { name: 'Deliveroo',       cat: 'Delivery',        connected: true },
  { name: 'Uber Eats',       cat: 'Delivery',        connected: true },
  { name: 'Bidfood',         cat: 'Supplier',        connected: true },
  { name: 'Sysco',           cat: 'Supplier',        connected: true },
  { name: 'Freshways',       cat: 'Supplier',        connected: false },
  { name: 'Xero',            cat: 'Accounting',      connected: true },
  { name: 'Deputy',          cat: 'Workforce',       connected: false },
  { name: 'Met Office',      cat: 'Weather',         connected: true },
]

const RULES = [
  { name: 'Auto-reply to 4★ and 5★ reviews within 2 hours', on: true },
  { name: 'Flag any menu item where GP variance exceeds 5%', on: true },
  { name: 'Suggest reorder when stock falls below par level', on: true },
  { name: 'Boost forecast on local event & holiday days', on: false },
  { name: 'Alert when labour cost of sales goes above 30%', on: true },
]

const SourcesModal = ({ onClose }: { onClose: () => void }) => {
  const [tab, setTab] = useState<'integrations' | 'rules'>('integrations')
  const connectedCount = INTEGRATIONS.filter(i => i.connected).length

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-[520px] max-h-[80vh] bg-white rounded-2xl border border-[#e5e5e5] shadow-[0_20px_48px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#e5e5e5] shrink-0">
          <div>
            <p className="text-[16px] font-semibold text-[#262626] leading-5">Nory's sources</p>
            <p className="text-[13px] text-[#737373] leading-4 mt-0.5">
              The integrations &amp; rules Nory uses to answer and act on your behalf.
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f5f5f5] shrink-0">
            <XIcon size={14} color="#525252" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 px-5 border-b border-[#e5e5e5] shrink-0">
          {([['integrations', `Integrations (${connectedCount})`], ['rules', `Rules (${RULES.filter(r => r.on).length})`]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-1 py-3 mr-6 text-[14px] border-b-2 -mb-px transition-colors ${tab === id ? 'border-[#735cf6] text-[#262626] font-medium' : 'border-transparent text-[#737373] hover:text-[#262626]'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 flex flex-col gap-2">
          {tab === 'integrations' ? (
            INTEGRATIONS.map(i => (
              <div key={i.name} className="flex items-center gap-3 px-3 py-2.5 border border-[#e5e5e5] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[11px] font-semibold text-[#525252] shrink-0">
                  {i.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#262626] leading-4 truncate">{i.name}</p>
                  <p className="text-[12px] text-[#a3a3a3] leading-4 mt-0.5">{i.cat}</p>
                </div>
                {i.connected ? (
                  <span className="flex items-center gap-1.5 text-[12px] text-[#16a34c] shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34c]" /> Connected
                  </span>
                ) : (
                  <button className="text-[13px] text-[#735cf6] font-medium px-2.5 py-1 rounded-lg border border-[#c4b5fd] hover:bg-[#f5f3ff] shrink-0">
                    Connect
                  </button>
                )}
              </div>
            ))
          ) : (
            RULES.map(r => (
              <div key={r.name} className="flex items-center gap-3 px-3 py-2.5 border border-[#e5e5e5] rounded-xl">
                <p className="flex-1 text-[14px] text-[#262626] leading-5">{r.name}</p>
                <div className={`w-9 h-5 rounded-full shrink-0 relative transition-colors ${r.on ? 'bg-[#735cf6]' : 'bg-[#d4d4d4]'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${r.on ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Mic icon
const MicIcon = ({ size = 18, color = '#525252' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <rect x="6.5" y="2" width="5" height="9" rx="2.5" stroke={color} strokeWidth="1.3" />
    <path d="M4 8.5a5 5 0 0 0 10 0M9 13.5V16M6.5 16h5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

// Sources / stack icon
const SourcesIcon = ({ size = 14, color = '#525252' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5 12.5 4 7 6.5 1.5 4 7 1.5Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M1.5 7 7 9.5 12.5 7M1.5 10 7 12.5 12.5 10" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

interface Source { short: string; name: string; color: string }
interface Message {
  role: 'ai' | 'user'
  content: string
  keyInsight?: string
  sources?: Source[]
  steps?: string[]
  durationMs?: number
}

// Sources Nory consults (small circles under an answer)
const ANSWER_SOURCES: Source[] = [
  { short: 'IN', name: 'Inventory counts', color: '#735cf6' },
  { short: 'SQ', name: 'Square POS',       color: '#2563eb' },
  { short: 'SW', name: 'SynQ waste log',   color: '#16a34c' },
  { short: 'BF', name: 'Bidfood invoices', color: '#ea580c' },
]

// Steps Nory runs while answering
const ANSWER_STEPS = [
  'Checking inventory levels',
  'Checking Square POS sales',
  'Checking SynQ waste log',
  'Comparing against last period',
]

const WASTE_INSIGHT =
  "Waste is **1.33% of sales** (~**£1,290**) this week — **0.46pp better** than last period."
const WASTE_BODY =
  "Most of it is **over-portioning** in Back of House (~46%) and **fresh produce spoilage** (~31%).\n\nQuickest win: tighten par levels on chicken and herbs — roughly **£180/week** back."

// 3 key actions Nory can take (welcome state)
const QUICK_ACTIONS: { label: string; prompt: string; icon: React.ReactNode }[] = [
  {
    label: 'Create a schedule',
    prompt: 'Create a schedule for next week',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#525252" strokeWidth="1.2" />
        <path d="M2 7h12M5.5 1.5v3M10.5 1.5v3" stroke="#525252" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Fix a forecast',
    prompt: 'Help me fix the sales forecast',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M2 11l3.5-3.5 2.5 2.5L14 4" stroke="#525252" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 4h4v4" stroke="#525252" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Research a topic',
    prompt: 'Research a topic for me',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="#525252" strokeWidth="1.2" />
        <path d="M10.5 10.5 14 14" stroke="#525252" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
]

const AI_RESPONSES: Record<string, string> = {
  "What's driving the 78% response rate?":
    "Your 78% response rate is driven by the **Autoreply** feature — 16 of 21 reviews this week received an automated reply within 2 hours.\n\nThe remaining 22% are reviews that came in after business hours and are awaiting manual review. I'd recommend setting a reply window for those to keep your rate above 80%.",

  'Which locations have the lowest ratings?':
    "**Galway – Shop Street** has the lowest rating this week at **3.9 ★** from 2 reviews. Two customers mentioned long wait times.\n\n**Cork – Patrick Street** follows at **4.2 ★** with 4 reviews, where service speed was also flagged.\n\nWould you like me to draft reply templates for those locations?",

  'How can I improve my average rating?':
    "Your current average is **4.51 ★** — here are 3 things that could push it above 4.7:\n\n1. **Respond faster to 1-star reviews** — you have 1 unresponded 1-star review from this week.\n2. **Ask happy customers to leave reviews** — most of your 5-star regulars haven't reviewed yet.\n3. **Address the service speed issue** — mentioned in 3 of your last 5 reviews across locations.\n\nShould I create an action plan for your team?",

  'Summarise this week\'s reviews':
    "Here's your week at a glance:\n\n📊 **21 reviews** received (↑2 vs last week)\n⭐ **4.51 average** rating (↑0.12)\n💬 **78% response rate** (↑1.02%)\n\n**Top themes:**\n- Coffee quality praised in 8 reviews\n- Sweet treats mentioned positively in 6\n- Service speed flagged in 3\n\n**Best performing location:** Dublin – Grafton St (4.8 ★)\n**Needs attention:** Galway – Shop St (3.9 ★)",
}

function renderRich(content: string) {
  return content.split('\n').map((line, i) => {
    if (!line) return <br key={i} />
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i} className={i > 0 ? 'mt-1' : ''}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-semibold text-[#262626]">{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>,
        )}
      </p>
    )
  })
}

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
    <path d="M2 6l3 3 5-5" stroke="#16a34c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function AIMessage({ msg, onOpenSources }: { msg: Message; onOpenSources: () => void }) {
  const [open, setOpen] = useState(false)
  const hasSources = !!msg.sources?.length

  return (
    <div className="flex gap-2.5 max-w-full">
      <div className="w-6 h-6 rounded-full bg-[#f0edff] flex items-center justify-center shrink-0 mt-0.5">
        <AiIcon size={14} color="#735cf6" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* Collapsed steps summary */}
        {msg.steps && (
          <div>
            <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-[12px] text-[#737373] hover:text-[#525252] transition-colors">
              <Check />
              Worked across {msg.sources?.length ?? ANSWER_SOURCES.length} sources · {((msg.durationMs ?? 2000) / 1000).toFixed(1)}s
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
                <path d="M3 4.5 6 7.5 9 4.5" stroke="#a3a3a3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <ul className="mt-1.5 flex flex-col gap-1 pl-0.5">
                {msg.steps.map(s => (
                  <li key={s} className="flex items-center gap-1.5 text-[12px] text-[#737373]">
                    <Check /> {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Key insight — larger highlighted callout */}
        {msg.keyInsight && (
          <div className="rounded-xl rounded-tl-sm bg-[#f5f3ff] border border-[#e3dbff] px-3.5 py-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AiIcon size={12} color="#735cf6" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#735cf6]">Key insight</span>
            </div>
            <div className="text-[16px] leading-6 text-[#262626] font-medium">
              {renderRich(msg.keyInsight)}
            </div>
          </div>
        )}

        {/* Answer body */}
        {msg.content && (
          <div className={`text-[14px] leading-5 text-[#262626] tracking-[-0.15px] ${msg.keyInsight ? 'px-1' : 'bg-[#fafafa] border border-[#e5e5e5] rounded-xl rounded-tl-sm px-3 py-2.5'}`}>
            {renderRich(msg.content)}
          </div>
        )}

        {/* Source circles */}
        {hasSources && (
          <button onClick={onOpenSources} className="flex items-center gap-2 self-start group">
            <div className="flex -space-x-1.5">
              {msg.sources!.map(s => (
                <span
                  key={s.short}
                  title={s.name}
                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-semibold text-white"
                  style={{ background: s.color }}
                >
                  {s.short}
                </span>
              ))}
            </div>
            <span className="text-[12px] text-[#737373] group-hover:text-[#525252]">{msg.sources!.length} sources</span>
          </button>
        )}

        {/* Add more sources banner */}
        {hasSources && (
          <div className="flex items-start gap-2 px-3 py-2 bg-[#faf9ff] rounded-xl">
            <span className="mt-0.5"><AiIcon size={13} color="#735cf6" /></span>
            <p className="flex-1 text-[12px] text-[#525252] leading-4">
              Nory used {msg.sources!.length} sources. Adding <span className="font-medium text-[#262626]">Sysco invoices</span> would improve waste accuracy ~12%.{' '}
              <button onClick={onOpenSources} className="text-[#735cf6] font-medium hover:underline">Add</button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-[#735cf6] text-white rounded-xl rounded-tr-sm px-3 py-2.5 text-[14px] leading-5 tracking-[-0.15px]">
        {content}
      </div>
    </div>
  )
}

interface AskNoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function AskNoryPanel({ isOpen, onClose }: AskNoryPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content:
        "Hi! I'm Nory. I can help with lots of things — answer your reviews, create a schedule, override a forecast, or answer any question you have.\n\nWhat would you like to do?",
    },
  ])
  const [inputValue, setInputValue] = useState('')
  // run.stepIndex: -1 = "Thinking…", 0..n-1 = currently checking that step
  const [run, setRun] = useState<{ stepIndex: number } | null>(null)
  const [thinkMode, setThinkMode] = useState<ThinkMode>('normal')
  const [thinkOpen, setThinkOpen] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const busy = run !== null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, run])

  // Auto-grow the textarea (grows toward the top since it's anchored at the bottom).
  // When empty, pin to a single line — avoids a bad measurement while the panel slides in.
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    if (!inputValue) { ta.style.height = '24px'; return }
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`
  }, [inputValue, isOpen])

  const thinkLabel = THINK_MODES.find(m => m.id === thinkMode)!.label
  const hasText = inputValue.trim().length > 0

  const sendMessage = (text: string) => {
    if (!text.trim() || busy) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInputValue('')

    const started = Date.now()
    const stepMs = thinkMode === 'quick' ? 450 : thinkMode === 'long' ? 950 : 650

    // Phase 1: "Thinking…"
    setRun({ stepIndex: -1 })

    // Phase 2: reveal steps one by one
    let i = -1
    const tick = () => {
      i++
      if (i < ANSWER_STEPS.length) {
        setRun({ stepIndex: i })
        setTimeout(tick, stepMs)
      } else {
        // Phase 3: deliver the answer with a highlighted key insight + collapsed steps + sources
        const isWaste = /waste/i.test(text)
        setRun(null)
        setMessages(prev => [...prev, {
          role: 'ai',
          keyInsight: isWaste ? WASTE_INSIGHT : undefined,
          content: isWaste
            ? WASTE_BODY
            : (AI_RESPONSES[text] ||
              "Here's what I found across your data. I'm seeing a few patterns worth a closer look — want me to break any of these down or take an action on it?"),
          sources: ANSWER_SOURCES,
          steps: ANSWER_STEPS,
          durationMs: Date.now() - started,
        }])
      }
    }
    setTimeout(tick, 700)
  }

  return (
    <div className="h-full w-full bg-white border-l border-[#e5e5e5] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-[#e5e5e5] shrink-0">
        <div className="pr-2">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-[#262626] leading-5">Hey, Vahan — I'm Nory AI</p>
            <span className="px-1.5 py-0.5 rounded-full bg-[#f5f5f5] text-[10px] font-semibold tracking-[0.04em] text-[#737373] uppercase leading-none">Beta</span>
          </div>
          <p className="text-[12px] text-[#a3a3a3] leading-4 mt-0.5">
            AI-powered insights &amp; assistance to help you work faster and smarter.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#f5f5f5] shrink-0"
        >
          <XIcon size={14} color="#525252" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 min-h-0">
        {messages.map((msg, i) => {
          // Hide the initial greeting once a conversation has started
          if (i === 0 && messages.length > 1) return null
          return msg.role === 'ai' ? (
            <AIMessage key={i} msg={msg} onOpenSources={() => setSourcesOpen(true)} />
          ) : (
            <UserMessage key={i} content={msg.content} />
          )
        })}

        {/* Live step sequence while answering */}
        {run && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#f0edff] flex items-center justify-center shrink-0 mt-0.5">
              <AiIcon size={14} color="#735cf6" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              {run.stepIndex === -1 ? (
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#735cf6]">Thinking</span>
                  <span className="flex gap-1">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#735cf6] inline-block" style={{ animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </span>
                </div>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {ANSWER_STEPS.slice(0, run.stepIndex + 1).map((s, idx) => {
                    const done = idx < run.stepIndex
                    return (
                      <li key={s} className="flex items-center gap-2 text-[13px] text-[#525252]">
                        {done ? (
                          <Check />
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-spin shrink-0">
                            <path d="M6 1a5 5 0 1 0 4.7 3.3" stroke="#735cf6" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        )}
                        {s}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Welcome actions + hints — shown before the first user message */}
      {messages.length <= 1 && !busy && (
        <div className="px-4 pb-3 shrink-0 flex flex-col gap-3">
          {/* 3 key actions */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={() => sendMessage(a.prompt)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] hover:bg-[#fafafa] hover:border-[#d4d4d4] shadow-[0_1px_1px_rgba(47,62,77,0.04)] transition-colors"
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>

          {/* @ / Tab hints */}
          <div className="flex flex-col items-center gap-1.5">
            <p className="flex items-center gap-2 text-[13px] text-[#525252]">
              <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md border border-[#e5e5e5] bg-[#fafafa] text-[12px] text-[#525252] font-medium">@</kbd>
              to mention a location, report, supplier or menu item
            </p>
            <p className="flex items-center gap-2 text-[13px] text-[#525252]">
              <kbd className="inline-flex items-center justify-center h-[22px] px-2 rounded-md border border-[#e5e5e5] bg-[#fafafa] text-[12px] text-[#525252] font-medium">Tab</kbd>
              to add the current page to context
            </p>
          </div>
        </div>
      )}

      {/* Composer — two-part field (text + voice on top, controls on bottom) */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-[#e5e5e5]">
        <div className="bg-white border-2 border-[#262626] rounded-2xl focus-within:ring-2 focus-within:ring-[#262626]/15 transition-shadow overflow-visible">

          {/* ── Top: textarea + voice ── */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <textarea
              ref={taRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(inputValue)
                }
              }}
              placeholder="Ask a question or tell Nory what to do…"
              disabled={busy}
              className="flex-1 bg-transparent text-[15px] text-[#262626] placeholder:text-[#737373] outline-none tracking-[-0.15px] leading-6 resize-none max-h-[140px] h-6"
            />
            <button
              onClick={() => setListening(l => !l)}
              title="Voice input"
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${listening ? 'bg-[#f0edff]' : 'hover:bg-[#f5f5f5]'}`}
            >
              {listening ? (
                <span className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 bg-[#735cf6] rounded-full animate-bounce-dot" style={{ height: 6,  animationDelay: '0s' }} />
                  <span className="w-0.5 bg-[#735cf6] rounded-full animate-bounce-dot" style={{ height: 14, animationDelay: '0.15s' }} />
                  <span className="w-0.5 bg-[#735cf6] rounded-full animate-bounce-dot" style={{ height: 9,  animationDelay: '0.3s' }} />
                </span>
              ) : (
                <MicIcon size={18} color="#525252" />
              )}
            </button>
          </div>

          {/* ── Bottom: think switcher · sources · send ── */}
          <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-1">
            {/* Think switcher */}
            <div className="relative shrink-0">
              <button
                onClick={() => setThinkOpen(o => !o)}
                className="flex items-center gap-1 h-7 px-2 rounded-lg text-[12px] text-[#525252] hover:bg-[#f5f5f5] transition-colors"
              >
                <AiIcon size={12} color="#735cf6" />
                {thinkLabel}
                <ChevronUp size={11} color="#a3a3a3" />
              </button>
              {thinkOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setThinkOpen(false)} />
                  <div className="absolute bottom-[calc(100%+6px)] left-0 z-20 w-40 bg-white border border-[#e5e5e5] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1">
                    {THINK_MODES.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setThinkMode(m.id); setThinkOpen(false) }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-left text-[13px] hover:bg-[#fafafa] transition-colors ${m.id === thinkMode ? 'text-[#735cf6] font-medium' : 'text-[#262626]'}`}
                      >
                        <span className="w-3 shrink-0">
                          {m.id === thinkMode && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#735cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sources */}
            <button
              onClick={() => setSourcesOpen(true)}
              className="flex items-center gap-1 h-7 px-2 rounded-lg text-[12px] text-[#525252] hover:bg-[#f5f5f5] transition-colors"
            >
              <SourcesIcon size={12} color="#525252" />
              32 Sources
            </button>

            <div className="flex-1" />

            {/* Send — 70% purple when empty, full brand purple when typed */}
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!hasText || busy}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${hasText ? 'bg-[#735cf6] hover:bg-[#6248e8]' : 'bg-[#b3a4f9] cursor-default'}`}
            >
              <svg width="17" height="17" viewBox="0 0 14 14" fill="none">
                <path d="M7 11V3M7 3L3 7M7 3L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[11px] text-[#a3a3a3] text-center mt-2">
          Nory AI can make mistakes. Verify important decisions.
        </p>
      </div>

      {/* Sources modal */}
      {sourcesOpen && <SourcesModal onClose={() => setSourcesOpen(false)} />}
    </div>
  )
}
