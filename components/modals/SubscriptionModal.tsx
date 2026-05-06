import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { subscriptionBenefits } from "../../data";
import useSubscribeIAP from "../../hooks/others/useSubscribeIAP";
import { SubscriptionPlan } from "../../types";
import SubscriptionOptions from "../SubscriptionOptions";
import CustomButton from "../UI/CustomButton";
import CustomModal, { CustomModalProps } from "./CustomModal";
import ParentalGateModal from "./ParentalGateModal";
import useParentalGate from "../../hooks/others/useParentalGate";

type PropTypes = Pick<CustomModalProps, "isOpen" | "onClose"> & {
  onSubscribed?: () => void;
};

const SubscriptionModal = ({ isOpen, onClose, onSubscribed }: PropTypes) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null);
  const gate = useParentalGate();
  const {
    isLoading,
    errorMessage,
    isUserCancelled,
    subscriptions,
    handlePurchase,
    getPlanName,
  } = useSubscribeIAP(selectedPlan, onSubscribed);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <ScrollView
        contentContainerClassName="flex-col gap-y-10 bg-white"
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

        {errorMessage && (
          <Text
            className={`text-center font-[abeezee] text-xl ${isUserCancelled ? "text-[#616161]" : "text-red-700"}`}
          >
            {errorMessage}
          </Text>
        )}
        <SubscriptionOptions
          isLoading={isLoading}
          getPlanName={getPlanName}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          subscriptions={subscriptions}
        />

        <View
          aria-labelledby="subscription plans"
          className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4 border-y border-y-border-light pb-6 pt-10 lg:max-w-screen-lg xl:max-w-screen-xl"
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
          You won't just listen, you'll have an unlimited learning experience,
          with the voice type you choose.
        </Text>

        <View
          aria-labelledby="subscription disclaimer"
          className="mx-auto flex w-full max-w-screen-md flex-row gap-x-4 rounded-2xl bg-yellow px-4 py-5 lg:max-w-screen-lg xl:max-w-screen-xl"
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
            disabled={!selectedPlan}
            onPress={() => gate.guard(handlePurchase)}
          />
          <ParentalGateModal
            visible={gate.visible}
            onPass={gate.onPass}
            onCancel={gate.onCancel}
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
