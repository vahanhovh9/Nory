import { useState } from 'react'
import { StarFilled, StarEmpty, CaretUpDown, ArrowRight, PencilIcon, DotsIcon, NorySparkle, AiEditIcon, XIcon } from './icons'

// Google logo
const GoogleLogo = () => (
  <svg width="42" height="14" viewBox="0 0 42 14" fill="none">
    <text x="0" y="11" fontFamily="-apple-system, system-ui" fontSize="12" fontWeight="500">
      <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan>
      <tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan>
      <tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
    </text>
  </svg>
)

const UserAvatar = ({ initials = 'MC' }: { initials?: string }) => (
  <div className="w-8 h-8 rounded-full bg-[#a8c5a0] flex items-center justify-center text-white text-[12px] font-medium shrink-0">{initials}</div>
)

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => i < rating ? <StarFilled key={i} size={16} /> : <StarEmpty key={i} size={16} />)}
    </div>
  )
}

// ─── AI reply variations ───────────────────────────────────────────────────────

const AI_REPLIES: Record<number, string[]> = {
  0: [
    "Thank you for stopping by, May! We're so glad you enjoyed our sweet treats. We hear your feedback about the space — we're always working to create a more comfortable experience. We'd love to have you back for a perfect coffee and treat combo! ☕",
    "Thanks for the kind words, May! We appreciate you sharing your experience. Coffee is central to what we do and we'd love for you to try our specialty roasts on your next visit. We hope to win you over! 😊",
    "Hi May, thank you for visiting! While we are a cosy spot, we think that adds to the charm. Come back and let us make your next visit even better — our baristas have some exciting new brews you might love! 🫶",
  ],
  2: [
    "Thank you so much for the 5 stars, James! We're thrilled you loved the vibe, coffee, and our team. That means the world to us. We look forward to welcoming you back very soon! 🙌",
    "James, this completely made our day! Thank you for the wonderful feedback. Our team works hard to create the best possible experience and it's so rewarding to hear it's landing well. See you again soon! ⭐",
  ],
}

// ─── Single review card ────────────────────────────────────────────────────────

type ReplyState = 'idle' | 'composing' | 'ready' | 'sent'

interface ReviewCardProps {
  id: number
  author: string
  rating: number
  date: string
  text: string
  replied?: boolean
  reply?: string
  replyTime?: string
}

