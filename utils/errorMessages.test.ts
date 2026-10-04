// errorMessages imports ApiError from apiFetch, which reaches native storage
// modules that do not exist under jest-expo. Stub them; none are exercised here.
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import { ApiError } from "../apiFetch";
import { getUserFacingError, sanitizeUserFacingMessage } from "./errorMessages";

const GENERIC = "Something went wrong. Please try again.";
const OFFLINE =
  "You appear to be offline. Check your connection and try again.";

describe("sanitizeUserFacingMessage", () => {
  it("passes through copy that matches the allowlist", () => {
    for (const message of [
      "Email not verified",
      "Invalid email or password",
      "Invalid password reset link",
      "Your subscription has expired",
      "You have used all your free stories",
      "Upgrade to premium to switch voices",
      "Incorrect PIN",
      "The verification code has expired",
      // Verbatim from storytime_be/src/coupon/. If the backend rewords one of
      // these, this test is what tells us the allowlist needs updating.
      "Invalid coupon code",
      "Coupon is no longer valid",
      "Coupon is no longer valid or has reached its usage limit",
      "Coupon or account no longer available",
      "This coupon has expired",
      "This coupon has no valid free days",
      "This coupon has reached its usage limit",
      "This coupon is no longer active",
      "This coupon is not yet valid",
      "This coupon type cannot be redeemed here",
      "You have already redeemed this coupon",
    ]) {
      expect(sanitizeUserFacingMessage(message)).toBe(message);
    }
  });

  it("replaces messages that match nothing in the allowlist", () => {
    expect(sanitizeUserFacingMessage("Missing x-api-key header")).toBe(GENERIC);
  });

  // Regression guards. Earlier drafts of the coupon patterns required only a
  // generic failure word near the noun, or allowed an arbitrary character gap
  // between them. Both let internal text through verbatim; these are the
  // strings that slipped past one draft or another.
  it("does not let coupon plumbing failures through", () => {
    for (const plumbing of [
      "Failed to fetch coupon from Stripe: 500",
      "coupon service unavailable",
      "Coupon lookup timed out after 30s in CouponService",
      "Coupon lookup failed: invalid response from Stripe",
      "Failed to apply coupon, invalid gateway response from provider acct_1H2x",
      "Stripe coupon webhook signature invalid for merchant acct_1234",
      "Coupon not found for id cpn_9f3a in tenant 42",
      "promo code cache expired, falling back to origin",
      "Coupon table row not found in shard 3 after retry, invalid state",
      "Failed to apply coupon: upstream billing service is no longer available",
      "Coupon sync failed: Stripe entitlement row is invalid",
      "Invalid coupon code mapping in internal ledger shard 7 for user 9f2a",
      "Invalid coupon code for shard 7 in ledger",
      "Coupon entitlement replica is no longer available in region eu-west-1",
      // The connector-set gap is what separates these from the real messages.
      "coupon cache has expired for tenant 9, refetching from origin",
      "Coupon shard has expired connection to replica 4",
      "Coupon row is invalid",
      // An unused coupon is a success state, not a rejection.
      "unused coupon",
    ]) {
      expect(sanitizeUserFacingMessage(plumbing)).toBe(GENERIC);
    }
  });

  it("replaces allowlisted copy that still looks internal", () => {
    // Matches /invalid (email|password|credentials)/ but is plainly a dump.
    for (const leak of [
      "Database error: invalid password hash for user 123",
      "Invalid credentials\n    at AuthService.login (/app/src/auth.ts:12)",
      'Invalid email {"statusCode":400,"path":"/auth/login"}',
      "Invalid password — see https://internal.example.com/runbook",
      "PrismaClientKnownRequestError: invalid email",
      "Invalid credentials: user is undefined",
      `Invalid password ${"x".repeat(220)}`,
    ]) {
      expect(sanitizeUserFacingMessage(leak)).toBe(GENERIC);
    }
  });

  it("uses the caller's fallback rather than generic copy", () => {
    // Matches /invalid (email|password|credentials)/, so it reaches the
    // internal-marker guard rather than failing the allowlist first.
    expect(
      sanitizeUserFacingMessage(
        "Invalid credentials ECONNREFUSED 10.0.0.4:5432",
        "Upload failed"
      )
    ).toBe("Upload failed");
    expect(sanitizeUserFacingMessage(undefined, "Upload failed")).toBe(
      "Upload failed"
    );
    expect(sanitizeUserFacingMessage("   ", "Upload failed")).toBe(
      "Upload failed"
    );
  });

  it("reports offline errors as offline, ahead of any fallback", () => {
    // expo/fetch (the global fetch since SDK 56) prefixes the native
    // description with "fetch failed: ", so that is the shape this app sees
    // today. The bare forms below are the same NSURLError/OkHttp descriptions
    // unprefixed — a native module reporting one directly, rather than
    // anything React Native's own fetch polyfill produces (it discards the
    // description and rejects with one of its two fixed messages).
    for (const transport of [
      "Network request failed",
      "Network request timed out",
      "fetch failed: The Internet connection appears to be offline.",
      'fetch failed: Unable to resolve host "api.storytimeapp.me"',
      "The request timed out.",
      "connect timed out",
      "Read timed out",
      "The network connection was lost.",
      "timeout",
    ]) {
      expect(sanitizeUserFacingMessage(transport, "nope")).toBe(OFFLINE);
    }
  });

  it("does not treat a server timeout string as an offline device", () => {
    // Status is gone by the time a message reaches here, so the wording has to
    // carry it: a gateway/upstream timeout is ours, not the user's connection,
    // and neither is a backend operation that timed out internally. The two
    // "Timeout" strings matched the earlier bare /timeout/, "network error
    // occurred" the earlier bare /network error/, and the moderation line the
    // earlier bare /offline/. The other two are guards against fixing this by
    // matching /timed out/ or "failed to connect to" instead — neither matched
    // before either.
    for (const serverSide of [
      "Gateway Timeout",
      "Upstream request timeout",
      "Coupon lookup timed out after 30s",
      "An unexpected network error occurred. Please try again.",
      // A host the SERVER could not reach, and a sentence that merely says the
      // word. Neither is the parent's connection.
      "Failed to connect to Redis at redis://10.0.0.1:6379 (ECONNREFUSED)",
      "Story is offline for moderation",
    ]) {
      expect(sanitizeUserFacingMessage(serverSide, "Try again")).toBe(
        "Try again"
      );
    }
  });

  it("falls back instead of throwing when the value is not a string", () => {
    // Polled job bodies reach this function straight from response.json(), so
    // the `string` type is the backend's promise, not a guarantee. An object
    // here used to throw inside .trim() during render.
    // `null` and `undefined` already returned the fallback via `?.trim()`;
    // the object, array, number and boolean cases are the ones that threw.
    for (const notAString of [
      { code: 500, detail: "boom" },
      ["boom"],
      42,
      true,
      null,
    ]) {
      expect(sanitizeUserFacingMessage(notAString, "Try again")).toBe(
        "Try again"
      );
    }
  });
});

