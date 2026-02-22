import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import useGetStoryQuota from "../../hooks/tanstack/queryHooks/useGetStoryQuota";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";

const FreeStoriesBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { data: quota } = useGetStoryQuota();
  const { data: profile } = useGetUserProfile();

  const isPremium =
    profile?.subscriptionStatus === "active" || profile?.role === "admin";

  if (dismissed || isPremium || !quota) return null;

  const used = quota.used ?? 0;
  const totalAllowed = quota.totalAllowed ?? 0;
  const remaining = quota.remaining ?? 0;
  const isLimitReached = remaining === 0 && (quota.bonusStories ?? 0) === 0;
  const hasBonus = (quota.bonusStories ?? 0) > 0;
  const showUpgrade = isLimitReached || hasBonus;

  const getDescription = () => {
    if (isLimitReached) {
      return `${totalAllowed} free stories completed. Upgrade to unlock unlimited stories, audio narration, and a growing library your child will love.`;
    }
    if (hasBonus) {
      return "A new free story has arrived for you this month. Settle in and enjoy the moment, your next free story will be available next week.";
    }
    return `Get started with ${totalAllowed} free stories, and continue enjoying 1 free story every week with our Freemium plan.`;
  };

  const getBoldText = () => {
    if (showUpgrade) return "Upgrade to Premium";
    return `${used}/${totalAllowed} stories read`;
  };

  return (
    <View
      style={{
        backgroundColor: "#4807EC",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <View style={{ flex: 1, gap: 6 }}>
        <Text
          style={{
            fontFamily: "abeezee",
            fontSize: 12,
            color: "#D3C9FA",
          }}
        >
          {getDescription()}
        </Text>
        {showUpgrade ? (
          <Pressable onPress={() => navigator.navigate("getPremium")}>
            <Text
              style={{
                fontFamily: "quilka",
                fontSize: 12,
                fontWeight: "700",
                lineHeight: 20,
                color: "#FFFFFF",
                textDecorationLine: "underline",
              }}
            >
              {getBoldText()}
            </Text>
          </Pressable>
        ) : (
          <Text
            style={{
              fontFamily: "quilka",
              fontSize: 12,
              fontWeight: "700",
              lineHeight: 20,
              color: "#FFFFFF",
            }}
          >
            {getBoldText()}
          </Text>
        )}
      </View>
      <Pressable
        onPress={() => setDismissed(true)}
        accessibilityRole="button"
        accessibilityLabel="Dismiss banner"
        style={{
          backgroundColor: "#E2D6FE",
          borderWidth: 0.5,
          borderColor: "#804FFB",
          borderRadius: 28,
          padding: 6,
        }}
      >
        <Ionicons name="close" size={16} color="#4807EC" />
      </Pressable>
    </View>
  );
};

export default FreeStoriesBanner;
