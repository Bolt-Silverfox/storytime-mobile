import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import PageTitle from "../../components/PageTitle";
import SuccessScreen from "../../components/UI/SuccessScreen";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import useBioMetrics from "../../hooks/useBiometrics";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";

const EnableBioMetrics = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { data } = useGetUserProfile();
  const { enableBiometrics } = useBioMetrics();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data?.enableBiometrics) {
      navigator.navigate("selection");
    }
  }, [data]);

  const onProceed = () => {
    navigator.navigate("selection");
  };

  if (success)
    return (
      <SuccessScreen
        message="Biometric setup successful"
        onProceed={() => navigator.navigate("selection")}
        secondaryMessage="You have successfully set up your biometric"
      />
    );

  return (
    <View className="flex flex-1 bg-bgLight">
      <PageTitle title="Enable biometrics" goBack={() => navigator.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 bg-bgLight"
        contentContainerClassName="min-h-full sm:mx-auto max-w-screen-sm"
      >
        <View className="mb-10 mt-8 flex items-center flex-col">
          <Text className="font-[quilka] text-center text-2xl">
            Enable biometrics for faster authentication?
          </Text>
          <View className="flex mb-10 mx-4 sm:mx-auto max-w-screen-sm flex-row justify-center gap-x-10">
            <Pressable
              onPress={onProceed}
              className=" py-3 px-16  flex-1 rounded-full border-black border mt-4  bg-white"
            >
              <Text className="text-center text-black font-[abeezee]">No</Text>
            </Pressable>
            <Pressable
              onPress={enableBiometrics}
              className={`bg-primary py-3 px-16  flex-1 rounded-full mt-4 `}
            >
              <Text className="text-center text-white font-[abeezee]">Yes</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EnableBioMetrics;
