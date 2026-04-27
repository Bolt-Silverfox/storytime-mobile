import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import useIsPremium from "../../hooks/useIsPremium";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import SubscribedUserComponent from "./SubscribedUserComponent";
import UnsubscribedUserComponent from "./UnsubscribedUserComponent";

type PropTypes = {
  goBack: () => void;
};

const SubscriptionScreenComponent = ({ goBack }: PropTypes) => {
  const { isPremium: isSubscribed, isLoading, isError } = useIsPremium();

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

        {isLoading ? (
          <View className="flex flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : isError ? (
          <View className="flex flex-1 items-center justify-center px-6">
            <Text className="text-center font-[abeezee] text-base text-white">
              Unable to load subscription info. Please try again.
            </Text>
            <Pressable
              onPress={goBack}
              className="mt-4 rounded-lg bg-white/20 px-6 py-3"
            >
              <Text className="font-[abeezee] text-white">Go Back</Text>
            </Pressable>
          </View>
        ) : isSubscribed ? (
          <SubscribedUserComponent />
        ) : (
          <UnsubscribedUserComponent />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default SubscriptionScreenComponent;
