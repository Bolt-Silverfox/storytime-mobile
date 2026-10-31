/** @jest-environment node */
import fs from "fs";
import path from "path";
import { Finding, scanSource } from "./colourScan";

/**
 * Guards against hard-coded colours that break in dark mode (see colourScan.ts
 * for the rules). Fixed colours are only legitimate on fixed-colour surfaces
 * (images, brand fills, fixed pale banners, scrims). Each exemption is scoped to
 * one rule and one line (matched by a snippet of the trimmed line), so a NEW
 * violation in the same file still fails. Prefer a theme token instead.
 */
type Exemption = {
  file: string;
  rule: string;
  includes: string;
  reason: string;
};

const ex = (
  file: string,
  rule: string,
  includes: string,
  reason: string
): Exemption => ({
  file,
  rule,
  includes,
  reason,
});

const SCRIM = "modal scrim over content, theme independent";
const YELLOW = "ink on fixed yellow banner";
const AMBER = "fixed amber banner/pill (stock amber-50) with fixed amber text";
const RED_BANNER = "fixed red-50/100 banner with fixed red text";
const GREEN_BANNER = "fixed green-50 banner with fixed green text";
const BLUE_CARD = "fixed brand-blue card";
const PRIMARY_FILL = "text on selected brand-primary fill";
const IMAGE = "over a cover image / fixed art";

