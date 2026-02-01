import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import { getGreeting } from "../../utils/utils";
import Avatar from "../Avatar";
import Icon from "../Icon";

const ParentsHomeScreenHeader = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const protectedNav = useNavigation<ProtectedRoutesNavigationProp>();
  const isUserSubscribed = false;

  const { data, isPending } = useGetUserProfile();
  if (isPending) return <ActivityIndicator size={"large"} />;

  return (
    <View
      aria-labelledby="user avatar container"
      className="sticky top-0 flex flex-row items-center gap-2 border-b border-b-border-lighter bg-white pb-4"
    >
      <View>
        <Avatar
          size={40}
          onPress={() =>
            navigator.navigate("parents", {
              screen: "profile",
              params: { screen: "indexPage" },
            })
          }
        />
      </View>
      <View className="flex flex-1 flex-col gap-y-1.5">
        <Text className="font-[abeezee] text-base">{data?.name}</Text>
        <Text className="font-[abeezee] text-[12px] text-[#616161]">
          {getGreeting()}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-x-3">
        {!isUserSubscribed && (
          <Pressable
            className="overflow-hidden rounded-full"
            onPress={() => protectedNav.navigate("getPremium")}
          >
            <LinearGradient
              colors={["#3608AB", "#2651D3", "#976FFC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex flex-row items-center gap-x-1.5 px-4 py-3"
            >
              <Icon name="Crown" color="white" />
              <Text className="font-[abeezee] text-white">Get Premium</Text>
            </LinearGradient>
          </Pressable>
        )}
        <Pressable
          onPress={() =>
            protectedNav.navigate("notification", { screen: "index" })
          }
          className="flex size-11 items-center justify-center rounded-full border border-border-lighter bg-white "
        >
          <Icon name="Bell" />
        </Pressable>
      </View>
    </View>
  );
};

export default ParentsHomeScreenHeader;
