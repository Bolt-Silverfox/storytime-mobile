import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { subscriptionBenefits, subscriptionOptions } from "../../data";
import CustomButton from "../UI/CustomButton";

type PropTypes = {
  goBack: () => void;
};
const SubscriptionScreen = ({ goBack }: PropTypes) => {
  const [selectedPlan, setSelectedPlan] = useState<"Monthly" | "Yearly" | null>(
    null
  );

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#866EFF" }}>
    // {/* <StatusBar style="light" backgroundColor="#866EFF" /> */}
    <View className="flex flex-1  bg-[#866EFF]">
      <View className="flex flex-row px-4 pb-3 pt-5">
        <Pressable onPress={goBack}>
          <Feather name="chevron-left" size={24} color="white" />
        </Pressable>
        <Text className="flex-1 text-center font-[abeezee] text-[18px] text-white">
          Subscription
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex flex-col gap-y-8"
      >
        <View className="flex flex-col items-center justify-center">
          <Pressable className="flex size-[100px] items-center justify-center rounded-full bg-white">
            <FontAwesome5 name="crown" size={50} color="#866EFF" />
          </Pressable>
          <Text className="mt-4 font-[quilka] text-2xl text-white">
            Unlock Magical Adventures
          </Text>
          <Text className="font-[abeezee] text-sm text-white">
            Select a plan that best suits you
          </Text>
        </View>

        <View className="flex flex-1 flex-col gap-y-10 rounded-t-[32px] bg-white px-4 py-5">
          <View className="mx-auto flex w-full max-w-screen-md flex-row gap-x-2">
            {subscriptionOptions.map((subscription) => {
              const isSelected = selectedPlan === subscription.name;

              return (
                <Pressable
                  key={subscription.name}
                  onPress={() => setSelectedPlan(subscription.name)}
                  className={`  flex flex-1 flex-col items-center justify-center rounded-[20px] py-10 ${isSelected ? "border-2 border-purple" : "border border-border-light"}`}
                >
                  <View
                    className={`
                    flex h-6 w-6 items-center 
                    justify-center rounded-full border-2
                    ${isSelected ? "border-blue" : "border-gray-300"}
                  `}
                  >
                    {isSelected && (
                      <View className="h-3 w-3 rounded-full bg-blue" />
                    )}
                  </View>
                  <Text className="mb-1 mt-4 font-[quilka] text-2xl text-black">
                    $ {subscription.price}
                  </Text>
                  <Text className="font-[abeezee] text-[18px] leading-6 text-black">
                    {subscription.name} Plan
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4">
            <Text className="font-[quilka] text-[18px] text-black ">
              What you'll enjoy
            </Text>
            <View className="flex flex-col gap-y-5">
              {subscriptionBenefits.map((benefit) => (
                <View
                  key={benefit}
                  className="flex flex-row items-center gap-x-1.5"
                >
                  <Image
                    source={require("../../assets/icons/tick.png")}
                    className="h-[14px] w-[17px]"
                  />
                  <Text className="font-[abeezee] text-base">{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mx-auto flex w-full max-w-screen-md flex-row gap-x-4 rounded-2xl bg-yellow px-4 py-5">
            <Image
              className="size-6"
              source={require("../../assets/icons/caution.png")}
            />
            <Text className="flex-1 text-wrap font-[abeezee] text-xs">
              Your plan will automatically renew unless you cancel your
              subscription.
            </Text>
          </View>
          <CustomButton
            text="Subscribe"
            onPress={() => {}}
            disabled={!selectedPlan}
          />
        </View>
      </ScrollView>
    </View>
    // </SafeAreaView>
  );
};

export default SubscriptionScreen;
