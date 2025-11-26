import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Icon from "../../components/Icon";
import {
  KidsSetupNavigatorParamList,
  KidsSetupProp,
} from "../../Navigation/KidsSetupNavigator";

type RouteProps = RouteProp<KidsSetupNavigatorParamList, "welcomeScreen">;
const BuddySelectionScreen = () => {
  const { params } = useRoute<RouteProps>();
  const [selected, setSelected] = useState<"zylo" | "lumina">("zylo");
  const navigator = useNavigation<KidsSetupProp>();

  return (
    <View className="flex flex-col gap-y-10 py-10 flex-1 max-w-screen-md mx-auto w-full">
      <Text className="text-center font-[quilka] text-2xl">Hi, Tim</Text>
      <Text className="text-center font-[abeezee]">
        Choose your Storytime Buddy
      </Text>
      <View className="flex flex-1 flex-row items-center flex-wrap gap-x-2 justify-center">
        <Pressable
          onPress={() => setSelected("lumina")}
          className={`rounded-3xl h-[275px] py-10 w-[180px] border ${selected === "lumina" ? "border-2 border-purple bg-purple/10" : "border-black/20 border"}`}
        >
          <View className="flex-1">
            <Image
              className=""
              source={require("../../assets/avatars/lumina.png")}
            />
          </View>
          <Text className="font-[quilka] text-xl text-center">Lumina</Text>
        </Pressable>
        <Pressable
          onPress={() => setSelected("zylo")}
          className={`rounded-3xl h-[275px] py-10 w-[180px] border ${selected === "zylo" ? "border-2 border-purple bg-purple/10" : "border-black/20 border"}`}
        >
          <View className="flex-1">
            <Image
              className=""
              source={require("../../assets/avatars/zylo.png")}
            />
          </View>
          <Text className="font-[quilka] text-xl text-center">Zylo</Text>
        </Pressable>
      </View>
      <Pressable
        disabled={!selected}
        onPress={() =>
          navigator.navigate("welcomeScreen", {
            selected,
            childId: params?.childId ?? "childIDisundefined",
          })
        }
        className={`mx-5  flex flex-row justify-center items-center gap-x-4 sm:w-full py-4 rounded-full mt-4 max-w-screen-sm sm:mx-auto ${!selected ? "bg-purple/20" : "bg-purple"}`}
      >
        <Text className="text-center text-white font-[quilka] text-2xl">
          {"Continue"}
        </Text>
        <Icon name="ArrowRight" color="white" />
      </Pressable>
    </View>
  );
};

export default BuddySelectionScreen;
