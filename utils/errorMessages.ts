import { ApiError } from "../apiFetch";

/**
 * Server strings that are written for end users and are safe to show verbatim.
 * Anything not matched here is replaced with copy of our own, so a backend
 * message intended for API clients — a missing-header contract error, a
 * provider name, a database constraint — never lands in front of a parent or
 * child.
 *
 * Matching is substring-based and case-insensitive so backend copy can be
 * reworded slightly without silently falling back to generic text.
 */
const USER_FACING_PATTERNS: RegExp[] = [
  // Sign-in / sign-up
  /email not verified/i,
  /email .*already verified/i,
  /invalid (email|password|credentials)/i,
  /incorrect (email|password)/i,
  /email .*already (exists|registered|in use)/i,
  /too many requests/i,

  // Password rules and reset
  /password (must|should|needs to) (be|contain|include|have)/i,
  /password is too (weak|short|long|common)/i,
  /password too (weak|short|long|common)/i,
  /passwords? do(es)? not match/i,

  // Verification codes, OTPs and reset tokens
  /\b(verification|confirmation|reset) (code|token|link)\b/i,
  /\botps?\b/i,
  /\b(code|token|link) (has )?expired\b/i,
  /invalid or expired/i,

  // In-app PIN
  /\b(incorrect|invalid|expired|current|new|old|confirm) pin\b/i,
  /\bpins? (do(es)? not match|is incorrect|is invalid|has expired|must be)\b/i,

  // Entitlements. `subscription` alone is too broad — it also appears in
  // plumbing failures like "Failed to fetch subscription from RevenueCat: 500",
  // which must never reach a parent. Require entitlement wording alongside it.
  /free stor(y|ies)/i,
  /\bsubscription\b[^.]*\b(required|expired|inactive|cancell?ed|renew|not active|no longer active)\b/i,
  /\b(requires?|needs?|need) (an? )?(active )?subscription\b/i,
  /upgrade to premium/i,
  /story (limit|quota)/i,

  // Coupons are an EXACT closed set, not a pattern guess. Two attempts at
  // patterns here leaked ("Coupon has expired for tenant 9, refetching from
  // origin" passed a phrase-anchored version), and tightening them then broke
  // two real messages -- the compound "or has reached its usage limit" and
  // "has no valid free days". The full list of user-facing strings lives in
  // storytime_be/src/coupon/coupon.service.ts and is short and stable, so
  // matching it exactly removes the whole class of problem. Fails closed: if
  // the backend rewords one, the user gets generic copy rather than a leak.
  /^(?:coupon is no longer valid(?: or has reached its usage limit)?|coupon or account no longer available|invalid coupon code|you have already redeemed this coupon|this coupon (?:has expired|has no valid free days|has reached its usage limit|is no longer active|is not yet valid|type cannot be redeemed here))\.?$/i,
];

/**
 * A message may only be shown verbatim if it LOOKS like copy written for a
 * person. `USER_FACING_PATTERNS` matches substrings, which classifies well but
 * does not bound what else the string contains: "Database error: invalid
 * password hash for user 123" matches /invalid (email|password|credentials)/
 * and would otherwise be rendered to a parent in full.
 *
 * Anchoring the patterns instead was considered and rejected — legitimate copy
 * matches mid-string ("You have used all your free stories", "Your
 * subscription has expired"), so anchoring would silently downgrade real
 * messages to generic text, which is the failure this allowlist exists to
 * avoid.
 */
