import { ProductSubscription } from "expo-iap";
import { Dispatch, SetStateAction } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SubscriptionPlan } from "../types";

type Props = {
  selectedPlan: SubscriptionPlan;
  setSelectedPlan: Dispatch<SetStateAction<SubscriptionPlan>>;
  subscriptions: ProductSubscription[];
  isLoading: boolean;
  getPlanName: (id: string) => "Monthly" | "Yearly";
};

const SubscriptionOptions = ({
  selectedPlan,
  setSelectedPlan,
  subscriptions,
  getPlanName,
  isLoading,
}: Props) => {
  if (isLoading) return <ActivityIndicator size={"large"} />;

  if (subscriptions.length === 0) {
    return (
      <Text className="text-center font-[abeezee] text-base text-text">
        No subscription plans available. Please try again later.
      </Text>
    );
  }

  return (
    <View className="mx-auto flex w-full max-w-screen-md flex-row gap-x-2">
      {subscriptions.map((sub) => {
        const planName = getPlanName(sub.id);
        const isSelected = selectedPlan === planName;

        return (
          <Pressable
            key={sub.id}
            onPress={() => setSelectedPlan(planName)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`${planName} plan, ${sub.displayPrice}`}
            className={`flex flex-1 flex-col items-center justify-center rounded-[20px] py-10 ${isSelected ? "border-2 border-purple bg-purple/10" : "border border-border-light"}`}
          >
            <View
              className={`flex size-6 items-center justify-center rounded-full border-2 ${isSelected ? "border-purple bg-purple" : "border-gray-300"}`}
            >
              {isSelected && (
                <View className="size-2.5 rounded-full bg-white" />
              )}
            </View>
            <Text
              className={`mb-1 mt-4 font-[quilka] text-2xl ${isSelected ? "text-purple" : "text-black"}`}
            >
              {sub.displayPrice}
            </Text>
            <Text
              className={`font-[abeezee] text-[18px] leading-6 ${isSelected ? "text-purple" : "text-black"}`}
            >
              {planName} Plan
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SubscriptionOptions;
