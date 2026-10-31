/** @jest-environment node
 *
 * Guards against hard-coded colours that break in dark mode (rules: colourScan.ts).
 * Fixed colours are only legitimate on fixed-colour surfaces (images, brand
 * fills, fixed pale banners, scrims). Each exemption names one file, one rule, a
 * snippet of the offending line and the EXACT number of lines it covers
 * (`count`, default 1): more or fewer matches fail, so a new violation in an
 * exempted file cannot pass silently. Prefer a theme token instead.
 *
 * Shapes this static scan cannot see (review these by hand):
 *  - text-style-no-colour only sees `style={styles.k}` with a same-file entry; a conditional spread counts as setting a colour
 *  - classes held in a variable or returned by a helper (className={labelClass})
 *  - colour set by a child component or a prop (color={tokens.x}, style={{ color: tokens.x }})
 *  - defaultStyles / StyleSheet text colours, which spread themed styles
 *  - native defaults: ActivityIndicator/RefreshControl/Switch colours, keyboardAppearance, Lottie art
 *  - colour props whose value is built outside the prop (const c = "#000"; color={c})
 *  - hooks/, contexts/ and App.tsx are not scanned
 */

import fs from "fs";
import path from "path";
import { applyExemptions, Exemption, scanSource } from "./colourScan";

const ex = (
  file: string,
  rule: string,
  includes: string,
  reason: string,
  count = 1
): Exemption => ({ file, rule, includes, reason, count });

