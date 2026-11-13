import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { StorageImage } from "@/components/shared/storage-image"
import { getCategoryChildren, getRootCategories } from "@/lib/category-tree"
import type { Category } from "@/types/category"

interface CategoriesMegaMenuProps {
  categories: Category[]
  isLoading: boolean
  error: string | null
  triggerClassName?: string
}

const MAX_CHILDREN = 7

/**
 * rhoback.com-style mega menu: every top-level category is a column with an
 * underlined heading and a plain list of its subcategories, plus one promo
 * photo card on the right. Data is the shared `categories` table, so it
 * always matches pakclay.com's admin.
 */
export function CategoriesMegaMenu({ categories, isLoading, error, triggerClassName }: CategoriesMegaMenuProps) {
  const roots = getRootCategories(categories)
  const promo = roots.find((c) => c.cover_image_url) ?? null

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={triggerClassName}>Categories</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="max-h-[calc(100svh-9rem)] w-[min(72rem,calc(100vw-2rem))] overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-8 p-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : error || roots.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Categories coming soon.</p>
          ) : (
            <div className="flex gap-8 p-8">
              <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-3 xl:grid-cols-4">
                {roots.map((root) => {
                  const children = getCategoryChildren(categories, root.id)
                  return (
                    <div key={root.id} className="flex flex-col gap-2.5">
                      <NavigationMenuLink
                        render={<Link to={`/categories/${root.slug}`} />}
                        className="w-fit rounded-none p-0 text-[0.95rem] font-semibold text-ink underline decoration-1 underline-offset-[6px] hover:bg-transparent hover:text-primary focus:bg-transparent"
                      >
                        {root.name}
                      </NavigationMenuLink>
                      {children.slice(0, MAX_CHILDREN).map((child) => (
                        <NavigationMenuLink
                          key={child.id}
                          render={<Link to={`/categories/${child.slug}`} />}
                          className="w-fit rounded-none p-0 text-sm text-ink/75 hover:bg-transparent hover:text-primary focus:bg-transparent"
                        >
                          {child.name}
                        </NavigationMenuLink>
                      ))}
                      {children.length > MAX_CHILDREN && (
                        <Link to={`/categories/${root.slug}`} className="text-sm font-medium text-primary hover:underline">
                          View all
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
              {promo && (
                <NavigationMenuLink
                  render={<Link to={`/categories/${promo.slug}`} />}
                  className="group/promo relative hidden w-60 shrink-0 self-start overflow-hidden rounded-md p-0 lg:block"
                >
                  <StorageImage src={promo.cover_image_url!} alt="" width={240} height={300} className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 group-hover/promo:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white">
                    <span className="font-display text-lg leading-tight">{promo.name}</span>
                    <ArrowRightIcon className="size-4" />
                  </span>
                </NavigationMenuLink>
              )}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border px-8 py-4 text-sm">
            <span className="text-muted-foreground">Clay roof, floor & wall tiles — made in Lahore</span>
            <Link to="/categories" className="font-semibold text-ink hover:text-primary">
              All Categories →
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
