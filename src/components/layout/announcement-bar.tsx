import { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// Rotating navy announcement strip (rhoback.com). Only always-true
// statements — no discounts or delivery promises the business hasn't made.
const MESSAGES = [
  "Free tile samples — request yours on WhatsApp",
  "Clay roof & terracotta tiles, made in Lahore since 1982",
  "Visit our showrooms in Lahore & Islamabad",
]

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  function step(delta: number) {
    setIndex((i) => (i + delta + MESSAGES.length) % MESSAGES.length)
  }

  return (
    <div className="bg-navy text-navy-foreground">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-2 px-2 sm:px-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous announcement"
          className="flex size-7 items-center justify-center text-navy-foreground/70 outline-none hover:text-navy-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <p className="truncate text-center text-[0.7rem] font-medium tracking-wide uppercase sm:text-xs sm:tracking-[0.12em]" aria-live="polite">
          {MESSAGES[index]}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next announcement"
          className="flex size-7 items-center justify-center text-navy-foreground/70 outline-none hover:text-navy-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
