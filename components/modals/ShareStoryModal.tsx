import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { shareContent } from "../../utils/utils";
import useToast from "../../contexts/ToastContext";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

type ShareStoryModalProps = Omit<CustomModalProps, "children"> & {
  storyId: string;
  storyTitle: string;
};

const SOCIAL_ICONS = [
  { name: "facebook" as const, color: "#1877F2", label: "Facebook" },
  { name: "instagram" as const, color: "#E4405F", label: "Instagram" },
  { name: "linkedin" as const, color: "#0A66C2", label: "LinkedIn" },
  { name: "whatsapp" as const, color: "#25D366", label: "WhatsApp" },
  { name: "x-twitter" as const, color: "#14171A", label: "X" },
];

const ShareStoryModal = ({
  isOpen,
  onClose,
  storyId,
  storyTitle,
}: ShareStoryModalProps) => {
  // Use web URL as primary share link for better compatibility
  // Deep links won't work for recipients without the app installed
  const shareUrl = `https://storytime.app/story/${storyId}`;
  const { notify } = useToast();

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(shareUrl);
      notify("Link copied to clipboard");
    } catch {
      notify("Failed to copy link");
    }
  };

  const shareMessage = `Check out "${storyTitle}" on Storytime!`;

  const handleShare = () => {
    shareContent({
      // iOS uses separate url field for rich link preview; Android ignores url
      message:
        Platform.OS === "android"
          ? `${shareMessage}\n${shareUrl}`
          : shareMessage,
      url: Platform.OS === "ios" ? shareUrl : undefined,
      title: storyTitle,
    });
  };

  return (
    <CustomModal onClose={onClose} isOpen={isOpen}>
      <View className="flex flex-col gap-y-6">
        {/* Header */}
        <View className="flex flex-row items-center justify-between">
          <Text className="font-[abeezee] text-base text-black">
            Share link
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>

        {/* Shareable URL box */}
        <Pressable
          onPress={handleCopy}
          style={styles.urlBox}
          accessibilityLabel="Copy story link to clipboard"
          accessibilityRole="button"
        >
          <Text
            className="flex-1 font-[abeezee] text-base text-black"
            numberOfLines={2}
            ellipsizeMode="middle"
          >
            {shareUrl}
          </Text>
          <Icon name="Copy" size={22} color="#4807EC" />
        </Pressable>

        {/* Divider */}
        <View className="h-px bg-border-lighter" />

        {/* Social media icons */}
        <View className="flex-row items-start gap-x-3">
          {SOCIAL_ICONS.map((icon) => (
            <Pressable
              key={icon.name}
              onPress={handleShare}
              style={styles.socialButton}
              accessibilityLabel={`Share on ${icon.label}`}
              accessibilityRole="button"
            >
              <FontAwesome6 name={icon.name} size={28} color={icon.color} />
            </Pressable>
          ))}
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  urlBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    padding: 16,
    borderRadius: 18,
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderColor: "#FDE260",
    backgroundColor: "#FFF8D7",
  },
  socialButton: {
    padding: 16,
    borderRadius: 45,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
  },
});

export default ShareStoryModal;
