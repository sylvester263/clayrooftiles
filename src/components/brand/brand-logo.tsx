import { cn } from "@/lib/utils"

interface BrandMarkProps {
  className?: string
  /** "brand" = royal-blue tile with white roof; "inverse" = white tile with blue roof. */
  tone?: "brand" | "inverse"
}

/**
 * Clay Roof Tiles mark — a rounded tile with a roof ridge and two rows of
 * barrel (khaprail) tiles. Pure SVG so it stays crisp at any size and can
 * be re-coloured for the transparent home header.
 */
export function BrandMark({ className, tone = "brand" }: BrandMarkProps) {
  const fill = tone === "brand" ? "#0A4595" : "#FFFFFF"
  const stroke = tone === "brand" ? "#FFFFFF" : "#0A4595"
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="9" fill={fill} />
      <path d="M7.5 19.5 20 9.5l12.5 10" fill="none" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M9.5 26c1.4-2.6 3.6-2.6 5 0 1.4-2.6 3.6-2.6 5 0 1.4-2.6 3.6-2.6 5 0 1.4-2.6 3.6-2.6 5 0"
        fill="none"
        stroke={stroke}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 31.5c1.4-2.6 3.6-2.6 5 0 1.4-2.6 3.6-2.6 5 0 1.4-2.6 3.6-2.6 5 0"
        fill="none"
        stroke={stroke}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface BrandLogoProps {
  className?: string
  /** "dark" text for white backgrounds, "light" text for photo / dark backgrounds. */
  variant?: "dark" | "light"
}

export function BrandLogo({ className, variant = "dark" }: BrandLogoProps) {
  const isLight = variant === "light"
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark className="size-10 shrink-0 sm:size-11" tone={isLight ? "inverse" : "brand"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.3rem] tracking-tight sm:text-[1.45rem]",
            isLight ? "text-white" : "text-primary"
          )}
        >
          CLAY ROOF
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold tracking-[0.38em] sm:text-[0.65rem]",
            isLight ? "text-white/85" : "text-ink/70"
          )}
        >
          TILES · EST. 1982
        </span>
      </span>
    </span>
  )
}
