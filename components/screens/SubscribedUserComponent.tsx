import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../UI/CustomButton";

const SubscribedUserComponent = () => {
  const onCancelSubscription = () => {};
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="flex flex-grow flex-col gap-y-8"
    >
      <View className="flex flex-1 flex-col items-center justify-end pb-10">
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
      <View>
        <View className="mx-auto -mb-5 h-10 w-[90%] rounded-t-[32px] bg-white/60" />
        <View className="flex flex-col gap-y-10 rounded-t-[32px] bg-white px-4 py-5">
          <View className="flex flex-col gap-y-4">
            <Text className="ont-[abeezee] text-base text-black">
              Your plan
            </Text>
            <View className="flex h-[114px] flex-row items-center justify-between gap-x-3 rounded-[20px] border border-border-light px-6">
              <Text className="font-[abeezee] text-base text-text">
                Monghly Plan
              </Text>
              <Text className="font-[quilka] text-[50px] text-[#333333]">
                $2.99
              </Text>
            </View>
          </View>

          <View className="flex flex-col gap-y-8">
            <View>
              <Text className="font-[abeezee] text-base text-black">
                Your plan will automatically renew unless on 14/12/2026.
              </Text>
              <Text className="font-[abeezee] text-base text-black">
                You'll be charged $2.99/Month.
              </Text>
            </View>
            <CustomButton
              transparent
              text="Cancel Subscription"
              onPress={onCancelSubscription}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SubscribedUserComponent;
