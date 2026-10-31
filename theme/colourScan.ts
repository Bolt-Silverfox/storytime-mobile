/**
 * Static scanner for colours that are unsafe in dark mode. Used by
 * colourGuard.test.ts. Pure functions so the rules themselves can be tested.
 */

export type Finding = { line: number; rule: string; text: string };

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
    "color-prop",
    new RegExp(
      `\\b(color|tintColor|fill|stroke|focusColor)\\s*=\\s*(\\{\\s*)?["'](${HEX}|black|red|blue)["']`,
      "i"
    ),
  ],
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

export function scanSource(src: string): Finding[] {
  const out: Finding[] = [];
  const lines = src.split("\n");
  lines.forEach((text, i) => {
    for (const [rule, re] of LINE_RULES) {
      const m = re.exec(text);
      if (!m) continue;
      if (rule === "color-prop" && SAFE_HEX.has(m[3].toLowerCase())) continue;
      out.push({ line: i + 1, rule, text: text.trim() });
    }
  });
  for (const m of src.matchAll(STRING_LITERAL)) {
    const lit = m[1] ?? m[2] ?? m[3] ?? "";
    if (TOKEN_TEXT.test(lit) && FIXED_LIGHT_BG.test(lit)) {
      out.push({
        line: src.slice(0, m.index).split("\n").length,
        rule: "token-text-on-fixed-light-bg",
        text: lit.trim(),
      });
    }
  }
  out.push(...scanDescendants(src));
  return out;
}

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
        });
      }
    }
  }
  return out;
}

/** True if `chunk` (from `<Name` up to a string literal) has no tag-closing `>` at brace depth 0. */
function insideOpeningTag(chunk: string): boolean {
  let depth = 0;
  for (const c of chunk) {
    if (c === "{") depth += 1;
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
  e.file === f.file && e.rule === f.rule && f.text.includes(e.includes);

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
