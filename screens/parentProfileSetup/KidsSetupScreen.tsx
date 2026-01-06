import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageTitle from "../../components/PageTitle";
import { ageRange } from "../../data";
import useAddKids from "../../hooks/tanstack/mutationHooks/useAddKids";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import ChildForm from "../../components/ChildForm";

export type KidProfileType = {
  name: string;
  ageRange: (typeof ageRange)[number];
  id: string;
};

const KidsSetupScreen = () => {
  const [kidsData, setKidsData] = useState<KidProfileType[]>([
    {
      ageRange: "1 - 4",
      name: "",
      id: Date.now().toString(),
    },
  ]);
  const [currentlyActiveKid, setCurrentlyActiveKid] = useState<null | string>(
    null
  );
  const isProceedButtonDisabled = kidsData.length < 1;
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { data } = useGetUserProfile();
  const { isPending, mutate } = useAddKids(kidsData.length, () => onProceed());

  useEffect(() => {
    if (data?.numberOfKids) {
      navigator.navigate("parentProfileSetup", { screen: "kidSetup" });
    }
  }, [data]);

  const onProceed = () => {
    navigator.replace("selection");
  };

  const deleteKid = (id: string) => {
    const newKidsData = kidsData.filter((kid) => kid.id !== id);
    setKidsData(newKidsData);
  };

  const addKid = () => {
    setKidsData((k) => [
      ...k,
      { ageRange: "1 - 4", name: "", id: Date.now().toString() },
    ]);
  };

  const updateKid = (id: string, updatedData: Partial<KidProfileType>) => {
    setKidsData((kids) =>
      kids.map((k) => (k.id === id ? { ...k, ...updatedData } : k))
    );
  };

  const submit = () => {
    const kidsWithoutId = kidsData.map(({ id, ...rest }) => rest);
    mutate(kidsWithoutId);
  };

  return (
    <View className="flex-1 bg-bgLight">
      <PageTitle title="Kid(s) setup" goBack={() => navigator.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
          className="flex-1 mt-8 mx-4 bg-bgLight"
        >
          <View className="sm:mx-auto w-full max-w-screen-sm">
            <View className="flex flex-col items-center gap-y-2">
              <Text className="font-[quilka] text-2xl">
                Enter Your Kids Details
              </Text>
              <Text className="font-[abeezee] text-text text-base">
                Complete setting up your kid(s) information
              </Text>
            </View>

            <View className="flex flex-col gap-y-4 mt-6">
              {kidsData.map((k) => (
                <ChildForm
                  key={k.id}
                  updateKid={updateKid}
                  kid={k}
                  currentlyActiveKid={currentlyActiveKid}
                  setCurrentlyActiveKid={setCurrentlyActiveKid}
                  deleteKid={deleteKid}
                />
              ))}
            </View>

            <Pressable
              className="flex mt-2 flex-row gap-x-2 items-center w-fit self-end py-1 justify-center px-4 bg-white rounded-full border-black/5 border"
              onPress={addKid}
            >
              <Icon color="#292D32" size={24} name="CirclePlus" />
              <Text className="text-black font-[abeezee] text-sm">
                Add a new child
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <View className="bg-bgLight border-t border-gray-200 px-4 pb-5 pt-3">
          <View className="flex sm:mx-auto max-w-screen-sm flex-row justify-center gap-x-10">
            <Pressable
              onPress={onProceed}
              className="py-3 flex-1 rounded-full border-black border bg-white"
            >
              <Text className="text-center text-black font-[abeezee]">
                Skip
              </Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={isProceedButtonDisabled}
              className={`${
                isProceedButtonDisabled ? "bg-primary/60" : "bg-primary"
              } py-3 flex-1 rounded-full`}
            >
              <Text className="text-center text-white font-[abeezee]">
                {isPending ? "Loading..." : "Finalize Profile"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default KidsSetupScreen;
