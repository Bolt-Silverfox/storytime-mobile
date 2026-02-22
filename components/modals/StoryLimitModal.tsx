import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
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
  mode?: "blocking" | "reminder";
  onClose?: () => void;
};

const StoryLimitModal = ({
  visible,
  storyId,
  quota,
  mode = "blocking",
  onClose,
}: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null);

  const isDismissible = mode === "reminder";

  const handleCancel = () => {
    if (isDismissible && onClose) {
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
    isUserCancelled,
    subscriptions,
    handlePurchase,
    getPlanName,
  } = useSubscribeIAP(selectedPlan, handleSubscribed);

  const used = quota?.used ?? 0;
  const totalAllowed = quota?.totalAllowed ?? 0;

  const title = quota
    ? `${used}/${totalAllowed} Free Stories Read`
    : "Free Stories Read";

  const subtitle = !isDismissible
    ? `That was the last of your ${totalAllowed} free stories. With the Freemium plan, you'll receive 1 free story every week. Upgrade now for full access to our entire story library.`
    : `As a freemium user, you are entitled to ${totalAllowed} free stories overall and 1 free story weekly.`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <Pressable
        onPress={isDismissible ? handleCancel : undefined}
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
                  color: isUserCancelled ? "#616161" : "#B71C1C",
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
                disabled={!selectedPlan || isLoading}
                style={{
                  backgroundColor:
                    selectedPlan && !isLoading ? "#FF8771" : "#FFB8AD",
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
