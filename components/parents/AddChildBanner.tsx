import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import Icon from "../Icon";

const AddChildBanner = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <View className="bg-blue max-w-screen-md w-full mx-auto rounded-2xl flex justify-between items-center flex-row gap-x-2 p-2.5">
      <View className="flex flex-1 flex-col gap-y-2">
        <Text className="font-[quilka] text-white text-xl">Add a child</Text>
        <Text className="font-[abeezee] text-sm text-[#B89DFD]">
          Add child's profile to unlock personalized stories and safer
          content.{" "}
        </Text>
        <Pressable
          onPress={() => navigator.navigate("addChild")}
          className="bg-white  px-2 flex-row justify-between w-[180px] flex  items-center rounded-full"
        >
          <Text className="font-[abeezee] text-sm py-3 text-black">
            Add your child
          </Text>
          <Icon name="ArrowRight" size={20} />
        </Pressable>
      </View>

      <Image
        className="size-[133px]"
        source={require("../../assets/images/mother-and-child.png")}
      />
    </View>
  );
};

export default AddChildBanner;
