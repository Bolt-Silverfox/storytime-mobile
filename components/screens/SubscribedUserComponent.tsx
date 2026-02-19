import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable, Text, View } from "react-native";
import SubscriptionDetails from "../SubscriptionDetails";

const SubscribedUserComponent = () => {
  return (
    <View className="flex flex-1 flex-col">
      <View className="flex flex-1 flex-col items-center justify-center">
        <Pressable className="flex size-[100px] items-center justify-center rounded-full bg-white">
          <FontAwesome5 name="crown" size={50} color="#866EFF" />
        </Pressable>
        <Text className="mt-4 px-4 text-center font-[quilka] text-2xl text-white">
          You Have Unlocked Happiness
        </Text>
        <Text className="mt-2 px-4 text-center font-[abeezee] text-sm text-white">
          You are now subscribed to Storytime for Kids
        </Text>
      </View>
      <SubscriptionDetails />
    </View>
  );
};

export default SubscribedUserComponent;
