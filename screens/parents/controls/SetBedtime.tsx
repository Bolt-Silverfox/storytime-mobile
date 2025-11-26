import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import PageTitle from "../../../components/PageTitle";
import { useState } from "react";
import Icon from "../../../components/Icon";
import TimePickerOverlay from "../../../components/modals/TimePickerOverlay";

const SetBedtime = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const [bedTimeMode, setBedtimeMode] = useState(false);
  const [bedtimeControls, setBedtimeControls] = useState({
    lockDuringBedtime: true,
    dimDuringBedtime: true,
    showBedTimeReminder: false,
    allowBedtimeStoriesOnly: false,
  });
  const [repeatDays, setRepeatDays] = useState<
    "everyday" | "weekdays" | "weekends"
  >("weekdays");
  const [schedule, setSchedule] = useState({
    startTime: "9:00 PM",
    stopTime: "07:00 AM",
  });
  const [isTimeModalOpen, setIsTimeModalOpen] = useState<
    "start" | "stop" | null
  >(null);
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="min-h-full pb-10 bg-bgLight flex flex-col gap-y-10 sm:mx-auto max-w-screen-md w-full"
    >
      <PageTitle title="Bedtime Mode" goBack={() => navigator.goBack()} />
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
        aria-labelledby="Bedtime schedule"
        className="p-5 flex flex-col gap-y-6 bg-white mx-5 rounded-2xl"
      >
        <Text className="text-xl font-[abeezee]">SCHEDULE</Text>
        <Pressable
          onPress={() => setIsTimeModalOpen("start")}
          className="flex border-b border-b-black/10 pb-2 flex-row justify-between items-center"
        >
          <Text className="flex-1 font-[quilka]">Start Time</Text>
          <Text>{schedule.startTime}</Text> <Icon name="ChevronRight" />
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
        aria-labelledby="Bedtime schedule"
        className="p-5 flex flex-col gap-y-6 bg-white mx-5 rounded-2xl"
      >
        <Text className="text-xl font-[abeezee]">REPEAT</Text>
        <View className="flex border-b border-b-black/10 pb-2 flex-row justify-between items-center">
          <Text className="flex-1 font-[quilka]">Everyday</Text>
          <Switch
            disabled={bedTimeMode === false}
            value={repeatDays === "everyday"}
            onValueChange={() => setRepeatDays("everyday")}
          />
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="flex-1 font-[quilka]">Weekdays</Text>
          <Switch
            disabled={bedTimeMode === false}
            value={repeatDays === "weekdays"}
            onValueChange={() => setRepeatDays("weekdays")}
          />
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="flex-1 font-[quilka]">Weekends</Text>
          <Switch
            disabled={bedTimeMode === false}
            value={repeatDays === "weekends"}
            onValueChange={() => setRepeatDays("weekends")}
          />
        </View>
        {/* <View className="flex flex-row justify-between items-center">
          <Text className="flex-1 font-[quilka]">Custom</Text>
          <Pressable onPress={() => setIsTimeModalOpen(true)}>
            <Text>{"Select"}</Text>
            <Icon name="ChevronRight" />
          </Pressable>
        </View> */}
      </View>

      <View
        className="flex flex-col bg-white rounded-2xl p-3 mx-5"
        aria-labelledby="bedtime controls"
      >
        <View className="flex border-b border-b-black/10 flex-row justify-between items-center">
          <Text className="font-[abeezee] text-base text-text">
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
        <View className="flex border-b border-b-black/10 flex-row justify-between items-center">
          <Text className="font-[abeezee] text-base text-text">
            Lock app during bedtime
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
        <View className="flex border-b border-b-black/10 flex-row justify-between items-center">
          <Text className="font-[abeezee] text-base text-text">
            Lock app during bedtime
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
        <View className="flex  flex-row justify-between items-center">
          <Text className="font-[abeezee] text-base text-text">
            Lock app during bedtime
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
        onConfirm={(string) => setSchedule((s) => ({ ...s, stopTime: string }))}
      />
    </ScrollView>
  );
};

export default SetBedtime;
