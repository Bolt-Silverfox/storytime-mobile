import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
import { parentProfileSetupTags } from "../../data";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";

const CompleteProfileNewScreen = () => {
  const [imageUrl, setImageUrl] = useState(
    require("../../assets/life-of-pi.png")
  );
  const [error, setError] = useState("");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { data } = useGetUserProfile();
  const isLoading = false;
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  useEffect(() => {
    if (data?.profile.language) {
      navigator.replace("parentProfileSetup", {
        screen: "setPin",
      });
    }
  }, [data]);

  const handleSelect = (tag: string) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const isProceedButtonDisabled =
    !language.length || error.length > 0 || !selectedFilters.length;

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

        <View className="flex flex-row items-center gap-x-5  px-3 py-2 rounded-md">
          <Image className="size-[100px] rounded-full" source={imageUrl} />
          <View className="flex flex-col flex-1 gap-y-3">
            <Text className="font-[abeezee] text-base">
              Upload your profile image
            </Text>
            <Text className="font-[abeezee] text-text text-xs text-wrap">
              Accepted file types : jpeg, png, jpg, and no more than 2MB
            </Text>
          </View>
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
              onChangeText={setLanguage}
              value={language}
              className={`border w-full rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${error ? "border-red-600" : "border-border"}`}
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
          {error && <Text className="text-red-600 text-sm">{error}</Text>}
          <Text className="font-[abeezee] mt-10 mb-6 text-base">
            What do you want your kids to learn?
          </Text>
          <View className="mx-5 flex-wrap   gap-y-7 flex flex-row gap-x-5">
            {parentProfileSetupTags.map((tag) => (
              <Pressable
                onPress={() => handleSelect(tag)}
                key={tag}
                className={`${selectedFilters.includes(tag) ? "bg-blue-600 text-white" : ""} px-6 rounded-full py-3 text-black border border-black/15`}
              >
                <Text
                  className={`capitalize text-text font-[abeezee] ${selectedFilters.includes(tag) ? "text-white" : ""}`}
                >
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <LanguageSelectionModal
          setLanguage={setLanguage}
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />
        <LoadingOverlay visible={isLoading} />
      </ScrollView>
      <View className="flex mb-10 mx-4 sm:mx-auto max-w-screen-sm flex-row justify-center gap-x-10">
        <Pressable
          onPress={onProceed}
          className=" py-3 px-16  flex-1 rounded-full border-black border mt-4  bg-white"
        >
          <Text className="text-center text-black font-[abeezee]">Skip</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigator.navigate("parentProfileSetup", { screen: "setPin" })
          }
          disabled={isProceedButtonDisabled}
          className={`${
            isProceedButtonDisabled ? "bg-primary/60" : "bg-primary"
          } py-3 px-16  flex-1 rounded-full mt-4 `}
        >
          <Text className="text-center text-white font-[abeezee]">Proceed</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CompleteProfileNewScreen;
