/** @jest-environment node */
import fs from "fs";
import path from "path";

/**
 * Guards against new hard-coded colours that break in dark mode. Fixed colours
 * are only legitimate on fixed-colour surfaces (images, brand fills, banners);
 * add the file here (with a reason) when that is the case, otherwise use a
 * theme token (text-fg, bg-surface, tokens.textStrong, ...).
 */
const ALLOWED: Record<string, string> = {
  "components/AvailableVoices.tsx": "ink text/icons on fixed yellow banners",
  "components/modals/AboutStoryModesModal.tsx":
    "ink icon on fixed yellow circle",
  "components/modals/StoryLimitModal.tsx":
    "disclosure text on fixed yellow box",
  "screens/auth/OnBoardingScreen.tsx":
    "fixed onboarding artwork and white button",
  "components/StoryDetailsCTA.tsx": "red heart on image overlay",
  "components/FavouriteStoryItem.tsx": "red heart on image overlay",
  "components/parents/StoryItem.tsx": "red heart on image overlay",
  "components/CustomSplashScreen.tsx": "peach text on orange clouds art",
  "components/modals/storyModals/EndOfQuizMessage.tsx":
    "fixed blue result card",
  "components/modals/storyModals/InStoryModeModal.tsx":
    "text on selected brand fill",
  "screens/parents/home/ChildStoryDetails.tsx": "text on selected brand fill",
  "screens/parents/profile/ProfileScreen.tsx":
    "fixed blue rate-us card + yellow button",
};

const PATTERNS = [
  /text-\[#[0-9A-Fa-f]{3,8}\]/,
  /color="(black|red|#000|#212121|#333|#616161|#1a1a1a)"/,
  /color: "(black|#000|#212121|#333|#616161)"/,
  /(^|[^\w-])text-black(?![\w-])/,
  /(^|[^\w-])bg-white(?![\w/-])/,
];

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return p.endsWith(".tsx") ? [p] : [];
  });

describe("no hard-coded dark-mode-unsafe colours", () => {
  const root = path.resolve(__dirname, "..");
  const files = ["components", "screens"].flatMap((d) =>
    walk(path.join(root, d))
  );

  it("only allow-listed files contain fixed text/icon colours", () => {
    const offenders = files
      .map((f) => path.relative(root, f))
      .filter((rel) => !(rel in ALLOWED))
      .filter((rel) => {
        const src = fs.readFileSync(path.join(root, rel), "utf8");
        return PATTERNS.some((p) => p.test(src));
      });
    expect(offenders).toEqual([]);
  });

  it("allow-list has no stale entries", () => {
    const stale = Object.keys(ALLOWED).filter((rel) => {
      const src = fs.readFileSync(path.join(root, rel), "utf8");
      return !PATTERNS.some((p) => p.test(src));
    });
    expect(stale).toEqual([]);
  });
});
