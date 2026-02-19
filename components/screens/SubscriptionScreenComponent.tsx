import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { SUBSCRIPTION_STATUS, USER_ROLES } from "../../constants/ui";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import SubscribedUserComponent from "./SubscribedUserComponent";
import UnsubscribedUserComponent from "./UnsubscribedUserComponent";

type PropTypes = {
  goBack: () => void;
};

const SubscriptionScreenComponent = ({ goBack }: PropTypes) => {
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.subscriptionStatus === SUBSCRIPTION_STATUS.active ||
    data?.role === USER_ROLES.admin;

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

        {isSubscribed ? (
          <SubscribedUserComponent />
        ) : (
          <UnsubscribedUserComponent />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default SubscriptionScreenComponent;
