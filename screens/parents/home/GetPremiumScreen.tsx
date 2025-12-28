import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../../../components/Icon";
import CustomButton from "../../../components/UI/CustomButton";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const GetPremiumScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();
  const [selectedPlan, setSelectedPlan] = useState<"Monthly" | "Yearly" | null>(
    null
  );

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#866EFF" }}>
    // {/* <StatusBar style="light" backgroundColor="#866EFF" /> */}
    <View className="flex flex-1  bg-[#866EFF]">
      <View className="flex flex-row pt-5 pb-3 px-4">
        <Pressable onPress={() => navigator.goBack()}>
          <Icon name="ChevronLeft" color="white" />
        </Pressable>
        <Text className="text-center flex-1 text-[18px] text-white font-[abeezee]">
          Subscription
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex flex-col gap-y-8"
      >
        <View className="flex flex-col justify-center items-center">
          <Pressable className="bg-white size-[100px] rounded-full flex justify-center items-center">
            <Icon name="Crown" color="#866EFF" size={50} />
          </Pressable>
          <Text className="font-[quilka] text-2xl text-white mt-4">
            Unlock Magical Adventures
          </Text>
          <Text className="font-[abeezee] text-sm text-white">
            Select a plan that best suits you
          </Text>
        </View>

        <View className="rounded-t-[32px] flex flex-1 flex-col gap-y-10 bg-white py-5 px-4">
          <View className="flex flex-row gap-x-2 max-w-screen-md mx-auto w-full">
            {subscriptionOptions.map((subscription) => {
              const isSelected = selectedPlan === subscription.name;

              return (
                <Pressable
                  key={subscription.name}
                  onPress={() => setSelectedPlan(subscription.name)}
                  className={`  flex-1 rounded-[20px] py-10 justify-center items-center flex flex-col ${isSelected ? "border-purple border-2" : "border-border-light border"}`}
                >
                  <View
                    className={`
                    w-6 h-6 rounded-full border-2 
                    flex items-center justify-center
                    ${isSelected ? "border-blue" : "border-gray-300"}
                  `}
                  >
                    {isSelected && (
                      <View className="w-3 h-3 rounded-full bg-blue" />
                    )}
                  </View>
                  <Text className="font-[quilka] text-2xl text-black mt-4 mb-1">
                    $ {subscription.price}
                  </Text>
                  <Text className="font-[abeezee] text-[18px] leading-6 text-black">
                    {subscription.name} Plan
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="flex flex-col gap-y-4 max-w-screen-md mx-auto w-full">
            <Text className="font-[quilka] text-[18px] text-black ">
              What you'll enjoy
            </Text>
            <View className="flex flex-col gap-y-5">
              {benefits.map((benefit) => (
                <View
                  key={benefit}
                  className="flex flex-row gap-x-1.5 items-center"
                >
                  <Image
                    source={require("../../../assets/icons/tick.png")}
                    className="h-[14px] w-[17px]"
                  />
                  <Text className="font-[abeezee] text-base">{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="flex flex-row px-4 py-5 max-w-screen-md mx-auto w-full gap-x-4 bg-yellow rounded-2xl">
            <Image
              className="size-6"
              source={require("../../../assets/icons/caution.png")}
            />
            <Text className="font-[abeezee] text-xs flex-1 text-wrap">
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

export default GetPremiumScreen;

const subscriptionOptions: { name: "Monthly" | "Yearly"; price: number }[] = [
  {
    name: "Monthly",
    price: 4.99,
  },
  {
    name: "Yearly",
    price: 47.99,
  },
];

const benefits = [
  "Unlock full story library",
  "Create unlimited child profiles",
  "Encourage consistent reading habits",
  "Perfect for bedtime & independent reading",
  "Watch your child grow with every adventure",
];
