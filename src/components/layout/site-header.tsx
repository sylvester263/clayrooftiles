import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { SearchIcon, SparklesIcon, XIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand/brand-logo"
import { CategoriesMegaMenu } from "@/components/nav/categories-mega-menu"
import { MobileNav } from "@/components/nav/mobile-nav"
import { SiteSearch } from "@/components/nav/site-search"
import { NAV_LINKS } from "@/lib/nav-links"
import { useCategories } from "@/hooks/use-categories"
import { useChatPanel } from "@/lib/chat-panel-context"
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

// Desktop nav items shown in the main bar (the rest live in the footer and
// mobile menu, keeping the bar calm like rhoback.com).
const MAIN_NAV = NAV_LINKS.filter((link) => ["Products", "New Arrivals", "Best Sellers", "Videos", "Blog", "Contact"].includes(link.label))

/**
 * Two personalities, one component:
 *  - Home page, top of page: transparent and white, laid over the full-screen
 *    hero (stile.com.pk).
 *  - Everywhere else, or once the visitor scrolls: solid white, navy text,
 *    sticky, thin bottom border (rhoback.com).
 * The home hero pulls itself up underneath with a matching negative margin.
 */
export function SiteHeader() {
  const { categories, isLoading, error } = useCategories()
  const { open: openChatPanel } = useChatPanel()
  const { pathname } = useLocation()
  const isHome = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setSearchOpen(false)
  }, [pathname])

  const overlay = isHome && !isScrolled && !searchOpen

  const navItemClass = cn(
    "relative h-20 rounded-none bg-transparent px-3 text-[0.95rem] font-medium tracking-wide transition-colors lg:h-24",
    "after:absolute after:inset-x-3 after:bottom-6 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform lg:after:bottom-7",
    "hover:bg-transparent hover:after:scale-x-100 focus:bg-transparent data-popup-open:bg-transparent data-open:bg-transparent",
    "data-popup-open:hover:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:after:scale-x-100",
    "aria-[current=page]:after:scale-x-100",
    overlay
      ? "text-white after:bg-white hover:text-white focus:text-white data-popup-open:text-white"
      : "text-ink after:bg-primary hover:text-primary focus:text-primary data-popup-open:text-primary aria-[current=page]:text-primary"
  )

  const iconButtonClass = cn(
    "flex size-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
    overlay ? "text-white hover:bg-white/15" : "text-ink hover:bg-muted"
  )

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        overlay ? "border-b border-white/15 bg-transparent" : "border-b border-border bg-white",
        !overlay && isScrolled && "shadow-[0_4px_20px_rgb(0_0_0/0.06)]"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-24">
        <Link to="/" className="shrink-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Clay Roof Tiles home">
          <BrandLogo variant={overlay ? "light" : "dark"} />
        </Link>

        <NavigationMenu className="mx-auto hidden max-w-none flex-none lg:flex">
          <NavigationMenuList className="gap-0">
            <CategoriesMegaMenu categories={categories} isLoading={isLoading} error={error} triggerClassName={navItemClass} />
            {MAIN_NAV.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink render={<NavLink to={link.to} />} className={navItemClass}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={searchOpen ? "Close search" : "Search products"}
            aria-expanded={searchOpen}
            className={cn(iconButtonClass, "hidden lg:flex")}
          >
            {searchOpen ? <XIcon className="size-5" /> : <SearchIcon className="size-5" />}
          </button>
          <button type="button" onClick={openChatPanel} aria-label="Ask the AI assistant" className={cn(iconButtonClass, "hidden lg:flex")}>
            <SparklesIcon className="size-5" />
          </button>
          <Button
            className={cn(
              "ml-2 hidden h-11 px-5 text-sm font-semibold xl:inline-flex",
              overlay && "bg-white text-primary hover:bg-white/90"
            )}
            nativeButton={false}
            render={<a href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noreferrer" />}
          >
            Get a Sample
          </Button>
          <MobileNav
            categories={categories}
            isLoading={isLoading}
            error={error}
            triggerClassName={overlay ? "text-white hover:bg-white/15 hover:text-white" : undefined}
          />
        </div>
      </div>

      {searchOpen && (
        <div className="hidden border-t border-border bg-white lg:block">
          <div className="mx-auto flex max-w-7xl justify-center px-6 py-5">
            <SiteSearch className="max-w-2xl" autoFocus />
          </div>
        </div>
      )}
    </header>
  )
}
