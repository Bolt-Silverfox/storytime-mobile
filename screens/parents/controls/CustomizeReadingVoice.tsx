import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import ErrorComponent from "../../../components/ErrorComponent";
const StorytimeVoices = lazy(
  () => import("../../../components/StorytimeVoices")
);

type RouteProps = RouteProp<
  ParentControlNavigatorParamList,
  "customizeReadingVoices"
>;

const CustomizeReadingVoice = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const { data, isPending, error, refetch } = useGetKidById(params.childId);
  const [currentlyActiveVoiceId, setCurrentlyActiveVoiceId] = useState(
    data?.preferredVoiceId ?? ""
  );
  const [activeTab, setActiveTab] = useState<"storytime" | "personal">(
    "storytime"
  );

  useEffect(() => {
    setCurrentlyActiveVoiceId(data?.preferredVoiceId ?? "");
  }, [data]);
  console.log("kids data", data);
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  console.log("remote", data?.preferredVoiceId);
  console.log("local", currentlyActiveVoiceId);

  return (
    <View className="flex-1 min-h-full pb-10 bg-bgLight flex flex-col gap-y-10 sm:mx-auto max-w-screen-md w-full">
      <PageTitle
        title="Customize Reading Voice"
        goBack={() => navigator.goBack()}
      />
      <View className="flex flex-row gap-x-3  bg-white mx-auto rounded-full ">
        <Pressable
          className={`px-6 py-2 rounded-full ${activeTab === "storytime" ? "bg-primary text-white " : null}`}
          onPress={() => setActiveTab("storytime")}
        >
          <Text
            className={`text-dark font-[abeezee] text-base ${activeTab === "storytime" ? "bg-primary text-white " : null}`}
          >
            Storytime Voices
          </Text>
        </Pressable>
        <Pressable
          className={`px-6 py-2 rounded-full ${activeTab === "personal" ? "bg-primary text-white " : null}`}
          onPress={() => setActiveTab("personal")}
        >
          <Text
            className={`text-dark font-[abeezee] text-base ${activeTab === "personal" ? "bg-primary text-white " : null}`}
          >
            My Recordings
          </Text>
        </Pressable>
      </View>
      {activeTab === "storytime" ? (
        <Suspense fallback={<ActivityIndicator size={"large"} />}>
          <StorytimeVoices
            currentlyActiveVoiceId={currentlyActiveVoiceId}
            childId={params.childId}
          />
        </Suspense>
      ) : null}
      {activeTab === "personal" ? (
        <View className="flex flex-1 bg-bgLight justify-center items-center">
          <Text className="text-xl font-[abeezee] text-center">
            You have no recordings yet
          </Text>
          <CustomButton disabled={true} text="Add Recording" />
        </View>
      ) : null}
      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default CustomizeReadingVoice;

// 9c45b3e8-a20e-4ca6-9e54-377246aa4f86
