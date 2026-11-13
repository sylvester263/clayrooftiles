import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { StorageImage } from "@/components/shared/storage-image"
import { useLinkableCategories } from "@/hooks/use-linkable-categories"
import { getRootCategories } from "@/lib/category-tree"
import { CarouselArrow } from "./carousel-arrow"
import { useSnapCarousel } from "./use-snap-carousel"

/**
 * Edge-to-edge tall category panels with a blue wash and a bold
 * "Name →" label (stile.com.pk Floor/Wall/Indoor/Outdoor strip). Four per
 * view on desktop, scrolls for more. Real categories that have products.
 */
export function CategoryPanels() {
  const { categories, isLoading } = useLinkableCategories()
  const roots = getRootCategories(categories)
  const carousel = useSnapCarousel()

  if (!isLoading && roots.length === 0) return null

  return (
    <section className="relative bg-ink" aria-label="Shop by category">
      {carousel.canPrev && <CarouselArrow direction="prev" onClick={carousel.prev} className="left-4 lg:left-4" />}
      <div ref={carousel.ref} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[440px] w-1/2 shrink-0 rounded-none lg:w-1/4" />)
          : roots.map((category) => {
              const [first, ...rest] = category.name.split(" ")
              return (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group relative h-[380px] w-[70%] shrink-0 snap-start overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:ring-inset sm:w-1/2 lg:h-[480px] lg:w-1/4"
                >
                  {category.cover_image_url ? (
                    <StorageImage
                      src={category.cover_image_url}
                      alt=""
                      width={480}
                      height={600}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute inset-0 bg-primary-dark" />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent transition-opacity group-hover:opacity-90" />
                  <span className="absolute inset-x-6 bottom-8 text-white">
                    <span className="flex items-center gap-2 font-display text-3xl leading-none">
                      {first}
                      <ArrowRightIcon className="size-6 transition-transform group-hover:translate-x-1" />
                    </span>
                    {rest.length > 0 && <span className="mt-1 block font-display text-3xl leading-tight">{rest.join(" ")}</span>}
                  </span>
                </Link>
              )
            })}
      </div>
      {carousel.canNext && <CarouselArrow direction="next" onClick={carousel.next} className="right-4 lg:right-4" />}
    </section>
  )
}
