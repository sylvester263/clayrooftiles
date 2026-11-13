import { Link } from "react-router-dom"
import { StorageImage } from "@/components/shared/storage-image"
import type { Category } from "@/types/category"

/** rhoback.com sub-collection row: square photos with the name centered in white. */
export function SubcategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.slug}`}
          className="group relative aspect-[4/5] w-40 shrink-0 snap-start overflow-hidden bg-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
        >
          {category.cover_image_url && (
            <StorageImage
              src={category.cover_image_url}
              alt=""
              width={220}
              height={275}
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
          <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-lg leading-tight font-medium text-white">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
