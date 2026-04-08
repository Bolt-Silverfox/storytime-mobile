import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import useIsPremium from "../../hooks/useIsPremium";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import useAuth from "../../contexts/AuthContext";
import { getGreeting } from "../../utils/utils";
import Avatar from "../Avatar";
import Icon from "../Icon";

const ParentsHomeScreenHeader = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const rootNavigator = useNavigation<RootNavigatorProp>();
  const { isGuest } = useAuth();

  const { data, isPending } = useGetUserProfile();
  const { isPremium: isUserSubscribed } = useIsPremium();
  if (isPending && !isGuest) return <ActivityIndicator size={"large"} />;

  const handleGetPremiumPress = () => {
    if (isGuest) {
      rootNavigator.navigate("auth", { screen: "signUp" });
    } else {
      navigator.navigate("getPremium" as any);
    }
  };

  return (
    <View
      aria-labelledby="user avatar container"
      className="sticky top-0 flex flex-row items-center gap-2 border-b border-b-border-lighter bg-white pb-4"
    >
      <View>
        <Avatar
          size={40}
          onPress={
            isGuest
              ? undefined
              : () =>
                  navigator.navigate("parents", {
                    screen: "profile",
                    params: { screen: "indexPage" },
                  })
          }
        />
      </View>
      <View className="flex min-w-0 flex-1 flex-col gap-y-1.5">
        <Text numberOfLines={1} className="font-[abeezee] text-base">
          {isGuest ? "Guest" : (data?.name ?? "")}
        </Text>
        <Text className="font-[abeezee] text-[12px] text-[#616161]">
          {getGreeting()}
        </Text>
      </View>
      <View className="flex shrink-0 flex-row items-center gap-x-3">
        {!isUserSubscribed && (
          <Pressable
            className="overflow-hidden rounded-full"
            onPress={handleGetPremiumPress}
          >
            <LinearGradient
              colors={["#3608AB", "#2651D3", "#976FFC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={headerStyles.gradientContent}
            >
              <Icon name="Crown" color="white" />
              <Text className="font-[abeezee] text-white">Get Premium</Text>
            </LinearGradient>
          </Pressable>
        )}
        {!isGuest && (
          <Pressable
            onPress={() =>
              navigator.navigate("notification", { screen: "index" })
            }
            className="flex size-11 items-center justify-center rounded-full border border-border-lighter bg-white "
          >
            <Icon name="Bell" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  gradientContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default ParentsHomeScreenHeader;
