/**
 * Static scanner for colours that are unsafe in dark mode. Used by
 * colourGuard.test.ts. Pure functions so the rules themselves can be tested.
 */

/** `match` is what exemptions key on: the offending fragment, or the line. */
export type Finding = {
  line: number;
  rule: string;
  text: string;
  match: string;
};

/** Hex colours that read fine on both light and dark surfaces (brand/white). */
const SAFE_HEX = new Set(["#ec4007", "#866eff", "#fff", "#ffffff"]);

const HEX = "#[0-9A-Fa-f]{3,8}";
const FIXED_TEXT_COLOURS =
  "black|red|#000|#000000|#212121|#333|#333333|#616161|#666|#666666|#1a1a1a|#1A1A1A";

/** Single-line rules: a fixed colour that does not follow the theme. */
const LINE_RULES: Array<[string, RegExp]> = [
  ["text-hex-class", new RegExp(`(^|[\\s"'\`])text-\\[${HEX}\\]`)],
  [
    "border-hex-class",
    new RegExp(`(^|[\\s"'\`])border(-[tblrxy])?-\\[${HEX}\\]`),
  ],
  [
    "text-palette-class",
    /(^|[\s"'`])text-(gray|slate|zinc|neutral|red|green|amber|yellow|orange|black)(-\d+)?(?![\w-])/,
  ],
  ["bg-white-class", /(^|[\s"'`])bg-white(?![\w-])/],
  ["bg-black-class", /(^|[\s"'`])bg-black(?![\w/-])/],
  ["border-black-class", /(^|[\s"'`])border(-[tblrxy])?-black(?![\w-])/],
  ["bg-white-hex-class", /bg-\[#(f{3}|f{6}|f{8})\]/i],
  [
    "color-style",
    new RegExp(
      `\\b(color|tintColor)\\s*:\\s*["'](${FIXED_TEXT_COLOURS})["']`,
      "i"
    ),
  ],
  [
    "light-background-style",
    /\bbackgroundColor\s*:\s*["'](white|#fff|#ffffff|#fafafa|#f5f5f5|#f3f4f6|#fff9c4|#fff8d7|#f3f0ff)["']/i,
  ],
  ["border-color-style", /\bborderColor\s*:\s*["']#[0-9A-Fa-f]{3,8}["']/],
  ["rgb-literal", /["'`]rgba?\(\s*\d/],
];

/** Theme-token text classes, which turn light in dark mode. */
const TOKEN_TEXT =
  /(^|[\s"'`])text-(fg|body|muted|link|brand-text|purple-text|danger(-strong|-soft)?|success(-strong)?|price|pink|surface|background|reader-highlight-text)(?![\w-])/;
/** Fixed light backgrounds that do not follow the theme. */
const FIXED_LIGHT_BG = new RegExp(
  `bg-(red|green|yellow|amber|orange|rose|lime)-(50|100|200)(?![\\d])|bg-(blue|purple|pink|gray)-\\d+|bg-yellow-300|bg-(primary-light|purple-light|border-light|border-lighter|bgLight)(?![\\w-])|bg-\\[${HEX}\\]|bg-white(?![\\w/-])|bg-yellow(?![\\w-])`
);

const STRING_LITERAL = /"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g;

const COLOR_PROP_START =
  /\b(?:color|tintColor|fill|stroke|focusColor)\s*=\s*/gi;
const FIXED_LITERAL = new RegExp(`["'\`](${HEX}|black|red|blue)["'\`]`, "gi");

/** End index (exclusive) of the JSX attribute value starting at `start`. */
function propValueEnd(src: string, start: number): number {
  const q = src[start];
  if (q === '"' || q === "'") {
    const close = src.indexOf(q, start + 1);
    return close < 0 ? src.length : close + 1;
  }
  if (q !== "{") return start;
  let depth = 0;
  let quote = "";
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") i += 1;
      else if (c === quote) quote = "";
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth += 1;
    else if (c === "}" && --depth === 0) return i + 1;
  }
  return src.length;
}

/**
 * `color`-like props. The whole value is scanned (balanced braces, any number
 * of lines, quote and template literals), so a ternary or multi-line prop
 * cannot hide a fixed colour.
 */
function scanColorProps(src: string): Finding[] {
  const out: Finding[] = [];
  for (const start of src.matchAll(COLOR_PROP_START)) {
    const from = start.index + start[0].length;
    const to = propValueEnd(src, from);
    const value = src.slice(from, to);
    const prop = src.slice(start.index, to).replace(/\s+/g, " ");
    for (const lit of value.matchAll(FIXED_LITERAL)) {
      if (SAFE_HEX.has(lit[1].toLowerCase())) continue;
      const line = src.slice(0, from + (lit.index ?? 0)).split("\n").length;
      out.push({
        line,
        rule: "color-prop",
        text: src.split("\n")[line - 1].trim(),
        match: prop,
      });
    }
  }
  return out;
}

/** The offending fragment: the hit extended over the rest of its token. */
function fragment(text: string, hit: RegExpMatchArray, rule: string): string {
  const lead = hit[0].length - hit[0].replace(/^[\s"'`]+/, "").length;
  const start = (hit.index ?? 0) + lead;
  let end = (hit.index ?? 0) + hit[0].length;
  if (rule === "rgb-literal") {
    const close = text.indexOf(")", end);
    end = close < 0 ? text.length : close + 1;
  } else {
    while (end < text.length && /[\w/%.#[\]-]/.test(text[end])) end += 1;
  }
  return text.slice(start, end);
}

export function scanSource(src: string): Finding[] {
  const out: Finding[] = [];
  const lines = src.split("\n");
  lines.forEach((text, i) => {
    for (const [rule, re] of LINE_RULES) {
      const all = new RegExp(re.source, `${re.flags}g`);
      const hits = [...text.matchAll(all)];
      for (const hit of hits) {
        out.push({
          line: i + 1,
          rule,
          text: text.trim(),
          match: fragment(text, hit, rule),
        });
      }
    }
  });
  for (const m of src.matchAll(STRING_LITERAL)) {
    const lit = m[1] ?? m[2] ?? m[3] ?? "";
    if (TOKEN_TEXT.test(lit) && FIXED_LIGHT_BG.test(lit)) {
      out.push({
        line: src.slice(0, m.index).split("\n").length,
        rule: "token-text-on-fixed-light-bg",
        text: lit.trim(),
        match: lit.trim(),
      });
    }
  }
  out.push(
    ...scanColorProps(src),
    ...scanDescendants(src),
    ...scanInkAssets(src),
    ...scanColourlessTextStyles(src)
  );
  return out;
}

/** PNGs drawn in a fixed dark ink (black / indigo) that vanish on dark surfaces. */
const INK_ASSETS = ["apple-icon", "tick", "middot"];
const INK_REQUIRE = new RegExp(
  `require\\(\\s*["'][^"']*\\/((?:${INK_ASSETS.join("|")})\\.png)["']\\s*\\)`,
  "g"
);

/** An `<Image>` showing a fixed-ink PNG must carry a tintColor (dark variant). */
function scanInkAssets(src: string): Finding[] {
  const out: Finding[] = [];
  for (const m of src.matchAll(INK_REQUIRE)) {
    const idx = m.index ?? 0;
    const open = src.lastIndexOf("<Image", idx);
    const tag = open < 0 ? "" : src.slice(open, openingTagEnd(src, open));
    if (/tintColor/.test(tag)) continue;
    out.push({
      line: src.slice(0, idx).split("\n").length,
      rule: "untinted-ink-asset",
      text: m[0],
      match: m[1],
    });
  }
  return out;
}

/**
 * `<Text style={styles.k}>` where `k` (a StyleSheet entry in the same file) sets
 * no colour, spreads nothing, and the tag's className gives no text colour:
 * the text renders default black, invisible on dark surfaces.
 */
function scanColourlessTextStyles(src: string): Finding[] {
  const out: Finding[] = [];
  for (const m of src.matchAll(
    /<Text\b([^>]*?)\bstyle=\{styles\.(\w+)\}([^>]*)>/g
  )) {
    const tag = m[1] + m[3];
    const cls = [...tag.matchAll(/text-([\w[\]#-]+)/g)].map((x) => x[1]);
    if (cls.some((c) => !SIZE_OR_ALIGN.test(c))) continue;
    const key = m[2];
    const body = styleEntryBody(src, key);
    if (body === null || setsTextColour(body)) continue;
    out.push({
      line: src.slice(0, m.index).split("\n").length,
      rule: "text-style-no-colour",
      text: m[0].replace(/\s+/g, " ").slice(0, 100),
      match: `styles.${key}`,
    });
  }
  return out;
}
/** End (exclusive) of the JSX opening tag starting at `open` (brace/quote aware). */
function openingTagEnd(src: string, open: number): number {
  let depth = 0;
  let quote = "";
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") i += 1;
      else if (c === quote) quote = "";
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth += 1;
    else if (c === "}") depth -= 1;
    else if (c === "=" && src[i + 1] === ">") i += 1;
    else if (c === ">" && depth === 0) return i + 1;
  }
  return src.length;
}

/** Balanced `{ ... }` body of the first `key: {` entry, or null. */
function styleEntryBody(src: string, key: string): string | null {
  const m = new RegExp(`^\\s*${key}\\s*:\\s*\\{`, "m").exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}" && --depth === 0) return src.slice(start, i);
  }
  return src.slice(start);
}

/**
 * True if a style body sets a text colour: a `color:` key (backgroundColor and
 * borderColor do not count), a conditional spread whose object has a `color:`
 * key, or a spread of another style object (`...defaultStyles.heading`), which
 * this file-local scan cannot see into and trusts to be themed.
 */
function setsTextColour(body: string): boolean {
  if (/(^|[\s,{])color\s*:/.test(body)) return true;
  return /\.\.\.\s*[A-Za-z_$][\w$]*(\.[\w$]+)+/.test(body);
}

const SIZE_OR_ALIGN =
  /^(center|left|right|justify|base|xs|sm|lg|\d*xl|\[\d+(px)?\]|wrap|nowrap|ellipsis)$/;

/**
 * Token-coloured text anywhere inside the subtree of an element whose
 * className has a fixed light background (the banner bug: a themed text colour
 * that turns light in dark mode on a bg-red-50 banner). Approximate JSX
 * tag-balancing; good enough for this codebase's formatting.
 */
function scanDescendants(src: string): Finding[] {
  const out: Finding[] = [];
  const flat = src.replace(/=>/g, "=_");
  for (const m of flat.matchAll(STRING_LITERAL)) {
    const lit = m[1] ?? m[2] ?? m[3] ?? "";
    if (!FIXED_LIGHT_BG.test(lit)) continue;
    const before = flat.slice(0, m.index);
    const open = before.lastIndexOf("<");
    const name = /^<([A-Za-z][\w.]*)/.exec(flat.slice(open))?.[1];
    if (!name || open < 0) continue;
    if (!insideOpeningTag(flat.slice(open, m.index))) continue;
    const tagRe = new RegExp(`<(/?)${name}(?![\\w.])[^>]*?(/?)>`, "g");
    tagRe.lastIndex = open;
    let depth = 0;
    let end = flat.length;
    for (let t = tagRe.exec(flat); t; t = tagRe.exec(flat)) {
      if (t[1]) depth -= 1;
      else if (!t[2]) depth += 1;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    const subtree = flat.slice(m.index + m[0].length, end);
    for (const lm of subtree.matchAll(STRING_LITERAL)) {
      const inner = lm[1] ?? lm[2] ?? lm[3] ?? "";
      if (TOKEN_TEXT.test(inner) && !FIXED_LIGHT_BG.test(inner)) {
        const abs = m.index + m[0].length + (lm.index ?? 0);
        out.push({
          line: flat.slice(0, abs).split("\n").length,
          rule: "token-text-inside-fixed-light-bg",
          text: inner.trim(),
          match: inner.trim(),
        });
      }
    }
  }
  return out;
}

/** True if `chunk` (from `<Name` up to a string literal) has no tag-closing `>` at brace depth 0. */
function insideOpeningTag(chunk: string): boolean {
  let depth = 0;
  let quote = "";
  for (const c of chunk) {
    if (quote) {
      if (c === quote) quote = "";
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth += 1;
    else if (c === "}") depth -= 1;
    else if (c === ">" && depth === 0) return false;
  }
  return true;
}

export type Exemption = {
  file: string;
  rule: string;
  includes: string;
  /** Exact number of findings this exemption covers (default 1). */
  count?: number;
  reason: string;
};

type FileFinding = Finding & { file: string };

const covers = (e: Exemption, f: FileFinding) =>
  e.file === f.file && e.rule === f.rule && f.match.includes(e.includes);

/**
 * Findings not covered by any exemption, plus exemptions whose number of
 * covered findings differs from their expected count (more OR fewer).
 */
export function applyExemptions(
  findings: FileFinding[],
  exemptions: Exemption[]
) {
  const unexempt = findings.filter(
    (f) => !exemptions.some((e) => covers(e, f))
  );
  const mismatched = exemptions
    .map((e) => ({ e, actual: findings.filter((f) => covers(e, f)).length }))
    .filter(({ e, actual }) => actual !== (e.count ?? 1))
    .map(
      ({ e, actual }) =>
        `${e.file} [${e.rule}] "${e.includes}": expected ${e.count ?? 1}, found ${actual}`
    );
  return { unexempt, mismatched };
}
