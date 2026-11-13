import { useEffect, useState, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SlidersHorizontalIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/products/product-card"
import { FilterSidebar } from "@/components/products/filter-sidebar"
import { MobileFiltersDrawer } from "@/components/products/mobile-filters-drawer"
import { Pagination } from "@/components/shared/pagination"
import { cn } from "@/lib/utils"
import type { ActiveFilters, SortOption } from "@/lib/product-filters"
import type { FilterType, Product } from "@/types/product"

const MOBILE_FILTERS_HASH = "#mobile-filters"

interface ListingBrowserProps {
  products: Product[]
  isLoading: boolean
  error?: string | null
  filterGroups: Record<string, FilterType[]>
  facetCounts: Record<string, Record<string, number>>
  activeFilters: ActiveFilters
  filtersLoading: boolean
  sort: SortOption
  onToggle: (filterType: string, value: string) => void
  onClearAll: () => void
  onSortChange: (value: SortOption) => void
  emptyState: ReactNode
  pageSize?: number
  /** Resets pagination when this changes (e.g. the category slug). */
  resetKey?: string
}

/**
 * rhoback.com collection layout: a sticky toolbar (Filter toggle · result
 * count · Sort), an optional left filter sidebar that narrows the grid from
 * 4 to 3 columns, the product grid and pagination. On phones the Filter
 * button opens the existing bottom-sheet drawer (same `#mobile-filters`
 * hash the mobile tab bar uses).
 */
export function ListingBrowser({
  products,
  isLoading,
  error,
  filterGroups,
  facetCounts,
  activeFilters,
  filtersLoading,
  sort,
  onToggle,
  onClearAll,
  onSortChange,
  emptyState,
  pageSize = 12,
  resetKey,
}: ListingBrowserProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState(1)
  const activeCount = Object.values(activeFilters).reduce((n, v) => n + v.length, 0)
  const hasFilters = Object.keys(filterGroups).length > 0 || filtersLoading

  useEffect(() => {
    setPage(1)
  }, [location.search, resetKey])

  const pageCount = Math.max(1, Math.ceil(products.length / pageSize))
  const paged = products.slice((page - 1) * pageSize, page * pageSize)
  const mobileOpen = location.hash === MOBILE_FILTERS_HASH

  function openFilters() {
    if (window.matchMedia("(min-width: 1024px)").matches) setSidebarOpen((v) => !v)
    else navigate(`${location.pathname}${location.search}${MOBILE_FILTERS_HASH}`)
  }

  return (
    <div>
      <div className="sticky top-20 z-20 -mx-4 mb-8 flex h-14 items-center justify-between gap-4 border-y border-border bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:top-24">
        {hasFilters ? (
          <button
            type="button"
            onClick={openFilters}
            aria-expanded={sidebarOpen}
            className="flex h-10 items-center gap-2 rounded-sm border border-border px-4 text-sm font-medium text-ink outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <SlidersHorizontalIcon className="size-4" />
            Filter
            {activeCount > 0 && <span className="text-primary">({activeCount})</span>}
          </button>
        ) : (
          <span />
        )}
        <span className="hidden text-sm text-muted-foreground sm:block">
          {isLoading ? "Loading…" : `${products.length} ${products.length === 1 ? "product" : "products"}`}
        </span>
        <Select value={sort} onValueChange={(v) => v && onSortChange(v as SortOption)}>
          <SelectTrigger className="h-10 w-40 rounded-sm" aria-label="Sort products">
            <SelectValue placeholder="Sort">{(value: string) => (value === "name-asc" ? "Name A–Z" : "Newest")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name-asc">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={cn("grid gap-8", hasFilters && sidebarOpen && "lg:grid-cols-[250px_1fr]")}>
        {hasFilters && sidebarOpen && (
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-44">
              <FilterSidebar
                filterGroups={filterGroups}
                facetCounts={facetCounts}
                activeFilters={activeFilters}
                isLoading={filtersLoading}
                onToggle={onToggle}
                onClearAll={onClearAll}
              />
            </div>
          </aside>
        )}

        <div className="min-w-0">
          {isLoading ? (
            <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:gap-x-6", !(hasFilters && sidebarOpen) && "lg:grid-cols-4")}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : error || products.length === 0 ? (
            emptyState
          ) : (
            <>
              <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:gap-x-6", !(hasFilters && sidebarOpen) && "lg:grid-cols-4")}>
                {paged.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>

      <MobileFiltersDrawer
        open={mobileOpen}
        onClose={() => navigate(`${location.pathname}${location.search}`, { replace: true })}
        filterGroups={filterGroups}
        facetCounts={facetCounts}
        activeFilters={activeFilters}
        onToggle={onToggle}
        onClearAll={onClearAll}
      />
    </div>
  )
}
