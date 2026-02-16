import {
  Alert,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Bell, BellOff, Settings } from "lucide-react-native";
import * as Notifications from "expo-notifications";

type NotificationPermissionBannerProps = {
  permissionStatus: "granted" | "denied" | "undetermined";
  onDismiss?: () => void;
  onPermissionGranted?: () => void;
};

const NotificationPermissionBanner = ({
  permissionStatus,
  onDismiss,
  onPermissionGranted,
}: NotificationPermissionBannerProps) => {
  // Don't show banner if permissions are granted
  if (permissionStatus === "granted") return null;

  const isDenied = permissionStatus === "denied";

  const handleRequestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        onPermissionGranted?.();
      } else {
        // If still denied, show settings alert
        openSettings();
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to request permissions:", error);
      }
      openSettings();
    }
  };

  const openSettings = () => {
    Alert.alert(
      "Enable Notifications",
      "To receive story updates, achievements, and reminders, please enable notifications in your device settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  };

  const handlePrimaryAction = () => {
    if (isDenied) {
      openSettings();
    } else {
      handleRequestPermissions();
    }
  };

  return (
    <View className="mx-4 mt-3 rounded-lg bg-amber-50 p-4 shadow-sm">
      <View className="flex-row items-start">
        <View className="mr-3 mt-0.5">
          {isDenied ? (
            <BellOff size={20} color="#f59e0b" />
          ) : (
            <Bell size={20} color="#f59e0b" />
          )}
        </View>

        <View className="flex-1">
          <Text className="mb-1 font-semibold text-amber-900">
            {isDenied ? "Notifications Disabled" : "Enable Notifications"}
          </Text>
          <Text className="mb-3 text-sm leading-5 text-amber-800">
            {isDenied
              ? "You won't receive story updates, achievements, or reminders. Enable notifications in settings."
              : "Stay updated with new stories, achievements, and important reminders for your kids."}
          </Text>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={handlePrimaryAction}
              className="flex-row items-center rounded-md bg-amber-600 px-4 py-2"
              accessibilityLabel={
                isDenied
                  ? "Open device settings to enable notifications"
                  : "Request notification permissions"
              }
              accessibilityRole="button"
            >
              {isDenied ? (
                <Settings size={16} color="#fff" />
              ) : (
                <Bell size={16} color="#fff" />
              )}
              <Text className="ml-2 font-medium text-white">
                {isDenied ? "Open Settings" : "Enable Now"}
              </Text>
            </Pressable>

            {onDismiss && (
              <Pressable
                onPress={onDismiss}
                className="rounded-md px-4 py-2"
                accessibilityLabel="Dismiss notification banner"
                accessibilityRole="button"
              >
                <Text className="font-medium text-amber-700">Later</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default NotificationPermissionBanner;
