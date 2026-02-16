import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import apiFetch from "../apiFetch";
import type { DeviceTokenResponse } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const PUSH_TOKEN_KEY = "pushToken";

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    ...(Platform.OS === "android" && {
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Notification permission not granted");
    return false;
  }

  // Set up Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("storytime_default", {
      name: "StoryTime Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6366f1",
      sound: "default",
    });
  }

  return true;
};

// Get the FCM/Expo push token
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.error("EAS project ID not found in app config");
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return tokenResponse.data;
  } catch (error) {
    console.error("Failed to get push token:", error);
    return null;
  }
};

// Get FCM registration token for both platforms
// On Android: getDevicePushTokenAsync() already returns the FCM token
// On iOS: getDevicePushTokenAsync() returns raw APNs token, so we use
// Firebase Messaging to get the FCM registration token instead
export const getDevicePushToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "ios") {
      // Register with APNs first, then get the FCM token
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      return fcmToken;
    }

    // Android: expo-notifications returns the FCM token directly
    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    return tokenResponse.data;
  } catch (error) {
    console.error("Failed to get device push token:", error);
    return null;
  }
};

// Register device token with backend
export const registerDeviceToken = async (
  token: string
): Promise<DeviceTokenResponse | null> => {
  try {
    const platform = Platform.OS as "ios" | "android";
    const deviceName = Device.modelName || undefined;

    const response = await apiFetch(`${BASE_URL}/devices/register`, {
      method: "POST",
      body: JSON.stringify({
        token,
        platform,
        deviceName,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    console.error("Failed to register device token:", data.message);
    return null;
  } catch (error) {
    console.error("Error registering device token:", error);
    return null;
  }
};

// Unregister device token from backend (on logout)
export const unregisterDeviceToken = async (token: string): Promise<boolean> => {
  try {
    const response = await apiFetch(`${BASE_URL}/devices`, {
      method: "DELETE",
      body: JSON.stringify({ token }),
    });

    // Backend returns 204 No Content on success
    return response.ok;
  } catch (error) {
    console.error("Error unregistering device token:", error);
    return false;
  }
};

// Store push token locally for logout
const storePushToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to store push token:", error);
  }
};

// Get stored push token
export const getStoredPushToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get stored push token:", error);
    return null;
  }
};

// Clear stored push token
export const clearStoredPushToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to clear stored push token:", error);
  }
};

// Initialize push notifications and register token
// Always re-registers with backend to handle reinstalls where the
// old token became stale but AsyncStorage was cleared
export const initializePushNotifications = async (): Promise<string | null> => {
  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    return null;
  }

  // Get native device token (FCM for Android, APNs for iOS)
  // Backend uses Firebase Admin SDK directly, so it needs the native token
  const deviceToken = await getDevicePushToken();

  if (!deviceToken) {
    return null;
  }

  // Always register with backend - handles both fresh installs and reinstalls
  // Backend should upsert: if this user+platform already has a device entry,
  // update the token rather than creating a duplicate
  const result = await registerDeviceToken(deviceToken);

  if (result) {
    await storePushToken(deviceToken);
  }

  return deviceToken;
};

// Cleanup push notifications on logout
export const cleanupPushNotifications = async (): Promise<void> => {
  const token = await getStoredPushToken();

  if (token) {
    await unregisterDeviceToken(token);
    await clearStoredPushToken();
  }

  // Clear badge and dismiss notifications
  await clearBadgeCount();
  await dismissAllNotifications();
};

// Add listener for received notifications (foreground)
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

// Add listener for notification responses (when user taps notification)
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// Get the last notification response (for cold starts)
export const getLastNotificationResponse = async () => {
  return Notifications.getLastNotificationResponseAsync();
};

// Clear badge count
export const clearBadgeCount = async () => {
  await Notifications.setBadgeCountAsync(0);
};

// Get current badge count
export const getBadgeCount = async (): Promise<number> => {
  return Notifications.getBadgeCountAsync();
};

// Schedule a local notification (for testing)
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, unknown>
) => {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Immediately
  });
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Dismiss all delivered notifications
export const dismissAllNotifications = async () => {
  await Notifications.dismissAllNotificationsAsync();
};

// Listen for FCM token changes (token rotation or reinstall)
// Returns an unsubscribe function that should be called on cleanup
export const addTokenRefreshListener = (
  onTokenRefresh?: (token: string) => void
): (() => void) => {
  if (Platform.OS === "ios") {
    // Use Firebase Messaging listener on iOS for FCM token refresh
    return messaging().onTokenRefresh(async (newToken) => {
      const storedToken = await getStoredPushToken();

      if (newToken !== storedToken) {
        console.log("FCM token refreshed, re-registering with backend");
        const result = await registerDeviceToken(newToken);
        if (result) {
          await storePushToken(newToken);
          onTokenRefresh?.(newToken);
        }
      }
    });
  }

  // Android: expo-notifications listener returns FCM token directly
  const subscription = Notifications.addPushTokenListener(async (event) => {
    const newToken =
      typeof event.data === "string" ? event.data : (event.data as any)?.data;

    if (!newToken) return;

    const storedToken = await getStoredPushToken();

    if (newToken !== storedToken) {
      console.log("FCM token refreshed, re-registering with backend");
      const result = await registerDeviceToken(newToken);
      if (result) {
        await storePushToken(newToken);
        onTokenRefresh?.(newToken);
      }
    }
  });

  return () => subscription.remove();
};
