import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { filterTypeLabel, orderFilterTypes, type ActiveFilters } from "@/lib/product-filters"
import type { FilterType } from "@/types/product"

interface FilterSidebarProps {
  filterGroups: Record<string, FilterType[]>
  facetCounts: Record<string, Record<string, number>>
  activeFilters: ActiveFilters
  isLoading: boolean
  onToggle: (filterType: string, value: string) => void
  onClearAll: () => void
}

/**
 * rhoback.com collection sidebar: one collapsible row per facet (Colour,
 * Material, Size, Shape…) with checkbox values and live counts. Same data
 * and callbacks as the old horizontal FilterBar.
 */
export function FilterSidebar({ filterGroups, facetCounts, activeFilters, isLoading, onToggle, onClearAll }: FilterSidebarProps) {
  const orderedTypes = orderFilterTypes(Object.keys(filterGroups))
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.entries(activeFilters).map(([k, v]) => [k, v.length > 0]))
  )
  const hasActive = Object.values(activeFilters).some((v) => v.length > 0)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }
  if (orderedTypes.length === 0) {
    return <p className="text-sm text-muted-foreground">No filters for this range yet.</p>
  }

  return (
    <div className="flex flex-col">
      {hasActive && (
        <button
          type="button"
          onClick={onClearAll}
          className="mb-3 w-fit text-xs font-semibold tracking-[0.12em] text-primary uppercase underline-offset-4 hover:underline"
        >
          Clear all filters
        </button>
      )}
      {orderedTypes.map((filterType) => {
        const isOpen = open[filterType] ?? false
        const counts = facetCounts[filterType] ?? {}
        const active = activeFilters[filterType] ?? []
        const values = [...filterGroups[filterType]].sort((a, b) => a.value.localeCompare(b.value))
        const panelId = `facet-${filterType}`
        return (
          <div key={filterType} className="border border-b-0 border-border bg-white last:border-b">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen((o) => ({ ...o, [filterType]: !isOpen }))}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-ink outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <span>
                {filterTypeLabel(filterType)}
                {active.length > 0 && <span className="ml-1.5 text-primary">({active.length})</span>}
              </span>
              <ChevronDownIcon className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <ul id={panelId} className="flex max-h-72 flex-col gap-0.5 overflow-y-auto px-4 pb-4">
                {values.map((option) => {
                  const checked = active.includes(option.value)
                  const count = counts[option.value] ?? 0
                  return (
                    <li key={option.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 py-1.5 text-sm",
                          count === 0 && !checked ? "text-muted-foreground/60" : "text-ink/85"
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => onToggle(filterType, option.value)}
                          className="size-4 rounded-[2px]"
                        />
                        <span className="flex-1">{option.value}</span>
                        <span className="text-xs text-muted-foreground">{count}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
