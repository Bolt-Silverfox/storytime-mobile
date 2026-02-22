import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import { QUERY_KEYS } from "../../constants";
import { subscriptionBenefits } from "../../data";
import useSubscribeIAP from "../../hooks/others/useSubscribeIAP";
import { StoryQuota, SubscriptionPlan } from "../../types";
import SubscriptionOptions from "../SubscriptionOptions";

type PropTypes = {
  visible: boolean;
  storyId: string;
  quota?: StoryQuota;
  onClose?: () => void;
};

const StoryLimitModal = ({ visible, storyId, quota, onClose }: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null);

  const isAtLimit = quota ? quota.remaining === 0 : false;
  const isHalfway = !isAtLimit;

  const handleCancel = () => {
    if (isHalfway && onClose) {
      onClose();
    } else {
      navigator.reset({ index: 0, routes: [{ name: "parents" }] });
    }
  };

  const handleSubscribed = () => {
    queryClient.invalidateQueries({ queryKey: ["story", storyId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_STORY_QUOTA] });
    onClose?.();
  };

  const {
    isLoading,
    errorMessage,
    subscriptions,
    handlePurchase,
    getPlanName,
  } = useSubscribeIAP(selectedPlan, handleSubscribed);

  const title = quota
    ? `${quota.used}/${quota.totalAllowed} Free Stories Read`
    : "Free Stories Read";

  const subtitle = isAtLimit
    ? "That was the last of your 10 free stories. With the Freemium plan, you'll receive 1 free story every week. Upgrade now for full access to our entire story library."
    : "As a freemium user, you are entitled to 10 free stories overall and 1 free story weekly.";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <Pressable
        onPress={isHalfway ? handleCancel : undefined}
        style={{
          flex: 1,
          backgroundColor: "rgba(33, 33, 33, 0.6)",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingHorizontal: 16,
            paddingTop: 32,
            paddingBottom: 32,
            maxHeight: "90%",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2.5,
                borderColor: "#F96B3C",
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="book-reader" size={44} color="#F4845F" />
            </View>

            {/* Title */}
            <Text
              style={{
                fontFamily: "quilka",
                fontSize: 24,
                fontWeight: "700",
                color: "#212121",
                textAlign: "center",
              }}
            >
              {title}
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontFamily: "abeezee",
                fontSize: 14,
                color: "#616161",
                textAlign: "center",
                paddingHorizontal: 8,
              }}
            >
              {subtitle}
            </Text>

            {/* Divider */}
            <View
              style={{
                height: 0.5,
                backgroundColor: "#E0E0E0",
                width: "100%",
              }}
            />

            {/* Benefits section */}
            <View style={{ width: "100%", gap: 16 }}>
              <Text
                style={{
                  fontFamily: "quilka",
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#212121",
                }}
              >
                What you'll enjoy as a premium user
              </Text>
              <View style={{ gap: 12 }}>
                {subscriptionBenefits.map((benefit) => (
                  <View
                    key={benefit}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Image
                      source={require("../../assets/icons/tick.png")}
                      style={{ width: 17, height: 14 }}
                    />
                    <Text
                      style={{
                        fontFamily: "abeezee",
                        fontSize: 16,
                        color: "#212121",
                        flex: 1,
                      }}
                    >
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Summary text */}
            <Text
              style={{
                fontFamily: "abeezee",
                fontSize: 16,
                color: "#212121",
              }}
            >
              Your child won't just listen, they'll have an unlimited learning
              experience, with the voice type you choose for them.
            </Text>

            {/* Divider */}
            <View
              style={{
                height: 0.5,
                backgroundColor: "#E0E0E0",
                width: "100%",
              }}
            />

            {/* Plan selection */}
            {errorMessage ? (
              <Text
                style={{
                  fontFamily: "abeezee",
                  fontSize: 14,
                  color: "#B71C1C",
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </Text>
            ) : null}

            <SubscriptionOptions
              isLoading={isLoading}
              getPlanName={getPlanName}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              subscriptions={subscriptions}
            />

            {/* Divider */}
            <View
              style={{
                height: 0.5,
                backgroundColor: "#E0E0E0",
                width: "100%",
              }}
            />

            {/* Buttons */}
            <View style={{ width: "100%", gap: 12 }}>
              <Pressable
                onPress={handlePurchase}
                disabled={!selectedPlan}
                style={{
                  backgroundColor: selectedPlan ? "#FF8771" : "#FFB8AD",
                  borderRadius: 99,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "abeezee",
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Subscribe to Premium
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCancel}
                style={{
                  borderWidth: 0.5,
                  borderColor: "#212121",
                  borderRadius: 99,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "abeezee",
                    fontSize: 16,
                    color: "#212121",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default StoryLimitModal;
