import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import PageTitle from "../../../components/PageTitle";
import { useEffect, useState } from "react";
import Icon from "../../../components/Icon";
import TimePickerOverlay from "../../../components/modals/TimePickerOverlay";
import useUpdateKids from "../../../hooks/tanstack/mutationHooks/useUpdateKids";
import LoadingOverlay from "../../../components/LoadingOverlay";
import CustomButton from "../../../components/UI/CustomButton";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import ErrorComponent from "../../../components/ErrorComponent";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";

type PropRoutes = RouteProp<ParentControlNavigatorParamList, "setBedtime">;

const weekDays = [1, 2, 3, 4, 5];
const weekEnds = [6, 0];
const everyday = [0, 1, 2, 3, 4, 5, 6];

const arraysMatch = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

const SetBedtime = () => {
  const { params } = useRoute<PropRoutes>();
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const {
    isPending: isLoading,
    error: fetcherror,
    refetch,
    data,
  } = useGetKidById(params.childId);
  const { mutate, isPending, error } = useUpdateKids({
    id: params.childId,
    onSuccess: () => navigator.goBack(),
  });
  const [bedTimeMode, setBedtimeMode] = useState(false);
  const [bedtimeControls, setBedtimeControls] = useState({
    lockDuringBedtime: false,
    dimDuringBedtime: false,
    showBedTimeReminder: false,
    allowBedtimeStoriesOnly: false,
  });
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [schedule, setSchedule] = useState({
    startTime: "",
    stopTime: "",
  });
  const [isTimeModalOpen, setIsTimeModalOpen] = useState<
    "start" | "stop" | null
  >(null);

  useEffect(() => {
    setBedtimeMode(data?.isBedtimeEnabled ?? false);
    setSchedule({
      startTime: data?.bedtimeStart ?? "9:00",
      stopTime: data?.bedtimeEnd ?? "07:00",
    });
    setRepeatDays(data?.bedtimeDays ?? []);
    setBedtimeControls({
      lockDuringBedtime: data?.bedtimeLockApp ?? false,
      dimDuringBedtime: data?.bedtimeDimScreen ?? false,
      allowBedtimeStoriesOnly: data?.bedtimeStoriesOnly ?? false,
      showBedTimeReminder: data?.bedtimeReminder ?? false,
    });
  }, [data]);

  if (isLoading) return <LoadingOverlay visible={isLoading} />;
  if (fetcherror)
    return <ErrorComponent refetch={refetch} message={fetcherror.message} />;
  return (
    <View className="flex-1 bg-bgLight pb-5">
      <PageTitle title="Bedtime Mode" goBack={() => navigator.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="min-h-full pb-5 bg-bgLight flex flex-col gap-y-10 sm:mx-auto max-w-screen-md w-full"
      >
        {error?.message && (
          <ErrorMessageDisplay
            errorMessage={error?.message || "Error updating kids, try again."}
          />
        )}
        <View className="p-5 mx-5  flex flex-col gap-y-2 rounded-2xl bg-white">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-[abeezee] text- mb-2">
              ENABLE BEDTIME MODE{" "}
            </Text>
            <Switch value={bedTimeMode} onValueChange={setBedtimeMode} />
          </View>
          <Text className="text-text text-sm font-[abeezee] text-center">
            keep your child off StoryTime during bedtime
          </Text>
        </View>

        <View
          style={{ opacity: bedTimeMode ? 1 : 0.5 }}
          aria-labelledby="Bedtime schedule"
          className="p-5 flex flex-col gap-y-6 bg-white mx-5 rounded-2xl"
        >
          <Text className="text-xl font-[abeezee]">SCHEDULE</Text>
          <Pressable
            onPress={() => setIsTimeModalOpen("start")}
            className="flex border-b border-b-black/10 pb-2 flex-row justify-between items-center"
          >
            <Text className="flex-1 font-[quilka]">Start Time</Text>
            <Text>{schedule.startTime}</Text>
            <Text>
              <Icon name="ChevronRight" />
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsTimeModalOpen("stop")}
            className="flex flex-row justify-between items-center"
          >
            <Text className="flex-1 font-[quilka]">Stop Time</Text>
            <Text>{schedule.stopTime}</Text>
            <Icon name="ChevronRight" />
          </Pressable>
        </View>

        <View
          style={{ opacity: bedTimeMode ? 1 : 0.5 }}
          aria-labelledby="Bedtime schedule"
          className="p-5 flex flex-col gap-y-6 bg-white mx-5 rounded-2xl"
        >
          <Text className="text-xl font-[abeezee]">REPEAT</Text>
          <View className="flex border-b border-b-black/10 pb-2 flex-row justify-between items-center">
            <Text className="flex-1 font-[quilka]">Everyday</Text>
            <Switch
              disabled={bedTimeMode === false}
              value={arraysMatch(repeatDays, everyday)}
              onValueChange={() => setRepeatDays(everyday)}
            />
          </View>
          <View className="flex flex-row border-b border-b-black/10 justify-between items-center">
            <Text className="flex-1 font-[quilka]">Weekdays</Text>
            <Switch
              disabled={bedTimeMode === false}
              value={arraysMatch(repeatDays, weekDays)}
              onValueChange={() => setRepeatDays(weekDays)}
            />
          </View>
          <View className="flex flex-row justify-between items-center">
            <Text className="flex-1 font-[quilka]">Weekends</Text>
            <Switch
              disabled={bedTimeMode === false}
              value={arraysMatch(repeatDays, weekEnds)}
              onValueChange={() => setRepeatDays(weekEnds)}
            />
          </View>
        </View>

        <View
          style={{ opacity: bedTimeMode ? 1 : 0.5 }}
          className="flex flex-col  bg-white rounded-2xl p-5 pt-4 mx-5"
          aria-labelledby="bedtime controls"
        >
          <Text className="text-xl font-[abeezee]">BEDTIME CONTROLS</Text>
          <View className="flex border-b  border-b-black/10 px-4 py-3 flex-row justify-between items-center">
            <Text className="font-[abeezee]  text-base text-text">
              Lock app during bedtime
            </Text>
            <Switch
              disabled={bedTimeMode === false}
              value={bedtimeControls.lockDuringBedtime}
              onValueChange={() =>
                setBedtimeControls((b) => ({
                  ...b,
                  lockDuringBedtime: !b.lockDuringBedtime,
                }))
              }
            />
          </View>
          <View className="flex border-b  border-b-black/10 px-4 py-3 flex-row justify-between items-center">
            <Text className="font-[abeezee]  text-base text-text">
              Dim screen during bedtime
            </Text>
            <Switch
              disabled={bedTimeMode === false}
              value={bedtimeControls.dimDuringBedtime}
              onValueChange={() =>
                setBedtimeControls((b) => ({
                  ...b,
                  dimDuringBedtime: !b.dimDuringBedtime,
                }))
              }
            />
          </View>
          <View className="flex border-b py-3 border-b-black/10 px-4 flex-row justify-between items-center">
            <Text className="font-[abeezee]  text-base text-text">
              Show bedtime reminder
            </Text>
            <Switch
              disabled={bedTimeMode === false}
              value={bedtimeControls.showBedTimeReminder}
              onValueChange={() =>
                setBedtimeControls((b) => ({
                  ...b,
                  showBedTimeReminder: !b.showBedTimeReminder,
                }))
              }
            />
          </View>
          <View className="flex  flex-row py-3 justify-between px-4 items-center">
            <Text className="font-[abeezee]  text-base text-text">
              Allow bedtime stories only{" "}
            </Text>
            <Switch
              disabled={bedTimeMode === false}
              value={bedtimeControls.allowBedtimeStoriesOnly}
              onValueChange={() =>
                setBedtimeControls((b) => ({
                  ...b,
                  allowBedtimeStoriesOnly: !b.allowBedtimeStoriesOnly,
                }))
              }
            />
          </View>
        </View>

        <TimePickerOverlay
          visible={isTimeModalOpen === "start"}
          onClose={() => setIsTimeModalOpen(null)}
          onConfirm={(string) =>
            setSchedule((s) => ({ ...s, startTime: string }))
          }
        />
        <TimePickerOverlay
          visible={isTimeModalOpen === "stop"}
          onClose={() => setIsTimeModalOpen(null)}
          onConfirm={(string) =>
            setSchedule((s) => ({ ...s, stopTime: string }))
          }
        />
        <LoadingOverlay visible={isPending || isLoading} />
      </ScrollView>
      <CustomButton
        disabled={isPending}
        onPress={() =>
          mutate({
            isBedtimeEnabled: bedTimeMode,
            bedtimeStart: schedule.startTime,
            bedtimeEnd: schedule.stopTime,
            bedtimeDays: repeatDays,
            bedtimeLockApp: bedtimeControls.lockDuringBedtime,
            bedtimeDimScreen: bedtimeControls.dimDuringBedtime,
            bedtimeReminder: bedtimeControls.showBedTimeReminder,
            bedtimeStoriesOnly: bedtimeControls.allowBedtimeStoriesOnly,
          })
        }
        text={isPending ? "Saving" : "Save changes"}
      />
    </View>
  );
};

export default SetBedtime;
