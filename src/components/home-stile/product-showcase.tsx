import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/types/product"

interface ProductShowcaseProps {
  title: string
  ctaLabel: string
  ctaTo: string
  products: Product[]
  isLoading: boolean
}

/** rhoback.com "Bestsellers" row — title left, navy button right, 4-up grid. */
export function ProductShowcase({ title, ctaLabel, ctaTo, products, isLoading }: ProductShowcaseProps) {
  if (!isLoading && products.length === 0) return null
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="rail-title">{title}</h2>
        <Button className="h-11 shrink-0 bg-ink px-5 text-sm font-semibold hover:bg-ink/90" nativeButton={false} render={<Link to={ctaTo} />}>
          {ctaLabel}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          : products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  )
}