const EXEMPTIONS: Exemption[] = [
  ex("components/AvailableVoices.tsx", "color-prop", 'color="#212121"', YELLOW),
  ex(
    "components/AvailableVoices.tsx",
    "text-palette-class",
    "text-amber-",
    AMBER
  ),
  ex(
    "components/CustomSplashScreen.tsx",
    "text-hex-class",
    "#F1D7C9",
    "peach text over orange cloud art"
  ),
  ex(
    "components/FavouriteStoryItem.tsx",
    "color-prop",
    'color="red"',
    "pure-red heart accent, graphic 3:1+ on both surfaces"
  ),
  ex(
    "components/StoryDetailsCTA.tsx",
    "color-prop",
    'color="red"',
    "pure-red liked-heart accent, graphic 3:1+ on both surfaces"
  ),
  ex(
    "components/parents/StoryItem.tsx",
    "color-prop",
    'color="red"',
    "red heart over cover image"
  ),
  ex(
    "components/NotificationPermissionBanner.tsx",
    "text-palette-class",
    "text-amber-",
    AMBER
  ),
  ex(
    "components/StoryAudioPlayer.tsx",
    "bg-white-class",
    "bg-white/50",
    "disabled pill over cover image"
  ),
  ex(
    "components/StoryAudioPlayer.tsx",
    "text-palette-class",
    "text-red-600",
    "failed text on the translucent-white disabled pill"
  ),
  ex(
    "components/StoryContentContainer.tsx",
    "text-palette-class",
    "text-red-700",
    RED_BANNER
  ),
  ex(
    "components/UI/ProgressBar.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.2)",
    "original light track colour (dark uses a token)"
  ),
  ex(
    "components/UI/Toggle.tsx",
    "light-background-style",
    '"#fff"',
    "toggle knob is white on both themes"
  ),
  ex(
    "components/modals/AboutStoryModesModal.tsx",
    "color-prop",
    'color="#212121"',
    YELLOW
  ),
  ex(
    "components/modals/AuthPromptModal.tsx",
    "rgb-literal",
    "rgba(33, 33, 33, 0.6)",
    SCRIM
  ),
  ex(
    "components/modals/ParentalGateModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.5)",
    SCRIM
  ),
  ex(
    "components/modals/RateUsModal.tsx",
    "rgb-literal",
    "rgba(33, 33, 33, 0.6)",
    SCRIM
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "rgb-literal",
    "rgba(33, 33, 33, 0.6)",
    SCRIM
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "color-style",
    '"#616161"',
    "disclosure text on fixed yellow box"
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "border-color-style",
    "#F96B3C",
    "brand-orange selected plan border"
  ),
  ex(
    "components/modals/ShareStoryModal.tsx",
    "border-color-style",
    "#FDE260",
    "dashed border on fixed yellow url box"
  ),
  ex(
    "components/modals/SubscriptionModal.tsx",
    "border-hex-class",
    "border-[#866EFF]",
    "brand purple ring, 3:1+ on both surfaces"
  ),
  ex(
    "components/modals/SuccessModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.4)",
    SCRIM
  ),
  ex(
    "components/modals/SuccessModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.2)",
    "original light border colour (dark uses a token)"
  ),
  ex("components/modals/TopModal.tsx", "rgb-literal", "rgba(0,0,0,0.4)", SCRIM),
  ex(
    "components/modals/storyModals/EndOfQuizMessage.tsx",
    "text-hex-class",
    "#B89DFD",
    BLUE_CARD
  ),
  ex(
    "components/modals/storyModals/EndOfQuizMessage.tsx",
    "bg-white-class",
    '"bg-white"',
    "result badge on " + BLUE_CARD
  ),
  ex(
    "components/modals/storyModals/InStoryModeModal.tsx",
    "border-hex-class",
    "#EC400740",
    PRIMARY_FILL
  ),
  ex(
    "components/modals/storyModals/InStoryModeModal.tsx",
    "text-hex-class",
    "#FED0C1",
    PRIMARY_FILL
  ),
  ex(
    "components/modals/storyModals/InStoryOptionsModal.tsx",
    "border-hex-class",
    "#FFC8C8",
    "fixed pale-red exit tile"
  ),
  ex(
    "components/parents/CreateStoryCard.tsx",
    "bg-white-class",
    "bg-white/20",
    "translucent white on brand card"
  ),
  ex(
    "components/parents/ProgressBar.tsx",
    "color-prop",
    'color = "#000"',
    "fixed light track, black default fill"
  ),
  ex(
    "components/parents/ProgressBar.tsx",
    "border-hex-class",
    "#DAE1F1",
    "fixed light-blue track"
  ),
  ex(
    "components/screens/SubscriptionScreenComponent.tsx",
    "bg-white-class",
    "bg-white/20",
    "translucent white on fixed purple header"
  ),
  ex(
    "components/screens/UnsubscribedUserComponent.tsx",
    "text-palette-class",
    "text-green-700",
    GREEN_BANNER
  ),
  ex(
    "screens/auth/ConfirmResetPasswordToken.tsx",
    "border-color-style",
    "#ccc",
    "OTP box hairline, readable on both"
  ),
  ex(
    "screens/auth/VerifyEmailScreen.tsx",
    "border-color-style",
    "#ccc",
    "OTP box hairline, readable on both"
  ),
  ex(
    "screens/auth/OnBoardingScreen.tsx",
    "border-hex-class",
    "#4A413F",
    "fixed white onboarding button"
  ),
  ex(
    "screens/auth/OnBoardingScreen.tsx",
    "color-style",
    '"#212121"',
    "dark text on fixed white onboarding button"
  ),
  ex(
    "screens/auth/OnBoardingScreen.tsx",
    "light-background-style",
    '"white"',
    "fixed white onboarding button"
  ),
  ex(
    "screens/parents/home/ChildStoryDetails.tsx",
    "text-hex-class",
    "#FED0C1",
    PRIMARY_FILL
  ),
  ex(
    "screens/parents/home/CreateStoryScreen.tsx",
    "text-palette-class",
    "text-red-600",
    RED_BANNER
  ),
  ex(
    "screens/parents/profile/ProfileScreen.tsx",
    "text-hex-class",
    "#D3C9FA",
    BLUE_CARD
  ),
  ex(
    "screens/parents/profile/ProfileScreen.tsx",
    "text-hex-class",
    "#212121",
    "ink on fixed yellow rate-us button"
  ),
  ex(
    "screens/parents/profile/RedeemCouponScreen.tsx",
    "text-palette-class",
    "text-green-700",
    GREEN_BANNER
  ),
  ex(
    "screens/parents/profile/RedeemCouponScreen.tsx",
    "text-palette-class",
    "text-red-600",
    RED_BANNER
  ),
  ex(
    "screens/parents/profile/helpAndSupport/ContactUsScreen.tsx",
    "border-hex-class",
    "#EAE8E8",
    "decorative card hairline"
  ),
  ex(
    "components/parents/FreeStoriesBanner.tsx",
    "border-color-style",
    "#804FFB",
    "fixed blue banner"
  ),
  ex(
    "screens/parents/profile/LinkedAccountsScreen.tsx",
    "border-color-style",
    "#EC4007",
    "brand-orange link button border"
  ),
];

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.tsx?$/.test(p) && !/\.test\./.test(p) ? [p] : [];
  });

const root = path.resolve(__dirname, "..");
const SCANNED = ["components", "screens", "Navigation", "utils"];

const findings: Array<Finding & { file: string }> = SCANNED.flatMap((d) =>
  walk(path.join(root, d)).flatMap((f) =>
    scanSource(fs.readFileSync(f, "utf8")).map((x) => ({
      ...x,
      file: path.relative(root, f),
    }))
  )
);

const covers = (e: Exemption, f: Finding & { file: string }) =>
  e.file === f.file && e.rule === f.rule && f.text.includes(e.includes);

describe("no hard-coded dark-mode-unsafe colours", () => {
  it("every finding is covered by a scoped, reasoned exemption", () => {
    const unexempt = findings
      .filter((f) => !EXEMPTIONS.some((e) => covers(e, f)))
      .map((f) => `${f.file}:${f.line} [${f.rule}] ${f.text.slice(0, 100)}`);
    expect(unexempt).toEqual([]);
  });

  it("has no stale exemptions", () => {
    const stale = EXEMPTIONS.filter(
      (e) => !findings.some((f) => covers(e, f))
    ).map((e) => `${e.file} [${e.rule}] ${e.includes}`);
    expect(stale).toEqual([]);
  });
});
