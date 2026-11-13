import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselArrowProps {
  direction: "prev" | "next"
  onClick: () => void
  disabled?: boolean
  tone?: "light" | "dark"
  className?: string
}

/** Stile-style floating chevron button that sits over a carousel's edge. */
export function CarouselArrow({ direction, onClick, disabled, tone = "light", className }: CarouselArrowProps) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full shadow-md outline-none transition-opacity focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-0 sm:flex",
        tone === "light" ? "bg-white text-ink hover:bg-white/90" : "bg-ink/80 text-white hover:bg-ink",
        direction === "prev" ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5",
        className
      )}
    >
      <Icon className="size-5" />
    </button>
  )
}
