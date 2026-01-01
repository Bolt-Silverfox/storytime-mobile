import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import Icon from "../Icon";

const CompleteProfileBanner = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <View className="bg-primary max-w-screen-md w-full mx-auto rounded-2xl flex justify-between items-center flex-row gap-x-2 p-2.5">
      <View className="flex flex-1 flex-col gap-y-2">
        <Text className="font-[quilka] text-white text-xl">
          Complete your profile
        </Text>
        <Text className="font-[abeezee] text-sm text-[#FCB49C]">
          Complete your profile to explore all the benefits of the app.
        </Text>
        <Pressable
          onPress={() =>
            navigator.navigate("parentProfileSetup", { screen: "index" })
          }
          className="bg-white mt-2 px-2 flex-row justify-between w-[180px] flex  items-center rounded-full"
        >
          <Text className="font-[abeezee] text-sm py-3 text-black">
            Complete profile
          </Text>
          <Icon name="ArrowRight" size={20} />
        </Pressable>
      </View>

      <Image
        className="size-[133px]"
        source={require("../../assets/images/couple.png")}
      />
    </View>
  );
};

export default CompleteProfileBanner;
