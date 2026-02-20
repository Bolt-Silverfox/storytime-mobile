import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { subscriptionBenefits, subscriptionOptions } from "../../data";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import CustomModal, { CustomModalProps } from "../modals/CustomModal";
import CustomButton from "./CustomButton";

type PropTypes = Pick<CustomModalProps, "isOpen" | "onClose" | "maxHeight"> & {
  used: number | undefined;
  totalAllowed: number | undefined;
};

const StoryLimitModal = ({
  isOpen,
  onClose,
  maxHeight,
  used,
  totalAllowed,
}: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<"Monthly" | "Yearly" | null>(
    null
  );

  return (
    <CustomModal maxHeight={maxHeight} isOpen={isOpen} onClose={onClose}>
      {used !== undefined ? (
        <ScrollView
          contentContainerClassName="flex flex-col gap-y-10 bg-white"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="flex flex-col items-center gap-y-6 border-b border-b-border-light pb-6"
            aria-label="Subscription modal header"
          >
            <View className="flex size-[100px] items-center justify-center rounded-full border-2 border-[#EC4007] bg-white">
              <Ionicons name="trophy" size={50} color="#EC4007" />
            </View>
            <View className="flex flex-col gap-y-2">
              <Text className="text-center font-[quilka] text-2xl text-black">
                {used}/{totalAllowed} Free Stories Read
              </Text>
              <Text className="text-center font-[abeezee] text-sm text-text">
                {used < 10
                  ? "As a fremium user, you are entitled to 10 free stories overall and 1 free story weekly."
                  : "That was the last of your free stories. With the Freemium plan, you’ll receive 1 free story every week. Upgrade now for full access to our entire story library."}
              </Text>
            </View>
          </View>

          <View
            aria-label="subscription plans"
            className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4"
          >
            <Text className="font-[quilka] text-[18px] text-black ">
              What you'll enjoy as a premium user
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
          <View className="border-y border-y-border-light py-4">
            <Text className="font-[abeezee] text-base text-black">
              Your child won't just listen, they'll have an unlimited learning
              experience, with the voice type you choose for them.
            </Text>
          </View>
          <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-2">
            {subscriptionOptions.map((subscription) => {
              const isSelected = selectedPlan === subscription.name;

              return (
                <Pressable
                  key={subscription.name}
                  onPress={() => setSelectedPlan(subscription.name)}
                  className={`  flex flex-1 flex-row rounded-[20px] p-6 ${isSelected ? "border-2 border-primary" : "border border-border-light"}`}
                >
                  <View className="flex flex-1 flex-row items-center gap-x-3">
                    <View
                      className={`
                      flex h-6 w-6 items-center justify-center rounded-full border-2
                      ${isSelected ? "border-primary" : "border-gray-300"}
                      `}
                    >
                      {isSelected && (
                        <View className="h-3 w-3 rounded-full bg-primary" />
                      )}
                    </View>
                    <Text className="font-[quilka] text-2xl text-black">
                      $ {subscription.price}
                    </Text>
                  </View>
                  <Text className="font-[abeezee] text-[18px] leading-6 text-black">
                    {subscription.name} Plan
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            aria-labelledby="subscription modal call to action buttons"
            className="flex flex-col items-center gap-y-3"
          >
            <CustomButton
              ariaLabel="Subscribe button"
              text="Subscribe"
              onPress={() => {
                navigator.navigate("getPremium", { selected: selectedPlan });
                onClose();
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
      ) : (
        <ActivityIndicator size={"large"} />
      )}
    </CustomModal>
  );
};

export default StoryLimitModal;
