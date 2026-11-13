import { Link } from "react-router-dom"
import { ArrowRightIcon, FileDownIcon, PackageCheckIcon, SparklesIcon } from "lucide-react"
import { useChatPanel } from "@/lib/chat-panel-context"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { HERITAGE_IMAGE_JPG, HERITAGE_IMAGE_WEBP_SRCSET } from "@/lib/heritage-image"
import { SectionHeading } from "./section-heading"

const cardClass =
  "group flex flex-col rounded-lg border border-border bg-white p-7 text-left shadow-[0_2px_12px_rgb(0_0_0/0.05)] outline-none transition-shadow hover:shadow-[0_8px_28px_rgb(0_0_0/0.10)] focus-visible:ring-3 focus-visible:ring-ring/50"

function ArrowBox({ light }: { light?: boolean }) {
  return (
    <span
      className={
        light
          ? "mt-auto flex size-8 items-center justify-center border-2 border-white text-white"
          : "mt-auto flex size-8 items-center justify-center border-2 border-primary text-primary transition-colors group-hover:bg-primary group-hover:text-white"
      }
    >
      <ArrowRightIcon className="size-4" />
    </span>
  )
}

/** "Our Smart Tools" (stile.com.pk "Our Dynamic Tools") — the site's real helpers. */
export function ToolsSection() {
  const { open: openChat } = useChatPanel()
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        title="Our Smart Tools"
        intro="Simple tools that make choosing clay tiles easier — get answers instantly, hold a real sample, or take the whole catalog with you."
      />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr_1fr]">
        <button type="button" onClick={openChat} className="group relative min-h-[300px] overflow-hidden rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <picture>
            <source srcSet={HERITAGE_IMAGE_WEBP_SRCSET} sizes="(min-width: 1024px) 540px, 100vw" type="image/webp" />
            <img src={HERITAGE_IMAGE_JPG} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </picture>
          <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <span className="relative flex h-full flex-col gap-3 p-7 text-white">
            <span className="flex size-10 items-center justify-center rounded-md border-2 border-white">
              <SparklesIcon className="size-5" />
            </span>
            <span className="mt-auto text-xl font-semibold">AI Tile Assistant</span>
            <span className="max-w-sm text-sm text-white/85">
              Describe your roof, room or budget and get real product suggestions from our catalog in seconds.
            </span>
            <ArrowBox light />
          </span>
        </button>

        <a href={buildWhatsAppUrl("Hi, I'd like to request a free tile sample.")} target="_blank" rel="noreferrer" className={cardClass}>
          <PackageCheckIcon className="size-9 text-primary" strokeWidth={1.5} />
          <span className="mt-6 text-lg font-semibold text-primary">Free Sample</span>
          <span className="mt-2 mb-6 text-sm text-muted-foreground">
            Hold the real tile before you order — check colour, weight and finish in your own light.
          </span>
          <ArrowBox />
        </a>

        <Link to="/downloads" className={cardClass}>
          <FileDownIcon className="size-9 text-primary" strokeWidth={1.5} />
          <span className="mt-6 text-lg font-semibold text-primary">Catalog & Spec Sheets</span>
          <span className="mt-2 mb-6 text-sm text-muted-foreground">
            Download the full catalog or a spec sheet for any tile, generated live from our range.
          </span>
          <ArrowBox />
        </Link>
      </div>
    </section>
  )
}
