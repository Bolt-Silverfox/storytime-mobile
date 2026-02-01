import AsyncStorage from "@react-native-async-storage/async-storage";

let logoutCallback: () => void = () => {};

const setLogoutCallBack = (callback: () => void) => {
  logoutCallback = callback;
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const apiFetch = async (url: string, options: FetchOptions = {}) => {
  const token = await AsyncStorage.getItem("accessToken");
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshTokens();

  if (!refreshed) {
    logoutCallback();
    throw new Error("Session expired");
  }

  const newToken = await AsyncStorage.getItem("accessToken");

  const retryHeaders = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${newToken}`,
  };

  return await fetch(url, { ...options, headers: retryHeaders });
};

const refreshTokens = async () => {
  const token = await AsyncStorage.getItem("refreshToken");
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

    const data = await response.json();
    if (!data.success) return false;
    await AsyncStorage.setItem("accessToken", data.data.jwt);
    return true;
  } catch {
    return false;
  }
};

export { setLogoutCallBack };
export default apiFetch;
