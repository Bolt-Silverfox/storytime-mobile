import { secureTokenStorage } from "./utils/secureTokenStorage";

// Token refresh lock mechanism to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

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
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const apiFetch = async (url: string, options: FetchOptions = {}) => {
  const token = await secureTokenStorage.getAccessToken();
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };

  let response = await fetch(url, { ...options, headers });

  // Handle non-401 errors with proper validation
  if (response.status !== 401) {
    if (
      !response.ok &&
      !options.passThroughStatuses?.includes(response.status)
    ) {
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status
      );
    }
    return response;
  }

  // Handle 401 with token refresh (using lock to prevent race conditions)
  const refreshed = await refreshTokensWithLock();

  if (!refreshed) {
    triggerLogout();
    throw new ApiError("Session expired", 401);
  }

  const newToken = await secureTokenStorage.getAccessToken();

  const retryHeaders = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${newToken}`,
  };

  const retryResponse = await fetch(url, { ...options, headers: retryHeaders });

  if (
    !retryResponse.ok &&
    !options.passThroughStatuses?.includes(retryResponse.status)
  ) {
    throw new ApiError(
      `Request failed with status ${retryResponse.status}`,
      retryResponse.status
    );
  }

  return retryResponse;
};

// Token refresh with lock mechanism to prevent multiple simultaneous refresh attempts
const refreshTokensWithLock = async (): Promise<boolean> => {
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

const refreshTokens = async (): Promise<boolean> => {
  const token = await secureTokenStorage.getRefreshToken();
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) return false;

    let data;
    try {
      data = await response.json();
    } catch {
      return false;
    }

    if (!data.success) return false;
    await secureTokenStorage.setAccessToken(data.data.jwt);
    return true;
  } catch {
    return false;
  }
};

export { setLogoutCallBack, ApiError };
export default apiFetch;
