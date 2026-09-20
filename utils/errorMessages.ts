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
];

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

const OFFLINE_PATTERN = /network request failed|network error|timeout|offline/i;

const isOfflineError = (err: unknown): boolean => {
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
    if (
      serverMessage &&
      USER_FACING_PATTERNS.some((p) => p.test(serverMessage))
    ) {
      return serverMessage;
    }
    const match = STATUS_COPY.find((entry) => entry.test(err.status));
    return match ? match.copy : GENERIC;
  }

  // Non-ApiError: a message we produced ourselves is usually already friendly,
  // but we cannot distinguish it from a leaked internal, so allowlist it too.
  const message = err instanceof Error ? err.message?.trim() : "";
  if (message && USER_FACING_PATTERNS.some((p) => p.test(message))) {
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
  message?: string,
  fallback: string = GENERIC
): string => {
  const trimmed = message?.trim();
  if (!trimmed) return fallback;
  if (OFFLINE_PATTERN.test(trimmed)) {
    return OFFLINE;
  }
  if (USER_FACING_PATTERNS.some((p) => p.test(trimmed))) return trimmed;
  return fallback;
};

export default getUserFacingError;
