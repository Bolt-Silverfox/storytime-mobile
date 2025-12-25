import { useNavigation } from "@react-navigation/native";
import { ScrollView, Switch, Text, View } from "react-native";
import PageTitle from "../../../components/PageTitle";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import { useState } from "react";

const NotificationsSettingsScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    subscriptionReminders: false,
    subscriptionStatusUpdates: false,
  });
  const [childActivityUpdates, setChildActivityUpdates] = useState({
    storyCompletion: false,
    challengesUpdates: true,
    streaksEarned: true,
  });
  const [reminders, setReminders] = useState({
    incompleteStoryReminder: true,
    dailyListeningReminder: true,
  });
  const [discoveryContent, setDiscoveryContent] = useState({
    newStories: true,
    weeklySummary: true,
  });
  return (
    <View className="flex flex-1 bg-bgLight">
      <PageTitle
        title="Notification Settings"
        goBack={() => navigator.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" flex flex-col gap-y-8 pb-5 px-4 pt-8"
      >
        <View className="flex flex-col gap-y-4">
          <Text className="font-[abeezee] text-xl text-black capitalize">
            subscription & billing
          </Text>
          <View className="bg-white border border-border-lighter flex flex-col rounded-[20px] p-4">
            <View className="flex flex-row border-b border-b-border-light justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Subscription reminders
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={subscriptionSettings.subscriptionReminders === true}
                onValueChange={() =>
                  setSubscriptionSettings((s) => ({
                    ...s,
                    subscriptionReminders: !s.subscriptionReminders,
                  }))
                }
              />
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Subscription status updates
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={subscriptionSettings.subscriptionStatusUpdates === true}
                onValueChange={() =>
                  setSubscriptionSettings((s) => ({
                    ...s,
                    subscriptionStatusUpdates: !s.subscriptionStatusUpdates,
                  }))
                }
              />
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-y-4">
          <Text className="font-[abeezee] text-xl text-black capitalize">
            child activity updates
          </Text>
          <View className="bg-white border border-border-lighter flex flex-col rounded-[20px] p-4">
            <View className="flex flex-row border-b border-b-border-light justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Story completion
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={childActivityUpdates.storyCompletion === true}
                onValueChange={() =>
                  setChildActivityUpdates((s) => ({
                    ...s,
                    storyCompletion: !s.storyCompletion,
                  }))
                }
              />
            </View>
            <View className="flex flex-row border-b border-b-border-light justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Challenges updates
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={childActivityUpdates.challengesUpdates === true}
                onValueChange={() =>
                  setChildActivityUpdates((s) => ({
                    ...s,
                    challengesUpdates: !s.challengesUpdates,
                  }))
                }
              />
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Streaks & badges earned
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={childActivityUpdates.streaksEarned === true}
                onValueChange={() =>
                  setChildActivityUpdates((s) => ({
                    ...s,
                    streaksEarned: !s.streaksEarned,
                  }))
                }
              />
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-y-4">
          <Text className="font-[abeezee] text-xl text-black capitalize">
            reminders
          </Text>
          <View className="bg-white border border-border-lighter flex flex-col rounded-[20px] p-4">
            <View className="flex flex-row border-b border-b-border-light justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Incomplete story reminder
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={reminders.incompleteStoryReminder === true}
                onValueChange={() =>
                  setReminders((s) => ({
                    ...s,
                    incompleteStoryReminder: !s.incompleteStoryReminder,
                  }))
                }
              />
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Daily listening reminder
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={reminders.dailyListeningReminder === true}
                onValueChange={() =>
                  setReminders((s) => ({
                    ...s,
                    dailyListeningReminder: !s.dailyListeningReminder,
                  }))
                }
              />
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-y-4">
          <Text className="font-[abeezee] text-xl text-black capitalize">
            discovery & content
          </Text>
          <View className="bg-white border border-border-lighter flex flex-col rounded-[20px] p-4">
            <View className="flex flex-row border-b border-b-border-light justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                New stories added
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={discoveryContent.newStories === true}
                onValueChange={() =>
                  setDiscoveryContent((s) => ({
                    ...s,
                    newStories: !s.newStories,
                  }))
                }
              />
            </View>
            <View className="flex flex-row  justify-between items-center">
              <Text className="font-[abeezee] text-black text-base">
                Daily listening reminder
              </Text>
              <Switch
                ios_backgroundColor={"#4807EC"}
                trackColor={{ true: "#4807EC" }}
                thumbColor={"white"}
                value={discoveryContent.weeklySummary === true}
                onValueChange={() =>
                  setDiscoveryContent((s) => ({
                    ...s,
                    weeklySummary: !s.weeklySummary,
                  }))
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationsSettingsScreen;
