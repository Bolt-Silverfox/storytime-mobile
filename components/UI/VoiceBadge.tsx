import { Text, View } from "react-native";
import { BADGE_LABELS, COLORS } from "../../constants/ui";

const VoiceBadge = ({
  isDefault,
  isPremium,
}: {
  isDefault: boolean;
  isPremium: boolean;
}) => {
  if (isDefault) {
    return (
      <View
        style={{ backgroundColor: COLORS.defaultBadge.background }}
        className="flex h-6 items-center justify-center self-center rounded-full px-2"
      >
        <Text
          style={{ color: COLORS.defaultBadge.text }}
          className="font-[abeezee] text-xs"
        >
          {BADGE_LABELS.default}
        </Text>
      </View>
    );
  }

  if (!isPremium) {
    return (
      <View
        style={{ backgroundColor: COLORS.premiumBadge.background }}
        className="flex h-6 items-center justify-center self-center rounded-full px-2"
      >
        <Text className="font-[abeezee] text-xs text-black">
          {BADGE_LABELS.premium}
        </Text>
      </View>
    );
  }

  return <View className="h-6" />;
};

export default VoiceBadge;
