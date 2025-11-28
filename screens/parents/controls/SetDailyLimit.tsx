import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import useUpdateKids from "../../../hooks/tanstack/mutationHooks/useUpdateKids";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import CustomButton from "../../../components/UI/CustomButton";

const screenLimit: Limit[] = [
  {
    text: "30 Minutes",
    value: 30,
  },
  {
    text: "1 hour",
    value: 60,
  },
  {
    text: "2 hours",
    value: 120,
  },
  {
    text: "3 hours",
    value: 180,
  },
  {
    text: "4 hours",
    value: 240,
  },
  {
    text: "5 hours",
    value: 300,
  },
  {
    text: "6 hours",
    value: 360,
  },
  {
    text: "7 hours",
    value: 420,
  },
  {
    text: "No Limit",
    value: null,
  },
];

type Limit = {
  text: string;
  value: number | null;
};

type RouteProps = RouteProp<ParentControlNavigatorParamList, "setDailyLimit">;

const SetDailyLimit = () => {
  const { params } = useRoute<RouteProps>();
  const [limit, setLimit] = useState<Limit["value"]>(null);
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const { data, isPending, error, refetch } = useGetKidById(params.childId);
  const { mutate, isPending: isUpdating } = useUpdateKids({
    id: params.childId,
    onSuccess: () => navigator.goBack(),
  });

  useEffect(() => {
    setLimit(data?.dailyScreenTimeLimitMins ?? null);
  }, [data]);

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  console.log("local", limit);
  console.log("remote", data?.dailyScreenTimeLimitMins);
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="min-h-full pb-10 bg-light flex flex-col gap-y-10 sm:mx-auto max-w-screen-md w-full"
    >
      <PageTitle
        title="Set Daily Usage Limit"
        goBack={() => navigator.goBack()}
      />
      <View className="p-5 mx-5  flex flex-col gap-y-2 rounded-2xl bg-white">
        <Text className="text-xl font-[abeezee] text-center mb-2">
          DEFAULT SCREEN LIMIT :{" "}
          <Text className="font-[quilka]">{"No Limit"}</Text>
        </Text>
        <Text className="text-text text-base font-[abeezee] text-center">
          Set up default screen time for your child.
        </Text>
        <Text className="text-text text-base font-[abeezee] text-center">
          Once timer expires, the app will be locked
        </Text>
      </View>
      <View className="p-5 flex flex-col gap-y-6 bg-white mx-5 rounded-2xl">
        <Text className="text-xl font-[abeezee]">SELECT SCREEN LIMIT</Text>
        <View className="flex flex-col rounded-2xl gap-y-5 ">
          {screenLimit.map((limitValue) => (
            <View
              key={limitValue.value}
              className="bg-white flex flex-row justify-between items-center p-3 border-b border-b-black/10"
            >
              <Text className="font-[quilka] text-sm">{limitValue.text}</Text>
              <Switch
                value={limitValue.value === limit}
                onValueChange={() => setLimit(limitValue.value)}
              />
            </View>
          ))}
        </View>
      </View>
      <CustomButton
        disabled={isUpdating}
        text={isUpdating ? "Saving changes..." : "Save"}
        onPress={() =>
          mutate({
            dailyScreenTimeLimitMins: limit,
          })
        }
      />
      <LoadingOverlay visible={isPending} />
    </ScrollView>
  );
};

export default SetDailyLimit;
