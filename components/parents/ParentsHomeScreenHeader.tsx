import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ParentsNavigatorProp } from "../../Navigation/ParentsNavigator";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import { getGreeting } from "../../utils/utils";
import Avatar from "../Avatar";
import Icon from "../Icon";

const ParentsHomeScreenHeader = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const parentsNav = useNavigation<ParentsNavigatorProp>();
  const isUserSubscribed = false;

  const { data, isPending } = useGetUserProfile();
  if (isPending) return <ActivityIndicator size={"large"} />;

  return (
    <View
      aria-labelledby="user avatar container"
      className="flex flex-row bg-white pb-4 items-center gap-2 sticky top-0"
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
      <View className="flex flex-row gap-x-3 items-center">
        {!isUserSubscribed && (
          <Pressable
            className="rounded-full overflow-hidden"
            onPress={() => parentsNav.navigate("getPremium")}
          >
            <LinearGradient
              colors={["#3608AB", "#2651D3", "#976FFC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex flex-row items-center gap-x-1.5 py-3 px-4"
            >
              <Icon name="Crown" color="white" />
              <Text className="text-white font-[abeezee]">Get Premium</Text>
            </LinearGradient>
          </Pressable>
        )}
        <Pressable
          onPress={() =>
            parentsNav.navigate("notifications", { screen: "index" })
          }
          className="rounded-full flex justify-center items-center size-11 bg-white border border-border-lighter "
        >
          <Icon name="Bell" />
        </Pressable>
      </View>
    </View>
  );
};

export default ParentsHomeScreenHeader;
