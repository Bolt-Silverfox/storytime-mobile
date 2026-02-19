import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable, ScrollView, Text, View } from "react-native";
import SubscriptionDetails from "../SubscriptionDetails";

const SubscribedUserComponent = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="flex flex-grow flex-col gap-y-8"
    >
      <View className="flex flex-col items-center pb-10 pt-8">
        <Pressable className="flex size-[100px] items-center justify-center rounded-full bg-white">
          <FontAwesome5 name="crown" size={50} color="#866EFF" />
        </Pressable>
        <Text className="mt-4 font-[quilka] text-2xl text-white">
          You Have Unlocked Happiness
        </Text>
        <Text className="mt-2 font-[abeezee] text-sm text-white">
          You are now subscribed to Storytime for Kids
        </Text>
      </View>
      <SubscriptionDetails />
    </ScrollView>
  );
};

export default SubscribedUserComponent;
