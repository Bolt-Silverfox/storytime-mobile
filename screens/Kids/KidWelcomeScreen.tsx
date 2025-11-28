import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { KidsNavigatorProp } from "../../Navigation/KidsNavigator";
import Icon from "../../components/Icon";
import { KidsSetupNavigatorParamList } from "../../Navigation/KidsSetupNavigator";

type KidWelcomeScreenRouteProp = RouteProp<
  KidsSetupNavigatorParamList,
  "welcomeScreen"
>;
const KidWelcomeScreen = () => {
  const { params } = useRoute<KidWelcomeScreenRouteProp>();
  const navigator = useNavigation<KidsNavigatorProp>();
  const defaultName = "Tim";
  return (
    <View className="flex  flex-col gap-y-10  flex-1 max-w-screen-md mx-auto w-full">
      <ImageBackground
        source={
          params.selected === "zylo"
            ? require("../../assets/avatars/zylo-bg.png")
            : require("../../assets/avatars/lumina-bg.png")
        }
        className="w-full h-full rounded-2xl"
        resizeMode="cover"
      >
        <View
          className={`flex-1 my-20  ${params.selected === "lumina" ? " translate-y-72" : null}`}
        >
          <View className="p-7 self-center bg-[#FFFCFB] rounded-2xl">
            <Text className="text-[22px] font-[abeezee] text-black">
              Hello {defaultName}, i am {params.selected}.{" "}
            </Text>
            <Text className="text-[22px] font-[abeezee] text-black">
              I am your Storytime Buddy.
            </Text>
            <Text className="text-[22px] font-[abeezee] text-black">
              Ready to start reading together?
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() =>
            navigator.navigate("index", {
              screen: "home",
              params: { childId: params.childId },
            })
          }
          className={`mx-5 bg-purple/90 mb-20  flex flex-row justify-center items-center gap-x-4 sm:w-full py-4 rounded-full mt-4 max-w-screen-sm sm:mx-auto `}
        >
          <Text className="text-center text-white font-[quilka] text-2xl">
            {"Let's go"}
          </Text>
          <Icon name="ArrowRight" color="white" />
        </Pressable>
        ``
      </ImageBackground>
    </View>
  );
};

export default KidWelcomeScreen;
