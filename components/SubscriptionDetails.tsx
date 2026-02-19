import { View, Text, ActivityIndicator, Linking, Platform } from "react-native";
import CustomButton from "./UI/CustomButton";
import { useQuery } from "@tanstack/react-query";
import querySubscription from "../hooks/tanstack/queryHooks/querySubscriptionStatus";
import useAuth from "../contexts/AuthContext";
import ErrorComponent from "./ErrorComponent";
import { BUNDLE_IDENTIFIER } from "../constants";

const SubscriptionDetails = () => {
  const { user } = useAuth();
  const { isPending, data, error, refetch } = useQuery(
    querySubscription(user?.id)
  );

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (isPending)
    return (
      <View className="flex flex-1">
        <ActivityIndicator size={"large"} />
      </View>
    );

  const openURL = () => {
    if (Platform.OS === "ios") {
      return Linking.openURL("https://apps.apple.com/account/subscriptions");
    }
    Linking.openURL(
      `https://play.google.com/store/account/subscriptions?package=${BUNDLE_IDENTIFIER}`
    );
  };

  return (
    <View>
      <View className="mx-auto -mb-5 h-10 w-[90%] rounded-t-[32px] bg-white/60" />
      <View className="flex flex-col gap-y-10 rounded-t-[32px] bg-white px-4 py-5">
        <View className="flex flex-col gap-y-4">
          <Text className="font-[abeezee] text-base text-black">Your plan</Text>
          <View className="flex h-[114px] flex-row items-center justify-between gap-x-3 rounded-[20px] border border-border-light px-6">
            <Text className="font-[abeezee] text-base capitalize text-text">
              {data.plan} plan
            </Text>
            <Text className="font-[quilka] text-[50px] text-[#333333]">
              {data.currency}
              {data.price}
            </Text>
          </View>
        </View>

        <View className="flex flex-col gap-y-8">
          <View>
            <Text className="font-[abeezee] text-base text-black">
              Your plan will automatically renew on{" "}
              {new Date(data.endsAt).toLocaleDateString()}.
            </Text>
            <Text className="font-[abeezee] text-base text-black">
              You'll be charged {data.currency}
              {data.price}/{data.plan}.
            </Text>
          </View>
          <CustomButton
            disabled={isPending}
            transparent
            text={"Cancel Subscription"}
            onPress={openURL}
          />
        </View>
      </View>
    </View>
  );
};

export default SubscriptionDetails;
