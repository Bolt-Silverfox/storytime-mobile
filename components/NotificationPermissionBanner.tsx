import { Linking, Platform, Pressable, Text, View } from "react-native";
import { BellOff, X } from "lucide-react-native";
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
  if (permissionStatus === "granted") return null;

  const isDenied = permissionStatus === "denied";

  const openDeviceSettings = () => {
    Platform.OS === "ios"
      ? Linking.openURL("app-settings:")
      : Linking.openSettings();
  };

  const handlePress = async () => {
    if (isDenied) {
      openDeviceSettings();
    } else {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          onPermissionGranted?.();
        } else {
          openDeviceSettings();
        }
      } catch {
        openDeviceSettings();
      }
    }
  };

  return (
    <View className="flex-row items-center rounded-lg bg-amber-50 px-3 py-2.5">
      <BellOff size={16} color="#d97706" />
      <Pressable onPress={handlePress} className="ml-2 flex-1">
        <Text className="text-sm text-amber-800">
          {isDenied
            ? "Notifications are off. "
            : "Enable notifications for updates. "}
          <Text className="font-semibold text-amber-900 underline">
            {isDenied ? "Enable" : "Turn on"}
          </Text>
        </Text>
      </Pressable>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          className="ml-2 p-1"
          accessibilityLabel="Dismiss notification banner"
          accessibilityRole="button"
          hitSlop={8}
        >
          <X size={16} color="#92400e" />
        </Pressable>
      )}
    </View>
  );
};

export default NotificationPermissionBanner;
