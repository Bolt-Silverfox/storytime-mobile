import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import Icon from "../Icon";

const AddChildBanner = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <View className=" bg-[#6121AF] max-w-screen-md w-full mx-auto rounded-2xl flex justify-between items-center flex-row gap-x-2 pl-2.5">
      <Pressable
        onPress={() =>
          navigator.navigate("userProfile", {
            screen: "completeProfile",
          })
        }
        className="bg-white size-16 flex justify-center self-center  items-center rounded-full"
      >
        <Icon name="Plus" color="black" />
      </Pressable>
      <View className="flex flex-1  flex-col gap-y-2">
        <Text className="font-[abeezee] text-[#EEC607] text-sm">
          Add a child
        </Text>
        <Text className="font-[abeezee] leading-[130%] text-white text-[11px]">
          Add child’s profile to unlock personalized stories, safer content, and
          a calmer bedtime routine.
        </Text>
      </View>
      <Image
        className="size-[133px]"
        source={require("../../assets/images/mother-and-child.png")}
      />
    </View>
  );
};

export default AddChildBanner;
