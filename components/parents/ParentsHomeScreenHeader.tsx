import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const ParentsHomeScreenHeader = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const parentsNav = useNavigation<ParntHomeNavigatorProp>();
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
            navigator.reset({
              index: 0,
              routes: [{ name: "selection" }],
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
        <Pressable className="rounded-full flex justify-center items-center size-11 bg-white border border-[#FAF4F2] ">
          <Icon name="Bell" />
        </Pressable>
      </View>
    </View>
  );
};

export default ParentsHomeScreenHeader;
