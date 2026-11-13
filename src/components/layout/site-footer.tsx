import { Link } from "react-router-dom"
import { DownloadIcon, MapPinIcon, MessageCircleIcon, PackageCheckIcon } from "lucide-react"
import { BrandLogo } from "@/components/brand/brand-logo"
import { NAV_LINKS } from "@/lib/nav-links"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { CONTACT_EMAIL, CONTACT_HOURS, CONTACT_LOCATIONS, CONTACT_PHONES } from "@/lib/contact-info"
import { SOCIAL_LINKS } from "@/lib/social-links"
import { SUB_BRANDS } from "@/lib/sub-brands"
import { useLinkableCategories } from "@/hooks/use-linkable-categories"
import { getRootCategories } from "@/lib/category-tree"

const FOOTER_CATEGORY_LIMIT = 8

// Always-true service promises only (rhoback.com's footer trust strip).
const TRUST_ITEMS = [
  { Icon: PackageCheckIcon, title: "Free Samples", body: "See and feel the clay first", href: buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE), external: true },
  { Icon: DownloadIcon, title: "Full Catalog", body: "Download every tile as a PDF", href: "/downloads", external: false },
  { Icon: MessageCircleIcon, title: "WhatsApp Help", body: "Questions, sizes and quotes", href: buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE), external: true },
  { Icon: MapPinIcon, title: "Visit a Showroom", body: "Lahore & Islamabad", href: "/contact", external: false },
]

const COPYRIGHT = `Copyright © ${new Date().getFullYear()} Clay Roof Tiles · Part of PAKTILES.COM. All rights reserved.`

/** Trust strip (rhoback.com) + light, column footer (stile.com.pk). */
export function SiteFooter() {
  const { categories } = useLinkableCategories()
  const roots = getRootCategories(categories).slice(0, FOOTER_CATEGORY_LIMIT)
  const knowMore = NAV_LINKS.filter((l) => ["Home", "Videos", "Blog", "Contact"].includes(l.label))
  const browse = NAV_LINKS.filter((l) => ["Products", "New Arrivals", "Best Sellers", "Downloads"].includes(l.label))

  return (
    <footer className="mt-auto">
      <div className="border-y border-border bg-muted">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-4 py-7 sm:px-6 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ Icon, title, body, href, external }) => {
            const content = (
              <>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink/80 text-ink">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-ink uppercase">{title}</span>
                  <span className="text-sm text-muted-foreground">{body}</span>
                </span>
              </>
            )
            const cls = "flex items-center gap-3 px-2 outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
            return external ? (
              <a key={title} href={href} target="_blank" rel="noreferrer" className={cls}>
                {content}
              </a>
            ) : (
              <Link key={title} to={href} className={cls}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="bg-[#F8FAFD]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <BrandLogo />
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Clay Roof Tiles is the online home of our khaprail, clay roof and terracotta tile range — fired in
                Lahore since 1982 and part of the PAKTILES.COM family. Browse the catalog, compare sizes and finishes,
                and request a free sample before you order.
              </p>
              <div className="mt-5 flex items-center gap-2">
                {SOCIAL_LINKS.map(({ label, url, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full text-ink outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold text-primary">Contact Us</p>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {CONTACT_LOCATIONS.map((location) => (
                  <p key={location.label}>
                    <span className="font-medium text-ink">{location.label}:</span> {location.address}
                  </p>
                ))}
                <p>
                  Phone:{" "}
                  {CONTACT_PHONES.map((phone, i) => (
                    <span key={phone.href}>
                      {i > 0 && " · "}
                      <a href={phone.href} className="text-primary hover:underline">
                        {phone.display}
                      </a>
                    </span>
                  ))}
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p>{CONTACT_HOURS.map((row) => `${row.days}: ${row.hours}`).join(" · ")}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <FooterColumn title="Know More">
              <Link to="/about" className="hover:text-primary">About Us</Link>
              {knowMore.map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-primary">{l.label}</Link>
              ))}
            </FooterColumn>
            <FooterColumn title="Categories">
              {roots.map((c) => (
                <Link key={c.id} to={`/categories/${c.slug}`} className="hover:text-primary">{c.name}</Link>
              ))}
              <Link to="/categories" className="hover:text-primary">All Categories</Link>
            </FooterColumn>
            <FooterColumn title="Browse">
              {browse.map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-primary">{l.label}</Link>
              ))}
            </FooterColumn>
            <FooterColumn title="Our Brands">
              {SUB_BRANDS.map((brand) =>
                brand.isCurrent ? (
                  <span key={brand.name} className="font-medium text-ink">{brand.name}</span>
                ) : (
                  <a key={brand.name} href={brand.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {brand.name}
                  </a>
                )
              )}
            </FooterColumn>
          </div>

          <div className="mt-12 border-t border-border pt-6 text-center text-xs tracking-wide text-muted-foreground uppercase">
            {COPYRIGHT}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 font-semibold text-primary">{title}</p>
      <nav className="flex flex-col gap-2.5 text-sm text-ink/80">{children}</nav>
    </div>
  )
}