describe("getUserFacingError", () => {
  it("maps ApiError status codes to our own copy when the body is not showable", () => {
    const cases: [number, string][] = [
      [401, "You don't have access to this. Try signing in again."],
      [403, "You don't have access to this. Try signing in again."],
      [404, "We couldn't find that. It may have been removed."],
      [429, "Too many requests. Please wait a moment and try again."],
      [500, "Something went wrong on our end. Please try again shortly."],
      [422, "That didn't work. Please check your details and try again."],
    ];
    for (const [status, copy] of cases) {
      expect(
        getUserFacingError(new ApiError("relation does not exist", status))
      ).toBe(copy);
    }
  });

  it("keeps a showable ApiError body over the status copy", () => {
    expect(getUserFacingError(new ApiError("Email not verified", 403))).toBe(
      "Email not verified"
    );
  });

  it("does not leak an internal-looking body even on a known status", () => {
    expect(
      getUserFacingError(
        new ApiError(
          "Invalid credentials at Object.verify (/app/src/a.ts:1)",
          401
        )
      )
    ).toBe("You don't have access to this. Try signing in again.");
  });

  it("handles plain Errors and non-Error throws", () => {
    expect(getUserFacingError(new Error("Too many requests"))).toBe(
      "Too many requests"
    );
    expect(
      getUserFacingError(new Error("Cannot read property 'id' of null"))
    ).toBe(GENERIC);
    expect(getUserFacingError("just a string")).toBe(GENERIC);
    expect(getUserFacingError(undefined)).toBe(GENERIC);
    expect(getUserFacingError(null)).toBe(GENERIC);
    expect(getUserFacingError({ message: "Email not verified" })).toBe(GENERIC);
  });

  it("falls back to generic copy for a status no rule covers", () => {
    expect(getUserFacingError(new ApiError("weird", 0))).toBe(GENERIC);
  });

  it("detects offline for transport failures", () => {
    // A transport failure never carries a status: expo/fetch rejects with a
    // FetchError ("fetch failed: ..."), XHR paths with RN's own TypeError.
    expect(
      getUserFacingError(
        new Error(
          "fetch failed: The Internet connection appears to be offline."
        )
      )
    ).toBe(OFFLINE);
    expect(getUserFacingError(new TypeError("Network request failed"))).toBe(
      OFFLINE
    );
  });

  it("does not blame the device for a server-side timeout", () => {
    // An ApiError always came from an HTTP response, so it is a server fault
    // however its body is worded. Telling the parent to check their connection
    // would send them to fix something that is not broken.
    expect(getUserFacingError(new ApiError("Gateway Timeout", 504))).toBe(
      "Something went wrong on our end. Please try again shortly."
    );
    expect(getUserFacingError(new ApiError("Request timeout", 408))).toBe(
      "That didn't work. Please check your details and try again."
    );
    expect(
      getUserFacingError(new ApiError("Network request failed", 500))
    ).toBe("Something went wrong on our end. Please try again shortly.");
  });
});
