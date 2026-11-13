import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StorageImage } from "@/components/shared/storage-image"
import { useTrendingTiles } from "@/hooks/use-trending-tiles"
import { useLinkableCategories } from "@/hooks/use-linkable-categories"
import { useCategoryLinkResolver } from "@/hooks/use-category-link-resolver"
import { HERITAGE_IMAGE_JPG, HERITAGE_IMAGE_WEBP_SRCSET } from "@/lib/heritage-image"
import { SectionHeading } from "./section-heading"
import { CarouselArrow } from "./carousel-arrow"
import { useSnapCarousel } from "./use-snap-carousel"

interface CollectionCard {
  id: string
  title: string
  image: string
  alt: string
  to: string
  isNew?: boolean
}

/**
 * "Our Collections" — tall cards over a darkened photo (stile.com.pk).
 * Admin-curated Trending tiles first, then every subcategory that has a
 * photo and real products, so the carousel is never thin.
 */
export function CollectionsSection() {
  const { tiles, isLoading } = useTrendingTiles()
  const { categories, isLoading: catsLoading } = useLinkableCategories()
  const resolveLink = useCategoryLinkResolver()
  const carousel = useSnapCarousel()

  const fromTiles: CollectionCard[] = tiles.map((t) => ({
    id: t.id,
    title: t.title,
    image: t.image_url,
    alt: t.image_alt_text,
    to: resolveLink(t.link_url),
    isNew: t.show_new_badge,
  }))
  const fromCategories: CollectionCard[] = categories
    .filter((c) => c.parent_id !== null && c.cover_image_url)
    .sort((a, b) => Number(b.is_trending) - Number(a.is_trending) || a.sort_order - b.sort_order)
    .map((c) => ({ id: c.id, title: c.name, image: c.cover_image_url!, alt: c.name, to: `/categories/${c.slug}` }))
  const seen = new Set<string>()
  const cards = [...fromTiles, ...fromCategories].filter((c) => (seen.has(c.to) ? false : (seen.add(c.to), true))).slice(0, 12)

  const loading = isLoading || catsLoading
  if (!loading && cards.length === 0) return null

  return (
    <section className="relative isolate overflow-hidden py-20">
      <picture>
        <source srcSet={HERITAGE_IMAGE_WEBP_SRCSET} sizes="100vw" type="image/webp" />
        <img src={HERITAGE_IMAGE_JPG} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 -z-10 bg-black/75" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          tone="light"
          title="Our Collections"
          intro="From classic khaprail to glazed and terracotta ranges — collections made to suit every roof, floor and wall."
        />
        <div className="relative">
          {carousel.canPrev && <CarouselArrow direction="prev" onClick={carousel.prev} />}
          <div ref={carousel.ref} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-[70%] shrink-0 bg-white/10 sm:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]" />
                ))
              : cards.map((card) => (
                  <Link
                    key={card.id}
                    to={card.to}
                    className="group relative aspect-[3/4] w-[70%] shrink-0 snap-start overflow-hidden rounded-md outline-none focus-visible:ring-3 focus-visible:ring-white/60 sm:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]"
                  >
                    <StorageImage
                      src={card.image}
                      alt={card.alt}
                      width={320}
                      height={427}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    {card.isNew && (
                      <span className="absolute top-3 left-3 bg-clay px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider text-clay-foreground uppercase">
                        New
                      </span>
                    )}
                    <span className="absolute inset-x-4 bottom-6 text-center text-lg font-semibold text-white">{card.title}</span>
                  </Link>
                ))}
          </div>
          {carousel.canNext && <CarouselArrow direction="next" onClick={carousel.next} />}
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            className="h-12 bg-white px-8 text-xs font-semibold tracking-[0.15em] text-ink uppercase hover:bg-white/90"
            nativeButton={false}
            render={<Link to="/categories" />}
          >
            Explore all collections
          </Button>
        </div>
      </div>
    </section>
  )
}
