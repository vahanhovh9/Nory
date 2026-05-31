import { StarFilled, StarEmpty, CaretUpDown, ArrowRight, PencilIcon, DotsIcon, NorySparkle, AiEditIcon } from './icons'

// Google logo as simple SVG wordmark approximation
const GoogleLogo = () => (
  <svg width="42" height="14" viewBox="0 0 42 14" fill="none">
    <text x="0" y="11" fontFamily="-apple-system, system-ui" fontSize="12" fontWeight="500">
      <tspan fill="#4285F4">G</tspan>
      <tspan fill="#EA4335">o</tspan>
      <tspan fill="#FBBC05">o</tspan>
      <tspan fill="#4285F4">g</tspan>
      <tspan fill="#34A853">l</tspan>
      <tspan fill="#EA4335">e</tspan>
    </text>
  </svg>
)

const UserAvatar = ({ initials = 'MC' }: { initials?: string }) => (
  <div className="w-8 h-8 rounded-full bg-[#a8c5a0] flex items-center justify-center text-white text-[12px] font-medium shrink-0">
    {initials}
  </div>
)

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) =>
        i < rating ? <StarFilled key={i} size={16} /> : <StarEmpty key={i} size={16} />,
      )}
    </div>
  )
}

interface ReviewCardProps {
  author: string
  rating: number
  date: string
  text: string
  replied?: boolean
  reply?: string
  replyTime?: string
}

function ReviewCard({ author, rating, date, text, replied, reply, replyTime }: ReviewCardProps) {
  return (
    <div className="flex flex-col bg-[#fafafa] border border-[#e5e5e5] rounded-xl overflow-hidden shrink-0 w-full">
      {/* Review header */}
      <div className="flex flex-col gap-2 p-3">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <UserAvatar initials={author.split(' ').map((n) => n[0]).join('')} />
          <span className="flex-1 text-[14px] text-[#262626] tracking-[-0.15px]">{author}</span>
          <div className="flex items-center gap-1.5 text-[13px] text-[#a3a3a3]">
            <span>From</span>
            <GoogleLogo />
          </div>
        </div>

        {/* Stars + date */}
        <div className="flex items-center gap-3">
          <StarRating rating={rating} />
          <span className="text-[14px] text-[#a3a3a3] tracking-[-0.15px]">{date}</span>
        </div>

        {/* Review text */}
        <p className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px] whitespace-pre-line">
          {text}
        </p>
      </div>

      {/* Footer (not replied) */}
      {!replied && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[14px] text-[#a3a3a3] tracking-[-0.15px]">
            Respond to reviews instantly with Nory AI.
          </span>
          <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
            <AiEditIcon size={14} color="#735cf6" />
            Reply
          </button>
        </div>
      )}

      {/* Reply section */}
      {replied && reply && (
        <div className="bg-white border-t border-[#e5e5e5] px-3.5 py-3.5 flex flex-col gap-3">
          {/* Reply text with left border */}
          <div className="border-l-2 border-[#d4d4d4] pl-3">
            <p className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px]">{reply}</p>
          </div>

          {/* Reply meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NorySparkle size={14} color="#a3a3a3" />
              <span className="text-[13px] text-[#a3a3a3]">Autoreply</span>
              <span className="text-[13px] text-[#a3a3a3]">{replyTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
                <PencilIcon size={12} color="#525252" />
                Edit
              </button>
              <button className="flex items-center justify-center w-6 h-6 bg-white border border-[#e5e5e5] rounded-lg shadow-[0_1px_2px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
                <DotsIcon size={14} color="#525252" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const reviews: ReviewCardProps[] = [
  {
    author: 'May Cheung',
    rating: 4,
    date: '2 days ago',
    text: "Cute small cafe. Coffee was ok.\nThe actual coffee shop is quite small so I wouldn't want to be working non-stop in here. Lots of other sweet treats to try which pair well with a hot beverage.",
  },
  {
    author: 'May Cheung',
    rating: 4,
    date: '2 days ago',
    text: "Cute small cafe. Coffee was ok.\nThe actual coffee shop is quite small so I wouldn't want to be working non-stop in here. Lots of other sweet treats to try which pair well with a hot beverage.",
    replied: true,
    reply: "Thank you for your feedback, May. We appreciate your positive comments about our Wild Thing sandwich, but we apologize for the slow service you experienced. We're actively working to improve our service times, especially during lunch hours. We hope you'll give us another opportunity to provide you with a better overall experience.",
    replyTime: '2 hours ago',
  },
  {
    author: 'James O\'Brien',
    rating: 5,
    date: '3 days ago',
    text: 'Absolutely loved it. Great vibe, great coffee, great team. Will be back!',
  },
]

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
          {/* Platform selector */}
          <div className="flex items-center gap-2 px-3 h-8 bg-white border border-[#d4d4d4] rounded-lg cursor-pointer hover:bg-[#fafafa]">
            <GoogleLogo />
            <CaretUpDown size={14} color="#a3a3a3" />
          </div>

          {/* See all */}
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[14px] text-[#262626] shadow-[0_1px_1px_rgba(47,62,77,0.04)] hover:bg-[#fafafa]">
            See All
            <ArrowRight size={14} color="#262626" />
          </button>
        </div>
      </div>

      {/* Review list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {reviews.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </div>
    </div>
  )
}
