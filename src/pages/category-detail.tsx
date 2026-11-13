import { RelatedPosts } from "@/components/blog/related-posts"
import { keywordsOf } from "@/lib/related-content"
import { useDocumentHead } from "@/hooks/use-document-head"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbJsonLd } from "@/lib/seo/json-ld"
import { shareImage } from "@/lib/seo/image"
import { joinList, truncateAtWord } from "@/lib/seo/text"
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductRail } from "@/components/shared/product-rail"
import { ListingBrowser } from "@/components/products/listing-browser"
import { SubcategoryTiles } from "@/components/categories/subcategory-tiles"
import { useCategory } from "@/hooks/use-category"
import { useLinkableCategories } from "@/hooks/use-linkable-categories"
import { useCategories } from "@/hooks/use-categories"
import { useFeaturedProducts } from "@/hooks/use-featured-products"
import { useFilterTypes } from "@/hooks/use-filter-types"
import { useProducts } from "@/hooks/use-products"
import { getCategoryAncestors, getCategoryChildren, getDescendantCategoryIds } from "@/lib/category-tree"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import {
  filtersToSearchParams,
  parseFiltersFromSearchParams,
  parseSortFromSearchParams,
  toggleFilterValue,
  type SortOption,
} from "@/lib/product-filters"

const PAGE_SIZE = 12

