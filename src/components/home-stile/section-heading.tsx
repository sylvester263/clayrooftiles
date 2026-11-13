import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  intro?: string
  tone?: "light" | "dark"
  className?: string
}

/** Centered, bold stile.com.pk section heading with a one-line intro. */
export function SectionHeading({ title, intro, tone = "dark", className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-10 max-w-3xl text-center", className)}>
      <h2 className={cn("home-title", tone === "light" ? "text-white" : "text-ink")}>{title}</h2>
      {intro && (
        <p className={cn("mt-4 text-sm sm:text-base", tone === "light" ? "text-white/85" : "text-muted-foreground")}>{intro}</p>
      )}
    </div>
  )
}
