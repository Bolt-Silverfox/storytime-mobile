import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import {
  useRedeemCoupon,
  useValidateCoupon,
} from "../../../hooks/tanstack/mutationHooks/useCoupon";

const RedeemCouponScreen = () => {
  const navigation = useNavigation();
  const [couponCode, setCouponCode] = useState("");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    freeDays?: number;
    message: string;
  } | null>(null);
  const [redeemResult, setRedeemResult] = useState<{
    premiumAccessUntil: string;
    freeDays: number;
    message: string;
  } | null>(null);

  const validateMutation = useValidateCoupon();
  const redeemMutation = useRedeemCoupon();

  const handleValidate = () => {
    if (!couponCode.trim()) return;
    setValidationResult(null);
    validateMutation.mutate(couponCode.trim(), {
      onSuccess: (data) => setValidationResult(data),
      onError: (err) =>
        setValidationResult({ valid: false, message: err.message }),
    });
  };

  const handleRedeem = () => {
    if (!couponCode.trim()) return;
    redeemMutation.mutate(couponCode.trim(), {
      onSuccess: (result) => {
        setRedeemResult(result);
        setCouponCode("");
        setValidationResult(null);
      },
      onError: (err) =>
        setValidationResult({ valid: false, message: err.message }),
    });
  };

  return (
    <SafeAreaWrapper variant="solid">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="mb-8 flex-row items-center gap-x-3">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <Text className="font-[quilka] text-2xl text-black">
            Redeem Coupon
          </Text>
        </View>

        {redeemResult ? (
          /* Success state */
          <View className="flex-1 items-center justify-center gap-y-6 py-10">
            <View className="size-20 items-center justify-center rounded-full bg-green-100">
              <Feather name="check-circle" size={40} color="#16a34a" />
            </View>
            <Text className="text-center font-[quilka] text-2xl text-green-700">
              Premium Unlocked!
            </Text>
            <Text className="text-center font-[abeezee] text-base text-gray-600">
              {redeemResult.message}
            </Text>
            <View className="w-full rounded-2xl bg-green-50 px-4 py-4">
              <Text className="text-center font-[abeezee] text-sm text-green-700">
                Premium access until:{" "}
                {new Date(redeemResult.premiumAccessUntil).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mt-4 w-full rounded-full bg-primary py-4"
              activeOpacity={0.8}
            >
              <Text className="text-center font-[abeezee] text-base text-white">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Input state */
          <View className="flex-col gap-y-6">
            <Text className="font-[abeezee] text-base text-gray-600">
              Enter your coupon code below to unlock free premium access.
            </Text>

            {/* Code input */}
            <View className="flex-col gap-y-3">
              <Text className="font-[abeezee] text-sm font-medium text-gray-500">
                Coupon Code
              </Text>
              <TextInput
                value={couponCode}
                onChangeText={(t) => {
                  setCouponCode(t.toUpperCase());
                  setValidationResult(null);
                }}
                placeholder="e.g. SUMMER25"
                autoCapitalize="characters"
                autoCorrect={false}
                className="rounded-2xl border border-border-light bg-white px-4 py-3 font-[abeezee] text-base tracking-widest"
              />
            </View>

            {/* Validation result */}
            {validationResult && (
              <View
                className={`rounded-2xl px-4 py-3 ${
                  validationResult.valid ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <Text
                  className={`font-[abeezee] text-sm ${
                    validationResult.valid ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {validationResult.message}
                </Text>
              </View>
            )}

            {/* Check button */}
            {!validationResult?.valid && (
              <TouchableOpacity
                onPress={handleValidate}
                disabled={
                  !couponCode.trim() || validateMutation.isPending
                }
                className="w-full rounded-full bg-gray-100 py-4"
                activeOpacity={0.8}
              >
                {validateMutation.isPending ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <Text className="text-center font-[abeezee] text-base text-gray-700">
                    Check Code
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {/* Redeem button — shown only once validated */}
            {validationResult?.valid && (
              <TouchableOpacity
                onPress={handleRedeem}
                disabled={redeemMutation.isPending}
                className="w-full rounded-full bg-primary py-4"
                activeOpacity={0.8}
              >
                {redeemMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-center font-[abeezee] text-base text-white">
                    Redeem {validationResult.freeDays ?? 0} Day
                    {(validationResult.freeDays ?? 0) === 1 ? "" : "s"} Free
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default RedeemCouponScreen;
