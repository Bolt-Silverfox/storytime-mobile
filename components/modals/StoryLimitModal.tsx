import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Modal, Text, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import { StoryQuota } from "../../types";
import SubscriptionModal from "./SubscriptionModal";
import CustomButton from "../UI/CustomButton";

type PropTypes = {
  visible: boolean;
  storyId: string;
  quota?: StoryQuota;
};

const StoryLimitModal = ({ visible, storyId, quota }: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const queryClient = useQueryClient();
  const [showSubscription, setShowSubscription] = useState(false);

  const handleGoHome = () => {
    navigator.reset({ index: 0, routes: [{ name: "parents" }] });
  };

  const handleSubscribed = () => {
    setShowSubscription(false);
    queryClient.invalidateQueries({ queryKey: ["story", storyId] });
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleGoHome}
      >
        <View className="flex flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white px-6 py-10">
            <View className="flex flex-col items-center gap-y-6">
              <View className="flex size-[100px] items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                <FontAwesome5 name="book-reader" size={44} color="#F4845F" />
              </View>
              <View className="flex flex-col gap-y-2">
                <Text className="text-center font-[quilka] text-2xl text-black">
                  {quota
                    ? `You've read all ${quota.limit} free stories!`
                    : "You've read all your free stories!"}
                </Text>
                <Text className="text-center font-[abeezee] text-sm text-text">
                  Subscribe for unlimited access to all stories and features.
                </Text>
              </View>
              <View className="flex w-full flex-col gap-y-3">
                <CustomButton
                  ariaLabel="Subscribe for unlimited stories"
                  text="Subscribe"
                  disabled={showSubscription}
                  onPress={() => {
                    setShowSubscription(true);
                  }}
                />
                <CustomButton
                  ariaLabel="Go back to home"
                  text="Go Back"
                  onPress={handleGoHome}
                  transparent
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onSubscribed={handleSubscribed}
      />
    </>
  );
};

export default StoryLimitModal;
