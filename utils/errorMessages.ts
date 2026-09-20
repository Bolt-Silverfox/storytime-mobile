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
  /email not verified/i,
  /invalid (email|password|credentials)/i,
  /incorrect (email|password)/i,
  /email .*already (exists|registered|in use)/i,
  /password must be/i,
  /too many requests/i,
  /free stor(y|ies)/i,
  /subscription/i,
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

const isOfflineError = (err: unknown): boolean => {
  const message = err instanceof Error ? err.message : String(err ?? "");
  return /network request failed|network error|timeout|offline/i.test(message);
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
  if (/network request failed|network error|timeout|offline/i.test(trimmed)) {
    return OFFLINE;
  }
  if (USER_FACING_PATTERNS.some((p) => p.test(trimmed))) return trimmed;
  return fallback;
};

export default getUserFacingError;
