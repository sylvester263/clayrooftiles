import { useState } from "react"
import { MapPinIcon, PhoneIcon } from "lucide-react"
import { CONTACT_HOURS, CONTACT_LOCATIONS, CONTACT_PHONES } from "@/lib/contact-info"
import { HERO_IMAGE_JPG, HERO_IMAGE_WEBP_SRCSET } from "@/lib/hero-image"
import { cn } from "@/lib/utils"

function cityOf(label: string) {
  return label.replace(/\s*\[.*?\]\s*/g, "").trim()
}

/**
 * "Our Showrooms" (stile.com.pk "STILE Emporium"): lattice background, a
 * pipe-separated city switcher and one large photo with the showroom name
 * overlaid. Cities/addresses come from the shared contact-info source.
 */
export function ShowroomsSection() {
  const [active, setActive] = useState(0)
  const location = CONTACT_LOCATIONS[active]
  if (!location) return null
  const city = cityOf(location.label)
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`

  return (
    <section className="lattice-bg py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="home-title text-ink uppercase">Our Showrooms</h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            See the tiles in person, compare colours side by side and talk to our team about your roof or floor —
            visit a Clay Roof Tiles showroom near you.
          </p>
        </div>
        <div className="mb-8 flex flex-wrap items-center justify-center gap-y-2 text-sm font-medium tracking-[0.12em] uppercase">
          {CONTACT_LOCATIONS.map((loc, i) => (
            <span key={loc.label} className="flex items-center">
              {i > 0 && <span className="mx-4 h-4 w-px bg-ink/30" aria-hidden="true" />}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={cn(
                  "border-b-2 pb-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                  i === active ? "border-primary text-primary" : "border-transparent text-ink/70 hover:text-ink"
                )}
              >
                {cityOf(loc.label)}
              </button>
            </span>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <picture>
            <source srcSet={HERO_IMAGE_WEBP_SRCSET} sizes="(min-width: 1152px) 1152px, 100vw" type="image/webp" />
            <img src={HERO_IMAGE_JPG} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-end gap-3 p-6 text-white sm:p-10">
            <p className="font-display text-3xl leading-none uppercase sm:text-5xl">Clay Roof Tiles</p>
            <p className="text-2xl font-light tracking-wide uppercase sm:text-3xl">{city}</p>
            <p className="mt-2 flex items-start gap-2 text-sm text-white/90">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" />
              {location.address}
            </p>
            <p className="hidden text-sm text-white/80 sm:block">{CONTACT_HOURS.map((h) => `${h.days}: ${h.hours}`).join(" · ")}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center bg-white px-5 text-xs font-semibold tracking-[0.15em] text-ink uppercase outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                Get directions
              </a>
              {CONTACT_PHONES[0] && (
                <a
                  href={CONTACT_PHONES[0].href}
                  className="inline-flex h-11 items-center gap-2 border border-white/80 px-5 text-xs font-semibold tracking-[0.15em] uppercase outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/60"
                >
                  <PhoneIcon className="size-4" /> Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
