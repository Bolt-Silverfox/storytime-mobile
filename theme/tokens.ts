/**
 * Semantic colour tokens shared (by name) with the web app.
 * Light values are exactly the pre-dark-mode palette; dark values follow the
 * shared dark-token spec, adjusted where WCAG AA failed (see tokens.test.ts).
 */
export const lightTokens = {
  background: "#fbf8f7",
  // Legacy tailwind "bgLight" (#FFFCFBFB) drifted from `background`; kept distinct in light to avoid a visual change.
  backgroundSoft: "#FFFCFB",
  surface: "#FFFFFF",
  surfaceCream: "#FFF8ED",
  tint: "#FEEAE6",
  textStrong: "#212121",
  textBody: "#616161",
  textMuted: "#646577",
  textSubtle: "#6B7280",
  textFaint: "#9CA3AF",
  border: "#4A413F",
  borderLight: "#E0E0E0",
  borderSoft: "#FAF4F2",
  borderGray: "#E5E7EB",
  fillMuted: "#F3F4F6",
  skeleton: "#D1D5DB",
  brand: "#EC4007",
  brandText: "#EC4007",
  danger: "#DC2626",
  dangerStrong: "#B91C1C",
  dangerSoft: "#EF4444",
  success: "#16A34A",
  successStrong: "#15803D",
  pink: "#EC0794",
  unreadRow: "#F1EEFF",
  priceText: "#333333",
  errorText: "#B71C1C",
  borderInput: "#E0E0E0",
  link: "#0731EC",
  blueAccent: "#4807EC",
  purple: "#866EFF",
  readerHighlight: "#FFEFB8",
  readerHighlightText: "#221D1D",
  readerPanel: "#E6FBFE",
  readerPanelBorder: "#83E9FB",
  // Story reader keeps its cream "paper" in both modes for v1.
  readerPaper: "#FDF5D3",
  readerPaperText: "#212121",
  overlay: "rgba(0,0,0,0.5)",
} as const;

/** Pure black: the ink of fixed-colour PNG icons (e.g. the Apple logo) in light mode. */
export const FIXED_INK_BLACK = "#000000";

export type TokenName = keyof typeof lightTokens;
export type Tokens = Record<TokenName, string>;

export const darkTokens: Tokens = {
  background: "#1A1514",
  backgroundSoft: "#1A1514",
  surface: "#241D1B",
  surfaceCream: "#2E2522",
  tint: "#3A2420",
  textStrong: "#F5ECE9",
  textBody: "#CDBFBA",
  textMuted: "#9C8E89",
  textSubtle: "#9C8E89",
  textFaint: "#9C8E89",
  // spec #4A3F3B gave 1.6:1 vs surface (<3:1 UI rule); raised.
  border: "#7D706B",
  borderLight: "#3A302D",
  borderSoft: "#2A2220",
  borderGray: "#3A302D",
  fillMuted: "#2E2623",
  skeleton: "#3A302D",
  brand: "#EC4007",
  brandText: "#FF6B3D",
  danger: "#F87171",
  dangerStrong: "#F87171",
  dangerSoft: "#F87171",
  success: "#4ADE80",
  successStrong: "#4ADE80",
  pink: "#FF6BC1",
  unreadRow: "#2B2540",
  priceText: "#F5ECE9",
  errorText: "#F87171",
  borderInput: "#7D706B",
  link: "#8EA2FF",
  blueAccent: "#8EA2FF",
  purple: "#A794FF",
  readerHighlight: "#4A3B12",
  readerHighlightText: "#F5ECE9",
  readerPanel: "#12333A",
  readerPanelBorder: "#2A7A8A",
  readerPaper: "#FDF5D3",
  readerPaperText: "#212121",
  overlay: "rgba(0,0,0,0.65)",
};

export const lightTheme: Tokens = lightTokens;
