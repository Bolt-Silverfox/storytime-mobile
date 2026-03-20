import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { subscriptionBenefits } from "../../data";
import useUnauthSubscribeIAP from "../../hooks/others/useUnauthSubscribeIAP";
import { SubscriptionPlan } from "../../types";
import SubscriptionOptions from "../../components/SubscriptionOptions";
import CustomButton from "../../components/UI/CustomButton";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import Icon from "../../components/Icon";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";

const UnauthPaywallScreen = () => {
  const navigation = useNavigation<RootNavigatorProp>();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const { isLoading, errorMessage, subscriptions, handlePurchase, getPlanName } =
    useUnauthSubscribeIAP(selectedPlan, () => setPurchaseComplete(true));

  if (purchaseComplete) {
    return (
      <SafeAreaWrapper variant="solid">
        <View className="flex-1 items-center justify-center bg-white px-6">
          <View className="mb-6 size-20 items-center justify-center rounded-full bg-green-100">
            <FontAwesome5 name="check" size={36} color="#16a34a" />
          </View>
          <Text className="mb-2 text-center font-[quilka] text-2xl text-black">
            Purchase Successful!
          </Text>
          <Text className="mb-8 text-center font-[abeezee] text-base text-text">
            Create an account to access your subscription across all your
            devices.
          </Text>
          <View className="w-full gap-4">
            <CustomButton
              text="Create Account"
              onPress={() =>
                navigation.navigate("auth", { screen: "signUp" })
              }
            />
            <Pressable
              onPress={() => navigation.navigate("auth", { screen: "login" })}
              className="items-center rounded-full border border-border-light py-3"
            >
              <Text className="font-[abeezee] text-base text-black">
                Log In
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-primary">
        <View className="flex-row items-center px-4 pb-2 pt-4">
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icon name="ArrowLeft" size={24} color="white" />
          </Pressable>
        </View>
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
                <Text className="font-[quilka] text-[18px] text-black">
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
                      <Text className="font-[abeezee] text-base">
                        {benefit}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text className="-mt-5 font-[abeezee] text-base text-black">
                You won't just listen, you'll have an unlimited learning
                experience, with the voice type you choose.
              </Text>

              <View className="mx-auto flex w-full max-w-screen-md flex-row gap-x-4 rounded-2xl bg-yellow px-4 py-5 lg:max-w-screen-lg xl:max-w-screen-xl">
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

              <View className="flex-row items-center justify-center gap-x-4">
                <Pressable
                  onPress={() =>
                    navigation.navigate("auth", { screen: "termsOfService" })
                  }
                >
                  <Text className="font-[abeezee] text-xs text-primary underline">
                    Terms of Service
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate("auth", { screen: "privacyScreen" })
                  }
                >
                  <Text className="font-[abeezee] text-xs text-primary underline">
                    Privacy Policy
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate("auth", { screen: "login" })
                }
                className="items-center py-2"
              >
                <Text className="font-[abeezee] text-sm text-primary">
                  Restore Purchases
                </Text>
                <Text className="mt-1 font-[abeezee] text-xs text-text">
                  Log in to restore an existing subscription
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { gap: 32 },
});

export default UnauthPaywallScreen;
