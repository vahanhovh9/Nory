import { useState, useRef, useEffect } from 'react'
import { NorySparkle, XIcon } from './icons'

interface Message {
  role: 'ai' | 'user'
  content: string
  isThinking?: boolean
}

const SUGGESTED_QUESTIONS = [
  'What\'s driving the 78% response rate?',
  'Which locations have the lowest ratings?',
  'How can I improve my average rating?',
  'Summarise this week\'s reviews',
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

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot inline-block w-1.5 h-1.5 rounded-full bg-[#735cf6]"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}

function AIMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="flex gap-2.5 max-w-full">
      <div className="w-6 h-6 rounded-full bg-[#f0edff] flex items-center justify-center shrink-0 mt-0.5">
        <NorySparkle size={14} color="#735cf6" />
      </div>
      <div className="flex-1 bg-[#fafafa] border border-[#e5e5e5] rounded-xl rounded-tl-sm px-3 py-2.5 text-[14px] leading-5 text-[#262626] tracking-[-0.15px]">
        {lines.map((line, i) => {
          if (!line) return <br key={i} />
          // Render **bold** markdown
          const parts = line.split(/(\*\*[^*]+\*\*)/g)
          return (
            <p key={i} className={i > 0 ? 'mt-1' : ''}>
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={j} className="font-semibold text-[#262626]">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <span key={j}>{part}</span>
                ),
              )}
            </p>
          )
        })}
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
        "Hi! I'm Nory. I can see your customer reviews data for this week.\n\nWhat would you like to explore?",
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const sendMessage = (text: string) => {
    if (!text.trim() || isThinking) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsThinking(true)

    const delay = 1200 + Math.random() * 800

    setTimeout(() => {
      const response =
        AI_RESPONSES[text] ||
        "That's a great question. Based on this week's data, I'm seeing some interesting patterns in your customer feedback. Let me dig deeper — could you clarify which metric you're most interested in improving?"

      setIsThinking(false)
      setMessages((prev) => [...prev, { role: 'ai', content: response }])
    }, delay)
  }

  return (
    <div className="h-full w-full bg-white border-l border-[#e5e5e5] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f0edff] flex items-center justify-center">
            <NorySparkle size={16} color="#735cf6" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#262626] leading-4">Ask Nory</p>
            <p className="text-[12px] text-[#a3a3a3] leading-4">AI-powered insights</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#f5f5f5]"
        >
          <XIcon size={14} color="#525252" />
        </button>
      </div>

      {/* Context card */}
      <div className="mx-4 mt-3 mb-2 p-3 bg-[#f5f3ff] border border-[#e5e5e5] rounded-xl shrink-0">
        <p className="text-[12px] text-[#735cf6] font-medium mb-1">Viewing: Customer Reviews — This week</p>
        <div className="flex items-center gap-3 text-[12px] text-[#525252]">
          <span>⭐ 4.51 avg</span>
          <span>·</span>
          <span>21 reviews</span>
          <span>·</span>
          <span>78% reply rate</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-3 min-h-0">
        {messages.map((msg, i) =>
          msg.role === 'ai' ? (
            <AIMessage key={i} content={msg.content} />
          ) : (
            <UserMessage key={i} content={msg.content} />
          ),
        )}
        {isThinking && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#f0edff] flex items-center justify-center shrink-0 mt-0.5">
              <NorySparkle size={14} color="#735cf6" />
            </div>
            <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && !isThinking && (
        <div className="px-4 pb-3 shrink-0">
          <p className="text-[12px] text-[#a3a3a3] mb-2">Suggested questions</p>
          <div className="flex flex-col gap-1.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-left px-3 py-2 bg-[#fafafa] border border-[#e5e5e5] rounded-lg text-[13px] text-[#525252] hover:bg-[#f0edff] hover:border-[#c4b5fd] hover:text-[#735cf6] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-[#e5e5e5]">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#fafafa] border border-[#e5e5e5] rounded-xl focus-within:border-[#735cf6] focus-within:bg-white transition-colors">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Ask about your reviews…"
            disabled={isThinking}
            className="flex-1 bg-transparent text-[14px] text-[#262626] placeholder:text-[#a3a3a3] outline-none tracking-[-0.15px]"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isThinking}
            className="w-7 h-7 rounded-lg bg-[#735cf6] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#6248e8] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 11V3M7 3L3 7M7 3L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-[#a3a3a3] text-center mt-2">
          Nory AI can make mistakes. Verify important decisions.
        </p>
      </div>
    </div>
  )
}
