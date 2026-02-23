import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

const BANNER_DISMISSED_KEY = "notificationBannerDismissed";
const BANNER_DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const useNotificationBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");

  useFocusEffect(
    useCallback(() => {
      const check = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const normalizedStatus =
          status === "granted"
            ? "granted"
            : status === "denied"
              ? "denied"
              : "undetermined";
        setPermissionStatus(normalizedStatus);

        if (status === "granted") {
          setShowBanner(false);
          return;
        }

        try {
          const dismissedTime =
            await AsyncStorage.getItem(BANNER_DISMISSED_KEY);
          if (dismissedTime) {
            const timeSinceDismissed = Date.now() - parseInt(dismissedTime, 10);
            if (
              isNaN(timeSinceDismissed) ||
              timeSinceDismissed > BANNER_DISMISS_DURATION
            ) {
              setShowBanner(true);
              await AsyncStorage.removeItem(BANNER_DISMISSED_KEY);
            } else {
              setShowBanner(false);
            }
          } else {
            setShowBanner(true);
          }
        } catch {
          setShowBanner(true);
        }
      };

      check();
    }, [])
  );

  const handleDismiss = async () => {
    setShowBanner(false);
    try {
      await AsyncStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString());
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to save banner dismiss status:", error);
      }
    }
  };

  const handlePermissionGranted = async () => {
    setShowBanner(false);
    setPermissionStatus("granted");
    try {
      await AsyncStorage.removeItem(BANNER_DISMISSED_KEY);
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to clear banner dismiss status:", error);
      }
    }
  };

  return {
    showBanner,
    permissionStatus,
    handleDismiss,
    handlePermissionGranted,
  };
};

export default useNotificationBanner;
