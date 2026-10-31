/** @jest-environment node */
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { tokensToCssVars } from "./cssVars";
import { lightTokens } from "./tokens";

const config = require("../tailwind.config.js");

const compile = async (classes: string) => {
  const result = await postcss([
    tailwindcss({ ...config, content: [{ raw: classes, extension: "tsx" }] }),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
};

describe("tailwind semantic colours", () => {
  it("every var(--c-*) referenced by the config is defined by tokensToCssVars", () => {
    const defined = Object.keys(tokensToCssVars(lightTokens));
    const referenced = [
      ...JSON.stringify(config.theme.extend.colors).matchAll(/--c-[a-z-]+/g),
    ].map((m) => m[0]);
    expect(referenced.length).toBeGreaterThan(10);
    for (const v of new Set(referenced)) expect(defined).toContain(v);
  });

  it("themed colours use <alpha-value> so opacity modifiers resolve", () => {
    const themed = Object.values(
      config.theme.extend.colors as Record<string, string>
    ).filter((c) => c.includes("--c-"));
    expect(themed.length).toBeGreaterThan(10);
    for (const c of themed) expect(c).toContain("<alpha-value>");
  });

  it("emits CSS for plain and opacity-modified semantic classes", async () => {
    const css = await compile(
      "bg-surface text-fg border-line-soft text-link/40 bg-surface/60 text-brand-text"
    );
    for (const sel of [
      ".bg-surface",
      ".text-fg",
      ".border-line-soft",
      ".text-link\\/40",
      ".bg-surface\\/60",
      ".text-brand-text",
    ]) {
      expect(css).toContain(sel);
    }
    expect(css).toMatch(/--c-link\)\s*\/\s*0\.4/);
  });
});

describe("tokensToCssVars", () => {
  it("emits space-separated rgb channels", () => {
    const vars = tokensToCssVars(lightTokens);
    expect(vars["--c-surface"]).toBe("255 255 255");
    expect(vars["--c-text-strong"]).toBe("33 33 33");
  });
});
