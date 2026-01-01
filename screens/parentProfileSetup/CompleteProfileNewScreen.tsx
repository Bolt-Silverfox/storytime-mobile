import { useNavigation } from "@react-navigation/native";
import { lazy, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import colours from "../../colours";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import LanguageSelectionModal from "../../components/modals/LanguageSelectionModal";
import PageTitle from "../../components/PageTitle";
import SuspenseWrapper from "../../components/supsense/SuspenseWrapper";
import useCompleteProfile from "../../hooks/tanstack/mutationHooks/useCompleteProfile";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import useImagePicker from "../../hooks/useImagePicker";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";

const LearningExpectations = lazy(
  () => import("../../components/LearningExpectations")
);

const CompleteProfileNewScreen = () => {
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [language, setLanguage] = useState<
    { name: string; code: string } | undefined
  >(undefined);
  const [learningExpectations, setLearningExpectations] = useState<string[]>(
    []
  );
  const { data } = useGetUserProfile();
  const { pickImage } = useImagePicker(setImageUrl);
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { isPending, mutate, error } = useCompleteProfile({
    onSuccess: () =>
      navigator.navigate("parentProfileSetup", { screen: "setPin" }),
  });

  const handleSelect = (tag: string) => {
    setLearningExpectations((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const isProceedButtonDisabled =
    !language?.name.length || !learningExpectations.length;

  const onProceed = () => {
    if (data?.pinSet) {
      navigator.navigate("parentProfileSetup", { screen: "enableBiometrics" });
      return;
    }
    navigator.navigate("parentProfileSetup", { screen: "setPin" });
  };
  return (
    <View className="flex flex-1 bg-bgLight">
      <PageTitle title="" goBack={() => navigator.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 bg-bgLight"
        contentContainerClassName="min-h-full sm:mx-auto max-w-screen-sm"
      >
        <View className="mb-10 mt-8 flex items-center flex-col">
          <Text className="font-[quilka] text-2xl">Complete Your Profile</Text>
          <Text className="text-text font-[abeezee] text-base">
            Complete setting up your profile information
          </Text>
        </View>

        <View className="flex flex-row relative items-center gap-x-5  px-3 py-2 rounded-md">
          {imageUrl ? (
            <Image
              className="size-[100px] rounded-full"
              source={{ uri: imageUrl }}
            />
          ) : (
            <Image
              className="size-[100px] rounded-full"
              source={require("../../assets/placeholder-pfp.png")}
            />
          )}
          <View className="flex flex-col flex-1 gap-y-3">
            <Text className="font-[abeezee] text-base">
              Upload your profile image
            </Text>
            <Text className="font-[abeezee] text-text text-xs text-wrap">
              Accepted file types : jpeg, png, jpg, and no more than 2MB
            </Text>
          </View>
          <Pressable
            onPress={pickImage}
            className="bg-black/60 absolute bottom-0 left-[80px] size-10 rounded-full justify-center flex items-center "
          >
            <Icon name="Camera" color="white" size={20} />
          </Pressable>
        </View>

        <View className="flex relative flex-col  gap-x-5 mt-8   px-3 py-2 rounded-md">
          <Text className="mb-4 text-black font-[abeezee]">
            Select your preferred language
          </Text>
          <Pressable
            onPress={() => setIsLanguageModalOpen((o) => !o)}
            className="relative"
          >
            <TextInput
              editable={false}
              placeholder="Select your preferred language"
              value={language?.name}
              className={`border w-full rounded-full capitalize h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${error ? "border-red-600" : "border-border"}`}
              placeholderTextColor={error ? "red" : colours.text}
            />
            <Pressable
              onPress={() => setIsLanguageModalOpen((o) => !o)}
              className="absolute top-4 right-4"
            >
              {!isLanguageModalOpen ? (
                <Icon name="ChevronDown" />
              ) : (
                <Icon name="ChevronUp" />
              )}
            </Pressable>
          </Pressable>
          {error && (
            <Text className="text-red-600 text-sm">{error.message}</Text>
          )}
          <Text className="font-[abeezee] mt-10 mb-6 text-base">
            What do you want your kids to learn?
          </Text>
          <SuspenseWrapper>
            <LearningExpectations
              handleSelect={handleSelect}
              learningExpectations={learningExpectations}
            />
          </SuspenseWrapper>
        </View>

        <LanguageSelectionModal
          setLanguage={setLanguage}
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />
        <LoadingOverlay visible={isPending} />
      </ScrollView>
      <View className="flex mb-10 mx-4 sm:mx-auto max-w-screen-sm flex-row justify-center gap-x-10">
        <Pressable
          onPress={onProceed}
          className=" py-3   flex-1 rounded-full border-black border mt-4  bg-white"
        >
          <Text className="text-center text-black font-[abeezee]">Skip</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            mutate({
              userId: data?.id!,
              imageUri: imageUrl,
              language: language?.name,
              languageCode: language?.code,
              learningExpectations,
            })
          }
          disabled={isProceedButtonDisabled}
          className={`${
            isProceedButtonDisabled ? "bg-primary/60" : "bg-primary"
          } py-3   flex-1 rounded-full mt-4 `}
        >
          <Text className="text-center text-white font-[abeezee]">Proceed</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CompleteProfileNewScreen;
