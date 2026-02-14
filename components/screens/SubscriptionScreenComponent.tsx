import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { subscriptionBenefits } from "../../data";
import CustomButton from "../UI/CustomButton";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import LoadingOverlay from "../LoadingOverlay";
import { SubscriptionPlan } from "../../types";
import useSubscribeIAP from "../../hooks/others/useSubscribeIAP";
import SubscriptionOptions from "../SubscriptionOptions";
import { Pressable, Text, View } from "react-native";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import SubscribedUserComponent from "./SubscribedUserComponent";
import UnsubscribedUserComponent from "./UnsubscribedUserComponent";

type PropTypes = {
  goBack: () => void;
};

const SubscriptionScreenComponent = ({ goBack }: PropTypes) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null);
  const {
    isLoading,
    errorMessage,
    subscriptions,
    handlePurchase,
    getPlanName,
  } = useSubscribeIAP(selectedPlan);
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.subscriptionStatus === "active" || data?.role === "admin";

  return (
    <SafeAreaWrapper variant="solid" backgroundColor="#866EFF">
      <View className="flex flex-1 flex-col gap-y-3  bg-[#866EFF]">
        <View className="flex flex-row px-4  py-4">
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
            {errorMessage && (
              <Text className="text-center font-[abeezee] text-xl text-red-700">
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

            <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4 border-y border-y-border-light pb-6 pt-10">
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
              disabled={!selectedPlan}
              onPress={handlePurchase}
            />
          </View>
        </ScrollView>
        {isSubscribed ? (
          <SubscribedUserComponent />
        ) : (
          <UnsubscribedUserComponent />
        )}
      </View>
      <LoadingOverlay visible={isLoading} />
    </SafeAreaWrapper>
  );
};

export default SubscriptionScreenComponent;
