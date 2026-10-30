import { Tokens } from "./tokens";

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const hexToChannels = (hex: string): string | null => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/**
 * CSS variables (space-separated rgb channels) consumed by the semantic tailwind
 * colours, so opacity modifiers like `text-link/40` work. See tailwind.config.js.
 */
export const tokensToCssVars = (tokens: Tokens): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens)) {
    const channels = hexToChannels(v);
    if (channels) out[`--c-${kebab(k)}`] = channels;
  }
  return out;
};
