import { secureTokenStorage } from "./utils/secureTokenStorage";

// Token refresh lock mechanism to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<RefreshResult> | null = null;

// Logout callback - stored at module level for API layer access
let logoutCallback: (() => void) | null = null;

const setLogoutCallBack = (callback: () => void) => {
  logoutCallback = callback;
};

const triggerLogout = () => {
  if (logoutCallback) {
    logoutCallback();
  }
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  passThroughStatuses?: number[];
}

class ApiError extends Error {
  status: number;
  transientAuth?: boolean;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const buildHeaders = (
  token: string | null,
  options: FetchOptions
): Record<string, string> => {
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...options.headers,
  };
  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Let FormData set its own Content-Type with the correct boundary
  // Don't overwrite a caller-provided Content-Type
  const hasContentType = options.headers
    ? Object.keys(options.headers).some(
        (k) => k.toLowerCase() === "content-type"
      )
    : false;
  if (!isFormData && !hasContentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const buildErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Bad request. Please check your input and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested information could not be found.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "An unexpected server error occurred. Please try again later.";
    case 502:
    case 503:
    case 504:
      return "The server is temporarily unavailable. Please check your connection and try again.";
    default:
      return "An unexpected network error occurred. Please try again.";
  }
};

export enum RefreshResult {
  Success,
  InvalidToken,
  RetryableError,
}

const apiFetch = async (url: string, options: FetchOptions = {}) => {
  const token = await secureTokenStorage.getAccessToken();
  const headers = buildHeaders(token, options);

  let response = await fetch(url, { ...options, headers });

  // Handle non-401 errors with proper validation
  if (response.status !== 401) {
    if (
      !response.ok &&
      !options.passThroughStatuses?.includes(response.status)
    ) {
      throw new ApiError(buildErrorMessage(response.status), response.status);
    }
    return response;
  }

  // Handle 401 with token refresh (using lock to prevent race conditions)
  const refreshResult = await refreshTokensWithLock();

  if (refreshResult === RefreshResult.InvalidToken) {
    triggerLogout();
    throw new ApiError("Session expired", 401);
  }

  if (refreshResult === RefreshResult.RetryableError) {
    // For retryable errors (network/5xx), we throw without logging out
    const err = new ApiError("Authentication temporary failure, try again", 401);
    err.transientAuth = true;
    throw err;
  }

  const newToken = await secureTokenStorage.getAccessToken();
  const retryHeaders = buildHeaders(newToken, options);

  const retryResponse = await fetch(url, { ...options, headers: retryHeaders });

  if (
    !retryResponse.ok &&
    !options.passThroughStatuses?.includes(retryResponse.status)
  ) {
    if (retryResponse.status === 401) {
      triggerLogout();
    }
    throw new ApiError(
      buildErrorMessage(retryResponse.status),
      retryResponse.status
    );
  }

  return retryResponse;
};

// Token refresh with lock mechanism to prevent multiple simultaneous refresh attempts
export const refreshTokensWithLock = async (): Promise<RefreshResult> => {
  // If already refreshing, wait for the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshTokens().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
};

const refreshTokens = async (): Promise<RefreshResult> => {
  try {
    const token = await secureTokenStorage.getRefreshToken();
    if (!token) return RefreshResult.InvalidToken;
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
        },
        body: JSON.stringify({ token }),
      }
    );

    // If the server explicitly says the token is invalid (400, 401, 403)
    if ([400, 401, 403].includes(response.status)) {
      return RefreshResult.InvalidToken;
    }

    // For other non-ok responses (5xx, etc.), it's a retryable error
    if (!response.ok) return RefreshResult.RetryableError;

    let data;
    try {
      data = await response.json();
    } catch {
      return RefreshResult.RetryableError;
    }

    if (!data.success) return RefreshResult.InvalidToken;
    await secureTokenStorage.setAccessToken(data.data.jwt);
    return RefreshResult.Success;
  } catch {
    // Network errors are retryable
    return RefreshResult.RetryableError;
  }
};

export { setLogoutCallBack, ApiError };
export default apiFetch;