const INTERNAL_MARKERS: RegExp[] = [
  /\n/, // multi-line: a stack trace or a dump, never UI copy
  /\b(database|sql|postgres|prisma|redis|mongo|sequelize)\b/i,
  /\b(exception|stacktrace|stack trace|econnrefused|etimedout|enotfound)\b/i,
  /\bat\s+\w+[.(]/, // "at Object.foo (" — a stack frame
  /\w+error:/i, // "TypeError:", "Database error:", "AxiosError:"
  /\b(null|undefined|NaN)\b/,
  /https?:\/\//i, // internal URLs and provider endpoints
  /[{}[\]]/, // JSON or object fragments
  /\/(usr|home|var|app|src|node_modules)\//, // filesystem paths
];

/** Longest plausible sentence of user-facing copy. Beyond this it is a dump. */
const MAX_USER_FACING_LENGTH = 200;

const looksUserFacing = (message: string): boolean =>
  message.length <= MAX_USER_FACING_LENGTH &&
  !INTERNAL_MARKERS.some((p) => p.test(message));

/**
 * Allowlist AND guard. The pattern says "this is a class of error we show";
 * the guard says "and this particular string is safe to show".
 */
const isSafeToShow = (message: string): boolean =>
  USER_FACING_PATTERNS.some((p) => p.test(message)) && looksUserFacing(message);

/** Copy shown when we will not pass the server's own wording through. */
const STATUS_COPY: { test: (status: number) => boolean; copy: string }[] = [
  {
    test: (s) => s === 401 || s === 403,
    copy: "You don't have access to this. Try signing in again.",
  },
  {
    test: (s) => s === 404,
    copy: "We couldn't find that. It may have been removed.",
  },
  {
    test: (s) => s === 429,
    copy: "Too many requests. Please wait a moment and try again.",
  },
  {
    test: (s) => s >= 500,
    copy: "Something went wrong on our end. Please try again shortly.",
  },
  {
    test: (s) => s >= 400,
    copy: "That didn't work. Please check your details and try again.",
  },
];

const GENERIC = "Something went wrong. Please try again.";
const OFFLINE =
  "You appear to be offline. Check your connection and try again.";

/**
 * Transport failures only — the cases where the request never reached a
 * server, so "check your connection" is actually the right instruction.
 *
 * The strings here are the ones this app can actually produce. The global
 * `fetch` on native is expo/fetch (`expo/src/winter/runtime.native.ts`
 * installs it unless `EXPO_PUBLIC_USE_RN_FETCH` is "1" or "true", which
 * nothing in this repo sets; `utils/utils.tsx` has a separate note about the
 * same substitution), and its `FetchError`
 * prefixes the native description with "fetch failed: "
 * (`expo/src/winter/fetch/FetchErrors.ts`). That prefix is what actually
 * catches a transport failure today; the NSURLError/OkHttp phrasings below are
 * defensive, for native modules that report a description without going
 * through expo/fetch. Only "Network request failed" and "Network request timed
 * out" come from React Native's own fetch polyfill (whatwg-fetch), which is in
 * play if expo/fetch is ever disabled — and note it discards the native
 * description, so those two fixed strings are all it can ever produce.
 *
 * A bare /timeout/ used to be here and was wrong: an HTTP 504 carries the body
 * "Gateway Timeout", and the server timing out upstream is not the user's
 * connection. Telling a parent to check their wifi for our outage sends them
 * off to fix something that is not broken. A bare /timed out/ would be wrong
 * for the same reason ("Coupon lookup timed out after 30s in CouponService" is
 * ours), so only connection-scoped phrasings are matched, plus a message that
 * is nothing but the word "timeout" — a socket timeout, never something a
 * human wrote for a parent.
 *
 * This pattern is checked BEFORE `INTERNAL_MARKERS` and before the allowlist,
 * in both entry points, so whatever it matches is shown to the user as a
 * connection problem with no further filtering. That is why it has to stay
 * narrow and phrase-shaped. Deliberately NOT here:
 * - a bare /network error/ — apiFetch's copy for an unmapped status is
 *   "An unexpected network error occurred", which is ours, standing in for a
 *   server response rather than describing the device;
 * - `ECONNREFUSED`/`ETIMEDOUT`-style errnos and "failed to connect to X" —
 *   those read the same whether it was the phone or the SERVER that could not
 *   reach a host ("Failed to connect to Redis ... ECONNREFUSED"), and raw
 *   backend failure text does reach `sanitizeUserFacingMessage` through a
 *   job's `error` field;
 * - a bare /\boffline\b/ — a sentence can mention offline reading without
 *   being about connectivity.
 *
 * Known imprecisions, accepted. A client-side abort is reported as offline
 * (`AuthContext`'s AbortController timeouts: expo/fetch reports a signal that
 * was already aborted as "fetch failed: The operation was aborted.", and a
 * mid-flight cancellation as the native description, both behind the same
 * prefix). A request we gave up on is close enough to a connection problem
 * from the user's point of view.
 *
 * In the other direction, "fetch failed" is also Node's own transport error
 * text, and the backend forwards a failed job's raw `error`/`failedReason` to
 * the client — so an upstream failure the SERVER hit could be told to a parent
 * as their connection problem. No current route appears to: the Gemini path
 * replaces the string with copy of its own before anything can forward it.
 * That containment is partly incidental, though: the ElevenLabs client can
 * produce the same string and rethrows it raw, held back only by a generic
 * 500. Keeping client detection working is worth the residual risk, but the
 * remedy for a future leak belongs at the source rather than in an
 * ever-narrower pattern here.
 */
const OFFLINE_PATTERN =
  /fetch failed|network request (?:failed|timed out)|connection appears to be offline|network connection was lost|unable to resolve host|no address associated with hostname|specified hostname could not be found|could not connect to the server|the request timed out|(?:connect|read|socket|handshake) timed out|network is unreachable|no internet connection|^timeout$/i;

/**
 * Offline classification is by message, and an `ApiError` is raised only after
 * `apiFetch` has an HTTP response in hand (or, in two cases, as fixed
 * client-side copy: "Session expired" and the `transientAuth`
 * "Authentication temporary failure, try again"). None of those messages is a
 * description of the device's transport, so none should be read as a verdict
 * on the user's connection — which is what `/timeout/` matching a 504's
 * "Gateway Timeout" body amounted to.
 *
 * The cost of the exclusion: losing connectivity during a token refresh yields
 * the `transientAuth` 401 and therefore 401 copy ("Try signing in again")
 * rather than offline copy. That is pre-existing — the fixed message never
 * matched the pattern either — but it is the one case where an `ApiError`
 * really does stand in for a transport failure.
 */
const isOfflineError = (err: unknown): boolean => {
  if (err instanceof ApiError) return false;
  const message = err instanceof Error ? err.message : String(err ?? "");
  return OFFLINE_PATTERN.test(message);
};

/**
 * Converts any thrown value into copy safe to render in the UI.
 *
 * Server messages are only surfaced when they match `USER_FACING_PATTERNS`;
 * everything else becomes status-appropriate copy of our own. The original
 * message is still available on the error for logging and Sentry — this only
 * governs what a user reads.
 */
export const getUserFacingError = (err: unknown): string => {
  if (isOfflineError(err)) return OFFLINE;

  if (err instanceof ApiError) {
    const serverMessage = err.message?.trim();
    if (serverMessage && isSafeToShow(serverMessage)) {
      return serverMessage;
    }
    const match = STATUS_COPY.find((entry) => entry.test(err.status));
    return match ? match.copy : GENERIC;
  }

  // Non-ApiError: a message we produced ourselves is usually already friendly,
  // but we cannot distinguish it from a leaked internal, so allowlist it too.
  const message = err instanceof Error ? err.message?.trim() : "";
  if (message && isSafeToShow(message)) {
    return message;
  }
  return GENERIC;
};

/**
 * Sanitises an already-stringified error for display.
 *
 * Several hooks collapse errors to `new Error(getErrorMessage(err))` before
 * they reach the UI, so the status and error class are gone by render time.
 * This applies the same allowlist to the bare string: recognised user-facing
 * copy passes through, anything else becomes generic text rather than showing
 * a raw backend message.
 */
export const sanitizeUserFacingMessage = (
  // `unknown` rather than `string`: several callers pass a field taken
  // straight off a JSON body (GenerationProgressScreen sanitises the polled
  // job's `error`, useBatchStoryAudio the batch poll's, AuthContext the
  // auth responses' `message`), so the static type is a promise the backend
  // makes, not one it keeps. An
  // object-valued `error` used to reach `.trim()` and throw mid-render, taking
  // the screen down in the one situation — a failed job — where the user most
  // needs to be told something.
  message?: unknown,
  fallback: string = GENERIC
): string => {
  const trimmed = typeof message === "string" ? message.trim() : undefined;
  if (!trimmed) return fallback;
  if (OFFLINE_PATTERN.test(trimmed)) {
    return OFFLINE;
  }
  if (isSafeToShow(trimmed)) return trimmed;
  return fallback;
};

export default getUserFacingError;
