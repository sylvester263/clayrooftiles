import { useDocumentHead } from "@/hooks/use-document-head"
import { useBestSellers } from "@/hooks/use-best-sellers"
import { useNewArrivals } from "@/hooks/use-new-arrivals"
import { useFeaturedProducts } from "@/hooks/use-featured-products"
import { DeferredSection } from "@/components/shared/deferred-section"
import { HomeHero } from "@/components/home-stile/home-hero"
import { SpacesSection } from "@/components/home-stile/spaces-section"
import { CategoryPanels } from "@/components/home-stile/category-panels"
import { CollectionsSection } from "@/components/home-stile/collections-section"
import { ProductShowcase } from "@/components/home-stile/product-showcase"
import { ShowroomsSection } from "@/components/home-stile/showrooms-section"
import { ToolsSection } from "@/components/home-stile/tools-section"
import { PublicationsSection } from "@/components/home-stile/publications-section"

// Bestsellers are ranked from real sample requests; until enough exist, the
// row honestly falls back to admin-featured tiles under its own title.
function BestSellersShowcase() {
  const best = useBestSellers(8)
  const featured = useFeaturedProducts(8, null)
  if (best.isLoading || best.products.length > 0) {
    return <ProductShowcase title="Bestsellers" ctaLabel="Shop Bestsellers" ctaTo="/best-sellers" products={best.products} isLoading={best.isLoading} />
  }
  return <ProductShowcase title="Featured Tiles" ctaLabel="Shop All Tiles" ctaTo="/products" products={featured.products} isLoading={featured.isLoading} />
}

function NewArrivalsShowcase() {
  const { products, isLoading } = useNewArrivals(4)
  return <ProductShowcase title="New Arrivals" ctaLabel="Shop New Arrivals" ctaTo="/new-arrivals" products={products} isLoading={isLoading} />
}

// Clay Roof Tiles home page — section rhythm after stile.com.pk:
// full-screen hero → blue "spaces" band → edge-to-edge category panels →
// bestsellers → dark collections carousel → showrooms → new arrivals →
// smart tools → blue guides band. Every section reads the shared
// pakclay.com database; empty sections hide themselves.
export function Home() {
  useDocumentHead({
    title: "Clay Roof Tiles — Khaprail & Terracotta Roof Tiles Manufacturer in Pakistan",
    fullTitle: true,
    description:
      "Clay Roof Tiles makes khaprail, clay roof and terracotta tiles in Lahore since 1982. Browse the full range, compare sizes and finishes, and request a free sample.",
    path: "/",
  })
  return (
    <main className="flex-1">
      <HomeHero />
      <SpacesSection />
      <DeferredSection>
        <CategoryPanels />
      </DeferredSection>
      <DeferredSection>
        <BestSellersShowcase />
      </DeferredSection>
      <DeferredSection>
        <CollectionsSection />
      </DeferredSection>
      <DeferredSection>
        <ShowroomsSection />
      </DeferredSection>
      <DeferredSection>
        <NewArrivalsShowcase />
      </DeferredSection>
      <DeferredSection>
        <ToolsSection />
      </DeferredSection>
      <DeferredSection>
        <PublicationsSection />
      </DeferredSection>
    </main>
  )
}