function ReviewCard(props: ReviewCardProps) {
  const { id, author, rating, date, text, replied, reply, replyTime } = props
  const initials = author.split(' ').map(n => n[0]).join('')
  const hasReplies = Array.isArray(AI_REPLIES[id])

  const [replyState, setReplyState] = useState<ReplyState>('idle')
  const [replyText, setReplyText] = useState('')
  const [replyIdx, setReplyIdx] = useState(0)
  const [sentReply, setSentReply] = useState('')

  const startReply = () => {
    if (!hasReplies) return
    setReplyState('composing')
    setTimeout(() => {
      setReplyText(AI_REPLIES[id][replyIdx])
      setReplyState('ready')
    }, 1600)
  }

  const regenerate = () => {
    const replies = AI_REPLIES[id]
    const next = (replyIdx + 1) % replies.length
    setReplyIdx(next)
    setReplyState('composing')
    setTimeout(() => {
      setReplyText(replies[next])
      setReplyState('ready')
    }, 1200)
  }

  const send = () => {
    setSentReply(replyText)
    setReplyState('sent')
  }

  const cancel = () => {
    setReplyState('idle')
    setReplyText('')
  }

  return (
    <div className="flex flex-col bg-[#fafafa] border border-[#e5e5e5] rounded-xl overflow-hidden shrink-0 w-full">
      {/* Review header */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-3">
          <UserAvatar initials={initials} />
          <span className="flex-1 text-[14px] text-[#262626] tracking-[-0.15px]">{author}</span>
          <div className="flex items-center gap-1.5 text-[13px] text-[#a3a3a3]">
            <span>From</span><GoogleLogo />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StarRating rating={rating} />
          <span className="text-[14px] text-[#a3a3a3] tracking-[-0.15px]">{date}</span>
        </div>
        <p className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px] whitespace-pre-line">{text}</p>
      </div>

      {/* ── Already replied (original) ── */}
      {replied && reply && replyState === 'idle' && (
        <div className="bg-white border-t border-[#e5e5e5] px-3.5 py-3.5 flex flex-col gap-3">
          <div className="border-l-2 border-[#d4d4d4] pl-3">
            <p className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px]">{reply}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NorySparkle size={14} color="#a3a3a3" />
              <span className="text-[13px] text-[#a3a3a3]">Autoreply</span>
              <span className="text-[13px] text-[#a3a3a3]">{replyTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
                <PencilIcon size={12} color="#525252" />Edit
              </button>
              <button className="flex items-center justify-center w-6 h-6 bg-white border border-[#e5e5e5] rounded-lg shadow-[0_1px_2px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
                <DotsIcon size={14} color="#525252" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sent AI reply ── */}
      {replyState === 'sent' && (
        <div className="bg-white border-t border-[#e5e5e5] px-3.5 py-3.5 flex flex-col gap-3">
          <div className="border-l-2 border-[#735cf6] pl-3">
            <p className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px]">{sentReply}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NorySparkle size={14} color="#735cf6" />
              <span className="text-[13px] text-[#735cf6]">Nory AI reply</span>
              <span className="text-[13px] text-[#a3a3a3]">Just now</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
                <PencilIcon size={12} color="#525252" />Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Not replied + has AI support ── */}
      {!replied && hasReplies && replyState === 'idle' && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[14px] text-[#a3a3a3] tracking-[-0.15px]">Respond to reviews instantly with Nory AI.</span>
          <button onClick={startReply} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
            <AiEditIcon size={14} color="#735cf6" />Reply
          </button>
        </div>
      )}

      {/* ── Not replied, no AI support ── */}
      {!replied && !hasReplies && replyState === 'idle' && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[14px] text-[#a3a3a3] tracking-[-0.15px]">Respond to reviews instantly with Nory AI.</span>
          <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
            <AiEditIcon size={14} color="#735cf6" />Reply
          </button>
        </div>
      )}

      {/* ── AI composing ── */}
      {replyState === 'composing' && (
        <div className="bg-white border-t border-[#e5e5e5] px-3 py-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f5f3ff] rounded-xl">
            <NorySparkle size={16} color="#735cf6" />
            <span className="text-[14px] text-[#735cf6] tracking-[-0.15px]">Nory is composing a reply</span>
            <div className="flex gap-1 ml-1">
              {[0,1,2].map(i => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#735cf6] inline-block" style={{ animationDelay: `${i*0.2}s` }} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── AI reply ready ── */}
      {replyState === 'ready' && (
        <div className="bg-white border-t border-[#e5e5e5] flex flex-col gap-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e5e5]">
            <div className="flex items-center gap-2">
              <NorySparkle size={14} color="#735cf6" />
              <span className="text-[13px] text-[#735cf6] font-medium">Nory AI draft</span>
            </div>
            <button onClick={cancel} className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#fafafa]">
              <XIcon size={12} color="#a3a3a3" />
            </button>
          </div>
          {/* Editable text */}
          <div className="px-3 py-2 border-b border-[#e5e5e5]">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full text-[14px] text-[#262626] leading-5 tracking-[-0.15px] border-none outline-none resize-none bg-transparent"
              rows={4}
            />
          </div>
          {/* Actions */}
          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={regenerate}
              className="flex items-center gap-1.5 text-[13px] text-[#525252] hover:text-[#735cf6] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1.5 7A5.5 5.5 0 0 1 7 1.5M7 1.5l-2 2M7 1.5l2 2M12.5 7A5.5 5.5 0 0 1 7 12.5M7 12.5l-2-2M7 12.5l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Regenerate
            </button>
            <div className="flex items-center gap-2">
              <button onClick={cancel} className="px-3 py-1.5 text-[13px] text-[#525252] border border-[#e5e5e5] rounded-lg bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
                Cancel
              </button>
              <button onClick={send} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#735cf6] text-white rounded-lg text-[13px] hover:bg-[#6248e8] transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M7 2l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Reviews data ──────────────────────────────────────────────────────────────

const REVIEWS: ReviewCardProps[] = [
  {
    id: 0,
    author: 'May Cheung',
    rating: 4,
    date: '2 days ago',
    text: "Cute small cafe. Coffee was ok.\nThe actual coffee shop is quite small so I wouldn't want to be working non-stop in here. Lots of other sweet treats to try which pair well with a hot beverage.",
  },
  {
    id: 1,
    author: 'May Cheung',
    rating: 4,
    date: '2 days ago',
    text: "Cute small cafe. Coffee was ok.\nThe actual coffee shop is quite small so I wouldn't want to be working non-stop in here. Lots of other sweet treats to try which pair well with a hot beverage.",
    replied: true,
    reply: "Thank you for your feedback, May. We appreciate your positive comments about our Wild Thing sandwich, but we apologize for the slow service you experienced. We're actively working to improve our service times, especially during lunch hours. We hope you'll give us another opportunity to provide you with a better overall experience.",
    replyTime: '2 hours ago',
  },
  {
    id: 2,
    author: "James O'Brien",
    rating: 5,
    date: '3 days ago',
    text: 'Absolutely loved it. Great vibe, great coffee, great team. Will be back!',
  },
]

// ─── Panel ─────────────────────────────────────────────────────────────────────

export default function ReviewsPanel() {
  return (
    <div className="flex flex-col bg-white border border-[#e5e5e5] rounded-xl overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5] shrink-0">
        <div className="flex items-center gap-2 py-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L9.6 6H14L10.5 8.5L11.8 13L8 10.5L4.2 13L5.5 8.5L2 6H6.4L8 2Z" stroke="#262626" strokeWidth="1.2"/>
          </svg>
          <span className="text-[14px] text-[#262626] tracking-[-0.15px]">Customer Reviews (21)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 h-8 bg-white border border-[#d4d4d4] rounded-lg cursor-pointer hover:bg-[#fafafa]">
            <GoogleLogo /><CaretUpDown size={14} color="#a3a3a3" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[14px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
            See All <ArrowRight size={14} color="#262626" />
          </button>
        </div>
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {REVIEWS.map(r => <ReviewCard key={r.id} {...r} />)}
      </div>
    </div>
  )
}
