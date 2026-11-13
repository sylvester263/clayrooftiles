import { useCallback, useEffect, useRef, useState } from "react"

/** Scroll-snap carousel helper: arrow handlers + whether each end is reachable. */
export function useSnapCarousel<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [update])

  const scroll = useCallback((dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }, [])

  return { ref, canPrev, canNext, prev: () => scroll(-1), next: () => scroll(1), update }
}
