import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StorageImage } from "@/components/shared/storage-image"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useLinkableCategories } from "@/hooks/use-linkable-categories"
import { getRootCategories } from "@/lib/category-tree"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { HERO_IMAGE_JPG, HERO_IMAGE_SIZES, HERO_IMAGE_WEBP_SRCSET, HERO_IMAGE_WIDTH, HERO_IMAGE_HEIGHT } from "@/lib/hero-image"
import { HERITAGE_IMAGE_JPG, HERITAGE_IMAGE_WEBP_SRCSET, HERITAGE_IMAGE_WIDTH, HERITAGE_IMAGE_HEIGHT } from "@/lib/heritage-image"
import { cn } from "@/lib/utils"

interface Slide {
  key: string
  eyebrow: string
  title: string
  tagline: string
  cta: { label: string; to: string }
  image:
    | { kind: "static"; jpg: string; srcSet: string; width: number; height: number }
    | { kind: "storage"; url: string }
}

const STATIC_SLIDES: Slide[] = [
  {
    key: "roof",
    eyebrow: "Lahore · Since 1982",
    title: "Clay Roof Tiles",
    tagline: "Khaprail, roof and terracotta tiles — fired in Lahore since 1982",
    cta: { label: "Explore Collections", to: "/categories" },
    image: { kind: "static", jpg: HERO_IMAGE_JPG, srcSet: HERO_IMAGE_WEBP_SRCSET, width: HERO_IMAGE_WIDTH, height: HERO_IMAGE_HEIGHT },
  },
  {
    key: "craft",
    eyebrow: "Made by hand",
    title: "Crafted From Local Clay",
    tagline: "Every tile shaped, dried and kiln-fired by the same Lahore workshop",
    cta: { label: "Our Story", to: "/about" },
    image: {
      kind: "static",
      jpg: HERITAGE_IMAGE_JPG,
      srcSet: HERITAGE_IMAGE_WEBP_SRCSET,
      width: HERITAGE_IMAGE_WIDTH,
      height: HERITAGE_IMAGE_HEIGHT,
    },
  },
]

const INTERVAL_MS = 6500

/**
 * Full-screen stile.com.pk hero: image slides with a huge centered
 * headline, short underline and tagline, line indicators along the bottom.
 * Pulls itself up under the transparent header (-mt equals header height).
 * Slide 3 is the first real category that has a cover photo (admin data).
 */
export function HomeHero() {
  const reducedMotion = useReducedMotion()
  const { categories } = useLinkableCategories()
  const featured = getRootCategories(categories).find((c) => c.cover_image_url)
  const slides: Slide[] = featured
    ? [
        ...STATIC_SLIDES,
        {
          key: `cat-${featured.id}`,
          eyebrow: "Featured range",
          title: featured.name,
          tagline: "Browse the full range and request a free sample",
          cta: { label: `Shop ${featured.name}`, to: `/categories/${featured.slug}` },
          image: { kind: "storage", url: featured.cover_image_url! },
        },
      ]
    : STATIC_SLIDES

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const go = useCallback((i: number) => setActive((i + count) % count), [count])

  useEffect(() => {
    if (reducedMotion || paused || count < 2) return
    const id = window.setTimeout(() => go(active + 1), INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [active, paused, reducedMotion, count, go])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative -mt-20 h-[100svh] max-h-[960px] min-h-[600px] overflow-hidden bg-hero lg:-mt-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const isActive = i === active
        return (
          <div
            key={slide.key}
            aria-hidden={!isActive}
            className={cn("absolute inset-0 transition-opacity duration-1000", isActive ? "opacity-100" : "pointer-events-none opacity-0")}
          >
            {slide.image.kind === "static" ? (
              <picture>
                <source srcSet={slide.image.srcSet} sizes={HERO_IMAGE_SIZES} type="image/webp" />
                <img
                  src={slide.image.jpg}
                  alt=""
                  width={slide.image.width}
                  height={slide.image.height}
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={cn("h-full w-full object-cover transition-transform duration-[7000ms] ease-out", isActive && !reducedMotion && "scale-105")}
                />
              </picture>
            ) : (
              <StorageImage src={slide.image.url} alt="" width={1600} height={1000} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
            <div className="absolute inset-0 flex items-center justify-center px-6 pt-20 text-center lg:pt-24">
              <div className={cn("flex max-w-4xl flex-col items-center transition-all duration-700", isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                <span className="text-xs font-semibold tracking-[0.35em] text-white/80 uppercase">{slide.eyebrow}</span>
                {i === 0 ? (
                  <h1 className="mt-4 font-display text-5xl leading-[1.02] text-white uppercase sm:text-6xl lg:text-7xl">{slide.title}</h1>
                ) : (
                  <p className="mt-4 font-display text-5xl leading-[1.02] text-white uppercase sm:text-6xl lg:text-7xl">{slide.title}</p>
                )}
                <span className="mt-6 h-0.5 w-40 bg-white/90" />
                <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">{slide.tagline}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="h-12 bg-white px-8 text-sm font-semibold tracking-wide text-ink uppercase hover:bg-white/90"
                    nativeButton={false}
                    render={<Link to={slide.cta.to} tabIndex={isActive ? 0 : -1} />}
                  >
                    {slide.cta.label}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-white/80 bg-transparent px-8 text-sm font-semibold tracking-wide text-white uppercase hover:bg-white/10 hover:text-white"
                    nativeButton={false}
                    render={
                      <a
                        href={buildWhatsAppUrl("Hi, I'd like to request a free tile sample.")}
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={isActive ? 0 : -1}
                      />
                    }
                  >
                    Get a Free Sample
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className="group flex h-6 items-center outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <span className={cn("block h-[3px] rounded-full transition-all", i === active ? "w-12 bg-white" : "w-7 bg-white/45 group-hover:bg-white/70")} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
