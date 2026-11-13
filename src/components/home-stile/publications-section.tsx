import { Link } from "react-router-dom"
import { BookOpenIcon, FileTextIcon, PlayCircleIcon } from "lucide-react"
import { StorageImage } from "@/components/shared/storage-image"
import { useVideos } from "@/hooks/use-videos"
import { useBlogPosts } from "@/hooks/use-blog-posts"
import { useNewArrivals } from "@/hooks/use-new-arrivals"
import { SectionHeading } from "./section-heading"

/** "Guides & Downloads" (stile.com.pk "Our Publications") — real catalog, videos and blog. */
export function PublicationsSection() {
  const { videos } = useVideos(1)
  const { posts } = useBlogPosts()
  const { products } = useNewArrivals(1)

  const cards = [
    {
      title: "Product Catalog",
      body: "Every tile in one branded PDF — sizes, finishes and categories, always up to date.",
      to: "/downloads",
      Icon: FileTextIcon,
      image: products[0]?.cover_image_url ?? null,
    },
    {
      title: "From the Workshop",
      body: "Watch our tiles being shaped, fired and laid on real roofs across Pakistan.",
      to: "/videos",
      Icon: PlayCircleIcon,
      image: videos[0]?.thumbnail_url ?? null,
    },
    {
      title: "Tile Guides",
      body: "Practical guides on choosing, installing and caring for clay and terracotta tiles.",
      to: "/blog",
      Icon: BookOpenIcon,
      image: posts[0]?.cover_image_url ?? null,
    },
  ]

  return (
    <section className="bg-band py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          tone="light"
          title="Guides & Downloads"
          intro="Catalogs, workshop films and guides that help you pick the right clay tile for your home."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ title, body, to, Icon, image }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col rounded-lg bg-white p-5 outline-none transition-transform hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              <span className="text-lg font-semibold text-primary">{title}</span>
              <span className="mt-2 text-sm text-muted-foreground">{body}</span>
              <span className="mt-5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-secondary">
                {image ? (
                  <StorageImage src={image} alt="" width={340} height={340} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <Icon className="size-16 text-primary/60" strokeWidth={1.25} />
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
