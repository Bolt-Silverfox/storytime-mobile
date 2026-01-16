import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { subscriptionBenefits, subscriptionOptions } from "../../data";
import CustomButton from "../UI/CustomButton";
import CustomModal, { CustomModalProps } from "./CustomModal";

type PropTypes = Pick<CustomModalProps, "isOpen" | "onClose">;

const SubscriptionModal = ({ isOpen, onClose }: PropTypes) => {
  const [selectedPlan, setSelectedPlan] = useState<"Monthly" | "Yearly" | null>(
    null
  );

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <ScrollView
        contentContainerClassName="flex flex-col gap-y-10 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="flex flex-col items-center gap-y-6"
          aria-labelledby="Subscription modal header"
        >
          <View className="size-[100px] rounded-full border-2 border-[#866EFF] flex justify-center items-center bg-white">
            <FontAwesome5 name="crown" size={50} color="#866EFF" />
          </View>
          <View className="flex flex-col gap-y-2">
            <Text className="font-[quilka] text-center text-2xl text-black">
              Unlock Magical Adventure
            </Text>
            <Text className="font-[abeezee] text-text text-sm text-center">
              Select a plan that best suits you
            </Text>
          </View>
        </View>
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

        <View
          aria-labelledby="subscription plans"
          className="flex flex-col gap-y-4 max-w-screen-md mx-auto w-full"
        >
          <Text className="font-[quilka] text-[18px] text-black ">
            What you'll enjoy
          </Text>
          <View className="flex flex-col gap-y-5">
            {subscriptionBenefits.map((benefit) => (
              <View
                key={benefit}
                className="flex flex-row gap-x-1.5 items-center"
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

        <View
          aria-labelledby="subscription disclaimer"
          className="flex flex-row px-4 py-5 max-w-screen-md mx-auto w-full gap-x-4 bg-yellow rounded-2xl"
        >
          <Image
            className="size-6"
            source={require("../../assets/icons/caution.png")}
          />
          <Text className="font-[abeezee] text-xs flex-1 text-wrap">
            Your plan will automatically renew unless you cancel your
            subscription.
          </Text>
        </View>
        <View
          aria-labelledby="subscription modal call to action buttons"
          className="flex flex-col items-center gap-y-3"
        >
          <CustomButton
            ariaLabel="Subscribe button"
            text="Subscribe"
            onPress={() => {}}
            disabled={!selectedPlan}
          />
          <CustomButton
            ariaLabel="Cancel button"
            text="Cancel"
            onPress={onClose}
            transparent
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
};

export default SubscriptionModal;