const EXEMPTIONS: Exemption[] = [
  ex(
    "components/AvailableVoices.tsx",
    "color-prop",
    'color="#212121"',
    "ink on fixed yellow banner",
    3
  ),
  ex(
    "components/AvailableVoices.tsx",
    "color-prop",
    'color="#D97706"',
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    3
  ),
  ex(
    "components/AvailableVoices.tsx",
    "text-palette-class",
    "text-amber-700",
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    1
  ),
  ex(
    "components/AvailableVoices.tsx",
    "text-palette-class",
    "text-amber-600",
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    3
  ),
  ex(
    "components/CustomSplashScreen.tsx",
    "text-hex-class",
    "#F1D7C9",
    "peach text over orange cloud art",
    1
  ),
  ex(
    "components/FavouriteStoryItem.tsx",
    "color-prop",
    'color="red"',
    "pure-red heart accent, graphic 3:1+ on both surfaces",
    1
  ),
  ex(
    "components/StoryDetailsCTA.tsx",
    "color-prop",
    'color="red"',
    "pure-red liked-heart accent, graphic 3:1+ on both surfaces",
    1
  ),
  ex(
    "components/parents/StoryItem.tsx",
    "color-prop",
    'color="red"',
    "red heart over cover image",
    1
  ),
  ex(
    "components/LibraryStoryItem.tsx",
    "color-prop",
    'color="#4807EC"',
    "parents/ProgressBar has a fixed light track",
    1
  ),
  ex(
    "components/NotificationPermissionBanner.tsx",
    "text-palette-class",
    "text-amber-800",
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    1
  ),
  ex(
    "components/NotificationPermissionBanner.tsx",
    "text-palette-class",
    "text-amber-900",
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    1
  ),
  ex(
    "components/NotificationPermissionBanner.tsx",
    "color-prop",
    'color="#d97706"',
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    1
  ),
  ex(
    "components/NotificationPermissionBanner.tsx",
    "color-prop",
    'color="#92400e"',
    "fixed amber banner/pill (stock amber-50) with fixed amber text",
    1
  ),
  ex(
    "components/StoryAudioPlayer.tsx",
    "bg-white-class",
    "bg-white/50",
    "disabled pill over cover image",
    1
  ),
  ex(
    "components/StoryAudioPlayer.tsx",
    "text-palette-class",
    "text-red-600",
    "failed text on the translucent-white disabled pill",
    1
  ),
  ex(
    "components/StoryContentContainer.tsx",
    "text-palette-class",
    "text-red-700",
    "fixed red-50/100 banner with fixed red text",
    2
  ),
  ex(
    "components/StoryContentContainer.tsx",
    "color-prop",
    'color="#dc2626"',
    "fixed red-50/100 banner with fixed red text",
    1
  ),
  ex(
    "components/UI/ProgressBar.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.2)",
    "original light track colour (dark uses a token)",
    1
  ),
  ex(
    "components/UI/Toggle.tsx",
    "light-background-style",
    '"#fff"',
    "toggle knob is white on both themes",
    1
  ),
  ex(
    "components/skeletons/StoryItemSeleton.tsx",
    "color-prop",
    'color="#9CA3AF"',
    "neutral gray spinner readable on both",
    1
  ),
  ex(
    "components/modals/AboutStoryModesModal.tsx",
    "color-prop",
    'color="#212121"',
    "ink on fixed yellow banner",
    1
  ),
  ex(
    "components/modals/AuthPromptModal.tsx",
    "rgb-literal",
    "rgba(33, 33, 33, 0.6)",
    "modal scrim over content, theme independent",
    1
  ),
  ex(
    "components/modals/AuthPromptModal.tsx",
    "light-background-style",
    "#F3F0FF",
    "fixed pale-purple icon circle with purple icon",
    1
  ),
  ex(
    "components/modals/ParentalGateModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.5)",
    "modal scrim over content, theme independent",
    1
  ),
  ex(
    "components/modals/RateUsModal.tsx",
    "rgb-literal",
    "rgba(33, 33, 33, 0.6)",
    "modal scrim over content, theme independent",
    1
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "rgb-literal",
    "rgba(33, 33, 33, 0.6)",
    "modal scrim over content, theme independent",
    1
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "color-style",
    '"#616161"',
    "disclosure text on fixed yellow box",
    1
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "light-background-style",
    "#FFF9C4",
    "fixed yellow disclosure box",
    1
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "border-color-style",
    "#F96B3C",
    "brand-orange selected plan border",
    1
  ),
  ex(
    "components/modals/StoryLimitModal.tsx",
    "color-prop",
    'color="#F4845F"',
    "coral graphic readable on both surfaces",
    1
  ),
  ex(
    "components/modals/ShareStoryModal.tsx",
    "border-color-style",
    "#FDE260",
    "dashed border on fixed yellow url box",
    1
  ),
  ex(
    "components/modals/ShareStoryModal.tsx",
    "light-background-style",
    "#FFF8D7",
    "fixed yellow url box",
    1
  ),
  ex(
    "components/modals/ShareStoryModal.tsx",
    "color-prop",
    'color="#4807EC"',
    "copy icon on fixed yellow url box",
    1
  ),
  ex(
    "components/modals/SubscriptionModal.tsx",
    "border-hex-class",
    "border-[#866EFF]",
    "brand purple ring, 3:1+ on both surfaces",
    1
  ),
  ex(
    "components/modals/SuccessModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.4)",
    "modal scrim over content, theme independent",
    1
  ),
  ex(
    "components/modals/SuccessModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.2)",
    "original light border colour (dark uses a token)",
    1
  ),
  ex(
    "components/modals/TopModal.tsx",
    "rgb-literal",
    "rgba(0,0,0,0.4)",
    "modal scrim over content, theme independent",
    1
  ),
  ex(
    "components/modals/storyModals/EndOfQuizMessage.tsx",
    "text-hex-class",
    "#B89DFD",
    "fixed brand-blue card",
    2
  ),
  ex(
    "components/modals/storyModals/EndOfQuizMessage.tsx",
    "bg-white-class",
    "bg-white",
    "result badge on fixed brand-blue card",
    1
  ),
  ex(
    "components/modals/storyModals/InStoryModeModal.tsx",
    "border-hex-class",
    "#EC400740",
    "text on selected brand-primary fill",
    2
  ),
  ex(
    "components/modals/storyModals/InStoryModeModal.tsx",
    "text-hex-class",
    "#FED0C1",
    "text on selected brand-primary fill",
    2
  ),
  ex(
    "components/modals/storyModals/InStoryOptionsModal.tsx",
    "border-hex-class",
    "#FFC8C8",
    "fixed pale-red exit tile",
    1
  ),
  ex(
    "components/modals/storyModals/InStoryOptionsModal.tsx",
    "color-prop",
    'color="#EC0707"',
    "red icon on fixed pale-red exit tile",
    1
  ),
  ex(
    "components/parents/CreateStoryCard.tsx",
    "bg-white-class",
    "bg-white/20",
    "translucent white on brand card",
    1
  ),
  ex(
    "components/parents/ProgressBar.tsx",
    "color-prop",
    'color = "#000"',
    "fixed light track, black default fill",
    1
  ),
  ex(
    "components/parents/ProgressBar.tsx",
    "border-hex-class",
    "#DAE1F1",
    "fixed light-blue track",
    1
  ),
  ex(
    "components/parents/FreeStoriesBanner.tsx",
    "border-color-style",
    "#804FFB",
    "fixed blue banner",
    1
  ),
  ex(
    "components/parents/FreeStoriesBanner.tsx",
    "color-prop",
    'color="#4807EC"',
    "close icon on fixed pale button in fixed blue banner",
    1
  ),
  ex(
    "components/screens/SubscriptionScreenComponent.tsx",
    "bg-white-class",
    "bg-white/20",
    "translucent white on fixed purple header",
    1
  ),
  ex(
    "components/screens/UnsubscribedUserComponent.tsx",
    "text-palette-class",
    "text-green-700",
    "fixed green-50 banner/circle with fixed green text/icon",
    1
  ),
  ex(
    "screens/auth/ConfirmResetPasswordToken.tsx",
    "border-color-style",
    "#ccc",
    "OTP box hairline, readable on both",
    1
  ),
  ex(
    "screens/auth/VerifyEmailScreen.tsx",
    "border-color-style",
    "#ccc",
    "OTP box hairline, readable on both",
    1
  ),
  ex(
    "screens/auth/OnBoardingScreen.tsx",
    "color-style",
    '"#212121"',
    "dark text on fixed white onboarding button",
    1
  ),
  ex(
    "screens/auth/OnBoardingScreen.tsx",
    "light-background-style",
    '"white"',
    "fixed white onboarding button",
    1
  ),
  ex(
    "screens/auth/UnauthPaywallScreen.tsx",
    "color-prop",
    'color="#16a34a"',
    "green check on fixed green-100 circle",
    1
  ),
  ex(
    "screens/parents/home/ChildStoryDetails.tsx",
    "text-hex-class",
    "#FED0C1",
    "text on selected brand-primary fill",
    2
  ),
  ex(
    "screens/parents/home/CreateStoryScreen.tsx",
    "text-palette-class",
    "text-red-600",
    "fixed red-50/100 banner with fixed red text",
    1
  ),
  ex(
    "screens/parents/home/GenerationProgressScreen.tsx",
    "color-prop",
    'color="#dc2626"',
    "red icon on fixed red-100 circle",
    1
  ),
  ex(
    "screens/parents/profile/ProfileScreen.tsx",
    "text-hex-class",
    "#D3C9FA",
    "fixed brand-blue card",
    1
  ),
  ex(
    "screens/parents/profile/ProfileScreen.tsx",
    "text-hex-class",
    "#212121",
    "ink on fixed yellow rate-us button",
    1
  ),
  ex(
    "screens/parents/profile/RedeemCouponScreen.tsx",
    "text-palette-class",
    "text-green-700",
    "fixed green-50 banner/circle with fixed green text/icon",
    2
  ),
  ex(
    "screens/parents/profile/RedeemCouponScreen.tsx",
    "text-palette-class",
    "text-red-600",
    "fixed red-50/100 banner with fixed red text",
    1
  ),
  ex(
    "screens/parents/profile/RedeemCouponScreen.tsx",
    "color-prop",
    'color="#16a34a"',
    "green icon on fixed green-100 circle",
    1
  ),
  ex(
    "screens/parents/profile/LinkedAccountsScreen.tsx",
    "border-color-style",
    "#EC4007",
    "brand-orange link button border",
    1
  ),
  ex(
    "screens/parents/profile/helpAndSupport/ContactUsScreen.tsx",
    "border-hex-class",
    "#EAE8E8",
    "decorative card hairline",
    1
  ),
  ex(
    "screens/parents/profile/helpAndSupport/ContactUsScreen.tsx",
    "color-prop",
    'color="#4807EC"',
    "mail icon on fixed pale-purple circle",
    1
  ),
  ex(
    "utils/utils.tsx",
    "color-prop",
    'color="#ECC607"',
    "yellow/cyan accent icons, bright enough on both surfaces",
    1
  ),
  ex(
    "utils/utils.tsx",
    "color-prop",
    'color="#07CAEC"',
    "yellow/cyan accent icons, bright enough on both surfaces",
    1
  ),
  ex(
    "components/modals/RateUsModal.tsx",
    "text-style-no-colour",
    "styles.emoji",
    "emoji glyph, colour-independent",
    1
  ),
  ex(
    "components/modals/RateUsModal.tsx",
    "color-prop",
    'color={value <= rating ? "#ECC607" : "#D0D0D0"}',
    "pre-existing star colours, light deliberately unchanged (1.66:1 / 1.54:1 on white); gold and grey are visible on dark",
    2
  ),
  ex(
    "components/modals/storyModals/EndOfQuizMessage.tsx",
    "color-prop",
    'color={result ? "#4807EC" : "white"}',
    "icon on the fixed white / fixed red-600 result badge",
    1
  ),
  ex(
    "screens/auth/ConfirmResetPasswordToken.tsx",
    "color-prop",
    'focusColor={isDark ? tokens.link : "blue"}',
    "dark uses the link token; light keeps the original blue focus ring",
    1
  ),
  ex(
    "screens/auth/VerifyEmailScreen.tsx",
    "color-prop",
    'focusColor={isDark ? tokens.link : "blue"}',
    "dark uses the link token; light keeps the original blue focus ring",
    1
  ),
  ex(
    "screens/parents/profile/DeleteAccount.tsx",
    "color-prop",
    'color={ reason.checked ? isDark ? tokens.blueAccent : "#4630EB" : undefined }',
    "light-only branch (7.28:1 on white); dark uses tokens.blueAccent (6.92:1)",
    1
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

const findings = SCANNED.flatMap((d) =>
  walk(path.join(root, d)).flatMap((f) =>
    scanSource(fs.readFileSync(f, "utf8")).map((x) => ({
      ...x,
      file: path.relative(root, f),
    }))
  )
);

describe("no hard-coded dark-mode-unsafe colours", () => {
  const { unexempt, mismatched } = applyExemptions(findings, EXEMPTIONS);

  it("every finding is covered by a counted, reasoned exemption", () => {
    expect(
      unexempt.map(
        (f) => `${f.file}:${f.line} [${f.rule}] ${f.text.slice(0, 100)}`
      )
    ).toEqual([]);
  });

  it("every exemption matches exactly its expected number of lines", () => {
    expect(mismatched).toEqual([]);
  });
});

describe("applyExemptions", () => {
  const f = (line: number) => ({
    file: "a.tsx",
    rule: "color-prop",
    line,
    text: '<Icon color="#212121" />',
    match: 'color="#212121"',
  });
  const e: Exemption = {
    file: "a.tsx",
    rule: "color-prop",
    includes: 'color="#212121"',
    count: 3,
    reason: "test",
  };

  it("passes when the count matches", () => {
    const r = applyExemptions([f(1), f(2), f(3)], [e]);
    expect(r.unexempt).toEqual([]);
    expect(r.mismatched).toEqual([]);
  });

  it("fails when a 4th matching line is added to an exempted file", () => {
    const r = applyExemptions([f(1), f(2), f(3), f(4)], [e]);
    expect(r.mismatched).toHaveLength(1);
  });

  it("an exemption for one colour does not cover a recoloured icon", () => {
    const recoloured = { ...f(1), match: 'color="#000000"' };
    const r = applyExemptions([f(1), f(2), f(3), recoloured], [e]);
    expect(r.unexempt).toEqual([recoloured]);
    expect(r.mismatched).toEqual([]);
  });

  it("a second violation on an exempted line is a separate finding", () => {
    const second = { ...f(1), match: 'color="#000000"' };
    const r = applyExemptions([f(1), second, f(2), f(3)], [e]);
    expect(r.unexempt).toEqual([second]);
  });

  it("fails when fewer lines match (stale exemption)", () => {
    const r = applyExemptions([f(1), f(2)], [e]);
    expect(r.mismatched).toHaveLength(1);
  });
});
