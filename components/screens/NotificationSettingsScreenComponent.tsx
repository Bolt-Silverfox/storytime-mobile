import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import PageTitle from "../PageTitle";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";

type PropTypes = {
  goBack: () => void;
};

const NotificationSettingsScreenComponent = ({ goBack }: PropTypes) => {
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    subscriptionReminders: false,
    subscriptionStatusUpdates: false,
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
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight">
        <PageTitle title="Notification Settings" goBack={goBack} />
        <View className="flex-1 max-w-screen-md mx-auto w-full">
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
                    className="my-3"
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
                    className="my-3"
                    ios_backgroundColor={"#4807EC"}
                    trackColor={{ true: "#4807EC" }}
                    thumbColor={"white"}
                    value={
                      subscriptionSettings.subscriptionStatusUpdates === true
                    }
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
                reminders
              </Text>
              <View className="bg-white border border-border-lighter flex flex-col rounded-[20px] p-4">
                <View className="flex flex-row border-b border-b-border-light justify-between items-center">
                  <Text className="font-[abeezee] text-black text-base">
                    Incomplete story reminder
                  </Text>
                  <Switch
                    className="my-3"
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
                    className="my-3"
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
                <View className="flex flex-row  justify-between items-center">
                  <Text className="font-[abeezee] text-black text-base">
                    New stories added
                  </Text>
                  <Switch
                    className="my-3"
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
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default NotificationSettingsScreenComponent;
