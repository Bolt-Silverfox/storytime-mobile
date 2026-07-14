import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { makeStoryUniversalLink } from "../../constants";
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
  const shareUrl = makeStoryUniversalLink(storyId, storyTitle);
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

  // Per-app share intents (https universal links open the installed app, else
  // the web share dialog). Instagram has no link-share URL, so it — and any
  // failure to open — falls back to the OS share sheet.
  const handleSocialShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const targets: Record<string, string | undefined> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`,
      "x-twitter": `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareMessage
      )}&url=${encodedUrl}`,
    };

    const target = targets[platform];
    if (!target) {
      handleShare();
      return;
    }
    try {
      await Linking.openURL(target);
    } catch {
      handleShare();
    }
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
              onPress={() => handleSocialShare(icon.name)}
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
