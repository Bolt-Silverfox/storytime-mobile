import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
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
          <View className="flex size-[100px] items-center justify-center rounded-full border-2 border-[#866EFF] bg-white">
            <FontAwesome5 name="crown" size={50} color="#866EFF" />
          </View>
          <View className="flex flex-col gap-y-2">
            <Text className="text-center font-[quilka] text-2xl text-black">
              Unlock Magical Adventure
            </Text>
            <Text className="text-center font-[abeezee] text-sm text-text">
              Select a plan that best suits you
            </Text>
          </View>
        </View>
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

        <View
          aria-labelledby="subscription plans"
          className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4 border-y border-y-border-light pb-6 pt-10"
        >
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
        <Text className="-mt-5 font-[abeezee] text-base text-black">
          Your child won't just listen, they'll have an unlimited learning
          experience, with the voice type you choose for them.
        </Text>

        <View
          aria-labelledby="subscription disclaimer"
          className="mx-auto flex w-full max-w-screen-md flex-row gap-x-4 rounded-2xl bg-yellow px-4 py-5"
        >
          <Image
            className="size-6"
            source={require("../../assets/icons/caution.png")}
          />
          <Text className="flex-1 text-wrap font-[abeezee] text-xs">
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
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "Subscription functionality will be available soon."
              );
            }}
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
