import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";

const CompleteProfileBanner = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <View className="bg-[#2E3978] max-w-screen-md w-full mx-auto rounded-2xl flex justify-between items-center flex-row gap-x-2 pl-2.5">
      <View className="flex flex-1  flex-col gap-y-2">
        <Text className="font-[abeezee] text-[#FFDE05] text-sm">
          Complete your profile
        </Text>
        <Text className="font-[abeezee] leading-[130%] text-white text-[11px]">
          Kindly complete your profile to explore all the benefits of the App
        </Text>
        <Pressable
          onPress={() =>
            navigator.navigate("parentProfileSetup", { screen: "index" })
          }
          className="bg-white mt-2 justify-center w-[180px]  flex  items-center rounded-full"
        >
          <Text className="font-[abeezee] text-sm py-3 text-black">
            Complete profile
          </Text>
        </Pressable>
      </View>

      <Image
        className="size-[133px] rounded-r-2xl"
        source={require("../../assets/images/mother-and-child2.png")}
      />
    </View>
  );
};

export default CompleteProfileBanner;
