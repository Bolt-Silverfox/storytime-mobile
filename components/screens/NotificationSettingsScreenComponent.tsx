import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import PageTitle from "../PageTitle";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import useAuth from "../../contexts/AuthContext";
import useGetNotificationPreferences from "../../hooks/tanstack/queryHooks/useGetNotificationPreferences";
import useUpdateNotificationPreferences from "../../hooks/tanstack/mutationHooks/useUpdateNotificationPreferences";

type PropTypes = {
  goBack: () => void;
};

const SECTIONS = [
  {
    title: "subscription & billing",
    items: [
      { label: "Subscription reminders", category: "SUBSCRIPTION_REMINDER" },
      { label: "Subscription status updates", category: "SUBSCRIPTION_ALERT" },
    ],
  },
  {
    title: "reminders",
    items: [
      {
        label: "Incomplete story reminder",
        category: "INCOMPLETE_STORY_REMINDER",
      },
      {
        label: "Daily listening reminder",
        category: "DAILY_LISTENING_REMINDER",
      },
    ],
  },
  {
    title: "discovery & content",
    items: [
      { label: "New stories added", category: "NEW_STORY" },
      { label: "Story finished", category: "STORY_FINISHED" },
    ],
  },
] as const;

const NotificationSettingsScreenComponent = ({ goBack }: PropTypes) => {
  const { user } = useAuth();
  const {
    data: preferences,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationPreferences();
  const { mutate, isPending: isMutating } = useUpdateNotificationPreferences(
    user?.id
  );

  if (isLoading) {
    return (
      <SafeAreaWrapper variant="solid">
        <View className="flex flex-1 bg-bgLight">
          <PageTitle title="Notification Settings" goBack={goBack} />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4807EC" />
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isError) {
    return (
      <SafeAreaWrapper variant="solid">
        <View className="flex flex-1 bg-bgLight">
          <PageTitle title="Notification Settings" goBack={goBack} />
          <View className="flex-1 items-center justify-center px-4">
            <Text className="mb-4 text-center font-[abeezee] text-base text-black">
              Failed to load notification preferences.
            </Text>
            <Text
              className="font-[abeezee] text-base text-[#4807EC]"
              onPress={() => refetch()}
            >
              Tap to retry
            </Text>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight">
        <PageTitle title="Notification Settings" goBack={goBack} />
        <View className="mx-auto w-full max-w-screen-md flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName=" flex flex-col gap-y-8 pb-5 px-4 pt-8"
          >
            {SECTIONS.map((section) => (
              <View key={section.title} className="flex flex-col gap-y-4">
                <Text className="font-[abeezee] text-xl capitalize text-black">
                  {section.title}
                </Text>
                <View className="flex flex-col rounded-[20px] border border-border-lighter bg-white p-4">
                  {section.items.map((item, index) => {
                    const isEnabled =
                      preferences?.[item.category]?.push ?? true;
                    const isLast = index === section.items.length - 1;
                    return (
                      <View
                        key={item.category}
                        className={`flex flex-row items-center justify-between${!isLast ? " border-b border-b-border-light" : ""}`}
                      >
                        <Text className="font-[abeezee] text-base text-black">
                          {item.label}
                        </Text>
                        <Switch
                          className="my-3"
                          ios_backgroundColor="#B7C8FF"
                          trackColor={{ true: "#4807EC", false: "#B7C8FF" }}
                          thumbColor={"white"}
                          value={isEnabled}
                          disabled={isMutating}
                          onValueChange={() =>
                            mutate({ [item.category]: !isEnabled })
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default NotificationSettingsScreenComponent;
