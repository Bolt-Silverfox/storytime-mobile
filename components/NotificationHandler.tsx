import { ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "../contexts/AuthContext";
import useNotifications from "../hooks/useNotifications";
import NotificationPermissionBanner from "./NotificationPermissionBanner";

type NotificationHandlerProps = {
  children: ReactNode;
};

const BANNER_DISMISSED_KEY = "notificationBannerDismissed";
const BANNER_DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const NotificationHandler = ({ children }: NotificationHandlerProps) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [showBanner, setShowBanner] = useState(false);

  // Initialize notifications and set up listeners
  const { permissionStatus } = useNotifications(isAuthenticated);

  // Check if banner was previously dismissed
  useEffect(() => {
    const checkBannerStatus = async () => {
      if (!isAuthenticated || permissionStatus === "granted") {
        setShowBanner(false);
        return;
      }

      try {
        const dismissedTime = await AsyncStorage.getItem(BANNER_DISMISSED_KEY);
        if (dismissedTime) {
          const timeSinceDismissed = Date.now() - parseInt(dismissedTime, 10);
          // Show banner again after 7 days
          if (timeSinceDismissed > BANNER_DISMISS_DURATION) {
            setShowBanner(true);
            await AsyncStorage.removeItem(BANNER_DISMISSED_KEY);
          } else {
            setShowBanner(false);
          }
        } else {
          // Never dismissed, show the banner
          setShowBanner(true);
        }
      } catch (error) {
        // On error, show banner to be safe
        setShowBanner(true);
      }
    };

    checkBannerStatus();
  }, [isAuthenticated, permissionStatus]);

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
    // Clear any dismissed status since permission is now granted
    try {
      await AsyncStorage.removeItem(BANNER_DISMISSED_KEY);
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to clear banner dismiss status:", error);
      }
    }
  };

  return (
    <>
      {showBanner && isAuthenticated && (
        <NotificationPermissionBanner
          permissionStatus={permissionStatus}
          onDismiss={handleDismiss}
          onPermissionGranted={handlePermissionGranted}
        />
      )}
      {children}
    </>
  );
};

export default NotificationHandler;
