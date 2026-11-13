import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { StorageImage } from "@/components/shared/storage-image"
import { useLifestyleTiles } from "@/hooks/use-lifestyle-tiles"
import { useCategoryLinkResolver } from "@/hooks/use-category-link-resolver"
import { useLinkableCategories } from "@/hooks/use-linkable-categories"
import { getRootCategories } from "@/lib/category-tree"
import { SectionHeading } from "./section-heading"
import { CarouselArrow } from "./carousel-arrow"
import { useSnapCarousel } from "./use-snap-carousel"

interface SpaceCard {
  id: string
  title: string
  image: string
  alt: string
  to: string
}

/**
 * "Explore Our Spaces" — royal-blue band with a 3-up photo carousel
 * (stile.com.pk "Explore STILE Spaces"). Uses the admin-managed
 * lifestyle tiles; falls back to top-level categories with photos.
 */
export function SpacesSection() {
  const { tiles, isLoading } = useLifestyleTiles()
  const resolveLink = useCategoryLinkResolver()
  const { categories, isLoading: catsLoading } = useLinkableCategories()
  const carousel = useSnapCarousel()

  const cards: SpaceCard[] =
    tiles.length > 0
      ? tiles.map((t) => ({ id: t.id, title: t.caption, image: t.image_url, alt: t.image_alt_text, to: resolveLink(t.link_url) }))
      : getRootCategories(categories)
          .filter((c) => c.cover_image_url)
          .map((c) => ({ id: c.id, title: c.name, image: c.cover_image_url!, alt: c.name, to: `/categories/${c.slug}` }))

  const loading = isLoading || (tiles.length === 0 && catsLoading)
  if (!loading && cards.length === 0) return null

  return (
    <section className="bg-band py-20 text-band-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          tone="light"
          title="Explore Clay Roof Spaces"
          intro="Step into homes finished with our clay — roofs, courtyards, kitchens and walls that carry the warmth of fired earth."
        />
        <div className="relative">
          {carousel.canPrev && <CarouselArrow direction="prev" onClick={carousel.prev} />}
          <div ref={carousel.ref} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-[85%] shrink-0 sm:w-[calc((100%-48px)/3)]">
                    <Skeleton className="aspect-[4/3] w-full bg-white/15" />
                    <Skeleton className="mt-4 h-5 w-1/3 bg-white/15" />
                  </div>
                ))
              : cards.map((card) => (
                  <Link
                    key={card.id}
                    to={card.to}
                    className="group w-[85%] shrink-0 snap-start outline-none focus-visible:ring-3 focus-visible:ring-white/60 sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
                  >
                    <div className="overflow-hidden rounded-lg">
                      <StorageImage
                        src={card.image}
                        alt={card.alt}
                        width={420}
                        height={315}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-4 text-lg font-semibold">{card.title}</p>
                  </Link>
                ))}
          </div>
          {carousel.canNext && <CarouselArrow direction="next" onClick={carousel.next} />}
        </div>
      </div>
    </section>
  )
}
