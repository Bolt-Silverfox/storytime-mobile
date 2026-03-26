import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { subscriptionBenefits } from "../../data";
import useSubscribeIAP from "../../hooks/others/useSubscribeIAP";
import useRestorePurchases from "../../hooks/others/useRestorePurchases";
import {
  useRedeemCoupon,
  useValidateCoupon,
} from "../../hooks/tanstack/mutationHooks/useCoupon";
import { SubscriptionPlan } from "../../types";
import SubscriptionOptions from "../SubscriptionOptions";
import CustomButton from "../UI/CustomButton";

const UnsubscribedUserComponent = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null);
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    valid: boolean;
  } | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const {
    isLoading,
    errorMessage,
    subscriptions,
    handlePurchase,
    getPlanName,
  } = useSubscribeIAP(selectedPlan);

  const {
    handleRestore,
    isRestoring,
    error: restoreError,
    restoredCount,
  } = useRestorePurchases();

  const validateMutation = useValidateCoupon();
  const redeemMutation = useRedeemCoupon();

  const handleValidate = () => {
    if (!couponCode.trim()) return;
    setCouponMessage(null);
    validateMutation.mutate(couponCode.trim(), {
      onSuccess: (data) => {
        setCouponMessage({ text: data.message, valid: data.valid });
      },
      onError: (err) => {
        setCouponMessage({ text: err.message, valid: false });
      },
    });
  };

  const handleRedeem = () => {
    if (!couponCode.trim()) return;
    redeemMutation.mutate(couponCode.trim(), {
      onSuccess: (result) => {
        setRedeemSuccess(result.message);
        setCouponCode("");
        setCouponMessage(null);
      },
      onError: (err) => {
        setCouponMessage({ text: err.message, valid: false });
      },
    });
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
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
      <View>
        <View className="mx-auto -mb-5 h-10 w-[90%] rounded-t-[32px] bg-white/60" />
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

          <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4 border-y border-y-border-light pb-6 pt-10 lg:max-w-screen-lg xl:max-w-screen-xl">
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
            You won't just listen, you'll have an unlimited learning
            experience, with the voice type you choose.
          </Text>

          <View className="mx-auto flex w-full max-w-screen-md gap-y-2 rounded-2xl bg-yellow px-4 py-5 lg:max-w-screen-lg xl:max-w-screen-xl">
            <View className="flex-row gap-x-4">
              <Image
                className="size-6"
                source={require("../../assets/icons/caution.png")}
              />
              <Text className="flex-1 text-wrap font-[abeezee] text-xs">
                Subscription automatically renews unless canceled at least 24
                hours before the end of the current period.
              </Text>
            </View>
            <Text className="font-[abeezee] text-[10px] leading-4 text-text">
              {Platform.OS === "ios"
                ? "Payment will be charged to your Apple ID account at confirmation of purchase. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your Account Settings on the App Store after purchase."
                : "Payment will be charged to your Google Play account at confirmation of purchase. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions in Google Play Store subscription settings."}
            </Text>
          </View>
          {/* Coupon Redemption */}
          {redeemSuccess ? (
            <View className="rounded-2xl bg-green-50 px-4 py-4">
              <Text className="text-center font-[abeezee] text-sm text-green-700">
                {redeemSuccess}
              </Text>
            </View>
          ) : (
            <View className="rounded-2xl border border-border-light px-4 py-3">
              <TouchableOpacity
                onPress={() => setCouponExpanded((v) => !v)}
                className="flex-row items-center justify-between"
                activeOpacity={0.7}
              >
                <Text className="font-[abeezee] text-sm text-gray-600">
                  Have a coupon code?
                </Text>
                <Text className="font-[abeezee] text-sm text-primary">
                  {couponExpanded ? "Hide ▲" : "Show ▼"}
                </Text>
              </TouchableOpacity>

              {couponExpanded && (
                <View className="mt-3 flex-col gap-y-2">
                  <View className="flex-row items-center gap-x-2">
                    <TextInput
                      value={couponCode}
                      onChangeText={(t) => {
                        setCouponCode(t.toUpperCase());
                        setCouponMessage(null);
                      }}
                      placeholder="Enter coupon code"
                      autoCapitalize="characters"
                      autoCorrect={false}
                      className="flex-1 rounded-xl border border-border-light px-3 py-2 font-[abeezee] text-sm"
                    />
                    <TouchableOpacity
                      onPress={handleValidate}
                      disabled={
                        !couponCode.trim() ||
                        validateMutation.isPending ||
                        redeemMutation.isPending
                      }
                      className="rounded-xl bg-gray-100 px-3 py-2"
                      activeOpacity={0.7}
                    >
                      {validateMutation.isPending ? (
                        <ActivityIndicator size="small" color="#666" />
                      ) : (
                        <Text className="font-[abeezee] text-sm text-gray-700">
                          Check
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  {couponMessage && (
                    <Text
                      className={`font-[abeezee] text-xs ${
                        couponMessage.valid ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {couponMessage.text}
                    </Text>
                  )}

                  {couponMessage?.valid && (
                    <CustomButton
                      text={redeemMutation.isPending ? "Redeeming…" : "Redeem"}
                      disabled={
                        redeemMutation.isPending || validateMutation.isPending
                      }
                      onPress={handleRedeem}
                    />
                  )}
                </View>
              )}
            </View>
          )}

          <CustomButton
            text="Subscribe"
            disabled={!selectedPlan}
            onPress={handlePurchase}
          />

          <TouchableOpacity
            onPress={handleRestore}
            disabled={isRestoring}
            activeOpacity={0.7}
            className="items-center py-2"
            accessibilityLabel="Restore Purchases"
            accessibilityRole="button"
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color="#866EFF" />
            ) : (
              <Text className="font-[abeezee] text-sm text-primary">
                Restore Purchases
              </Text>
            )}
          </TouchableOpacity>
          {restoredCount > 0 ? (
            <Text className="text-center font-[abeezee] text-sm text-green-600">
              Subscription restored successfully!
            </Text>
          ) : restoreError ? (
            <Text className="text-center font-[abeezee] text-sm text-red-500">
              {restoreError}
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { gap: 32 },
});

export default UnsubscribedUserComponent;