// /categories/[slug] — shared template for both main categories and
// subcategories, filtered by category_id (11-CATEGORY-LISTING-SPEC.md).
export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { category, isLoading, error } = useCategory(slug)
  const { categories } = useCategories()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const activeFilters = parseFiltersFromSearchParams(searchParams)
  const sort = parseSortFromSearchParams(searchParams)

  // Include products attached to any descendant category, not just this
  // one directly — a root category like Floor Tiles has real products
  // filed under a child (Terracotta Floor Tiles), and the page should show
  // them instead of a false "coming soon" (UX_AUDIT_REPORT.md finding 2.1).
  const categoryIds = category ? getDescendantCategoryIds(categories, category.id) : null

  const topPicks = useFeaturedProducts(8, categoryIds)
  const { filterGroups, isLoading: filtersLoading } = useFilterTypes()
  const { products, facetCounts, isLoading: productsLoading, error: productsError } = useProducts(
    activeFilters,
    sort,
    categoryIds
  )

  const ancestors = category ? getCategoryAncestors(categories, category.id) : []
  const { categories: linkableCategories } = useLinkableCategories()
  const children = category ? getCategoryChildren(linkableCategories, category.id) : []

  // Title/description are built only from real data (the category's name and
  // parent, its real product count and product names). A category with no
  // products at all is a thin page: it is set noindex (and kept out of the
  // sitemap by the server) until products are added. Active filters (the
  // ?color=... query) vary the visible list but not the page's identity, so
  // the canonical stays the bare path and the description omits the count.
  const hasActiveFilters = Object.values(activeFilters).some((values) => values.length > 0)
  const parentName = ancestors[ancestors.length - 1]?.name
  const isEmptyCategory = !productsLoading && !hasActiveFilters && products.length === 0
  useDocumentHead(
    category && !productsLoading
      ? {
          title: /tiles?\b/i.test(category.name) ? category.name : `${category.name} Tiles`,
          description: truncateAtWord(
            isEmptyCategory
              ? `Browse ${category.name} at Clay Roof Tiles. Products for this category are being added — contact us on WhatsApp for availability.`
              : hasActiveFilters || products.length === 0
                ? `Browse ${category.name} from Clay Roof Tiles. Filter by type, pattern, material, finish and color, then request a free sample.`
                : products.length === 1
                  ? `Browse ${category.name}${parentName ? ` in our ${parentName} range` : ""}: ${products[0].name}. Request a free sample from Clay Roof Tiles.`
                  : `Browse ${products.length} products in ${category.name}${parentName ? `, part of our ${parentName} range` : ""}, including ${joinList(
                      products.slice(0, 2).map((p) => p.name),
                    )}. Request a free sample from Clay Roof Tiles.`,
            155,
          ),
          path: `/categories/${category.slug}`,
          image: shareImage(category.cover_image_url ?? products[0]?.cover_image_url, 630),
          imageAlt: category.name,
          noindex: isEmptyCategory,
        }
      : null,
  )

  // Keeps the URL hash so the mobile filters drawer (#mobile-filters)
  // stays open while filters are tapped.
  function applySearchParams(next: URLSearchParams) {
    const search = next.toString()
    navigate(`${location.pathname}${search ? `?${search}` : ""}${location.hash}`, { replace: true })
  }

  function handleToggle(filterType: string, value: string) {
    applySearchParams(filtersToSearchParams(toggleFilterValue(activeFilters, filterType, value), sort))
  }

  function handleClearAll() {
    applySearchParams(filtersToSearchParams({}, sort))
  }

  function handleSortChange(value: SortOption) {
    applySearchParams(filtersToSearchParams(activeFilters, value))
  }

  if (isLoading) {
    return (
      <main className="min-h-svh flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <Skeleton className="mx-auto h-8 w-64" />
        </div>
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <h1 className="font-heading text-2xl">Category not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find that category. Browse all categories instead.
        </p>
        <Button className="mt-4" nativeButton={false} render={<Link to="/categories" />}>
          View All Categories
        </Button>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          ...ancestors.map((a) => ({ name: a.name, path: `/categories/${a.slug}` })),
          { name: category.name, path: `/categories/${category.slug}` },
        ])}
      />
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-ink hover:underline">
            Home
          </Link>
          {ancestors.map((ancestor) => (
            <span key={ancestor.id} className="flex items-center gap-1">
              <ChevronRightIcon className="size-3" />
              <Link to={`/categories/${ancestor.slug}`} className="hover:text-ink hover:underline">
                {ancestor.name}
              </Link>
            </span>
          ))}
          <span className="flex items-center gap-1">
            <ChevronRightIcon className="size-3" />
            <span className="text-ink">{category.name}</span>
          </span>
        </nav>

        <h1 className="page-title mb-6">{category.name}</h1>

        {children.length > 0 && (
          <div className="mb-8">
            <h2 className="sr-only">Explore {category.name}</h2>
            <SubcategoryTiles categories={children} />
          </div>
        )}

        <h2 className="sr-only">Tile products in this category</h2>
        <ListingBrowser
          products={products}
          isLoading={productsLoading}
          error={productsError}
          filterGroups={filterGroups}
          facetCounts={facetCounts}
          activeFilters={activeFilters}
          filtersLoading={filtersLoading}
          sort={sort}
          onToggle={handleToggle}
          onClearAll={handleClearAll}
          onSortChange={handleSortChange}
          pageSize={PAGE_SIZE}
          resetKey={slug}
          emptyState={
            <div className="border border-border bg-muted px-6 py-16 text-center">
              <p className="text-muted-foreground">
                Products in this category are coming soon. In the meantime, get in touch and we'll walk you through
                what's available.
              </p>
              <Button
                size="lg"
                className="mt-6 h-12 px-6 text-base"
                nativeButton={false}
                render={
                  <a
                    href={buildWhatsAppUrl(`Hi, I'm interested in ${category.name}. Could you share more details?`)}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                Ask About {category.name} on WhatsApp
              </Button>
            </div>
          }
        />

        <div className="mt-20">
          <ProductRail
            title="Top Picks"
            emptyCopy="We're still building our top picks for this category — check back soon."
            products={topPicks.products}
            isLoading={topPicks.isLoading}
            hideWhenEmpty
            minCount={3}
          />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <RelatedPosts keywords={keywordsOf(category.name, ...ancestors.map((a) => a.name))} />
      </div>
    </main>
  )
}
