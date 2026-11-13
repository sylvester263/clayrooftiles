import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { SiteLayout } from "@/components/layout/site-layout"
import { Home } from "@/pages/home"

// SEO/perf batch A (2026-09-10, see 00-PROGRESS.md): every route was
// previously a static import, so a first-time visitor to the homepage
// downloaded the entire app in one bundle — every admin CRUD editor, the
// blog editor, every storefront page — before React could render anything.
// `lazy()` splits each route into its own chunk, fetched only when that
// route is actually visited; Vite/Rollup handles the chunking automatically
// from these dynamic `import()` calls, no manual `manualChunks` config
// needed. The admin section in particular (16 routes, never visited by a
// public/crawler request) no longer ships to storefront visitors at all.
//
// `Home` is the one exception, kept as a normal static import: measured
// live (re-ran Lighthouse after lazy-loading it too) and lazy-loading the
// single overwhelmingly-most-common landing page actually made LCP/FCP/TBT
// *worse* — it adds one extra network round-trip (fetch the "home" chunk)
// before the hero/LCP image can even start rendering, which costs more than
// the ~24KB it would have saved. Every other route keeps the real byte
// savings from splitting with none of that downside, since they aren't the
// default landing page.
const NotFound = lazy(() => import("@/pages/not-found").then((m) => ({ default: m.NotFound })))
const CategoriesIndex = lazy(() => import("@/pages/categories-index").then((m) => ({ default: m.CategoriesIndex })))
const CategoryDetail = lazy(() => import("@/pages/category-detail").then((m) => ({ default: m.CategoryDetail })))
const ProductsListing = lazy(() => import("@/pages/products-listing").then((m) => ({ default: m.ProductsListing })))
const SearchResults = lazy(() => import("@/pages/search-results").then((m) => ({ default: m.SearchResults })))
const ProductDetail = lazy(() => import("@/pages/product-detail").then((m) => ({ default: m.ProductDetail })))
const NewArrivals = lazy(() => import("@/pages/new-arrivals").then((m) => ({ default: m.NewArrivals })))
const BestSellers = lazy(() => import("@/pages/best-sellers").then((m) => ({ default: m.BestSellers })))
const About = lazy(() => import("@/pages/about").then((m) => ({ default: m.About })))
const Contact = lazy(() => import("@/pages/contact").then((m) => ({ default: m.Contact })))
const Videos = lazy(() => import("@/pages/videos").then((m) => ({ default: m.Videos })))
const Downloads = lazy(() => import("@/pages/downloads").then((m) => ({ default: m.Downloads })))
const BlogIndex = lazy(() => import("@/pages/blog-index").then((m) => ({ default: m.BlogIndex })))
const BlogPost = lazy(() => import("@/pages/blog-post").then((m) => ({ default: m.BlogPost })))

// This storefront shares pakclay.com's Supabase database and admin
// dashboard — there is no admin UI in this build. Any /admin URL sends the
// visitor to the one shared admin.
const SHARED_ADMIN_URL = "https://pakclay.com/admin"

function AdminRedirect() {
  if (typeof window !== "undefined") window.location.replace(SHARED_ADMIN_URL)
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<CategoriesIndex />} />
          <Route path="/categories/:slug" element={<CategoryDetail />} />
          <Route path="/products" element={<ProductsListing />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          {/* Any other URL: a real "not found" page (the server also sends a genuine HTTP 404). */}
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/*" element={<AdminRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
