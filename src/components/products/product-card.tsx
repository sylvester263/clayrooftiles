import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { StorageImage } from "@/components/shared/storage-image"
import { buildSampleRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp"
import type { Product } from "@/types/product"

const NEW_ARRIVAL_WINDOW_DAYS = 60

// `is_new` is a real editorial decision (admin checkbox, tri-state: true
// always shows the badge, false always hides it) and always wins when set.
// The `created_at`-window check only kicks in when nobody has made that
// call yet (`is_new === null`) — it stays a real "this really is recent"
// signal for future products added days/weeks apart, but the whole catalog
// being bulk-inserted in one session meant it covered almost every card
// with no real signal value, so existing rows were explicitly backfilled
// to `false` rather than left to the fallback (UX_AUDIT_REPORT.md finding 3).
function isNewArrival(product: Pick<Product, "is_new" | "created_at">): boolean {
  if (product.is_new !== null) return product.is_new
  const ageMs = Date.now() - new Date(product.created_at).getTime()
  return ageMs < NEW_ARRIVAL_WINDOW_DAYS * 24 * 60 * 60 * 1000
}

interface ProductCardProps {
  product: Product
}

// rhoback.com-style listing card: large photo on a soft gray plate, small
// square badges top-left, then name / size / price in quiet type. No boxed
// card chrome. "Get a Sample" stays as a light text link so the existing
// WhatsApp sample flow is one tap away from every listing.
export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group/card flex flex-col">
      <Link to={`/products/${product.slug}`} className="group/link flex flex-col outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-[#F4F5F7]">
          {product.cover_image_url && (
            <StorageImage
              src={product.cover_image_url}
              alt=""
              width={320}
              height={320}
              className="h-full w-full object-cover transition-transform duration-700 group-hover/link:scale-105"
            />
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {isNewArrival(product) && (
              <Badge className="h-auto rounded-none bg-clay px-2 py-1 text-[0.65rem] font-semibold text-clay-foreground">New</Badge>
            )}
            {product.is_featured && (
              <Badge className="h-auto rounded-none border border-ink/20 bg-white px-2 py-1 text-[0.65rem] font-medium text-ink">Bestseller</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 pt-4">
          <h3 className="text-[0.95rem] font-medium text-ink group-hover/link:underline group-hover/link:underline-offset-4">{product.name}</h3>
          {product.size && <p className="text-sm text-muted-foreground">{product.size}</p>}
          {product.price != null && <p className="mt-1 text-sm font-semibold text-price">PKR {product.price.toLocaleString()}</p>}
        </div>
      </Link>
      <a
        href={buildWhatsAppUrl(buildSampleRequestMessage(product.name))}
        target="_blank"
        rel="noreferrer"
        className="mt-2 w-fit text-xs font-semibold tracking-[0.12em] text-primary uppercase underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        Get a sample →
      </a>
    </div>
  )
}
