/**
 * Snapshot of the palette BEFORE dark mode (colours.ts, constants/ui.ts and the
 * tailwind config as of dev-v1.3.0 @ 8dec401). Independent of tokens.ts so the
 * "light mode is unchanged" test is not circular.
 */
export const legacyLight = {
  background: "#fbf8f7", // colours["bg-light"]
  backgroundSoft: "#FFFCFB", // tailwind bgLight #FFFCFBFB (alpha dropped)
  surface: "#FFFFFF", // tailwind white
  textStrong: "#212121", // colours.black
  textBody: "#616161", // colours.text
  textMuted: "#646577", // COLORS.text.muted
  border: "#4A413F", // colours.border
  borderLight: "#E0E0E0", // tailwind border-light
  borderSoft: "#FAF4F2", // tailwind border-lighter
  borderGray: "#E5E7EB", // COLORS.border.gray
  brand: "#EC4007", // colours.primary
  brandText: "#EC4007",
  link: "#0731EC", // colours.link
  purple: "#866EFF", // tailwind purple
  readerPaper: "#FDF5D3", // StoryContentContainer bg-[#FDF5D3]
  danger: "#DC2626", // MenuItem delete / parental gate error
} as const;
