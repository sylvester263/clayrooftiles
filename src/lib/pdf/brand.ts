// Clay Roof Tiles's blue / slate / gray tokens (src/index.css) — react-pdf
// can't read CSS variables, so the brand hex values are duplicated here.
// Shared by every PDF document (spec sheets, the full catalog) so they read
// as one consistent, branded set rather than drifting independently.
// Keep in sync with :root in src/index.css (see 02-DESIGN-SYSTEM.md).
export const PDF_COLORS = {
  primary: "#0A4595",
  foreground: "#1B2540",
  muted: "#5B6475",
  border: "#E3E7EE",
} as const
