import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import {
  initializePushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  addTokenRefreshListener,
  getLastNotificationResponse,
  clearBadgeCount,
} from "../utils/notifications";
import type { NotificationCategory } from "../types";

type NotificationData = {
  category?: NotificationCategory;
  storyId?: string;
  kidId?: string;
  screen?: string;
  [key: string]: unknown;
};

export const useNotifications = (isAuthenticated: boolean) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const notificationListener = useRef<ReturnType<
    typeof Notifications.addNotificationReceivedListener
  > | null>(null);
  const responseListener = useRef<ReturnType<
    typeof Notifications.addNotificationResponseReceivedListener
  > | null>(null);
  const tokenRefreshListener = useRef<ReturnType<
    typeof Notifications.addPushTokenListener
  > | null>(null);

  // Handle notification navigation based on category/data
  const handleNotificationNavigation = (data: NotificationData) => {
    const { category, storyId, kidId, screen } = data;

    // If explicit screen is provided, navigate there
    if (screen) {
      try {
        // @ts-expect-error - dynamic navigation
        navigation.navigate(screen, data);
      } catch (error) {
        console.warn("Failed to navigate to screen:", screen, error);
      }
      return;
    }

    // Handle navigation based on notification category
    switch (category) {
      case "NEW_STORY":
      case "STORY_RECOMMENDATION":
      case "STORY_FINISHED":
        if (storyId) {
          // @ts-expect-error - dynamic navigation
          navigation.navigate("StoryDetails", { storyId });
        }
        break;

      case "ACHIEVEMENT_UNLOCKED":
      case "BADGE_EARNED":
      case "STREAK_MILESTONE":
        // Navigate to achievements/progress screen
        // @ts-expect-error - dynamic navigation
        navigation.navigate("ParentsNavigator", {
          screen: "NotificationsNavigator",
        });
        break;

      case "SCREEN_TIME_LIMIT":
      case "BEDTIME_REMINDER":
      case "WEEKLY_REPORT":
        if (kidId) {
          // @ts-expect-error - dynamic navigation
          navigation.navigate("ParentControls", { kidId });
        } else {
          // @ts-expect-error - dynamic navigation
          navigation.navigate("ParentsNavigator");
        }
        break;

      case "NEW_LOGIN":
      case "PASSWORD_CHANGED":
      case "PASSWORD_RESET_ALERT":
        // Navigate to security settings
        // @ts-expect-error - dynamic navigation
        navigation.navigate("ParentsNavigator", {
          screen: "ParentProfileNavigator",
          params: { screen: "Security" },
        });
        break;

      case "SUBSCRIPTION_ALERT":
      case "SUBSCRIPTION_REMINDER":
      case "PAYMENT_SUCCESS":
      case "PAYMENT_FAILED":
        // Navigate to subscription screen
        // @ts-expect-error - dynamic navigation
        navigation.navigate("ParentsNavigator", {
          screen: "ParentProfileNavigator",
          params: { screen: "Subscriptions" },
        });
        break;

      default:
        // Default: go to notifications screen
        // @ts-expect-error - dynamic navigation
        navigation.navigate("ParentsNavigator", {
          screen: "NotificationsNavigator",
        });
        break;
    }
  };

  // Initialize push notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setIsInitialized(false);
      setPermissionStatus("undetermined");
      return;
    }

    const initialize = async () => {
      // Check current permission status first
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined");

      const token = await initializePushNotifications();
      if (token) {
        setExpoPushToken(token);
        setIsInitialized(true);
        setPermissionStatus("granted");
      } else {
        // Check if permission was denied
        const { status: finalStatus } = await Notifications.getPermissionsAsync();
        setPermissionStatus(finalStatus === "granted" ? "granted" : "denied");
      }
    };

    initialize();
  }, [isAuthenticated]);

  // Set up notification listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    // Listener for notifications received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        if (__DEV__) {
          console.log("Notification received in foreground:", notification);
        }
      }
    );

    // Listener for when user taps on a notification
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content
        .data as NotificationData;

      if (__DEV__) {
        console.log("Notification tapped:", data);
      }

      handleNotificationNavigation(data);
    });

    // Listen for FCM token refresh (handles reinstalls & token rotation)
    tokenRefreshListener.current = addTokenRefreshListener((newToken) => {
      setExpoPushToken(newToken);
    });

    // Check for notification that opened the app (cold start)
    getLastNotificationResponse().then((response) => {
      if (response) {
        const data = response.notification.request.content
          .data as NotificationData;

        if (__DEV__) {
          console.log("App opened from notification:", data);
        }

        // Small delay to ensure navigation is ready
        setTimeout(() => {
          handleNotificationNavigation(data);
        }, 500);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      if (tokenRefreshListener.current) {
        tokenRefreshListener.current.remove();
      }
    };
  }, [isAuthenticated, navigation]);

  // Clear badge count and refresh notifications when app becomes active
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && isAuthenticated) {
        // Clear badge count
        clearBadgeCount();

        // Invalidate notification queries to fetch fresh data
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, queryClient]);

  return {
    expoPushToken,
    isInitialized,
    permissionStatus,
  };
};

export default useNotifications;
