import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SecureStore doesn't work on web, so we fallback to AsyncStorage
const isSecureStoreAvailable = Platform.OS !== "web";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const secureTokenStorage = {
  async getAccessToken(): Promise<string | null> {
    if (isSecureStoreAvailable) {
      return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async setAccessToken(token: string): Promise<void> {
    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } else {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    if (isSecureStoreAvailable) {
      return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    }
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.setAccessToken(accessToken),
      this.setRefreshToken(refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    if (isSecureStoreAvailable) {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } else {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    }
  },

  async hasAccessToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  },
};

export default secureTokenStorage;
