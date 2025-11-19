import AsyncStorage from "@react-native-async-storage/async-storage";

let logoutCallback: () => void = () => {};

const setLogoutCallBack = (callback: () => void) => {
  logoutCallback = callback;
};

const apiFetch = async (url: string, options: any = {}) => {
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
  console.log("reresh token", token);
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) return false;

    const data = await response.json();
    console.log("refresh new token data", data);
    if (!data.success) return false;
    console.log("refresh toen data", data);
    await AsyncStorage.setItem("accessToken", data.data.jwt);
    return true;
  } catch (err) {
    return false;
  }
};

export { setLogoutCallBack };
export default apiFetch;
