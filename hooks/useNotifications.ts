import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { notifLogger } from "../utils/logger";
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

// Allowed top-level screens for notification-driven navigation.
// Only registered ProtectedRoutesParamList screen names should appear here.
const ALLOWED_SCREENS = new Set(["stories", "notification", "getPremium"]);

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
  const tokenRefreshUnsubscribe = useRef<(() => void) | null>(null);
  const coldStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Handle notification navigation based on category/data
  const handleNotificationNavigation = useCallback(
    (data: NotificationData) => {
      const { category, storyId, screen } = data;

      const goToNotifications = () => {
        // @ts-expect-error - dynamic navigation
        navigation.navigate("notification");
      };

      // If explicit screen is provided, validate and navigate there
      if (screen) {
        if (!ALLOWED_SCREENS.has(screen)) {
          notifLogger.warn("Unknown notification screen:", screen);
          goToNotifications();
          return;
        }
        try {
          // Only forward storyId as a safe, known param — never pass raw data
          const safeParams = storyId ? { storyId } : undefined;
          // @ts-expect-error - dynamic navigation
          navigation.navigate(screen, safeParams);
        } catch (err) {
          notifLogger.warn("Failed to navigate to screen:", screen, err);
          goToNotifications();
        }
        return;
      }

      // Handle navigation based on notification category
      switch (category) {
        case "NEW_STORY":
        case "STORY_RECOMMENDATION":
        case "STORY_FINISHED":
          if (storyId) {
            // Navigate to story deep link screen via nested navigator
            // @ts-expect-error - dynamic navigation
            navigation.navigate("stories", {
              screen: "storyDeepLink",
              params: { storyId },
            });
          } else {
            goToNotifications();
          }
          break;

        case "ACHIEVEMENT_UNLOCKED":
        case "BADGE_EARNED":
        case "STREAK_MILESTONE":
          goToNotifications();
          break;

        case "SCREEN_TIME_LIMIT":
        case "BEDTIME_REMINDER":
        case "WEEKLY_REPORT":
          goToNotifications();
          break;

        case "NEW_LOGIN":
        case "PASSWORD_CHANGED":
        case "PASSWORD_RESET_ALERT":
          // Navigate to the profile tab → password reset screen
          // @ts-expect-error - dynamic navigation
          navigation.navigate("parents", {
            screen: "profile",
            params: { screen: "resetParentPassword" },
          });
          break;

        case "SUBSCRIPTION_ALERT":
        case "SUBSCRIPTION_REMINDER":
        case "PAYMENT_SUCCESS":
        case "PAYMENT_FAILED":
          // Navigate to the premium/subscription screen
          // @ts-expect-error - dynamic navigation
          navigation.navigate("getPremium");
          break;

        default:
          goToNotifications();
          break;
      }
    },
    [navigation]
  );

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
      setPermissionStatus(
        status === "granted"
          ? "granted"
          : status === "denied"
            ? "denied"
            : "undetermined"
      );

      const token = await initializePushNotifications();
      if (token) {
        setExpoPushToken(token);
        setIsInitialized(true);
        setPermissionStatus("granted");
      } else {
        // Check if permission was denied
        const { status: finalStatus } =
          await Notifications.getPermissionsAsync();
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
        notifLogger.debug("Notification received in foreground", {
          notificationId: notification.request.identifier,
          category: notification.request.content.categoryIdentifier,
        });
      }
    );

    // Listener for when user taps on a notification
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content
        .data as NotificationData;

      notifLogger.debug("Notification tapped", {
        category: data.category,
        screen: data.screen,
        hasStoryId: Boolean(data.storyId),
        hasKidId: Boolean(data.kidId),
      });

      handleNotificationNavigation(data);
    });

    // Listen for FCM token refresh (handles reinstalls & token rotation)
    tokenRefreshUnsubscribe.current = addTokenRefreshListener((newToken) => {
      setExpoPushToken(newToken);
    });

    // Check for notification that opened the app (cold start)
    getLastNotificationResponse().then((response) => {
      if (response) {
        const data = response.notification.request.content
          .data as NotificationData;

        notifLogger.debug("App opened from notification", {
          category: data.category,
          screen: data.screen,
          hasStoryId: Boolean(data.storyId),
          hasKidId: Boolean(data.kidId),
        });

        // Small delay to ensure navigation is ready
        coldStartTimeoutRef.current = setTimeout(() => {
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
      if (tokenRefreshUnsubscribe.current) {
        tokenRefreshUnsubscribe.current();
      }
      if (coldStartTimeoutRef.current) {
        clearTimeout(coldStartTimeoutRef.current);
      }
    };
  }, [isAuthenticated, navigation, handleNotificationNavigation]);

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
