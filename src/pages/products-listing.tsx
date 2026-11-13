import { useDocumentHead } from "@/hooks/use-document-head"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { ListingBrowser } from "@/components/products/listing-browser"
import { useFilterTypes } from "@/hooks/use-filter-types"
import { useProducts } from "@/hooks/use-products"
import {
  filtersToSearchParams,
  parseFiltersFromSearchParams,
  parseSortFromSearchParams,
  toggleFilterValue,
  type SortOption,
} from "@/lib/product-filters"

const PAGE_SIZE = 12

// The mobile filters drawer's open state lives in the URL hash rather than
// a query param, since `parseFiltersFromSearchParams` treats every query
// key except `sort` as a real filter type — a `?mfilters=1` param would be
// misread as an attribute filter and silently break the product query.

// /products — filterable listing (04-PRODUCT-LISTING-FILTERS.md). Filters
// reflect into the URL so views are shareable/bookmarkable/indexable. On
// mobile, the chip-row `FilterBar` is replaced by `MobileFiltersDrawer` (a
// two-pane facet drill-down opened from the bottom tab bar) — both drive
// the exact same `activeFilters` state.
export function ProductsListing() {
  useDocumentHead({
    title: "Shop All Tiles — Roof, Floor & Wall Tiles",
    description:
      "Browse every clay roof tile, terracotta floor tile, Multani tile and stone wall tile we offer. Filter by type, pattern, material, finish and color.",
    path: "/products",
  })
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const activeFilters = parseFiltersFromSearchParams(searchParams)
  const sort = parseSortFromSearchParams(searchParams)

  const { filterGroups, isLoading: filtersLoading } = useFilterTypes()
  const { products, facetCounts, isLoading: productsLoading, error } = useProducts(activeFilters, sort)


  // Navigates with the new search params while preserving the current URL
  // hash — `useSearchParams`'s setter drops the hash entirely, which would
  // otherwise close the mobile filters drawer (its open state is
  // `location.hash === '#mobile-filters'`) on every single filter tap.
  function applySearchParams(next: URLSearchParams) {
    const search = next.toString()
    navigate(`${location.pathname}${search ? `?${search}` : ""}${location.hash}`, { replace: true })
  }

  function handleToggle(filterType: string, value: string) {
    const next = toggleFilterValue(activeFilters, filterType, value)
    applySearchParams(filtersToSearchParams(next, sort))
  }

  function handleClearAll() {
    applySearchParams(filtersToSearchParams({}, sort))
  }

  function handleSortChange(value: SortOption | null) {
    if (!value) return
    applySearchParams(filtersToSearchParams(activeFilters, value))
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6">
        <h1 className="page-title">All Products</h1>
        <p className="mt-2 mb-8 text-muted-foreground">Browse our full catalog of clay and terracotta tiles.</p>
        <h2 className="sr-only">Tile products</h2>
        <ListingBrowser
          products={products}
          isLoading={productsLoading}
          error={error}
          filterGroups={filterGroups}
          facetCounts={facetCounts}
          activeFilters={activeFilters}
          filtersLoading={filtersLoading}
          sort={sort}
          onToggle={handleToggle}
          onClearAll={handleClearAll}
          onSortChange={handleSortChange}
          pageSize={PAGE_SIZE}
          emptyState={<p className="py-16 text-center text-sm text-muted-foreground">Products coming soon.</p>}
        />
      </div>
    </main>
  )
}
